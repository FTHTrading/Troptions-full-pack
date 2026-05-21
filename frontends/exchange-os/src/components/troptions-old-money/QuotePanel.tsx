type QuotePanelProps = {
  quote: string;
  attribution: string;
};

export function QuotePanel({ quote, attribution }: QuotePanelProps) {
  return (
    <aside className="om-quote">
      <p>&ldquo;{quote}&rdquo;</p>
      <small>{attribution}</small>
    </aside>
  );
}
