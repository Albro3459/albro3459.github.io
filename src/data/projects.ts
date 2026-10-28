export type Project = {
  slug: string;
  name: string;
  category: 'Applications' | 'Developer tools';
  kind: string;
  headline: string;
  description: string;
  tags: string[];
  repository: string;
  destination?: { label: string; url: string };
  intro: string;
  role: string;
  highlights: { title: string; description: string }[];
  images: { file: string; alt: string; caption: string }[];
  credit?: string;
};

export const projects: Project[] = [
  {
    slug: 'cloudgateway', name: 'CloudGateway', category: 'Applications', kind: 'CLOUD INFRASTRUCTURE · NATIVE APPS',
    headline: 'Multi-region WireGuard VPN platform',
    description: 'WireGuard VPN service with web, iOS, macOS, and command-line clients.',
    tags: ['Swift', 'React', 'Python', 'Oracle Cloud'], repository: 'https://github.com/Albro3459/CloudGateway',
    destination: { label: 'Visit website', url: 'https://www.gocloudlaunch.com/' },
    intro: 'Built a multi-region VPN platform with a React dashboard, native Apple apps, and command-line clients. The backend uses FastAPI, Firebase, and Terraform-managed Oracle Cloud infrastructure.',
    role: 'Full-stack development, native clients & infrastructure',
    highlights: [
      { title: 'Web and native clients', description: 'Developed the web dashboard, native iOS and macOS clients, and CLI. The macOS app and CLI share authentication, client inventory, and connection state.' },
      { title: 'Regional infrastructure', description: 'Terraform-managed OCI hosts run regional WireGuard servers. FastAPI handles the control plane, with Firebase Auth and Firestore managing accounts, clients, and desired peer state.' },
      { title: 'Access control and regional networking', description: 'Account-scoped access controls isolate users, while a regional mesh connects authorized devices across regions. Cloudflare and Caddy front the regional APIs.' },
    ],
    images: [
      { file: 'cloudgateway-web', alt: 'CloudGateway web dashboard with region selection and VPN client management', caption: 'Web dashboard for region selection and client configuration.' },
      { file: 'cloudgateway-ios', alt: 'CloudGateway native iOS VPN dashboard', caption: 'A native iOS client for managing and connecting VPN profiles.' },
      { file: 'cloudgateway-mac', alt: 'CloudGateway macOS menu showing connected status and regions', caption: 'Connect and manage clients directly from the macOS menu bar.' },
    ],
  },
  {
    slug: 'streamtrack', name: 'StreamTrack', category: 'Applications', kind: 'MOBILE APP · ENTERTAINMENT',
    headline: 'Movie and TV discovery app',
    description: 'React Native app with streaming availability, watchlists, and a custom .NET API.',
    tags: ['React Native', 'TypeScript', 'C# / .NET', 'Firebase'], repository: 'https://github.com/Albro3459/StreamTrack',
    destination: { label: 'View on the App Store', url: 'https://apps.apple.com/us/app/streamtracker/id6770622039' },
    intro: 'Rewrote a React Native movie and TV discovery app in TypeScript and built its C#/.NET API and AWS Lambda content pipeline. Features include streaming availability, title details, and personal watchlists.',
    role: 'App rewrite, API development & content pipeline',
    highlights: [
      { title: 'Discovery and watchlists', description: 'Implemented movie and TV discovery, title details, streaming availability, and personal watchlists in the mobile app.' },
      { title: 'API and content pipeline', description: 'The TypeScript and Expo frontend uses Firebase authentication. A C#/.NET API handles content, while an AWS Lambda function fetches popular streaming titles.' },
      { title: 'App rewrite and project history', description: 'After the original collaborative classroom project, I rewrote the app in summer 2025 and built the API and Lambda function from scratch.' },
    ],
    images: [
      { file: 'streamtrack-discover', alt: 'StreamTrack discovery screen with movie and television recommendations', caption: 'Movie and TV discovery screen.' },
      { file: 'streamtrack-details', alt: 'StreamTrack title details and streaming availability screen', caption: 'Title details and streaming availability.' },
      { file: 'streamtrack-library', alt: 'StreamTrack personal watchlist library', caption: 'Personal watchlist library.' },
    ],
    credit: 'The original classroom frontend was created with Joseph Slade and Truc Lam Ho. This case study focuses on my subsequent rewrite and backend work.',
  },
  {
    slug: 'clipboard-history', name: 'ClipboardHistory', category: 'Applications', kind: 'MACOS · PRODUCTIVITY',
    headline: 'Native macOS clipboard manager',
    description: 'Swift clipboard history manager with configurable keyboard shortcuts and plain-text paste.',
    tags: ['Swift', 'macOS', 'Keyboard shortcuts'], repository: 'https://github.com/Albro3459/ClipboardHistory',
    destination: { label: 'Watch the demo', url: 'https://youtu.be/p2S1_Rhee5o' },
    intro: 'Built a native Swift clipboard history manager for macOS, inspired by Windows clipboard history. It supports configurable keyboard shortcuts and pasting without formatting.',
    role: 'Native macOS app development',
    highlights: [
      { title: 'Keyboard shortcuts', description: 'Configurable shortcuts open clipboard history and access previously copied content.' },
      { title: 'Swift implementation', description: 'Written in Swift and built with Xcode, with the KeyboardShortcuts package handling user-configurable shortcuts.' },
      { title: 'Plain-text paste', description: 'A configurable universal paste action removes formatting from copied content.' },
    ], images: [],
  },
  {
    slug: 'codelaunch', name: 'CodeLaunch', category: 'Developer tools', kind: 'DEVELOPER TOOLS · REMOTE WORKFLOWS',
    headline: 'Remote coding-agent setup automation',
    description: 'Setup scripts for remote T3 Code access, with optional Cloudflare Tunnel and Access integration.',
    tags: ['Shell', 'T3 Code', 'Cloudflare'], repository: 'https://github.com/Albro3459/CodeLaunch',
    intro: 'Created setup scripts and documentation for remote access to coding agents through T3 Code. The default configuration uses T3 Connect, with optional self-hosted HTTPS and agent integration modes.',
    role: 'Workflow design, setup automation & documentation',
    highlights: [
      { title: 'Setup automation', description: 'The default path uses T3 Connect. Setup tooling and documentation bring the configuration into a repeatable workflow.' },
      { title: 'Cloudflare integration', description: 'Cloudflare Tunnel and Cloudflare Access provide an opt-in HTTPS route. Other opt-in modes integrate CLIProxyAPI and Codex with Claude Code.' },
      { title: 'Desktop and mobile access', description: 'The public project includes desktop and phone examples of accessing the configured coding environment while away from the host.' },
    ],
    images: [
      { file: 'codelaunch-desktop', alt: 'CodeLaunch remote coding workflow on desktop', caption: 'A desktop view of the remote coding environment.' },
      { file: 'codelaunch-mobile', alt: 'CodeLaunch remote coding workflow on a phone', caption: 'Remote coding environment on mobile.' },
    ], credit: 'CodeLaunch configures and integrates existing tools, including T3 Code. Those upstream products belong to their respective creators.',
  },
  {
    slug: 'br0wser', name: 'br0wser', category: 'Developer tools', kind: 'CLI · BROWSER AUTOMATION',
    headline: 'Persistent Chrome sessions for coding agents',
    description: 'JavaScript CLI for launching and reusing Chrome sessions through the DevTools Protocol.',
    tags: ['JavaScript', 'Chrome CDP', 'CLI'], repository: 'https://github.com/Albro3459/br0wser',
    destination: { label: 'View npm package', url: 'https://www.npmjs.com/package/@albro3459/br0wser' },
    intro: 'Built a JavaScript CLI for launching, reconnecting to, and reusing Chrome or Chromium sessions through the Chrome DevTools Protocol. Browser state persists between commands.',
    role: 'CLI development & agent skill integration',
    highlights: [
      { title: 'Persistent sessions', description: 'Commands connect through the Chrome DevTools Protocol and detach after each operation. The browser retains tabs, cookies, and signed-in state.' },
      { title: 'Agent skill integration', description: 'Bundled Claude and Codex skills document how agents can open pages, inspect state, interact, and return to a running browser.' },
      { title: 'Command-line interface', description: 'A command-line interface exposes browser operations without requiring every task to manage a new browser lifecycle.' },
    ], images: [],
  },
  {
    slug: 't3-thread', name: 't3-thread', category: 'Developer tools', kind: 'CLI · CONVERSATION RETRIEVAL',
    headline: 'Read-only T3 Code conversation retrieval',
    description: 'A read-only CLI for finding and retrieving persisted T3 Code conversations.',
    tags: ['Node.js', 'SQLite', 'JSON / JSONL'], repository: 'https://github.com/Albro3459/t3-thread',
    destination: { label: 'View npm package', url: 'https://www.npmjs.com/package/@albro3459/t3-thread' },
    intro: 'Built a Node.js CLI and ESM API for reading locally stored T3 Code conversations from SQLite. Supports title search, selected-turn retrieval, and structured JSON or JSONL output.',
    role: 'CLI, local data access & structured output',
    highlights: [
      { title: 'Search and retrieval', description: 'Search by title or retrieve an exact thread, then select bounded turns rather than pulling in an entire conversation.' },
      { title: 'Structured output', description: 'Versioned JSON and JSONL schemas make the results usable by agents and scripts. An ESM API supports programmatic access.' },
      { title: 'Read-only data access', description: 'Local SQLite access supports conversation retrieval, live change output, and participant inspection without editing stored threads.' },
    ], images: [],
  },
];
