import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
  isRecording: boolean;
  className?: string;
}

export function WaveformVisualizer({ isRecording, className }: WaveformVisualizerProps) {
  // Simple CSS animation visualizer for MVP
  // In v2, we can connect AudioContext to draw real frequency data
  
  return (
    <div className={cn("flex items-center justify-center gap-1 h-12", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 bg-primary/80 rounded-full transition-all duration-300",
            isRecording ? "animate-[bounce_1s_infinite]" : "h-1.5"
          )}
          style={{
            height: isRecording ? '100%' : '6px',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}
