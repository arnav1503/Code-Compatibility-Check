import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { InputArea } from "@/components/input-area";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { useEffect, useRef } from "react";
import { Cpu, Wifi } from "lucide-react";

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
      <header className="sticky top-0 z-10 glass-panel border-b border-white/5 py-4 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Cpu className="w-8 h-8 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/40 blur-md animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-glow text-white">
                ARU<span className="text-primary">GPT</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                System Online
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-muted-foreground font-mono">VOICE MODULE</span>
              <div className="flex items-center gap-2 h-5">
                <span className={isSpeaking ? "text-primary text-shadow-glow" : "text-muted-foreground/30"}>
                  OUTPUT
                </span>
                <AudioVisualizer isActive={isSpeaking} color="primary" className="h-4" />
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
            
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
              <Wifi className="w-3 h-3 text-primary" />
              v1.0.4
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isPending && (
            <div className="flex items-center gap-3 p-4 text-muted-foreground animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="text-xs font-mono uppercase tracking-widest">Processing</span>
            </div>
          )}
          
          <div ref={bottomRef} className="h-4" />
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
