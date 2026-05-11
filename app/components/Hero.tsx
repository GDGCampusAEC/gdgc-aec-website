// app/components/Hero.tsx
export default function Hero() {
  return (
    <section className="h-screen flex flex-col items-center justify-center text-center text-white">
      <h1 className="text-6xl font-bold">GDGC PRC</h1>
      <p className="mt-4 text-gray-400">
        Google Developer Groups On Campus
      </p>
      <button className="mt-6 px-6 py-2 border rounded-full">
        Join Us →
      </button>
    </section>
  );
}