'use server';

interface DockerMetadata {
  exposedPorts: string[];
  volumes: string[];
  envs: string[];
  imageName: string;
}

export async function getDockerMetadata(url: string): Promise<DockerMetadata> {
  let repo = '';
  let imageName = '';
  
  // Parse hub.docker.com URLs
  if (url.includes('hub.docker.com/_/')) {
    imageName = url.split('hub.docker.com/_/')[1];
    repo = `library/${imageName}`;
  } else if (url.includes('hub.docker.com/r/')) {
    imageName = url.split('hub.docker.com/r/')[1];
    repo = imageName;
  } else {
    // Fallback if it's just the name
    imageName = url.replace('https://', '').replace('http://', '');
    repo = imageName.includes('/') ? imageName : `library/${imageName}`;
  }

  try {
    // 1. Get Token
    const authUrl = `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${repo}:pull`;
    const authRes = await fetch(authUrl);
    const authData = await authRes.json();
    const token = authData.token;

    if (!token) throw new Error('Could not get token');

    // 2. Get Manifest
    const manifestUrl = `https://registry-1.docker.io/v2/${repo}/manifests/latest`;
    const manifestRes = await fetch(manifestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.docker.distribution.manifest.v2+json',
      },
    });
    const manifestData = await manifestRes.json();
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
