// app/components/WhatWeDo.tsx
export default function WhatWeDo() {
  return (
    <section className="p-10 text-white">
      <h2 className="text-4xl font-bold mb-4">What We Do?</h2>
      <p className="text-gray-400 max-w-2xl">
        We help students explore development and build real-world solutions.
      </p>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="p-6 border rounded-xl">App Development</div>
        <div className="p-6 border rounded-xl">Web Development</div>
        <div className="p-6 border rounded-xl">AI / ML</div>
        <div className="p-6 border rounded-xl">UI / UX</div>
      </div>
    </section>
  );
}