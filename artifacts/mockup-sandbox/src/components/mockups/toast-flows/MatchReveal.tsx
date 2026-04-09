import React from "react";
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Share2, 
  MoreHorizontal 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const members = [
  { name: "Ploy", avatar: "https://i.pravatar.cc/150?u=ploy" },
  { name: "Beam", avatar: "https://i.pravatar.cc/150?u=beam" },
  { name: "Fern", avatar: "https://i.pravatar.cc/150?u=fern" },
  { name: "Ice", avatar: "https://i.pravatar.cc/150?u=ice" },
];

const restaurants = [
  {
    id: 1,
    name: "Thipsamai",
    tags: "Thai · Classic",
    area: "Phra Nakhon",
    rating: 4.7,
    price: "฿฿",
    distance: "2.4 km",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Pad Thai Fai Ta Lu",
    tags: "Street Food",
    area: "Dinso Road",
    rating: 4.5,
    price: "฿",
    distance: "3.1 km",
    image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Baan Pad Thai",
    tags: "Thai · Modern",
    area: "Sukhumvit 33",
    rating: 4.3,
    price: "฿฿฿",
    distance: "5.2 km",
    image: "https://images.unsplash.com/photo-1626804475297-41609ea084eb?w=400&h=300&fit=crop",
  },
];

export function MatchReveal() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] overflow-y-auto relative text-neutral-900 shadow-xl border border-neutral-200 rounded-[40px] overflow-hidden">
      {/* Header Image Area */}
      <div className="relative h-[360px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=800&fit=crop" 
          alt="Pad Thai" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Top actions */}
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center text-white">
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Dish Info */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <Badge className="bg-[#FFCC02] text-black hover:bg-[#FFCC02]/90 font-bold mb-3 border-none px-3 py-1 text-sm inline-flex gap-1.5 items-center">
            <span>🎉</span> 92% Group Match
          </Badge>
          <h1 className="text-4xl font-black mb-1 leading-tight tracking-tight">Pad Thai</h1>
          <p className="text-white/80 font-medium text-lg">Thai Classic</p>
        </div>
      </div>

      <div className="px-6 py-6 pb-24">
        {/* Consensus Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Almost Unanimous!</p>
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {members.map((member, i) => (
                <div key={i} className="relative z-10 border-2 border-[#FAFAF8] rounded-full">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 z-20 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-50" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm font-medium text-neutral-600">
              <span className="font-bold text-neutral-900">4 of 4</span> agreed
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Top spots for Pad Thai</h2>
          
          <div className="flex flex-col gap-4">
            {restaurants.map((restaurant, i) => (
              <div key={restaurant.id} className="bg-white rounded-2xl p-3 flex gap-4 shadow-sm border border-neutral-100 items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-base truncate pr-2">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold bg-neutral-100 px-1.5 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-[#FFCC02] text-[#FFCC02]" />
                      {restaurant.rating}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 mb-2 truncate">{restaurant.tags}</p>
                  <div className="flex items-center text-xs text-neutral-500 gap-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {restaurant.distance}</span>
                    <span>•</span>
                    <span>{restaurant.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Action */}
        <div className="text-center mt-2">
          <button className="text-neutral-500 font-medium text-sm hover:text-neutral-900 underline decoration-neutral-300 underline-offset-4">
            See other options
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent pt-12">
        <Button className="w-full h-14 bg-[#FFCC02] hover:bg-[#FFCC02]/90 text-black font-bold text-lg rounded-2xl shadow-lg shadow-[#FFCC02]/20">
          Let's go here!
        </Button>
      </div>
    </div>
  );
}
