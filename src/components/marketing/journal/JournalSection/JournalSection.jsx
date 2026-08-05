import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/components/marketing/motion";
import { JOURNAL_ARTICLES } from "@/constants";
import "./JournalSection.scss";

export function JournalSection({ variant = "home", limit }) {
  const isPage = variant === "page";
  const items =
    typeof limit === "number"
      ? JOURNAL_ARTICLES.slice(0, limit)
      : JOURNAL_ARTICLES;

  return (
    <section
      id="journal"
      className={`journal-section${isPage ? " journal-section--page" : ""}`}
    >
      <div className="journal-section__container">
        <div className="journal-section__header">
          <div>
            {isPage && (
              <p className="journal-section__eyebrow">Insights</p>
            )}
            <h2
              className={`journal-section__title${
                isPage ? " journal-section__title--page" : ""
              }`}
            >
              {isPage ? "Journal" : "From the Journal"}
            </h2>
          </div>
          {variant === "home" && (
            <Link to="/journal" className="journal-section__link">
              View All Articles
              <ArrowRight
                className="journal-section__link-icon"
                strokeWidth={1.5}
              />
            </Link>
          )}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className={`journal-section__grid${
            !isPage ? " journal-section__grid--home" : ""
          }`}
        >
          {items.map((article) => (
            <article key={article.slug} className="journal-section__card">
              <Link
                to={`/journal/${article.slug}`}
                className="journal-section__card-link"
              >
                <div className="journal-section__card-thumb">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="journal-section__card-image"
                  />
                </div>
                <div className="journal-section__card-body">
                  <h3 className="journal-section__card-title">
                    {article.title}
                  </h3>
                  <p className="journal-section__card-meta">
                    {article.category}
                    <span className="journal-section__card-meta-sep">•</span>
                    {article.readTime}
                  </p>
                </div>
              </Link>
              <Link
                to={`/journal/${article.slug}`}
                aria-label={`Read ${article.title}`}
                className="journal-section__card-action"
              >
                <ArrowRight
                  className="journal-section__card-action-icon"
                  strokeWidth={1.5}
                />
              </Link>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default JournalSection;
