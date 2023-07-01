type ProgressbarProps = {
  progress: number;
};

export default function Progressbar({ progress }: ProgressbarProps) {
  return (
    <div
      className="progressbar"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
