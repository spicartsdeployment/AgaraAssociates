import fs from "fs";
import path from "path";

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
  return content.replace(/@use "\.\.\/base\//g, '@use "../../../../assets/styles/base/');
}

for (const [asset, dest] of scssMappings) {
  const content = fixScss(fs.readFileSync(path.join(root, "src/assets/styles/components", asset), "utf8"));
  const out = path.join(root, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}

for (const [asset, forward] of forwardMappings) {
  fs.writeFileSync(path.join(root, "src/assets/styles/components", asset), `@forward "${forward}";\n`);
}

const shimMap = [
  ["hero-section.jsx", "HeroSection", "@/components/marketing/hero/HeroSection"],
  ["philosophy-section.jsx", "PhilosophySection", "@/components/marketing/philosophy/PhilosophySection"],
  ["about-section.jsx", "AboutSection", "@/components/marketing/about/AboutSection"],
  ["services-section.jsx", "ServicesSection", "@/components/marketing/services/ServicesSection"],
  ["projects-section.jsx", "ProjectsSection", "@/components/marketing/projects/ProjectsSection"],
  ["journal-section.jsx", "JournalSection", "@/components/marketing/journal/JournalSection"],
  ["contact-section.jsx", "ContactSection", "@/components/marketing/contact/ContactSection"],
];

for (const [file, name, mod] of shimMap) {
  fs.writeFileSync(
    path.join(root, "src/components/marketing/sections", file),
    `export { ${name}, ${name} as default } from "${mod}";\n`
  );
}

const about = fs.readFileSync(path.join(root, "src/components/marketing/sections/about-section.jsx"), "utf8");
// about was overwritten - need to read from backup... we need to create AboutSection from original content first

