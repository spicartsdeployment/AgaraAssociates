import os
from pathlib import Path

root = Path("d:/Aagraassociates/client")

scss_mappings = [
    ("HeroSection.scss", "src/components/marketing/hero/HeroSection/HeroSection.scss"),
    ("PhilosophySection.scss", "src/components/marketing/philosophy/PhilosophySection/PhilosophySection.scss"),
    ("AboutSection.scss", "src/components/marketing/about/AboutSection/AboutSection.scss"),
    ("ServicesSection.scss", "src/components/marketing/services/ServicesSection/ServicesSection.scss"),
    ("ProjectsSection.scss", "src/components/marketing/projects/ProjectsSection/ProjectsSection.scss"),
    ("JournalSection.scss", "src/components/marketing/journal/JournalSection/JournalSection.scss"),
    ("ContactSection.scss", "src/components/marketing/contact/ContactSection/ContactSection.scss"),
]

forward_mappings = [
    ("HeroSection.scss", "../../../components/marketing/hero/HeroSection/HeroSection"),
    ("PhilosophySection.scss", "../../../components/marketing/philosophy/PhilosophySection/PhilosophySection"),
    ("AboutSection.scss", "../../../components/marketing/about/AboutSection/AboutSection"),
    ("ServicesSection.scss", "../../../components/marketing/services/ServicesSection/ServicesSection"),
    ("ProjectsSection.scss", "../../../components/marketing/projects/ProjectsSection/ProjectsSection"),
    ("JournalSection.scss", "../../../components/marketing/journal/JournalSection/JournalSection"),
    ("ContactSection.scss", "../../../components/marketing/contact/ContactSection/ContactSection"),
]

def fix_scss(content: str) -> str:
    return content.replace('@use "../base/', '@use "../../../../assets/styles/base/')

for asset, dest in scss_mappings:
    src = root / "src/assets/styles/components" / asset
    content = fix_scss(src.read_text(encoding="utf-8"))
    out = root / dest
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content, encoding="utf-8")

for asset, fwd in forward_mappings:
    stub = f'@forward "{fwd}";\n'
    (root / "src/assets/styles/components" / asset).write_text(stub, encoding="utf-8")

jsx_moves = [
    ("about-section.jsx", "AboutSection", "about/AboutSection", [
        ("@/components/marketing/sections/philosophy-section", "@/components/marketing/philosophy/PhilosophySection"),
        ("@/assets/styles/components/AboutSection.scss", "./AboutSection.scss"),
    ]),
    ("services-section.jsx", "ServicesSection", "services/ServicesSection", [
        ("@/assets/styles/components/ServicesSection.scss", "./ServicesSection.scss"),
    ]),
    ("projects-section.jsx", "ProjectsSection", "projects/ProjectsSection", [
        ("@/assets/styles/components/ProjectsSection.scss", "./ProjectsSection.scss"),
    ]),
    ("journal-section.jsx", "JournalSection", "journal/JournalSection", [
        ("@/assets/styles/components/JournalSection.scss", "./JournalSection.scss"),
    ]),
    ("contact-section.jsx", "ContactSection", "contact/ContactSection", [
        ("@/assets/styles/components/ContactSection.scss", "./ContactSection.scss"),
    ]),
]

for file, name, folder, reps in jsx_moves:
    content = (root / "src/components/marketing/sections" / file).read_text(encoding="utf-8")
    for old, new in reps:
        content = content.replace(old, new)
    dir_path = root / "src/components/marketing" / folder
    dir_path.mkdir(parents=True, exist_ok=True)
    if "export default" not in content:
        content += f"\nexport default {name};\n"
    (dir_path / f"{name}.jsx").write_text(content, encoding="utf-8")
    (dir_path / "index.js").write_text(
        f'export {{ {name}, {name} as default }} from "./{name}";\n',
        encoding="utf-8",
    )

shims = [
    ("hero-section.jsx", "HeroSection", "@/components/marketing/hero/HeroSection"),
    ("philosophy-section.jsx", "PhilosophySection", "@/components/marketing/philosophy/PhilosophySection"),
    ("about-section.jsx", "AboutSection", "@/components/marketing/about/AboutSection"),
    ("services-section.jsx", "ServicesSection", "@/components/marketing/services/ServicesSection"),
    ("projects-section.jsx", "ProjectsSection", "@/components/marketing/projects/ProjectsSection"),
    ("journal-section.jsx", "JournalSection", "@/components/marketing/journal/JournalSection"),
    ("contact-section.jsx", "ContactSection", "@/components/marketing/contact/ContactSection"),
]

for file, name, mod in shims:
    (root / "src/components/marketing/sections" / file).write_text(
        f'export {{ {name}, {name} as default }} from "{mod}";\n',
        encoding="utf-8",
    )

landing = '''import HeroSection from "@/components/marketing/hero/HeroSection";
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
'''

(root / "src/components/marketing/agara-landing-page.jsx").write_text(landing, encoding="utf-8")
print("stage6 complete")
