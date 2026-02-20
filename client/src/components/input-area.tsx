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
    <div className="relative w-full max-w-4xl mx-auto group">
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-primary/20 backdrop-blur-2xl border border-primary/30 text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3 shadow-[0_0_30px_rgba(0,243,255,0.3)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            Direct_Voice_Capture
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative rounded-[2.5rem] glass-panel p-3 transition-all duration-700 shadow-2xl",
        isListening ? "border-primary/60 bg-primary/5 shadow-[0_0_50px_rgba(0,243,255,0.15)] ring-1 ring-primary/20" : "border-white/10 group-hover:border-white/20"
      )}>
        <div className="flex items-end gap-3">
          <div className="relative">
            <Button
              type="button"
              size="icon"
              onClick={onMicClick}
              className={cn(
                "h-14 w-14 rounded-3xl shrink-0 transition-all duration-500 relative z-10",
                isListening 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)]" 
                  : "bg-white/5 hover:bg-white/10 text-primary border border-white/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
              )}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            {isListening && (
              <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Decoding voice frequencies..." : "Query the neural network..."}
              rows={1}
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-4 px-3 text-lg text-white placeholder:text-white/20 max-h-[250px] font-light tracking-tight"
              disabled={isListening}
            />
            
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isPending || isListening}
              className={cn(
                "h-14 w-14 rounded-3xl shrink-0 transition-all duration-500",
                input.trim() 
                  ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(0,243,255,0.5)] hover:shadow-[0_0_40px_rgba(0,243,255,0.7)] scale-100" 
                  : "bg-white/5 text-white/20 scale-95 opacity-50"
              )}
            >
              <Send className="w-6 h-6" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
