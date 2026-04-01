import React from "react";
import { motion } from "framer-motion";
import { Home, Map, Heart, User, Search, MapPin, ChevronDown, Star, Sparkles, CloudSun } from "lucide-react";

const VIBES = [
  { label: "Popular", emoji: "🔥" },
  { label: "Spicy", emoji: "🌶️" },
  { label: "Drinks", emoji: "🍸" },
  { label: "Budget", emoji: "💰" },
  { label: "Healthy", emoji: "🥗" },
  { label: "Outdoor", emoji: "⛱️" },
  { label: "Date Night", emoji: "💕" },
  { label: "More", emoji: "✨" },
];

const RESTAURANTS = [
  {
    id: 1,
    name: "Thipsamai",
    cuisine: "Thai",
    rating: "4.9",
    price: "฿",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60",
    description: "Famous pad thai"
  },
  {
    id: 2,
    name: "Sushi Masato",
    cuisine: "Sushi",
    rating: "4.9",
    price: "฿฿฿",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60",
    description: "Omakase counter"
  },
  {
    id: 3,
    name: "Jay Fai",
    cuisine: "Thai",
    rating: "4.9",
    price: "฿฿฿",
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60",
    description: "Michelin street food"
  },
  {
    id: 4,
    name: "Peppina",
    cuisine: "Pizza",
    rating: "4.8",
    price: "฿฿",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60",
    description: "Neapolitan pizza"
  },
  {
    id: 5,
    name: "Roast",
    cuisine: "Breakfast",
    rating: "4.7",
    price: "฿฿",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=60",
    description: "Premier brunch spot"
  },
  {
    id: 6,
    name: "After You",
    cuisine: "Desserts",
    rating: "4.5",
    price: "฿฿",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60",
    description: "Kakigori & honey toast"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function AirbnbStyle() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="relative w-[390px] h-[844px] bg-[#FAF8F5] rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-gray-900 flex flex-col">
        {/* Dynamic Island / Notch placeholder */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          
          {/* Top Bar */}
          <div className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#FAF8F5]/90 backdrop-blur-md z-40">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            >
              <MapPin size={16} className="text-[#FFCC02]" />
              <span className="text-sm font-medium text-gray-800">Sukhumvit</span>
              <ChevronDown size={14} className="text-gray-400 ml-1" />
            </motion.div>
            
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-gray-800"
              >
                <Search size={20} />
              </motion.button>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm"
              >
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" alt="Avatar" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          <div className="px-6 space-y-8 pb-8">
            {/* Greeting */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <CloudSun size={16} />
                <span>32°C in Bangkok</span>
              </div>
              <h1 className="text-4xl text-gray-900 font-serif leading-tight tracking-tight mb-4">
                Good evening, <br/>
                <span className="italic text-gray-600">foodie.</span>
              </h1>
              
              <div className="flex gap-2">
                <div className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-gray-700 shadow-sm border border-gray-100 flex items-center gap-1.5">
                  <span>🍜</span> Thai food fan
                </div>
                <div className="px-3 py-1.5 bg-white rounded-xl text-xs font-medium text-gray-700 shadow-sm border border-gray-100 flex items-center gap-1.5">
                  <span className="text-[#FFCC02]"><Sparkles size={12} fill="currentColor"/></span> 12-wk streak
                </div>
              </div>
            </motion.div>

            {/* Mode Selection */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex gap-4"
            >
              <motion.div 
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCC02]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <h3 className="font-serif text-2xl mb-1 text-gray-900">Solo</h3>
                <p className="text-xs text-gray-500 font-medium">Just for you</p>
                <div className="mt-6 w-10 h-10 bg-[#FFCC02] rounded-full flex items-center justify-center text-white shadow-md">
                  <User size={18} fill="currentColor" />
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <h3 className="font-serif text-2xl mb-1 text-gray-900">Group</h3>
                <p className="text-xs text-gray-500 font-medium">With friends</p>
                <div className="mt-6 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-md">
                  <div className="flex -space-x-1">
                    <User size={14} fill="currentColor" />
                    <User size={14} fill="currentColor" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Vibes Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-serif font-medium text-gray-900">Pick a Vibe</h2>
              </div>
              <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                {VIBES.map((vibe, idx) => (
                  <motion.div
                    key={vibe.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center text-2xl border border-gray-50">
                      {vibe.emoji}
                    </div>
                    <span className="text-[10px] font-medium text-gray-600">{vibe.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Horizontal List 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-medium text-gray-900">Your Usuals</h2>
                <button className="text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors">See all</button>
              </div>
              
              <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 scrollbar-hide snap-x">
                {RESTAURANTS.slice(0, 3).map((restaurant) => (
                  <motion.div 
                    key={restaurant.id}
                    whileHover={{ y: -4 }}
                    className="min-w-[240px] snap-center cursor-pointer group"
                  >
                    <div className="w-full h-[160px] rounded-3xl overflow-hidden relative mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-sm">
                        <Heart size={16} />
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif text-lg text-gray-900 leading-tight">{restaurant.name}</h3>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Star size={14} className="text-[#FFCC02]" fill="currentColor" />
                          <span>{restaurant.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{restaurant.cuisine} • {restaurant.price}</p>
                      <p className="text-xs text-gray-400 mt-1">{restaurant.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Horizontal List 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-medium text-gray-900">New near you</h2>
              </div>
              
              <div className="flex overflow-x-auto pb-6 -mx-6 px-6 gap-4 scrollbar-hide snap-x">
                {RESTAURANTS.slice(3, 6).map((restaurant) => (
                  <motion.div 
                    key={restaurant.id}
                    whileHover={{ y: -4 }}
                    className="min-w-[160px] snap-center cursor-pointer group"
                  >
                    <div className="w-full h-[200px] rounded-3xl overflow-hidden relative mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-sm">
                        <Heart size={16} />
                      </div>
                    </div>
                    <div className="px-1">
                      <h3 className="font-serif text-lg text-gray-900 leading-tight mb-1">{restaurant.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Star size={12} className="text-[#FFCC02]" fill="currentColor" />
                          {restaurant.rating}
                        </span>
                        <span>•</span>
                        <span>{restaurant.cuisine}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex justify-between items-center px-8 pb-4">
          <button className="flex flex-col items-center gap-1 text-[#FFCC02]">
            <Home size={24} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Map size={24} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Heart size={24} />
            <span className="text-[10px] font-medium">Saved</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <User size={24} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>

      </div>
      
      {/* Global styles for hiding scrollbar but allowing scroll */}
      <style dangerouslySetInline={{__html: `
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

export default AirbnbStyle;
