import React from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

export function SmartBrowse() {
  const sections = [
    {
      title: "Closest to your vibe",
      items: [
        {
          id: 1,
          name: "The Aviary",
          category: "Rooftop Bar",
          image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 2,
          name: "Blue Note",
          category: "Jazz Club",
          image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 3,
          name: "Clay & Co",
          category: "Pottery Workshop",
          image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
      ],
    },
    {
      title: "Popular tonight 🔥",
      items: [
        {
          id: 4,
          name: "Neon Arcade",
          category: "Barcade",
          image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 5,
          name: "Lucky Strike",
          category: "Bowling",
          image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 6,
          name: "Night Market",
          category: "Street Food",
          image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
      ],
    },
    {
      title: "Hidden gems 💎",
      items: [
        {
          id: 7,
          name: "Secret Garden",
          category: "Cocktail Bar",
          image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 8,
          name: "The Vault",
          category: "Escape Room",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 9,
          name: "Artisan Alley",
          category: "Gallery",
          image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
      ],
    },
    {
      title: "Good for groups 👯",
      items: [
        {
          id: 10,
          name: "Sing Sing",
          category: "Karaoke",
          image: "https://images.unsplash.com/photo-1516280440502-a2f7c0068a4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 11,
          name: "Board Game Cafe",
          category: "Cafe",
          image: "https://images.unsplash.com/photo-1611891487122-2075b925d524?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
        {
          id: 12,
          name: "The Warehouse",
          category: "Live Music",
          image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        },
      ],
    },
  ];

  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative pb-8">
      {/* Safe Area */}
      <div className="h-[44px] w-full" />

      {/* Header */}
      <div className="px-6 flex items-center justify-between">
        <button className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-900" strokeWidth={1.5} />
        </button>
        <h1 className="text-[18px] font-bold text-neutral-900">More options</h1>
        <button className="w-10 h-10 flex items-center justify-center -mr-2 rounded-full hover:bg-neutral-100 transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
        </button>
      </div>

      {/* Context */}
      <div className="px-6 mt-2">
        <p className="text-[14px] text-neutral-500 font-medium">More that may fit your vibe</p>
      </div>

      {/* Sections Container */}
      <div className="mt-5 pb-6">
        {sections.map((section, index) => (
          <div key={index} className="mt-6 first:mt-0">
            <h2 className="px-6 text-[16px] font-bold text-neutral-900 mb-3">{section.title}</h2>
            
            {/* Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto -mx-6 px-6 scrollbar-hide snap-x">
              {section.items.map((item) => (
                <div 
                  key={item.id} 
                  className="w-[160px] flex-shrink-0 bg-white rounded-2xl border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden snap-start"
                >
                  <div className="h-[100px] w-full bg-neutral-100 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5 flex flex-col gap-2">
                    <div>
                      <h3 className="text-[13px] font-semibold text-neutral-900 leading-tight truncate">{item.name}</h3>
                      <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">{item.category}</p>
                    </div>
                    <button className="h-7 w-full rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold hover:bg-amber-100 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              ))}
              <div className="w-3 flex-shrink-0" /> {/* Spacer for end of scroll */}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTAs */}
      <div className="px-6 mt-2 mb-6">
        <button className="w-full bg-white border border-neutral-200 text-neutral-800 font-semibold rounded-2xl h-12 flex items-center justify-center shadow-sm">
          Change vibe
        </button>
        <button className="w-full text-center mt-3 text-[13px] text-neutral-400 font-medium">
          Back to suggestions
        </button>
      </div>
      
      {/* Scrollbar hide styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
