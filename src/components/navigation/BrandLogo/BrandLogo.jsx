import { Link } from "react-router-dom";
import "./BrandLogo.scss";

export function BrandLogo({ className = "", compact = false }) {
    const rootClassName = [
        "brand-logo",
        compact ? "brand-logo--compact" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Link to="/" className={rootClassName} aria-label="Agara Architects home">
            <img
                src="/logo.png"
                alt="Agara Architects logo"
                className="brand-logo__image"
            />
            <span className="brand-logo__text" aria-hidden="true">
                <span className="brand-logo__name">AGARA</span>
                <span className="brand-logo__tagline">ARCHITECTS</span>
            </span>
        </Link>
    );
}

export default BrandLogo;
