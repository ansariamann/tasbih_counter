import TasbihCounter from "@/components/TasbihCounter";
import kaabaBackground from "@/assets/kaaba-background.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kaabaBackground})` }}
      />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-background/70 backdrop-blur-sm" />

      {/* Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8">
        <TasbihCounter />
      </main>
    </div>
  );
};

export default Index;
