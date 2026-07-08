type TidlWordmarkProps = {
  variant?: "light" | "dark";
  size?: "nav" | "footer";
  className?: string;
};

export function TidlWordmark({ variant = "dark", size = "nav", className }: TidlWordmarkProps) {
  return (
    <span
      className={[
        "tidl-wordmark",
        `tidl-wordmark--${variant}`,
        `tidl-wordmark--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      TIDL
    </span>
  );
}
