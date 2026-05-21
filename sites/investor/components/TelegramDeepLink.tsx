const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(/^@/, "");
const href = username ? `https://t.me/${username}` : null;

export function TelegramDeepLink({
  className = "",
  label = "Open Telegram",
}: {
  className?: string;
  label?: string;
}) {
  if (!href) {
    return (
      <span
        className={`inline-flex cursor-not-allowed items-center rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] ${className}`}
        title="Set NEXT_PUBLIC_TELEGRAM_BOT_USERNAME at build time"
      >
        {label} (configure username)
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`inline-flex items-center rounded border border-[var(--color-accent-blue)] bg-[color-mix(in_srgb,var(--color-accent-blue)_12%,transparent)] px-4 py-2 text-sm font-medium text-[#9ec5e0] transition hover:bg-[color-mix(in_srgb,var(--color-accent-blue)_22%,transparent)] ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}
