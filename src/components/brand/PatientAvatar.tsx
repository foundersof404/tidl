type PatientAvatarProps = {
  name: string;
  size?: "sm" | "card" | "featured";
  className?: string;
};

function getInitials(name: string) {
  return name
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PatientAvatar({ name, size = "sm", className }: PatientAvatarProps) {
  const initials = getInitials(name);

  return (
    <span
      className={["patient-avatar", `patient-avatar--${size}`, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

type TestimonialContextPhotoProps = {
  src: string;
  alt: string;
  className?: string;
};

export function TestimonialContextPhoto({ src, alt, className }: TestimonialContextPhotoProps) {
  return (
    <div className={["testimonial-context-photo", className].filter(Boolean).join(" ")}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
