import { useState, useEffect } from "react";
import TasbihCounter from "@/components/TasbihCounter";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className={`fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 bg-[url('/mobile-bg.jpeg')] md:bg-[url('/kabah.jpg')] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Content */}
      <main className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center py-8">
        <TasbihCounter />
      </main>
    </div>
  );
};

export default Index;
