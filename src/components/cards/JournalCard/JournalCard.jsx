import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./JournalCard.scss";

export function JournalCard({ article }) {
  return (
    <article className="journal-section__card">
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
  );
}

export default JournalCard;
