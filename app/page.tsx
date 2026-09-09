import { Hero } from "@/components/hero/Hero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Contact } from "@/components/sections/Contact";
import { Lanes } from "@/components/sections/Lanes";
import { Products } from "@/components/sections/Products";
import { Team } from "@/components/sections/Team";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <div id="work" className="relative z-10 mx-auto w-full max-w-6xl">
        <Lanes />
        <Products />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Team />
        <Contact />
        <SiteFooter />
      </div>
    </main>
  );
}
