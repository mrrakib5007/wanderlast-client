import { Banner } from "@/components/banner";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <Banner />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
    </main>
  );
}
