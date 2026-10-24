import { Banner } from "@/components/banner";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <Banner />
      <WhyChooseUs />
    </main>
  );
}
