import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  isActive: boolean;
  color?: "primary" | "secondary";
  className?: string;
}

export function AudioVisualizer({ isActive, color = "primary", className }: AudioVisualizerProps) {
  const bars = [1, 2, 3, 4, 5];
  
  if (!isActive) return null;

  return (
    <div className={cn("voice-wave", className)}>
      {bars.map((i) => (
        <div 
          key={i} 
          className={cn(
            "voice-bar w-1 mx-[1px]", 
            color === "primary" ? "bg-cyan-400" : "bg-purple-500"
          )} 
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
