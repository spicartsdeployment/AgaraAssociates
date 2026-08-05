import HeroSection from "@/components/marketing/hero/HeroSection";
import ServicesSection from "@/components/marketing/services/ServicesSection";
import ProjectsSection from "@/components/marketing/projects/ProjectsSection";
import PhilosophySection from "@/components/marketing/philosophy/PhilosophySection";
import JournalSection from "@/components/marketing/journal/JournalSection";
import AboutSection from "@/components/marketing/about/AboutSection";
import ContactSection from "@/components/marketing/contact/ContactSection";
import "@/assets/styles/components/AgaraLandingPage.scss";

export function AgaraLandingPage() {
  return (
    <div className="agara-landing-page">
      <HeroSection />
      <ServicesSection variant="home" />
      <ProjectsSection variant="home" limit={4} />
      <PhilosophySection />
      <JournalSection variant="home" limit={3} />
      <AboutSection variant="home" />
      <ContactSection />
    </div>
  );
}
