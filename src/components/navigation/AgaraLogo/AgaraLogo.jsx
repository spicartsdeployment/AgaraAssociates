import { Link } from "react-router-dom";
import "./AgaraLogo.scss";

export function AgaraLogo() {
  return (
    <Link to="/" className="agara-logo">
      <img
        src="/logo.png"
        alt="Agara Architects logo"
        className="agara-logo__image"
      />
      <span className="agara-logo__text">Agara Architects</span>
    </Link>
  );
}

export default AgaraLogo;
