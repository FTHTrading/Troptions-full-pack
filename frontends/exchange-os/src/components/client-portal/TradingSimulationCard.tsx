type TradingSimulationCardProps = {
  strategy: string;
  simulationMode: boolean;
  blockedReasons: string[];
};

export function TradingSimulationCard({ strategy, simulationMode, blockedReasons }: TradingSimulationCardProps) {
  return (
    <article className="cp-card">
      <h3>{strategy}</h3>
      <span className="cp-badge">{simulationMode ? "Simulation" : "Live"}</span>
      <p>{simulationMode ? "Live execution remains disabled by default." : blockedReasons.join(" | ")}</p>
    </article>
  );
}
