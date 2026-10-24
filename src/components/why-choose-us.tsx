import Image from "next/image";

/* Why Choose Us config — add/edit items freely */
const features = [
  {
    icon: "/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
] as const;

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-cyan-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <h2 className="font-josefin text-center text-4xl text-slate-800 sm:text-5xl">
          Why Choose Wanderlast
        </h2>
        <p className="mt-3 text-center text-sm text-slate-500">
          Your trusted partner for exceptional travel experiences
        </p>

        {/* Feature cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 shadow-sm"
            >
              <Image
                src={feature.icon}
                alt=""
                width={36}
                height={36}
                className="size-9"
              />
              <h3 className="font-josefin mt-5 text-xl font-medium text-slate-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
