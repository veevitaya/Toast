import React from 'react';
import { GripVertical, X, Clock, Plus, Sparkles } from 'lucide-react';

export function PlanEdit() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] overflow-hidden font-['Figtree',sans-serif] mx-auto relative flex flex-col">
      {/* Safe Area */}
      <div className="h-[44px] w-full shrink-0" />

      {/* Header */}
      <div className="px-6 flex items-center justify-between shrink-0 mb-6 mt-2">
        <h1 className="text-[18px] font-bold text-neutral-900">Edit Plan</h1>
        <button className="text-[15px] font-semibold text-[#FFCC02]">Done</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Editable plan cards */}
        <div className="px-6 flex flex-col gap-3">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3">
            <GripVertical className="w-5 h-5 text-neutral-300 shrink-0" />
            <div className="w-6 h-6 rounded-full bg-[#FFCC02] text-[12px] font-bold text-neutral-900 flex items-center justify-center shrink-0">1</div>
            
            <img 
              src="https://images.unsplash.com/photo-1559314809-0d155014e29e?w=100&auto=format&fit=crop&q=80" 
              alt="Thipsamai" 
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-neutral-900 truncate">Thipsamai</div>
              <div className="text-[12px] text-neutral-500">Dinner</div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
              <div className="flex items-center gap-1.5 bg-neutral-50 rounded-lg px-2 py-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[13px] font-medium text-neutral-700">7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Being Dragged */}
          <div className="rounded-2xl p-4 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] scale-[1.02] bg-[#FAFAF8] border-2 border-[#FFCC02]/30 flex items-center gap-3 relative z-10">
            <GripVertical className="w-5 h-5 text-neutral-300 shrink-0" />
            <div className="w-6 h-6 rounded-full bg-[#FFCC02] text-[12px] font-bold text-neutral-900 flex items-center justify-center shrink-0">2</div>
            
            <img 
              src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&auto=format&fit=crop&q=80" 
              alt="After You" 
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-neutral-900 truncate">After You</div>
              <div className="text-[12px] text-neutral-500">Dessert</div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
              <div className="flex items-center gap-1.5 bg-neutral-50 rounded-lg px-2 py-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[13px] font-medium text-neutral-700">8:30 PM</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-3">
            <GripVertical className="w-5 h-5 text-neutral-300 shrink-0" />
            <div className="w-6 h-6 rounded-full bg-[#FFCC02] text-[12px] font-bold text-neutral-900 flex items-center justify-center shrink-0">3</div>
            
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=100&auto=format&fit=crop&q=80" 
              alt="Vesper" 
              className="w-10 h-10 rounded-lg object-cover shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] text-neutral-900 truncate">Vesper</div>
              <div className="text-[12px] text-neutral-500">Drinks</div>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
              <div className="flex items-center gap-1.5 bg-neutral-50 rounded-lg px-2 py-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[13px] font-medium text-neutral-700">10:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add stop button */}
        <button className="mx-6 mt-4 w-[calc(100%-48px)] border-2 border-dashed border-neutral-200 rounded-2xl h-14 flex items-center justify-center gap-2 bg-transparent active:bg-neutral-50 transition-colors">
          <Plus className="w-5 h-5 text-neutral-400" />
          <span className="text-[14px] font-medium text-neutral-400">Add another stop</span>
        </button>

        {/* Swap suggestion */}
        <div className="mx-6 mt-4 bg-[#FFCC02]/5 rounded-2xl p-4 border border-[#FFCC02]/20 flex flex-col">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#CC9900]" />
            <span className="text-[13px] font-semibold text-[#CC9900]">Swap suggestion</span>
          </div>
          <p className="text-[12px] text-neutral-500 mt-1">
            Try Tichuca Rooftop instead of Vesper — matches your group's vibe
          </p>
          <button className="ml-auto mt-2 text-[13px] font-bold text-[#FFCC02]">
            Swap
          </button>
        </div>

        {/* Save button */}
        <div className="px-6 mt-6">
          <button className="bg-[#FFCC02] text-neutral-900 font-bold rounded-2xl h-14 w-full flex items-center justify-center shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
