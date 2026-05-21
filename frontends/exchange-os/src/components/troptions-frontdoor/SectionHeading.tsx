interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-mono uppercase tracking-[0.28em] text-[#c4a84a]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#f5f1e8] md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#b4bfd3] md:text-base">{description}</p>
    </header>
  );
}
