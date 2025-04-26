import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

type BarLogoProps = {
  name: string;
  path?: string | null;
  className?: string;
};

export function BarLogo({ name, path, className }: BarLogoProps) {
  return (
    <Avatar className={cn("size-12", className)}>
      <AvatarImage src={`${storageUrl}/${path}`} />
      <AvatarFallback className="bg-foreground text-background text-2xl uppercase">
        {name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
