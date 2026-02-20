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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-4 max-w-4xl mx-auto p-4 md:p-6 rounded-2xl mb-4 border",
        isBot 
          ? "bg-card/40 border-primary/20 flex-row" 
          : "bg-secondary/10 border-secondary/20 flex-row-reverse"
      )}
    >
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
        isBot 
          ? "bg-primary/10 text-primary ring-1 ring-primary/40 shadow-primary/20" 
          : "bg-secondary/10 text-secondary ring-1 ring-secondary/40 shadow-secondary/20"
      )}>
        {isBot ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
      </div>

      <div className={cn(
        "flex flex-col gap-1 min-w-0 max-w-[85%]",
        isBot ? "items-start" : "items-end"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            isBot ? "text-primary" : "text-secondary"
          )}>
            {isBot ? "AruGPT" : "User"}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className={cn(
          "prose prose-invert max-w-none text-base md:text-lg leading-relaxed font-light whitespace-pre-wrap",
          isBot ? "text-foreground/90" : "text-foreground/90 text-right"
        )}>
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
