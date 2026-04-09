import React from 'react';
import { Share2, Clock, MapPin, Navigation, CalendarHeart, Sparkles, ChevronRight, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function PlanSummary() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#FAFAF8] flex flex-col font-sans relative overflow-hidden" style={{ fontFamily: 'Figtree, sans-serif' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white rounded-b-[2rem] shadow-sm z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </Button>
          <div className="flex -space-x-2">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src="https://i.pravatar.cc/150?u=1" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src="https://i.pravatar.cc/150?u=2" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src="https://i.pravatar.cc/150?u=3" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
              +2
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 flex items-center gap-2">
          Your Night Plan <span className="text-2xl">🌙</span>
        </h1>
        <p className="text-gray-500 text-sm flex items-center gap-1.5">
          <CalendarHeart className="w-4 h-4" />
          Friday, 24 Nov • 5 People
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 px-6 py-8 relative">
        {/* Connection Line */}
        <div className="absolute left-10 top-12 bottom-12 w-0.5 bg-gray-200 z-0"></div>

        <div className="space-y-8 relative z-10">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center mt-1">
              <div className="w-8 h-8 rounded-full bg-[#FFCC02] flex items-center justify-center text-white font-bold shadow-sm z-10">
                1
              </div>
              <div className="text-xs font-semibold text-gray-500 mt-2">7:00</div>
              <div className="text-[10px] text-gray-400">PM</div>
            </div>
            <Card className="flex-1 border-none shadow-sm overflow-hidden rounded-2xl bg-white">
              <div className="h-32 w-full relative">
                <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Gaggan Anand" />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900 font-semibold backdrop-blur-sm shadow-sm">
                    Dinner
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900">Gaggan Anand</h3>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Sukhumvit • Progressive Indian
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">Fine Dining</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">Experience</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">$$$$</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center mt-1">
              <div className="w-8 h-8 rounded-full bg-[#FFCC02] flex items-center justify-center text-white font-bold shadow-sm z-10">
                2
              </div>
              <div className="text-xs font-semibold text-gray-500 mt-2">9:00</div>
              <div className="text-[10px] text-gray-400">PM</div>
            </div>
            <Card className="flex-1 border-none shadow-sm overflow-hidden rounded-2xl bg-white">
              <div className="h-32 w-full relative">
                <img src="https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="After You" />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900 font-semibold backdrop-blur-sm shadow-sm">
                    Dessert
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900">After You</h3>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Siam • Cafe & Desserts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">Kakigori</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">Sweet</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">$$</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center mt-1">
              <div className="w-8 h-8 rounded-full bg-[#FFCC02] flex items-center justify-center text-white font-bold shadow-sm z-10">
                3
              </div>
              <div className="text-xs font-semibold text-gray-500 mt-2">10:30</div>
              <div className="text-[10px] text-gray-400">PM</div>
            </div>
            <Card className="flex-1 border-none shadow-sm overflow-hidden rounded-2xl bg-white">
              <div className="h-32 w-full relative">
                <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Vesper" />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900 font-semibold backdrop-blur-sm shadow-sm">
                    Drinks
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1 text-gray-900">Vesper</h3>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Silom • Cocktail Bar
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">Craft Cocktails</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">Vibey</Badge>
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-100">$$$</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-white border-t border-gray-100 mt-auto rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-20">
        <Button className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-base h-14 rounded-xl mb-3 shadow-md shadow-green-100">
          <Share2 className="w-5 h-5 mr-2" />
          Share Plan to LINE
        </Button>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="outline" className="h-12 rounded-xl font-semibold border-gray-200 text-gray-700">
            <Navigation className="w-4 h-4 mr-2" />
            Navigate
          </Button>
          <Button variant="outline" className="h-12 rounded-xl font-semibold border-gray-200 text-gray-700">
            <Bookmark className="w-4 h-4 mr-2" />
            Save for Later
          </Button>
        </div>
        
        <Separator className="mb-6 bg-gray-100" />
        
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FFCC02]" />
            Unlock your full Toast experience
          </p>
          <p className="text-xs text-gray-500 mb-3">Download the app for easy group planning.</p>
          <Button variant="link" className="text-[#FFCC02] font-bold h-auto p-0">
            Get the App
          </Button>
        </div>
      </div>
    </div>
  );
}
