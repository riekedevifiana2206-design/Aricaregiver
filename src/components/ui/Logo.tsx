import { useSettings } from "../../context/SettingsContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const { logo } = useSettings();
  const sizes = {
    sm: "text-base h-8",
    md: "text-xl h-10",
    lg: "text-3xl h-14",
  };
  if (logo) {
    const h = { sm: "h-8", md: "h-10", lg: "h-14" }[size];
    return (
      <img
        src={logo}
        alt="Logo"
        className={`${h} w-auto object-contain ${className || ""}`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} ${className || ""} inline-flex items-center font-serif font-semibold tracking-tight`}
      style={{ color: "#000000", background: "#ffffff" }}
    >
      Ari Caregiver
    </div>
  );
}
