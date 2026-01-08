import TasbihCounter from "@/components/TasbihCounter";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/kabah.jpg)` }}
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
              href="https://ansariaman.netlify.app/"
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
