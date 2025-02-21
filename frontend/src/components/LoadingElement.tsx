import clsx from "clsx";

interface LoadingElementProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  text?: string;
  variant?: "spinner" | "dots" | "pulse";
  overlay?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingElement({
  size = "md",
  color = "primary",
  text = "Loading...",
  variant = "spinner",
  overlay = false,
  fullScreen = false,
  className,
}: LoadingElementProps): JSX.Element {
  // Size mappings
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  // Color mappings
  const colorMap = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
  };

  // Container classes
  const containerClasses = clsx(
    "flex flex-col items-center justify-center",
    {
      "fixed inset-0 z-50": fullScreen,
      relative: !fullScreen,
      "bg-black bg-opacity-50": overlay,
    },
    className
  );

  // Spinner classes
  const spinnerClasses = clsx("animate-spin", sizeMap[size], colorMap[color]);

  const renderLoadingIndicator = (): JSX.Element => {
    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-2">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={clsx(
                  "animate-bounce rounded-full",
                  sizeMap[size].split(" ")[0].replace("h-", "h-2"),
                  sizeMap[size].split(" ")[1].replace("w-", "w-2"),
                  colorMap[color]
                )}
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </div>
        );
      case "pulse":
        return (
          <div
            className={clsx(
              "animate-pulse rounded-full",
              sizeMap[size],
              colorMap[color]
            )}
          />
        );
      default:
        return (
          <svg
            className={spinnerClasses}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={containerClasses}>
      {renderLoadingIndicator()}
      {text && (
        <span className={clsx("mt-4 text-sm font-medium", colorMap[color])}>
          {text}
        </span>
      )}
    </div>
  );
}
