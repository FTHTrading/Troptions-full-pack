import { DISCLAIMERS } from "@/content/troptions/disclaimerRegistry";

interface DisclaimerBannerProps {
  variant?: "master" | "asset" | "securities" | "stable" | "rwa" | "barter" | "exchange" | "full-public" | "institutional";
  className?: string;
}

export function DisclaimerBanner({ variant = "master", className = "" }: DisclaimerBannerProps) {
  let text = "";

  if (variant === "full-public") {
    text = [DISCLAIMERS.MASTER, DISCLAIMERS.ASSET, DISCLAIMERS.JURISDICTION, DISCLAIMERS.FORWARD_LOOKING].join(" ");
  } else if (variant === "institutional") {
    text = [DISCLAIMERS.MASTER, DISCLAIMERS.ASSET, DISCLAIMERS.SECURITIES, DISCLAIMERS.JURISDICTION, DISCLAIMERS.FORWARD_LOOKING, DISCLAIMERS.FUNDING].join(" ");
  } else if (variant === "master") {
    text = DISCLAIMERS.MASTER;
  } else if (variant === "asset") {
    text = DISCLAIMERS.ASSET;
  } else if (variant === "securities") {
    text = DISCLAIMERS.SECURITIES;
  } else if (variant === "stable") {
    text = DISCLAIMERS.STABLE_UNIT;
  } else if (variant === "rwa") {
    text = DISCLAIMERS.RWA;
  } else if (variant === "barter") {
    text = DISCLAIMERS.BARTER;
  } else if (variant === "exchange") {
    text = DISCLAIMERS.EXCHANGE;
  }

  return (
    <div className={`border border-yellow-600/40 bg-yellow-950/30 rounded px-4 py-3 ${className}`}>
      <p className="text-yellow-300/80 text-xs leading-relaxed font-light">{text}</p>
    </div>
  );
}
