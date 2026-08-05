const fs = require("fs");
const path = require("path");

const root = "d:/Aagraassociates/client";

const scssMappings = [
  ["HeroSection.scss", "src/components/marketing/hero/HeroSection/HeroSection.scss"],
  ["PhilosophySection.scss", "src/components/marketing/philosophy/PhilosophySection/PhilosophySection.scss"],
  ["AboutSection.scss", "src/components/marketing/about/AboutSection/AboutSection.scss"],
  ["ServicesSection.scss", "src/components/marketing/services/ServicesSection/ServicesSection.scss"],
  ["ProjectsSection.scss", "src/components/marketing/projects/ProjectsSection/ProjectsSection.scss"],
  ["JournalSection.scss", "src/components/marketing/journal/JournalSection/JournalSection.scss"],
  ["ContactSection.scss", "src/components/marketing/contact/ContactSection/ContactSection.scss"],
];

const forwardMappings = [
  ["HeroSection.scss", "../../../components/marketing/hero/HeroSection/HeroSection"],
  ["PhilosophySection.scss", "../../../components/marketing/philosophy/PhilosophySection/PhilosophySection"],
  ["AboutSection.scss", "../../../components/marketing/about/AboutSection/AboutSection"],
  ["ServicesSection.scss", "../../../components/marketing/services/ServicesSection/ServicesSection"],
  ["ProjectsSection.scss", "../../../components/marketing/projects/ProjectsSection/ProjectsSection"],
  ["JournalSection.scss", "../../../components/marketing/journal/JournalSection/JournalSection"],
  ["ContactSection.scss", "../../../components/marketing/contact/ContactSection/ContactSection"],
];

function fixScss(content) {
  return content.split('@use "../base/').join('@use "../../../../assets/styles/base/');
}

function fixJsx(content) {
  return content
    .split("@/components/marketing/data")
    .join("@/constants")
    .split("../../../../public/ContactSectionImage.png")
    .join("@/assets/images/maps/ContactSectionImage.png");
}

for (const [asset, dest] of scssMappings) {
  const content = fixScss(fs.readFileSync(path.join(root, "src/assets/styles/components", asset), "utf8"));
  const out = path.join(root, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}

for (const [asset, fwd] of forwardMappings) {
  fs.writeFileSync(path.join(root, "src/assets/styles/components", asset), '@forward "' + fwd + '";\n');
}

const jsxMoves = [
  ["about-section.jsx", "AboutSection", "about/AboutSection", [
    ["@/components/marketing/sections/philosophy-section", "@/components/marketing/philosophy/PhilosophySection"],
    ["@/assets/styles/components/AboutSection.scss", "./AboutSection.scss"],
  ]],
  ["services-section.jsx", "ServicesSection", "services/ServicesSection", [
    ["@/assets/styles/components/ServicesSection.scss", "./ServicesSection.scss"],
  ]],
  ["projects-section.jsx", "ProjectsSection", "projects/ProjectsSection", [
    ["@/assets/styles/components/ProjectsSection.scss", "./ProjectsSection.scss"],
  ]],
  ["journal-section.jsx", "JournalSection", "journal/JournalSection", [
    ["@/assets/styles/components/JournalSection.scss", "./JournalSection.scss"],
  ]],
  ["contact-section.jsx", "ContactSection", "contact/ContactSection", [
    ["@/assets/styles/components/ContactSection.scss", "./ContactSection.scss"],
  ]],
];

for (const [file, name, folder, reps] of jsxMoves) {
  let content = fs.readFileSync(path.join(root, "src/components/marketing/sections", file), "utf8");
  for (const [from, to] of reps) content = content.split(from).join(to);
  content = fixJsx(content);
  const dir = path.join(root, "src/components/marketing", folder);
  fs.mkdirSync(dir, { recursive: true });
  if (!content.includes("export default")) content += "\nexport default " + name + ";\n";
  fs.writeFileSync(path.join(dir, name + ".jsx"), content);
  fs.writeFileSync(path.join(dir, "index.js"), 'export { ' + name + ", " + name + ' as default } from "./' + name + '";\n');
}

const shims = [
  ["hero-section.jsx", "HeroSection", "@/components/marketing/hero/HeroSection"],
  ["philosophy-section.jsx", "PhilosophySection", "@/components/marketing/philosophy/PhilosophySection"],
  ["about-section.jsx", "AboutSection", "@/components/marketing/about/AboutSection"],
  ["services-section.jsx", "ServicesSection", "@/components/marketing/services/ServicesSection"],
  ["projects-section.jsx", "ProjectsSection", "@/components/marketing/projects/ProjectsSection"],
  ["journal-section.jsx", "JournalSection", "@/components/marketing/journal/JournalSection"],
  ["contact-section.jsx", "ContactSection", "@/components/marketing/contact/ContactSection"],
];

for (const [file, name, mod] of shims) {
  fs.writeFileSync(
    path.join(root, "src/components/marketing/sections", file),
    'export { ' + name + ", " + name + ' as default } from "' + mod + '";\n'
  );
}

const landing = `import HeroSection from "@/components/marketing/hero/HeroSection";
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
`;

fs.writeFileSync(path.join(root, "src/components/marketing/agara-landing-page.jsx"), landing);
console.log("stage6 complete");

