const fs = require("fs");
const path = require("path");
const root = "d:/Aagraassociates/client";
const files = [
  "src/components/marketing/hero/HeroSection/HeroSection.scss",
  "src/components/marketing/philosophy/PhilosophySection/PhilosophySection.scss",
  "src/components/marketing/about/AboutSection/AboutSection.scss",
  "src/components/marketing/services/ServicesSection/ServicesSection.scss",
  "src/components/marketing/projects/ProjectsSection/ProjectsSection.scss",
  "src/components/marketing/journal/JournalSection/JournalSection.scss",
  "src/components/marketing/contact/ContactSection/ContactSection.scss",
];
const from = '@use "../base/';
const to = '@use "../../../../assets/styles/base/';
for (const f of files) {
  const fp = path.join(root, f);
  let c = fs.readFileSync(fp, "utf8");
  if (c.includes(from)) {
    c = c.split(from).join(to);
    fs.writeFileSync(fp, c);
    console.log("fixed", f);
  } else {
    console.log("ok", f);
  }
}
