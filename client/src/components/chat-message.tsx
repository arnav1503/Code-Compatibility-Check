import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import type { Message } from "@/hooks/use-chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex w-full gap-5 max-w-4xl mx-auto p-6 md:p-8 rounded-[2rem] mb-6 relative group transition-all duration-500",
        isBot 
          ? "bg-white/[0.03] backdrop-blur-md border-white/5 flex-row hover:bg-white/[0.05]" 
          : "bg-primary/[0.03] backdrop-blur-md border-primary/10 flex-row-reverse hover:bg-primary/[0.05]"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-2xl",
        isBot 
          ? "bg-gradient-to-br from-primary/20 to-primary/5 text-primary ring-1 ring-primary/40 shadow-primary/20" 
          : "bg-gradient-to-br from-secondary/20 to-secondary/5 text-secondary ring-1 ring-secondary/40 shadow-secondary/20"
      )}>
        {isBot ? <Bot className="w-7 h-7" /> : <User className="w-7 h-7" />}
      </div>

      <div className={cn(
        "flex flex-col gap-2 min-w-0 max-w-[85%]",
        isBot ? "items-start" : "items-end"
      )}>
        <div className="flex items-center gap-3 mb-1">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em]",
            isBot ? "text-primary text-glow" : "text-secondary text-glow-purple"
          )}>
            {isBot ? "SYSTEM_ARU" : "CLIENT_USER"}
          </span>
          <span className="text-[10px] text-muted-foreground/40 font-mono tracking-tighter">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        
        <div className={cn(
          "prose prose-invert max-w-none text-lg md:text-xl leading-relaxed font-light tracking-tight",
          isBot ? "text-white/90" : "text-white/90 text-right"
        )}>
          {message.content}
        </div>
      </div>
      
      {/* Visual accents */}
      <div className={cn(
        "absolute top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        isBot ? "left-0 bg-primary rounded-l-full" : "right-0 bg-secondary rounded-r-full"
      )} />
    </motion.div>
  );
}
