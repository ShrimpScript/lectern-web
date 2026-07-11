import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Pillars } from "@/components/site/Pillars";
import { Platform } from "@/components/site/Platform";
import { Backends } from "@/components/site/Backends";
import { Downloads } from "@/components/site/Downloads";
import { OpenSource } from "@/components/site/OpenSource";
import { CTA } from "@/components/site/CTA";
import { getLatestRelease } from "@/lib/release";

export default async function HomePage() {
  const release = await getLatestRelease();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pillars />
        <Platform />
        <Backends />
        <OpenSource />
        <Downloads version={release.version} date={release.date} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
