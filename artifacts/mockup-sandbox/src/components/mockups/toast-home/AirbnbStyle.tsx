import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Home, Map as MapIcon, Heart, User, Star, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'thai', label: 'Thai 🇹🇭' },
  { id: 'sushi', label: 'Sushi 🍣' },
  { id: 'burgers', label: 'Burgers 🍔' },
  { id: 'pizza', label: 'Pizza 🍕' },
  { id: 'bars', label: 'Bars 🍸' },
  { id: 'cafe', label: 'Cafe ☕' },
  { id: 'desserts', label: 'Desserts 🍰' },
];

const VIBES = [
  { id: 'popular', label: 'Popular', icon: '🔥' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'drinks', label: 'Drinks', icon: '🍸' },
  { id: 'budget', label: 'Budget', icon: '💰' },
  { id: 'healthy', label: 'Healthy', icon: '🥗' },
  { id: 'outdoor', label: 'Outdoor', icon: '⛱️' },
  { id: 'date', label: 'Date Night', icon: '💕' },
  { id: 'more', label: 'More', icon: '✨' },
];

const USUALS = [
  { id: 1, name: 'Thipsamai', cuisine: 'Thai', rating: 4.9, price: '฿', desc: 'Famous pad thai since 1966', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Sushi Masato', cuisine: 'Sushi', rating: 4.9, price: '฿฿฿', desc: 'Intimate 8-seat omakase', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Jay Fai', cuisine: 'Thai', rating: 4.9, price: '฿฿฿', desc: 'Michelin-starred street food', image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60' },
];

const NEW_NEAR = [
  { id: 1, name: 'Peppina', cuisine: 'Pizza', rating: 4.8, price: '฿฿', desc: 'Neapolitan pizza, wood-fired', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Roast', cuisine: 'Breakfast', rating: 4.7, price: '฿฿', desc: "Bangkok's premier brunch", image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=60' },
  { id: 3, name: 'After You', cuisine: 'Desserts', rating: 4.5, price: '฿฿', desc: 'Kakigori & honey toast', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=60' },
];

const MAP_PINS = [
  { top: '20%', left: '30%', icon: '🍜' },
  { top: '35%', left: '70%', icon: '🍣' },
  { top: '45%', left: '20%', icon: '🔥' },
  { top: '60%', left: '80%', icon: '🍕' },
  { top: '75%', left: '40%', icon: '☕' },
  { top: '85%', left: '60%', icon: '🍰' },
];

const springConfig = { type: "spring", stiffness: 320, damping: 22 };

export function AirbnbStyle() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-8 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .map-bg {
          background-color: #F0EDE8;
          background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}} />
      
      {/* Phone Frame */}
      <div className="relative w-[390px] h-[844px] bg-white rounded-[40px] border-[8px] border-gray-900 overflow-hidden shadow-2xl flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-[30px] bg-black rounded-b-3xl"></div>
        </div>

        {/* Map Background */}
        <div className="absolute inset-0 map-bg z-0" onClick={() => setDrawerOpen(false)}>
          {MAP_PINS.map((pin, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + (i * 0.1), ...springConfig }}
              className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 text-sm z-10 cursor-pointer hover:scale-110"
              style={{ top: pin.top, left: pin.left }}
            >
              {pin.icon}
            </motion.div>
          ))}
        </div>

        {/* Floating Top Elements */}
        <div className="relative z-20 pt-12 px-4 pb-4 pointer-events-none">
          {/* Search Bar */}
          <motion.div 
            className="flex items-center gap-3 w-full bg-white/90 backdrop-blur-md p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white pointer-events-auto"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="text-sm font-bold text-gray-900 leading-tight">What are you craving?</div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <span className="flex items-center gap-0.5 text-red-500"><MapPin className="w-3 h-3" /> Sukhumvit</span>
                <span className="text-gray-300">•</span>
                <span>Any time</span>
                <span className="text-gray-300">•</span>
                <span>2 guests</span>
              </div>
            </div>
            <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
              <SlidersHorizontal className="w-4 h-4 text-gray-900" />
            </div>
          </motion.div>

          {/* Category Chips - only visible when drawer is collapsed */}
          <AnimatePresence>
            {!drawerOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pointer-events-auto"
              >
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-100 ${i === 0 ? 'bg-gray-900 text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'}`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Drawer */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-[#F5F5F5] rounded-t-[28px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 flex flex-col"
          animate={{ height: drawerOpen ? '82%' : '45%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Drag Handle */}
          <div 
            className="w-full pt-3 pb-2 flex justify-center cursor-pointer touch-none"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
            
            {/* Header: Logo & Toggle */}
            <div className="px-6 py-2 flex items-center justify-between">
              <img src="/__mockup/images/toast_logo.png" alt="Toast" className="h-12 object-contain" />
              <button 
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                {drawerOpen ? 'See map' : 'See more'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Greeting Section */}
            <div className="px-6 mt-4 relative">
              <div className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Wed · 7:30 PM · ☀️ 32°C
              </div>
              <h1 className="text-3xl font-['Playfair_Display'] font-bold text-gray-900 leading-tight mb-3 pr-16">
                Good evening,<br/>foodie.
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                  🍜 Thai food fan
                </span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                  <span className="text-[#FFCC02]">✨</span> 12-wk streak
                </span>
              </div>
            </div>

            {/* Who's eating with you? */}
            <div className="px-6 mt-2 mb-8">
              <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">Who's eating with you?</h2>
              <div className="flex gap-4">
                <motion.div 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col items-center justify-center text-center gap-2"
                >
                  <div className="h-[80px] w-[80px] flex items-center justify-center">
                    <img src="/__mockup/images/toast_char.png" alt="Solo" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Solo</div>
                    <div className="text-xs text-gray-500 mt-0.5">Just for you</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer flex flex-col items-center justify-center text-center gap-2"
                >
                  <div className="h-[80px] w-[80px] flex items-center justify-center relative">
                    <img src="/__mockup/images/toast_waffle.jpeg" alt="Group" className="max-h-[90px] max-w-[90px] object-contain" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Group</div>
                    <div className="text-xs text-gray-500 mt-0.5">With friends</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Toast Decides Widget */}
            <div className="px-6 mb-10">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="pr-12">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mb-1">
                      <Sparkles className="w-4 h-4 text-[#FFCC02]" /> Toast's picks for today
                    </div>
                    <div className="text-gray-500 text-sm">I think you'll love this!</div>
                  </div>
                  <img src="/__mockup/images/toast_mascot.png" alt="Toast Mascot" className="w-[60px] h-[60px] object-contain absolute right-0 top-0 translate-x-2 -translate-y-2" />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#FFCC02] text-gray-900 font-bold py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2"
                >
                  Let Toast Decide <ArrowRight className="w-4 h-4" />
                </motion.button>
                <div className="text-center mt-3">
                  <span className="text-xs font-semibold text-gray-400 underline decoration-gray-300 underline-offset-2 cursor-pointer hover:text-gray-600">Refine preferences</span>
                </div>
              </div>
            </div>

            {/* Pick a Vibe Grid */}
            <div className="px-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">PICK A VIBE</h2>
                <span className="text-xs font-semibold text-gray-500 flex items-center">Opens a world <ChevronRight className="w-3 h-3 ml-0.5" /></span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {VIBES.map((vibe, idx) => (
                  <motion.div
                    key={vibe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.05), ...springConfig }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50 cursor-pointer"
                  >
                    <div className="text-2xl">{vibe.icon}</div>
                    <div className="text-[11px] font-semibold text-gray-700">{vibe.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your Usuals */}
            <RestaurantRow title="Your Usuals" subtitle="Places you love" restaurants={USUALS} />
            
            {/* New near you */}
            <RestaurantRow title="New near you" subtitle="Fresh spots to try" restaurants={NEW_NEAR} />
            
            <div className="h-10" /> {/* Bottom spacer */}
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 inset-x-0 h-[84px] bg-white border-t border-gray-100 flex justify-around items-start pt-3 px-6 z-40 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" active />
          <NavItem icon={<MapIcon className="w-6 h-6" />} label="Map" />
          <NavItem icon={<Heart className="w-6 h-6" />} label="Saved" />
          <NavItem icon={<User className="w-6 h-6" />} label="Profile" />
        </div>
      </div>
    </div>
  );
}

function RestaurantRow({ title, subtitle, restaurants }: { title: string, subtitle?: string, restaurants: typeof USUALS }) {
  return (
    <div className="mb-10 overflow-hidden">
      <div className="px-6 mb-4">
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4 pt-1 snap-x snap-mandatory">
        {restaurants.map((restaurant, idx) => (
          <motion.div 
            key={restaurant.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + (idx * 0.04), ...springConfig }}
            whileHover={{ y: -3 }}
            className="min-w-[260px] snap-center cursor-pointer group"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-3 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-gray-900" />
              </div>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-['Playfair_Display'] font-bold text-gray-900 text-lg truncate pr-2">{restaurant.name}</h3>
                <div className="flex items-center gap-1 text-sm font-semibold flex-shrink-0 pt-0.5 text-gray-800">
                  <Star className="w-3.5 h-3.5 fill-[#FFCC02] text-[#FFCC02]" />
                  {restaurant.rating}
                </div>
              </div>
              <div className="text-[13px] text-gray-500 mb-0.5 truncate">{restaurant.desc}</div>
              <div className="text-[13px] text-gray-500 font-medium">
                {restaurant.cuisine} · {restaurant.price}
              </div>
            </div>
          </motion.div>
        ))}
        {/* Spacer for right edge */}
        <div className="min-w-[4px] snap-center"></div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer ${active ? 'text-[#FFCC02]' : 'text-gray-400 hover:text-gray-600'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}

export default AirbnbStyle;
