export type TruthLabel = {
  label: string;
  status: string;
  lastCheck: string;
  proof: string;
};

export type TruthLabelsData = {
  generated: string;
  source: string;
  labels: TruthLabel[];
};

export async function getTruthLabels(): Promise<TruthLabelsData> {
  const res = await fetch("/data/truth-labels.json");
  if (!res.ok) throw new Error("Failed to load truth labels");
  return res.json() as Promise<TruthLabelsData>;
}
