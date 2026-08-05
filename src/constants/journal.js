export const JOURNAL_ARTICLES = [
  {
    slug: "choosing-materials-indian-climate",
    title: "Choosing the right materials for Indian climate",
    category: "Materials",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80",
    excerpt:
      "How climate-responsive material choices shape comfort, durability, and long-term beauty in Indian homes.",
  },
  {
    slug: "plan-courtyard-that-brings-life",
    title: "How to plan a courtyard that brings life in",
    category: "Design",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=500&q=80",
    excerpt:
      "Courtyards as living cores — light, air, and daily ritual woven into the plan.",
  },
  {
    slug: "natural-light-sun-and-shadow",
    title: "Natural light — Designing with sun and shadow",
    category: "Architecture",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=80",
    excerpt:
      "Proportion, orientation, and aperture — crafting atmospheres that shift through the day.",
  },
  {
    slug: "quiet-luxury-in-residential-interiors",
    title: "Quiet luxury in residential interiors",
    category: "Interiors",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80",
    excerpt:
      "Restraint, material honesty, and curated detail over spectacle.",
  },
  {
    slug: "landscape-as-architecture",
    title: "Landscape as architecture",
    category: "Landscape",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=500&q=80",
    excerpt:
      "Outdoor rooms that extend the narrative of the built form.",
  },
  {
    slug: "building-with-integrity",
    title: "Building with integrity from concept to site",
    category: "Construction",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80",
    excerpt:
      "Why execution discipline is inseparable from design intent.",
  },
];

export function getArticleBySlug(slug) {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug) ?? null;
}
