import { ArrowRight } from "lucide-react";

/* CTA config — edit everything here */
const cta = {
  title: "Ready To Start Your Journey?",
  subtitle: "Join thousands of travelers who have discovered the world with us",
  button: { label: "Book Your Trip Today", href: "/bookings" },
  image: "/CTA.png", // in /public
};

export function CTA() {
  return (
    <section
      className="relative flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${cta.image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="font-josefin whitespace-normal text-4xl text-white sm:whitespace-nowrap lg:text-5xl">
        {cta.title}
      </h2>
      <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
        {cta.subtitle}
      </p>

      <a
        href={cta.button.href}
        className="mt-10 inline-flex h-11 items-center justify-center gap-2 rounded-none bg-white px-6 text-xs font-semibold uppercase tracking-wider text-slate-900 transition-colors hover:bg-slate-100"
      >
        {cta.button.label}
        <ArrowRight className="size-4" />
      </a>
    </section>
  );
}
