
import GallerySection from "@/app/components/GallerySection";

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen bg-[#FDFBF7] flex flex-col">
      
      {/* pt-32 prevents the floating navbar from covering the title */}
      <div className="flex-grow pt-32 pb-24">
        <GallerySection />
      </div>
    </main>
  );
}