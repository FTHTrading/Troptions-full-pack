import { existsSync } from "node:fs";
import path from "node:path";

export interface OpenClawDiscoveryItem {
  id: string;
  type: "executable" | "config" | "archive";
  path: string;
}

function userPath(...parts: string[]) {
  return path.join(process.env.USERPROFILE || "", ...parts);
}

const CANDIDATES: OpenClawDiscoveryItem[] = [
  {
    id: "openclaw-dashboard-zip",
    type: "archive",
    path: userPath("OneDrive - FTH Trading", "11-Downloads", "openclaw-dashboard-1.7.3.zip"),
  },
  {
    id: "openclaw-voice-zip",
    type: "archive",
    path: userPath("OneDrive - FTH Trading", "11-Downloads", "openclaw-tts-voice-switch-1.0.0.zip"),
  },
  {
    id: "openclaw-agent-zip",
    type: "archive",
    path: userPath("OneDrive - FTH Trading", "11-Downloads", "agent-browser-clawdbot-0.1.0.zip"),
  },
  {
    id: "openclaw-config",
    type: "config",
    path: userPath("OpenClaw", "openclaw.config"),
  },
  {
    id: "clawd-config",
    type: "config",
    path: userPath("OpenClaw", "clawd.config"),
  },
  {
    id: "openclaw-tools",
    type: "config",
    path: userPath("OpenClaw", "tools.json"),
  },
  {
    id: "openclaw-agents",
    type: "config",
    path: userPath("OpenClaw", "agents.json"),
  },
  {
    id: "openclaw-executable",
    type: "executable",
    path: userPath("OpenClaw", "openclawd.exe"),
  },
];

export function discoverOpenClawPaths(): OpenClawDiscoveryItem[] {
  return CANDIDATES.filter((candidate) => existsSync(candidate.path));
}

export function getSafeOpenClawPathLabels(items: OpenClawDiscoveryItem[]) {
  return items.map((item) => ({
    id: item.id,
    type: item.type,
    label: path.basename(item.path),
  }));
}
