import React from "react";
import { Bookmark, Sparkles, Calendar, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpgradePrompt() {
  return (
    <div className="w-[390px] h-[844px] bg-[#FAFAF8] relative overflow-hidden flex flex-col font-sans shadow-xl mx-auto rounded-[40px] border-[8px] border-black my-8">
      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFCC02]/20 via-[#FAFAF8] to-[#FAFAF8] pointer-events-none" />
      
      {/* Decorative background blur */}
      <div className="absolute top-[-100px] left-[-50px] w-[300px] h-[300px] bg-[#FFCC02]/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-[200px] right-[-100px] w-[250px] h-[250px] bg-[#FFCC02]/20 rounded-full blur-[60px] pointer-events-none" />

      {/* Top Bar with Dismiss */}
      <div className="relative z-10 flex justify-end p-6 pt-12">
        <button className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-500 hover:bg-black/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-6 mt-2">
        {/* Abstract Phone Mockup Illustration */}
        <div className="relative w-[160px] h-[320px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-8 border-gray-100 flex flex-col items-center overflow-hidden mb-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
          {/* Dynamic Island */}
          <div className="w-[50px] h-[14px] bg-gray-100 rounded-full mt-3 mb-2" />
          
          {/* App UI Abstraction */}
          <div className="w-full px-3 flex flex-col gap-3">
            <div className="w-full h-[60px] bg-[#FFCC02]/20 rounded-xl relative overflow-hidden">
               <div className="absolute top-2 left-2 w-1/2 h-2.5 bg-[#FFCC02] rounded-full opacity-60" />
               <div className="absolute bottom-2 left-2 w-3/4 h-2 bg-[#FFCC02]/40 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2 h-[80px] bg-gray-50 rounded-xl border border-gray-100" />
              <div className="w-1/2 h-[80px] bg-gray-50 rounded-xl border border-gray-100" />
            </div>
            <div className="w-full h-[32px] bg-gray-50 rounded-lg border border-gray-100 flex items-center px-2">
              <div className="w-5 h-5 rounded-full bg-[#FFCC02]/30 flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-[#E6B800]" />
              </div>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full ml-2" />
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -right-3 top-16 w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-50 flex items-center justify-center transform rotate-12">
            <div className="w-7 h-7 rounded-full bg-[#FFCC02]/20 flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5 text-[#E6B800]" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center w-full max-w-[320px]">
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-3">
            Your plans deserve<br/>a permanent home.
          </h1>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-8 px-2">
            Get the full Toast app for the ultimate dining and activity experience in Bangkok.
          </p>

          {/* Benefits List */}
          <div className="flex flex-col gap-3.5 w-full text-left">
            {[
              { icon: Bookmark, text: "Save all your plans" },
              { icon: Sparkles, text: "Smarter suggestions" },
              { icon: Calendar, text: "Instant booking" },
              { icon: Smartphone, text: "Continue anytime" }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-gray-50/80 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-full bg-[#FFCC02]/15 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-4.5 h-4.5 text-[#E6B800]" />
                </div>
                <span className="font-semibold text-gray-800 text-[15px]">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 p-6 pt-4 pb-10 bg-gradient-to-t from-[#FAFAF8] via-[#FAFAF8] to-transparent mt-auto">
        <Button className="w-full h-14 bg-[#FFCC02] hover:bg-[#E6B800] text-gray-900 font-bold text-[17px] rounded-full shadow-[0_8px_20px_-8px_rgba(255,204,2,0.6)] mb-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
          Get the full experience
        </Button>
        <button className="w-full text-center text-[15px] font-medium text-gray-400 hover:text-gray-600 transition-colors py-2">
          Maybe later
        </button>
      </div>
    </div>
  );
}
