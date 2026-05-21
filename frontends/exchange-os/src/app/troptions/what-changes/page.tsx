import "@/styles/troptions-evolution.css";

export const metadata = {
  title: "What Changes",
  description: "Troptions transition from digital utility narrative to institutional operating infrastructure.",
};

const CHANGE_LIST = [
  "From claims to evidence",
  "From tokens to roles",
  "From payments to rail evaluation",
  "From RWA concepts to proof-gated intake",
  "From exchange language to simulation and routing",
  "From marketing to machine-readable trust",
  "From manual support to AI and telecom concierge",
  "From scattered sources to source-of-truth registry",
  "From speculative positioning to institutional discipline",
] as const;

export default function TroptionsWhatChangesPage() {
  return (
    <main className="te-page">
      <div className="te-wrap">
        <header className="te-panel">
          <p className="te-kicker">What Changes</p>
          <h1 className="te-heading">From Digital Utility to Institutional Operating Infrastructure</h1>
          <p className="te-subheading">
            Legacy Troptions narratives are preserved while being translated into controlled institutional workflows.
          </p>
        </header>

        <section className="te-panel">
          <ul>
            {CHANGE_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
