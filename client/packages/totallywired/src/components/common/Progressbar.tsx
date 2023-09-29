import { useId } from "react";
import "./Progressbar.css";

type ProgressbarProps = {
  label: string;
  progress: number;
};

export default function Progressbar({ progress, label }: ProgressbarProps) {
  const id = useId();
  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-labelledby={id}
    >
      <div className="progress" style={{ width: `${progress}%` }}></div>
      <div id={id} className="sr-only" aria-hidden="true">
        {label}
      </div>
    </div>
  );
}
