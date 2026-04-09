import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Flame, 
  ChevronRight,
  UtensilsCrossed,
  Ticket,
  Plus,
  Compass,
  History,
  Home,
  Bookmark,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// --- Mock Data ---

const TRENDING = [
  {
    id: 1,
    title: "Fran's Brunch & Greens",
    type: "Cafe & Brunch",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1495474472207-464a4d965cb0?auto=format&fit=crop&q=80&w=800",
    distance: "1.2 km"
  },
  {
    id: 2,
    title: "Vesper Cocktail Bar",
    type: "Nightlife",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    distance: "2.5 km"
  },
  {
    id: 3,
    title: "Pottery Workshop",
    type: "Activity",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
    distance: "3.0 km"
  }
];

export function NewHome() {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex justify-center bg-neutral-100 min-h-screen font-sans">
      {/* Mobile Viewport Container */}
      <div className="w-full max-w-[390px] bg-[#FAFAF8] min-h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header / Greeting */}
        <header className="px-6 pt-12 pb-6 flex justify-between items-center z-10 relative">
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">{greeting},</p>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Bestie Squad ✌️</h1>
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm cursor-pointer">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 px-6 no-scrollbar space-y-8">
          
          {/* Hero Decision Cards */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-3">What are we doing?</h2>
            
            {/* Primary: Food */}
            <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] h-48 shadow-sm transition-transform active:scale-95">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000" 
                alt="Food" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#FFCC02] p-2 rounded-full text-black">
                    <UtensilsCrossed size={18} strokeWidth={2.5} />
                  </div>
                  <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md">Core</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Find Food</h3>
                <p className="text-white/80 text-sm font-medium line-clamp-1">Restaurants, cafes & street food</p>
              </div>
            </div>

            {/* Secondary: Activities */}
            <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] h-40 shadow-sm transition-transform active:scale-95">
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000" 
                alt="Activities" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white p-2 rounded-full text-black">
                    <Ticket size={18} strokeWidth={2.5} />
                  </div>
                  <Badge variant="secondary" className="bg-[#FFCC02] text-black hover:bg-[#FFCC02]/90 border-none">New</Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Activities & Events</h3>
                <p className="text-white/80 text-sm font-medium line-clamp-1">Workshops, nightlife & experiences</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-3xl shadow-sm border border-neutral-100 transition-colors hover:bg-neutral-50 active:scale-95">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
                  <Users size={20} />
                </div>
                <span className="text-xs font-bold text-neutral-800 text-center">Join<br/>Session</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-3xl shadow-sm border border-neutral-100 transition-colors hover:bg-neutral-50 active:scale-95">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-1">
                  <History size={20} />
                </div>
                <span className="text-xs font-bold text-neutral-800 text-center">Continue<br/>Plan</span>
              </button>

              <button className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-3xl shadow-sm border border-neutral-100 transition-colors hover:bg-neutral-50 active:scale-95">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-1">
                  <Bookmark size={20} />
                </div>
                <span className="text-xs font-bold text-neutral-800 text-center">Recent<br/>Plan</span>
              </button>
            </div>
          </section>

          {/* Trending Now */}
          <section className="-mx-6">
            <div className="px-6 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="text-[#FFCC02]" size={20} fill="#FFCC02" />
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Trending Now</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-neutral-500 font-medium h-8 px-2 hover:bg-transparent hover:text-neutral-900">
                See all <ChevronRight size={16} />
              </Button>
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex w-max space-x-4 px-6">
                {TRENDING.map((item) => (
                  <div key={item.id} className="w-[240px] group cursor-pointer">
                    <div className="relative overflow-hidden rounded-3xl aspect-[4/3] mb-3 shadow-sm">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-neutral-800 flex items-center gap-1">
                        <span className="text-yellow-500 text-[10px]">★</span> {item.rating}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 truncate text-base mb-0.5">{item.title}</h4>
                      <div className="flex items-center text-sm text-neutral-500 font-medium">
                        <span>{item.type}</span>
                        <span className="mx-2 w-1 h-1 rounded-full bg-neutral-300" />
                        <span className="flex items-center"><MapPin size={12} className="mr-1" />{item.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </section>

        </main>

        {/* Floating Action Button (Start New Session) */}
        <div className="absolute bottom-24 right-6 z-20">
          <Button size="icon" className="h-14 w-14 rounded-full bg-[#FFCC02] hover:bg-[#E6B800] text-black shadow-xl shadow-[#FFCC02]/30 transition-transform active:scale-95">
            <Plus size={24} strokeWidth={2.5} />
          </Button>
        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-neutral-100 px-6 py-4 pb-safe flex justify-between items-center z-20">
          <button className="flex flex-col items-center gap-1 text-black">
            <Home size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors">
            <Compass size={24} />
            <span className="text-[10px] font-medium">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors">
            <Bookmark size={24} />
            <span className="text-[10px] font-medium">Saved</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 hover:text-neutral-600 transition-colors">
            <User size={24} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>
        
      </div>
    </div>
  );
}
