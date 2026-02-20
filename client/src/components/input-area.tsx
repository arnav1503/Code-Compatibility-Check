import { Button } from "@/components/ui/button";
import { Mic, Send, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface InputAreaProps {
  onSend: (message: string) => void;
  onMicClick: () => void;
  isListening: boolean;
  isPending: boolean;
}

export function InputArea({ onSend, onMicClick, isListening, isPending }: InputAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isPending) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary/10 backdrop-blur-md border border-primary/20 text-primary px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Listening...
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative rounded-2xl glass-panel p-2 transition-all duration-300",
        isListening ? "border-primary/50 shadow-[0_0_20px_rgba(0,243,255,0.2)]" : "border-white/10"
      )}>
        <div className="flex items-end gap-2">
          <Button
            type="button"
            size="icon"
            onClick={onMicClick}
            className={cn(
              "h-12 w-12 rounded-xl shrink-0 transition-all duration-300",
              isListening 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                : "bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 hover:shadow-[0_0_15px_rgba(176,38,255,0.3)]"
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <form onSubmit={handleSubmit} className="flex-1 flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening to your voice..." : "Ask AruGPT anything..."}
              rows={1}
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-foreground placeholder:text-muted-foreground/50 max-h-[200px]"
              disabled={isListening}
            />
            
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isPending || isListening}
              className={cn(
                "h-12 w-12 rounded-xl shrink-0 transition-all duration-300",
                input.trim() 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)]" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
