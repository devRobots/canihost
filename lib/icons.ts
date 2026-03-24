/**
 * Maps service names to icon strings (emoji or text-based for terminal aesthetic).
 * We keep it simple: emoji icons blend well with the terminal monospace aesthetic.
 */
export const SERVICE_ICONS: Record<string, string> = {
  // Databases
  PostgreSQL: '🐘',
  MySQL: '🐬',
  MongoDB: '🍃',
  Redis: '⚡',
  // Dev & DevOps
  Gitlab: '🦊',
  Jenkins: '🎩',
  Gitea: '🍵',
  'Drone CI': '🚁',
  Portainer: '🐳',
  Dokploy: '🚀',
  Coolify: '❄️',
  // Networking
  'Nginx Proxy Manager': '🔀',
  Traefik: '🛤️',
  Cloudflared: '🌩️',
  'Pi-Hole': '🕳️',
  'AdGuard Home': '🛡️',
  'Wireguard (WG-Easy)': '🔐',
  Tailscale: '🦔',
  // CMS & Web
  Strapi: '🍞',
  Ghost: '👻',
  WordPress: '📝',
  // Productivity
  Nextcloud: '☁️',
  Syncthing: '🔄',
  Vaultwarden: '🔑',
  'Paperless-ngx': '📄',
  Focalboard: '📌',
  // Automation & IoT
  n8n: '🔗',
  'Home Assistant': '🏠',
  Zigbee2MQTT: '📡',
  'Frigate NVR': '📷',
  'Node-RED': '🌊',
  'Mosquitto MQTT': '🦟',
  // Media
  Plex: '🎬',
  Jellyfin: '🎵',
  Immich: '📸',
  PhotoPrism: '🔭',
  Audiobookshelf: '📚',
  Navidrome: '🎧',
  // Gaming
  'Minecraft Server': '⛏️',
  'Palworld Server': '🦎',
  // Monitoring
  Grafana: '📊',
  Prometheus: '🔥',
  'Uptime Kuma': '🐻',
  Netdata: '💈',
  // Others
  SearXNG: '🔍',
  'Kasm Workspaces': '🖥️',
  Mealie: '🍲',
  'Trilium Notes': '🌲',
  Kavita: '📖',
  Prowlarr: '🎯',
  Radarr: '📡',
  Sonarr: '📺',
};

export function getServiceIcon(name: string): string {
  return SERVICE_ICONS[name] ?? '📦';
}

/**
 * Brand icons per machine brand / type
 */
export const MACHINE_ICONS: Record<string, string> = {
  ZimaBoard: '🧊',
  Chuwi: '🔲',
  Apple: '🍎',
  'Raspberry Pi': '🍓',
  Intel: '🔵',
  Beelink: '🐝',
  Minisforum: '⚙️',
  Dell: '🔷',
  Lenovo: '🔴',
  CubePath: '☁️',
};

export function getMachineIcon(brand: string | null | undefined): string {
  if (!brand) return '🖥️';
  return MACHINE_ICONS[brand] ?? '🖥️';
}
