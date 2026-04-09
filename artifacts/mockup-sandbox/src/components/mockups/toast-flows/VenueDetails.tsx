import React from "react";
import { 
  ChevronLeft, 
  Share, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  Navigation,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function VenueDetails() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100 p-4 font-sans">
      {/* Mobile Device Container */}
      <div 
        className="w-[390px] h-[844px] bg-[#FAFAF8] rounded-[40px] shadow-2xl overflow-hidden relative border-[8px] border-neutral-900 flex flex-col"
        style={{ fontFamily: "'Figtree', sans-serif" }}
      >
        <ScrollArea className="flex-1">
          {/* Hero Section */}
          <div className="relative h-[340px] w-full bg-neutral-200">
            <img 
              src="/images/gaggan.jpg" 
              alt="Gaggan Anand interior" 
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for text legibility at top */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
            
            {/* Top Navigation Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 shadow-sm hover:scale-105 transition-transform">
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 shadow-sm hover:scale-105 transition-transform">
                  <Share size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-neutral-800 shadow-sm hover:scale-105 transition-transform">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            {/* Pagination dots (mocking a gallery) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              <div className="w-2 h-2 rounded-full bg-white opacity-100" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <div className="w-2 h-2 rounded-full bg-white/50" />
            </div>
          </div>

          <div className="px-6 py-6 pb-32">
            {/* Header Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">Gaggan Anand</h1>
              <div className="flex items-center text-sm text-neutral-600 mb-3 font-medium">
                <span>Progressive Indian · Fine Dining</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FFCC02] text-[#FFCC02]" />
                  <span className="text-neutral-900">4.8</span>
                  <span className="text-neutral-400 font-normal">(420+)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-neutral-300" />
                <div className="text-neutral-900 tracking-widest">฿฿฿฿</div>
                <div className="w-1 h-1 rounded-full bg-neutral-300" />
                <div className="text-neutral-600">Phrom Phong</div>
              </div>
            </div>

            <Separator className="my-6 bg-neutral-200" />

            {/* Description */}
            <div className="mb-6">
              <p className="text-neutral-700 leading-relaxed text-[15px]">
                Asia's most celebrated progressive Indian restaurant. Chef Gaggan Anand creates a 25-course tasting menu that's equal parts science and soul.
              </p>
            </div>

            {/* Vibes */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-neutral-900 mb-3">Known for</h3>
              <div className="flex flex-wrap gap-2">
                {['date night', 'special occasion', 'adventurous', 'premium'].map((vibe) => (
                  <Badge 
                    key={vibe} 
                    variant="secondary" 
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1 font-medium text-xs rounded-full border-0"
                  >
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-6 bg-neutral-200" />

            {/* Location & Hours */}
            <div className="space-y-5 mb-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <MapPin className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 text-sm">Sukhumvit 31, Watthana</h4>
                  <p className="text-sm text-neutral-500 mt-0.5">Phrom Phong • 850m from BTS</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <Clock className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-green-600 text-sm">Open now</h4>
                    <span className="text-sm text-neutral-500 font-medium">Closes 11:00 PM</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-0.5">Tue-Sun 6:00 PM - 11:00 PM (Closed Monday)</p>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-neutral-200" />

            {/* Delivery Deep Links */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                Order Delivery <ExternalLink size={16} className="text-neutral-400" />
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between bg-[#00B14F]/10 hover:bg-[#00B14F]/20 text-[#00B14F] p-4 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00B14F] flex items-center justify-center text-white font-bold text-xs">G</div>
                    <span className="font-semibold">Order on GrabFood</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-[#00C300]/10 hover:bg-[#00C300]/20 text-[#00C300] p-4 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#00C300] flex items-center justify-center text-white font-bold text-xs">LM</div>
                    <span className="font-semibold">Order on LINE MAN</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-[#8B268B]/10 hover:bg-[#8B268B]/20 text-[#8B268B] p-4 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B268B] flex items-center justify-center text-white font-bold text-xs">R</div>
                    <span className="font-semibold">Order on Robinhood</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <Separator className="my-6 bg-neutral-200" />

            {/* Additional Info */}
            <div className="flex gap-4">
              <div className="mt-1">
                <Info className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 text-sm">Reservations required</h4>
                <p className="text-sm text-neutral-500 mt-0.5">Bookings open 30 days in advance. Cancellation policy applies.</p>
              </div>
            </div>

          </div>
        </ScrollArea>

        {/* Sticky Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 pb-8 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <Button 
            className="flex-1 bg-[#FFCC02] hover:bg-[#e6b802] text-neutral-900 font-bold h-14 rounded-2xl text-base shadow-sm"
          >
            Save to Plan
          </Button>
          <Button 
            variant="outline"
            className="flex-none w-14 h-14 rounded-2xl border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50"
          >
            <Navigation size={22} className="text-[#00B14F]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
