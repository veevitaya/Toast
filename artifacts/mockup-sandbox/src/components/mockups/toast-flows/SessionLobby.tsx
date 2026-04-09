import React, { useState } from "react";
import { Copy, Share2, CheckCircle2, Clock, Users, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const PARTICIPANTS = [
  {
    id: "1",
    name: "Ploy",
    isHost: true,
    isYou: true,
    status: "joined",
    avatarColor: "bg-blue-100 text-blue-700",
    initials: "PL",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "2",
    name: "Beam",
    isHost: false,
    isYou: false,
    status: "joined",
    avatarColor: "bg-emerald-100 text-emerald-700",
    initials: "BM",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "3",
    name: "Fern",
    isHost: false,
    isYou: false,
    status: "joined",
    avatarColor: "bg-purple-100 text-purple-700",
    initials: "FN",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "4",
    name: "Ice",
    isHost: false,
    isYou: false,
    status: "waiting",
    avatarColor: "bg-gray-100 text-gray-500",
    initials: "IC",
    img: ""
  }
];

export function SessionLobby() {
  const [copied, setCopied] = useState(false);
  const joinedCount = PARTICIPANTS.filter(p => p.status === "joined").length;
  const totalCount = PARTICIPANTS.length;
  const progressPercent = (joinedCount / totalCount) * 100;
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[390px] mx-auto bg-[#FAFAF8] font-['Figtree'] overflow-hidden text-slate-900 relative shadow-2xl">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[30%] bg-[#FFCC02]/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex flex-col items-center justify-center space-y-3 text-center relative z-10">
        <div className="inline-flex items-center justify-center space-x-1.5 bg-amber-100/50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Dinner Session</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Who's joining?</h1>
        <p className="text-slate-500 text-[15px] max-w-[240px] leading-relaxed">Wait for friends to join before swiping for restaurants</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 pb-32 z-10 space-y-8 no-scrollbar">
        
        {/* Session Code Card */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FFCC02]" />
          <CardContent className="p-6 flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Session Code</p>
                <div className="text-3xl font-black tracking-widest text-slate-800 font-mono">
                  TOAST-7842
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
                onClick={handleCopy}
              >
                {copied ? <CheckCircle2 className="w-6 h-6 text-[#06C755]" /> : <Copy className="w-6 h-6" />}
              </Button>
            </div>
            
            <Button 
              className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-2xl h-14 text-[15px] shadow-[0_8px_20px_-6px_rgba(6,199,85,0.5)] transition-all active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share to LINE
            </Button>
          </CardContent>
        </Card>

        {/* Participants Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <div className="bg-slate-200/50 p-1.5 rounded-lg">
                <Users className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-extrabold text-[15px]">Squad ({joinedCount}/{totalCount})</h2>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full">
              Waiting for {totalCount - joinedCount} more
            </span>
          </div>
          
          <div className="h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FFCC02] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Participants List */}
        <div className="space-y-3">
          {PARTICIPANTS.map((p, i) => (
            <div 
              key={p.id}
              className={`flex items-center justify-between p-4 rounded-3xl transition-all duration-500 ease-out ${
                p.status === "joined" 
                  ? "bg-white shadow-sm ring-1 ring-slate-100" 
                  : "bg-white/40 border-2 border-slate-200 border-dashed opacity-80"
              }`}
              style={{
                animationDelay: `${i * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className={`h-14 w-14 border-2 ${p.status === "joined" ? "border-white shadow-sm" : "border-transparent"}`}>
                    {p.img ? <AvatarImage src={p.img} alt={p.name} className="object-cover" /> : <AvatarFallback className={`${p.avatarColor} font-bold text-lg`}>{p.initials}</AvatarFallback>}
                  </Avatar>
                  {p.status === "joined" && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <div className="bg-[#06C755] w-3.5 h-3.5 rounded-full border-2 border-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className={`font-extrabold text-[15px] ${p.status === "joined" ? "text-slate-900" : "text-slate-500"}`}>
                      {p.name}
                    </p>
                    {p.isYou && (
                      <Badge variant="outline" className="text-[10px] font-bold uppercase py-0 h-4 px-1.5 border-slate-200 text-slate-500 bg-slate-50">You</Badge>
                    )}
                    {p.isHost && (
                      <Badge variant="outline" className="text-[10px] font-bold uppercase py-0 h-4 px-1.5 border-amber-200 bg-amber-50 text-amber-600">Host</Badge>
                    )}
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 flex items-center">
                    {p.status === "joined" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#06C755]" />
                        <span className="text-slate-600">Ready</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        <span>Invited...</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Area */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent pt-12 z-20 pb-8">
        <Button 
          className="w-full h-16 rounded-2xl text-[16px] font-black bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)] transition-all active:scale-[0.98] group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center tracking-wide">
            Start Swiping
            <Play className="w-5 h-5 ml-2 fill-current" />
          </span>
          {/* Subtle pulse effect for the button to indicate action */}
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        </Button>
      </div>
    </div>
  );
}
