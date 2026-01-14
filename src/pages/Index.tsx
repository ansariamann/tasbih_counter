import { useState, useEffect } from "react";
import TasbihCounter from "@/components/TasbihCounter";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: isLoaded ? `url(/kabah.jpg)` : 'none',
          opacity: isLoaded ? 1 : 0
        }}
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8">
        <TasbihCounter />
        <footer className="absolute bottom-4 text-center text-xs text-white">
          <small>
            Made by{" "}
            <a
              href="https://www.linkedin.com/in/-aman-ansari"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Aman Ansari
            </a>
          </small>
        </footer>
      </main>
    </div>
  );
};

export default Index;
