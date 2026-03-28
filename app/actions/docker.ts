'use server';

interface DockerMetadata {
  exposedPorts: string[];
  volumes: string[];
  envs: string[];
  imageName: string;
}

function parseDockerUrl(url: string): { repo: string; imageName: string } {
  if (url.includes('hub.docker.com/_/')) {
    const imageName = url.split('hub.docker.com/_/')[1];
    return { repo: `library/${imageName}`, imageName };
  } 
  
  if (url.includes('hub.docker.com/r/')) {
    const imageName = url.split('hub.docker.com/r/')[1];
    return { repo: imageName, imageName };
  } 
  
  // Fallback if it's just the name
  const imageName = url.replace('https://', '').replace('http://', '');
  const repo = imageName.includes('/') ? imageName : `library/${imageName}`;
  return { repo, imageName };
}

async function fetchDockerToken(repo: string): Promise<string> {
  const authHeaders: HeadersInit = {};
  if (process.env.DOCKER_USERNAME && process.env.DOCKER_PAT) {
    const credentials = Buffer.from(`${process.env.DOCKER_USERNAME}:${process.env.DOCKER_PAT}`).toString('base64');
    authHeaders.Authorization = `Basic ${credentials}`;
  }

  const authUrl = `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${repo}:pull`;
  const authRes = await fetch(authUrl, { headers: authHeaders });
  const authData = await authRes.json();
  const token = authData.token;

  if (!token) throw new Error('Could not get token');

  return token;
}

export async function getDockerMetadata(url: string): Promise<DockerMetadata> {
  const { repo, imageName } = parseDockerUrl(url);

  try {
    // 1. Get Token
    const token = await fetchDockerToken(repo);

    // 2. Get Manifest
    const manifestUrl = `https://registry-1.docker.io/v2/${repo}/manifests/latest`;
    const manifestOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json',
      },
    };
    let manifestRes = await fetch(manifestUrl, manifestOptions);
    let manifestData = await manifestRes.json();

    // If it's a manifest list, fetch the first architecture's manifest (prefer amd64/linux)
    if (manifestData.manifests && manifestData.manifests.length > 0) {
      const archManifest = manifestData.manifests.find(
        (m: { platform?: { architecture?: string; os?: string }; digest: string }) => m.platform?.architecture === 'amd64' && m.platform?.os === 'linux'
      ) || manifestData.manifests[0];
      
      const archManifestUrl = `https://registry-1.docker.io/v2/${repo}/manifests/${archManifest.digest}`;
      manifestRes = await fetch(archManifestUrl, manifestOptions);
      manifestData = await manifestRes.json();
    }

    const configDigest = manifestData.config?.digest;

    if (!configDigest) throw new Error('Could not find config digest');

    // 3. Get Config Blob
    const configUrl = `https://registry-1.docker.io/v2/${repo}/blobs/${configDigest}`;
    const configRes = await fetch(configUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const configData = await configRes.json();
    
    // Config data might be in configData.config or configData.container_config
    const config = configData.config || configData.container_config || {};
    
    const exposedPorts = config.ExposedPorts ? Object.keys(config.ExposedPorts) : [];
    const volumes = config.Volumes ? Object.keys(config.Volumes) : [];
    const envs = config.Env || [];

    return {
      exposedPorts,
      volumes,
      envs,
      imageName: repo === `library/${imageName}` ? imageName : repo,
    };
  } catch (err) {
    console.error(`Error fetching docker metadata for ${repo}:`, err);
    return {
      exposedPorts: [],
      volumes: [],
      envs: [],
      imageName: repo === `library/${imageName}` ? imageName : repo,
    };
  }
}
