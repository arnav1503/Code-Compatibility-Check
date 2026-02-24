import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/components/chat-message";
import { InputArea } from "@/components/input-area";
import { AudioVisualizer } from "@/components/audio-visualizer";
import { useEffect, useRef, useState } from "react";
import { Cpu, Wifi, Bot, Sparkles, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SKILLS = [
  { name: "Voice Interaction", desc: "Speak and listen naturally" },
  { name: "Math Calculations", desc: "Complex arithmetic & logic" },
  { name: "Global Data", desc: "Capitals, GDP, Population" },
  { name: "Neural Memory", desc: "Learns new facts from you" },
  { name: "Science & Tech", desc: "Atoms, DNA, Gravity, etc." },
  { name: "Geography", desc: "Mountains, Rivers, Deserts" },
  { name: "Fun Facts", desc: "Random interesting trivia" }
];

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
  
  const [showSkills, setShowSkills] = useState(false);
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#020205]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-secondary/10 rounded-full blur-[150px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/5 py-4 px-6 md:px-8 shadow-2xl shadow-primary/5">
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
                Neural Link Active
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSkills(!showSkills)}
              className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/80 hover:text-primary hover:bg-primary/5 border border-primary/10 rounded-full px-4"
            >
              <Sparkles className="w-3 h-3" />
              Core_Capabilities
            </Button>

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
            
            <div className="flex items-center gap-3 text-[10px] font-black tracking-tighter text-primary/80 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
              <Wifi className="w-3.5 h-3.5" />
              STABLE_LINK_2026
            </div>
          </div>
        </div>
      </header>

      {/* Skills Sidebar */}
      <AnimatePresence>
        {showSkills && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkills(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm glass-panel z-50 p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white tracking-tighter flex items-center gap-3">
                  <Sparkles className="text-primary w-6 h-6" />
                  NEURAL_SKILLS
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowSkills(false)} className="rounded-full hover:bg-white/5">
                  <X className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2 max-h-[calc(100vh-250px)] custom-scrollbar">
                {SKILLS.map((skill, i) => (
                  <motion.div 
                    key={skill.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{skill.name}</span>
                      <ChevronRight className="w-3 h-3 text-primary/40 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-sm text-muted-foreground font-light">{skill.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                  <p className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.2em] mb-2">System Status</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    AruGPT is constantly evolving. Use the "X is Y" command to teach it new information.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-48 scroll-smooth custom-scrollbar relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
                <div className="p-10 rounded-full bg-primary/5 border border-primary/10 relative z-10">
                  <Bot className="w-20 h-20 text-primary/60" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter">Neural Link Established</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-lg font-light leading-relaxed">
                  Welcome, Dev Supreme. I am AruGPT, your advanced voice interface. How shall we proceed today?
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full px-4">
                <button onClick={() => sendMessage("Tell me a fact")} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary text-left">
                  "Tell me an interesting fact"
                </button>
                <button onClick={() => sendMessage("What is the capital of India?")} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary text-left">
                  "What is the capital of India?"
                </button>
              </div>
            </motion.div>
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
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Neural_Processing</span>
            </motion.div>
          )}
          
          <div ref={bottomRef} className="h-8" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#020205] via-[#020205]/95 to-transparent z-20">
        <InputArea 
          onSend={sendMessage} 
          onMicClick={handleMicClick}
          isListening={isListening}
          isPending={isPending}
        />
        <div className="text-center mt-6 flex flex-col items-center gap-1">
          <p className="text-[10px] text-primary/40 font-black uppercase tracking-[0.4em]">
            Neural Network Interface • Quantum Encryption Active • Multilingual Support
          </p>
          <p className="text-[11px] text-white/60 font-black tracking-tight">
            Designed and Developed by <span className="text-primary italic">Arnav Raj Singh</span>
          </p>
          <p className="text-[9px] text-muted-foreground/40 font-medium uppercase tracking-widest">
            Powered by Python & Neural Synthesis
          </p>
        </div>
      </footer>
    </div>
  );
}
