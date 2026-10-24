import { Banner } from "@/components/banner";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <Banner />
      <WhyChooseUs />
      <Testimonials />
    </main>
  );
}
