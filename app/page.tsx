import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { Platform } from "@/components/site/Platform";
import { Backends } from "@/components/site/Backends";
import { Downloads } from "@/components/site/Downloads";
import { OpenSource } from "@/components/site/OpenSource";
import { CTA } from "@/components/site/CTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pillars />
        <Platform />
        <Backends />
        <OpenSource />
        <Downloads />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
