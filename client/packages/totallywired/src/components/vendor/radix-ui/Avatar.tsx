import * as RAvatar from "@radix-ui/react-avatar";
import "./Avatar.css";

type AvatarProps = {
  src?: string;
  name: string;
  fallback?: string;
};

function getFallback(name: string) {
  const fb = name
    .split(" ", 2)
    .map((x) => x[0].toUpperCase())
    .join("");
  return fb ? fb : "?";
}

export function Avatar({ name, fallback, src }: AvatarProps) {
  return (
    <RAvatar.Root className="AvatarRoot">
      <RAvatar.Image className="AvatarImage" src={src} alt={name} />
      <RAvatar.Fallback className="AvatarFallback" delayMs={600}>
        {fallback ?? getFallback(name)}
      </RAvatar.Fallback>
    </RAvatar.Root>
  );
}
