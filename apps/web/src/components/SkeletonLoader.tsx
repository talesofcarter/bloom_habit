interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}
