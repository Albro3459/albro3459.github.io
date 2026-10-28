export type DeveloperTool = {
  name: string;
  description: string;
  repository: string;
  caseStudy?: string;
  destination?: { label: string; url: string };
  credit?: string;
};

export const developerTools: DeveloperTool[] = [
  {
    name: 'CodeLaunch',
    description: 'Setup automation and documentation for remote coding-agent access through T3 Connect, with optional Cloudflare Tunnel and Access integration.',
    repository: 'https://github.com/Albro3459/CodeLaunch',
    caseStudy: '/projects/codelaunch/',
  },
  {
    name: 'br0wser',
    description: 'A CLI that lets coding agents reconnect to Chrome through the DevTools Protocol while preserving tabs, cookies, and signed-in sessions.',
    repository: 'https://github.com/Albro3459/br0wser',
    caseStudy: '/projects/br0wser/',
    destination: { label: 'npm package', url: 'https://www.npmjs.com/package/@albro3459/br0wser' },
  },
  {
    name: 't3-profile',
    description: 'A CLI for managing multiple Claude and Codex profiles in T3 Code, keeping authentication separate while optionally sharing configuration and skills.',
    repository: 'https://github.com/Albro3459/t3-profile',
    destination: { label: 'npm package', url: 'https://www.npmjs.com/package/@albro3459/t3-profile' },
  },
  {
    name: 't3-thread',
    description: 'Read-only T3 Code conversation retrieval through a Node.js CLI and ESM API, with SQLite access, bounded history, and versioned JSON and JSONL output.',
    repository: 'https://github.com/Albro3459/t3-thread',
    caseStudy: '/projects/t3-thread/',
    destination: { label: 'npm package', url: 'https://www.npmjs.com/package/@albro3459/t3-thread' },
  },
  {
    name: 'codex-thread',
    description: 'A CLI for finding and reading local Codex conversations through a private app-server process, including selected turns and subagent relationships.',
    repository: 'https://github.com/Albro3459/codex-thread',
    destination: { label: 'npm package', url: 'https://www.npmjs.com/package/@albro3459/codex-thread' },
  },
  {
    name: 'VS Code Debugger MCP',
    description: 'A maintained fork of the VS Code debugger extension, with updated MCP transports, client configuration, and fixes for agent debugging workflows.',
    repository: 'https://github.com/Albro3459/VsCodeDebugger-MCP',
    destination: { label: 'VS Code Marketplace', url: 'https://marketplace.visualstudio.com/items?itemName=Albro3459.mcp-vscode-debugger' },
    credit: 'Maintained fork of NyxJae/VsCodeDebugger-MCP. The original extension is credited in the repository.',
  },
];

export type Project = {
  slug: string;
  name: string;
  category: 'Applications' | 'Developer tools';
  kind: string;
  headline: string;
  description: string;
  tags: string[];
  repository?: string;
  isFeatured?: boolean;
  destination?: { label: string; url: string };
  intro: string;
  role: string;
  highlights: { title: string; description: string; link?: { label: string; url: string } }[];
  images: { file: string; alt: string; caption: string }[];
  tools?: DeveloperTool[];
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
      { title: 'CloudLaunch origins', description: 'CloudGateway grew from CloudLaunch, my AWS deployment platform. CloudLaunch automated regional network setup, AMI distribution, server deployment, and resource cleanup, using a WireGuard VPN as its example product.', link: { label: 'View CloudLaunch', url: 'https://github.com/Albro3459/CloudLaunch' } },
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
    slug: 'shelf', name: 'Shelf', category: 'Applications', kind: 'WEB APP · LIBRARY CATALOGS',
    headline: 'Library book search and availability alerts',
    description: 'Find physical library books, save reading lists, and get email alerts when a copy is available.',
    tags: ['React', 'TypeScript', 'Convex', 'AWS SES'], repository: 'https://github.com/Albro3459/Shelf',
    destination: { label: 'Open Shelf', url: 'https://shelf.gocloudlaunch.com' },
    intro: 'Built a React application and Convex backend for finding physical books across East Baton Rouge Parish Library branches. Users can search the catalog, save books to private lists, and subscribe to availability alerts for selected libraries.',
    role: 'Full-stack development, catalog integration & notifications',
    highlights: [
      { title: 'Catalog integration', description: 'Built a reusable TypeScript catalog client shared by the app backend and CLI. It handles anonymous sessions, XML responses, physical-book filtering, and availability across library branches.' },
      { title: 'Private reading lists', description: 'Google sign-in and Convex persist personal book lists across sessions. Backend functions enforce ownership when users create lists or save and remove books.' },
      { title: 'Availability notifications', description: 'Scheduled checks monitor selected branches during daytime hours. AWS SES sends email when books become available, with notification state preventing repeated alerts for unchanged availability.' },
    ],
    images: [
      { file: 'shelf-web', alt: 'Shelf search results showing physical books and library branch availability', caption: 'Search library books and check availability across branches.' },
      { file: 'shelf-mobile', alt: 'Shelf on mobile showing a book and availability at library branches', caption: 'Book details and library availability on mobile.' },
    ],
  },
  {
    slug: 'ai-developer-tools', name: 'AI & Developer Tools', category: 'Developer tools', kind: 'CLI TOOLS · AGENT INTEGRATIONS',
    headline: 'Tools for coding-agent workflows',
    description: 'CodeLaunch, browser automation, profile management, conversation retrieval, and VS Code debugging integrations.',
    tags: ['Node.js', 'Chrome CDP', 'MCP', 'CLI'],
    intro: 'Built tools for the development workflows I use: remote coding-agent access, persistent browser sessions, separate provider profiles, and structured conversation retrieval. I also maintain a VS Code debugger extension fork for agent-driven debugging.',
    role: 'CLI development, setup automation & open-source maintenance',
    highlights: [],
    tools: developerTools,
    images: [
      { file: 'codelaunch-desktop', alt: 'CodeLaunch remote coding environment on desktop', caption: 'CodeLaunch setup for remote access to T3 Code from a desktop browser.' },
      { file: 'codelaunch-mobile', alt: 'CodeLaunch remote coding environment on a phone', caption: 'The same CodeLaunch environment accessed from a phone.' },
    ],
    credit: 'CodeLaunch integrates existing products, including T3 Code. VS Code Debugger MCP is a maintained fork. The linked repositories credit their upstream projects.',
  },
  {
    slug: 'clipboard-history', name: 'ClipboardHistory', category: 'Applications', kind: 'MACOS · PRODUCTIVITY',
    headline: 'Native macOS clipboard manager',
    description: 'Native macOS clipboard history for text, images, and files, with OCR search and configurable shortcuts.',
    tags: ['Swift', 'macOS', 'Keyboard shortcuts'], repository: 'https://github.com/Albro3459/ClipboardHistory',
    destination: { label: 'Watch the demo', url: 'https://youtu.be/p2S1_Rhee5o' },
    intro: 'Built a native Swift clipboard history manager for macOS, inspired by Windows clipboard history. It stores text, images, files, and folders, with keyboard navigation, OCR search, and plain-text paste.',
    role: 'Native macOS app development',
    highlights: [
      { title: 'Keyboard shortcuts', description: 'Configurable shortcuts open clipboard history and access previously copied content.' },
      { title: 'Multiple formats and search', description: 'Clipboard history holds text, images, files, folders, and grouped items. Search finds text and filenames, including text recognized within images.' },
      { title: 'Plain-text paste', description: 'A configurable universal paste action removes formatting from copied content.' },
    ],
    images: [
      { file: 'clipboard-window', alt: 'ClipboardHistory window displaying saved clipboard items', caption: 'Saved clipboard items in the native macOS app.' },
      { file: 'clipboard-search', alt: 'ClipboardHistory showing a search across saved files and folders', caption: 'Search across saved clipboard content.' },
    ],
  },
  {
    slug: 'the-catch', name: 'The Catch', category: 'Applications', kind: 'MOBILE APP · TEAM PROJECT',
    headline: 'Dating app, tied for first place in class',
    description: 'React Native dating app with real-time messaging. Tied for first place in Software Systems Development.',
    tags: ['React Native', 'TypeScript', 'Expo', 'Firebase'], repository: 'https://github.com/Albro3459/the_catch',
    intro: 'Co-developed The Catch, a dating app built with React Native, TypeScript, Expo, and Firebase. Our team tied for first place in the Software Systems Development class.',
    role: 'Team-based application development',
    highlights: [
      { title: 'Mobile application', description: 'The team built a dating app with registration and real-time messaging in React Native and TypeScript.' },
      { title: 'Firebase integration', description: 'Firebase provides authentication, storage, and real-time data for the application.' },
      { title: 'Class recognition', description: 'The project tied for first place in Software Systems Development.' },
    ],
    images: [
      { file: 'catch-home', alt: 'The Catch dating app landing screen', caption: 'The Catch landing screen.' },
      { file: 'catch-chat', alt: 'The Catch real-time messaging screen', caption: 'Real-time messaging in the app.' },
      { file: 'catch-registration', alt: 'The Catch account registration screen', caption: 'Account registration.' },
    ],
    credit: 'Created with GitHub collaborators markstubbs04, MParkerP, rferrell03, and Myles82. The public repository is a copy of the private team project, so the original commit history is unavailable.',
  },
  {
    slug: 'codelaunch', name: 'CodeLaunch', category: 'Developer tools', kind: 'DEVELOPER TOOLS · REMOTE WORKFLOWS',
    isFeatured: false,
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
    isFeatured: false,
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
    isFeatured: false,
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

export const featuredProjects = projects.filter(project => project.isFeatured !== false);
