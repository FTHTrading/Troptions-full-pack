interface CapabilityCardProps {
  title: string;
  description: string;
  bullets: readonly string[];
}

export function CapabilityCard({ title, description, bullets }: CapabilityCardProps) {
  return (
    <article className="rounded-2xl border border-[#2d426e] bg-[#0f182c]/90 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
      <h3 className="text-lg font-semibold text-[#f5f1e8]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#a8b3c7]">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-[#d2d9e6]">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-[#c4a84a]" aria-hidden />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
