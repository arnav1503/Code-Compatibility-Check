import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { InputArea } from "@/components/input-area";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { useEffect, useRef } from "react";
import { Cpu, Wifi, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const { 
    messages, 
    sendMessage, 
    isPending, 
    isSpeaking, 
    isListening, 
    startListening, 
    stopListening 
  } = useChat();
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} 
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 glass-panel border-b border-white/5 py-4 px-6 md:px-8 shadow-2xl shadow-primary/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all duration-500 rounded-full" />
              <Cpu className="w-9 h-9 text-primary relative z-10 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-glow text-white">
                ARU<span className="text-primary italic">GPT</span>
              </h1>
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Core Active
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] text-primary/60 font-black tracking-[0.3em] mb-1">VOICE_MOD_V4</span>
              <div className="flex items-center gap-3 h-5">
                <span className={cn(
                  "text-[10px] font-bold tracking-widest transition-all duration-300",
                  isSpeaking ? "text-primary text-glow" : "text-muted-foreground/20"
                )}>
                  SYNC_OUT
                </span>
                <AudioVisualizer isActive={isSpeaking} color="primary" className="h-5" />
              </div>
            </div>
            
            <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
            
            <div className="flex items-center gap-3 text-[10px] font-black tracking-tighter text-primary/80 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:bg-primary/10 transition-colors cursor-default">
              <Wifi className="w-3.5 h-3.5" />
              STABLE_LINK_2026
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-40 scroll-smooth custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-8 rounded-full bg-primary/5 border border-primary/10 animate-pulse">
                <Bot className="w-16 h-16 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white/90 tracking-tighter">Initializing AruGPT...</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-lg font-light leading-relaxed">
                  Your neural-linked voice assistant is ready. Speak or type to begin interaction.
                </p>
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isPending && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-6 rounded-3xl bg-primary/5 border border-primary/10 w-fit"
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Analyzing_Request</span>
            </motion.div>
          )}
          
          <div ref={bottomRef} className="h-8" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-background via-background/90 to-transparent z-20">
        <InputArea 
          onSend={sendMessage} 
          onMicClick={handleMicClick}
          isListening={isListening}
          isPending={isPending}
        />
        <div className="text-center mt-2">
          <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
            AI-Powered Voice Assistant • Deep Learning Enabled
          </p>
        </div>
      </footer>
    </div>
  );
}
