'use client';

import { useState, useEffect } from 'react';

const ANNOUNCEMENTS = [
  {
    id: 1,
    text: "Coming Soon: Launch your memecoin directly from SwiftToken! 🚀",
    icon: "🪙"
  },
  {
    id: 2,
    text: "Coming Soon: Host your memecoin website with one click! 🌐",
    icon: "💻"
  },
  {
    id: 3,
    text: "Coming Soon: Create and manage liquidity pools directly from SwiftToken! 💧",
    icon: "💱"
  }
];

export function ComingSoonBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl shadow-xl max-w-lg">
        <div className="flex items-center gap-4">
          <span className="text-3xl animate-bounce">
            {ANNOUNCEMENTS[currentIndex].icon}
          </span>
          <p className="text-base font-medium leading-snug">
            {ANNOUNCEMENTS[currentIndex].text}
          </p>
        </div>
      </div>
    </div>
  );
}
