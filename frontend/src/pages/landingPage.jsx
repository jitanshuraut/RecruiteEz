import { About } from "../LandingPage/components/About";
import { Hero } from "@/LandingPage/components/Hero";
import { HowItWorks } from "../LandingPage/components/HowItWorks";
import { Navbar } from "@/LandingPage/components/Navbar";
import React from "react";
import { Features } from "@/LandingPage/components/Features";
import { Services } from "@/LandingPage/components/Services";
import { Testimonials } from "@/LandingPage/components/Testimonials";
import { Footer } from "./../LandingPage/components/Footer";
import { ScrollToTop } from "./../LandingPage/components/ScrollToTop";

export function LandingPage() {
  return (
    <>
      <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Testimonials />
      <Footer />
      <ScrollToTop/>
    </>
  );
}
