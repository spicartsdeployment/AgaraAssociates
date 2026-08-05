import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getArticleBySlug } from "@/constants";
import "@/assets/styles/pages/MarketingJournalDetailPage.scss";

export default function MarketingJournalDetailPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <section className="marketing-journal-detail-page">
        <div className="marketing-journal-detail-page__not-found agara-glass">
          <h1 className="marketing-journal-detail-page__not-found-title">
            Article not found
          </h1>
          <Link
            to="/journal"
            className="marketing-journal-detail-page__not-found-link"
          >
            <ArrowLeft
              className="marketing-journal-detail-page__not-found-icon"
              strokeWidth={1.5}
            />
            Back to Journal
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="marketing-journal-detail-page">
      <div className="marketing-journal-detail-page__container">
        <Link
          to="/journal"
          className="marketing-journal-detail-page__back-link"
        >
          <ArrowLeft
            className="marketing-journal-detail-page__back-icon"
            strokeWidth={1.5}
          />
          Journal
        </Link>

        <div className="marketing-journal-detail-page__hero-wrap">
          <img
            src={article.image}
            alt={article.title}
            className="marketing-journal-detail-page__hero-image"
          />
        </div>

        <div className="marketing-journal-detail-page__content agara-glass">
          <p className="marketing-journal-detail-page__meta">
            {article.category}
            <span className="marketing-journal-detail-page__meta-sep">•</span>
            {article.readTime}
          </p>
          <h1 className="marketing-journal-detail-page__title">
            {article.title}
          </h1>
          <p className="marketing-journal-detail-page__excerpt">
            {article.excerpt}
          </p>
          <p className="marketing-journal-detail-page__body">
            Full article content will expand here — research notes, material
            studies, and project reflections — while preserving AGARA&apos;s
            existing typography and glass aesthetic.
          </p>
          <Link
            to="/contact"
            className="marketing-journal-detail-page__cta"
          >
            Discuss this idea
            <ArrowRight
              className="marketing-journal-detail-page__cta-icon"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
