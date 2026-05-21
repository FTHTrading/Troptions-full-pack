import type { TruthLabel } from "@/lib/command-center";

const styles: Record<TruthLabel, string> = {
  PROVEN: "label-proven",
  PIPELINE: "label-pipeline",
  PROJECTION: "label-projection",
};

export function TruthChip({ label }: { label: TruthLabel }) {
  return <span className={styles[label]}>{label}</span>;
}
