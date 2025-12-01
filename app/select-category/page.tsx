"use client";

import { useRouter } from "next/navigation";
import { Film, Music, Tv, Smartphone, Candy, Gamepad2, Shuffle } from "lucide-react";

const categories = [
  {
    name: "90s Cartoons",
    icon: Tv,
    gradient: "from-neon-pink via-neon-purple to-neon-cyan",
    borderColor: "border-neon-pink",
    shadowColor: "shadow-neon-pink",
    emoji: "📺"
  },
  {
    name: "Bollywood",
    icon: Film,
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    borderColor: "border-yellow-400",
    shadowColor: "shadow-yellow-400",
    emoji: "🎬"
  },
  {
    name: "Hollywood",
    icon: Film,
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    borderColor: "border-blue-400",
    shadowColor: "shadow-blue-400",
    emoji: "🎥"
  },
  {
    name: "Old Gadgets",
    icon: Smartphone,
    gradient: "from-gray-400 via-gray-600 to-gray-800",
    borderColor: "border-gray-400",
    shadowColor: "shadow-gray-400",
    emoji: "📱"
  },
  {
    name: "Childhood Snacks",
    icon: Candy,
    gradient: "from-green-400 via-yellow-400 to-orange-400",
    borderColor: "border-green-400",
    shadowColor: "shadow-green-400",
    emoji: "🍿"
  },
  {
    name: "Toys & Games",
    icon: Gamepad2,
    gradient: "from-purple-400 via-pink-400 to-red-400",
    borderColor: "border-purple-400",
    shadowColor: "shadow-purple-400",
    emoji: "🎮"
  },
  {
    name: "Mixed",
    icon: Shuffle,
    gradient: "from-neon-cyan via-neon-pink to-neon-green",
    borderColor: "border-neon-cyan",
    shadowColor: "shadow-neon-cyan",
    emoji: "🎲"
  }
];

export default function SelectCategory() {
  const router = useRouter();

  const handleSelect = (category: string) => {
    router.push(`/play?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen retro-grid p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold neon-text mb-4 glow-effect">
            Select Your Quiz Category
          </h1>
          <p className="text-xl text-neon-cyan">
            Choose your nostalgia adventure!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className={`group relative p-8 rounded-xl border-2 ${cat.borderColor} bg-gradient-to-br ${cat.gradient} 
                           transition-all duration-300 transform hover:scale-105 hover:${cat.shadowColor} 
                           hover:shadow-2xl overflow-hidden`}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="text-6xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {cat.emoji}
                  </div>
                  <Icon className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-2xl font-bold text-white drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
