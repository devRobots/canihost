/**
 * Maps app names to icon strings (emoji or text-based for terminal aesthetic).
 * We keep it simple: emoji icons blend well with the terminal monospace aesthetic.
 */
export const APP_ICONS: Record<string, string> = {
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

export function getAppIcon(name: string): string {
  return APP_ICONS[name] ?? '📦';
}
