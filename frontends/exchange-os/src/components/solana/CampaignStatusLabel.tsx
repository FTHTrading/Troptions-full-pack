// Campaign mint status pill — truth label component
interface CampaignStatusLabelProps {
  mintStatus: 'pending' | 'minted' | 'stub';
  network: 'devnet' | 'mainnet-beta';
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; label: string }
> = {
  'devnet·stub': {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400/80',
    label: 'DEVNET · STUB',
  },
  'devnet·pending': {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400/80',
    label: 'DEVNET · PENDING',
  },
  'devnet·minted': {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400/80',
    label: 'DEVNET · MINTED',
  },
  'mainnet-beta·minted': {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    label: 'MAINNET · MINTED',
  },
  'mainnet-beta·pending': {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400/80',
    label: 'MAINNET · PENDING',
  },
  'mainnet-beta·stub': {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400/80',
    label: 'MAINNET · STUB',
  },
};

export default function CampaignStatusLabel({
  mintStatus,
  network,
  className = '',
}: CampaignStatusLabelProps) {
  const key = `${network}·${mintStatus}`;
  const cfg = STATUS_CONFIG[key] ?? STATUS_CONFIG['devnet·stub'];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${cfg.bg} ${cfg.border} ${cfg.text} ${className}`}
    >
      {cfg.label}
    </span>
  );
}
