type SectionCardProps = {
  heading: string;
  body: string;
};

export function SectionCard({ heading, body }: SectionCardProps) {
  return (
    <article className="om-card">
      <h3>{heading}</h3>
      <p>{body}</p>
    </article>
  );
}
