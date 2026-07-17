interface LogoMarkProps {
  className?: string;
}

export default function LogoMark({ className = "w-16 h-16" }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer thin white ring */}
      <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="2" />

      {/* Inner thick Spotify-green ring */}
      <circle cx="50" cy="50" r="32" stroke="#1DB954" strokeWidth="12" />
    </svg>
  );
}
