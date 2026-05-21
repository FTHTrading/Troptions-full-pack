type DestinationTagPanelProps = {
  readonly destinationTag: string;
  readonly txHash: string;
  readonly exchangeName: string;
};

export function DestinationTagPanel({ destinationTag, txHash, exchangeName }: DestinationTagPanelProps) {
  return (
    <section className="wf-panel wf-warning-card">
      <h2>Destination Tag Forensics</h2>
      <p>Destination tag <strong>{destinationTag}</strong> is required for {exchangeName} internal routing.</p>
      <p>Tag-linked transaction: <span className="wf-mono">{txHash}</span></p>
      <p>If exchange routing fails, support must map this tag to an internal order record.</p>
    </section>
  );
}
