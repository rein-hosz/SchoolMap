interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-neutral-200 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
}

interface MapLoadingProps {
  message?: string;
}

export function MapLoading({ message = "Loading map..." }: MapLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <div className="text-xl font-medium">{message}</div>
          <div className="text-sm text-neutral-400 max-w-sm mx-auto">
            Please wait while we initialize the interactive map with school
            locations
          </div>
        </div>
      </div>

      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      </div>
    </div>
  );
}
