import React from "react";
import { ChevronRight, IceCream, Wine, Gamepad2, Ticket, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContinuationBridge() {
  const selectedRestaurant = {
    name: "Charmgang Curry Shop",
    area: "Talad Noi, Bangkok",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
  };

  const categories = [
    {
      id: "dessert",
      title: "Dessert",
      subtext: "Sweet tooth calling",
      icon: <IceCream className="w-5 h-5 text-white" />,
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
      color: "from-pink-500/80 to-pink-900/90",
    },
    {
      id: "drinks",
      title: "Drinks",
      subtext: "Keep the vibe alive",
      icon: <Wine className="w-5 h-5 text-white" />,
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600",
      color: "from-blue-500/80 to-indigo-900/90",
    },
    {
      id: "activities",
      title: "Activities",
      subtext: "Games & fun times",
      icon: <Gamepad2 className="w-5 h-5 text-white" />,
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
      color: "from-green-500/80 to-emerald-900/90",
    },
    {
      id: "events",
      title: "Events",
      subtext: "Live music & more",
      icon: <Ticket className="w-5 h-5 text-white" />,
      image:
        "https://images.unsplash.com/photo-1540039155733-d76e6d488311?auto=format&fit=crop&q=80&w=600",
      color: "from-purple-500/80 to-violet-900/90",
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] font-['Figtree',sans-serif] mx-auto overflow-hidden relative shadow-2xl rounded-[40px] border-[8px] border-black">
      {/* Confetti / Celebration Header */}
      <div className="px-6 pt-12 pb-6 bg-gradient-to-b from-[#FFCC02]/20 to-transparent">
        <div className="inline-block px-3 py-1 bg-[#FFCC02] text-black font-bold text-sm rounded-full mb-4 shadow-sm transform -rotate-2">
          🎉 Match Found!
        </div>
        
        {/* Match Context Card */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5 flex items-center gap-4 mb-8">
          <img
            src={selectedRestaurant.image}
            alt={selectedRestaurant.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 leading-tight">
              {selectedRestaurant.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {selectedRestaurant.area}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-[#CC9900]" />
          </div>
        </div>

        {/* Transition Headline */}
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Your night doesn't <br /> end here ✨
          </h1>
          <p className="text-gray-600 text-lg">
            Where to next? Keep the plan going.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-6 grid grid-cols-2 gap-4 pb-24">
        {categories.map((category) => (
          <button
            key={category.id}
            className="relative h-48 rounded-3xl overflow-hidden group text-left active:scale-95 transition-transform duration-200 shadow-sm"
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-90`}
            />
            
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                {category.icon}
              </div>
              
              <div>
                <h3 className="text-white font-bold text-xl mb-1 drop-shadow-sm">
                  {category.title}
                </h3>
                <p className="text-white/80 text-xs font-medium leading-tight drop-shadow-sm">
                  {category.subtext}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Skip / Footer Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent">
        <button className="w-full py-4 text-center text-gray-500 font-semibold hover:text-gray-900 transition-colors">
          Skip — I just want food for now
        </button>
      </div>
    </div>
  );
}
