import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "@/lib/auth/session";
import "@/assets/styles/components/ProtectedRoute.scss";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    getSession()
      .then((session) => {
        if (!active) return;
        setAuthenticated(Boolean(session));
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setAuthenticated(false);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="protected-route">
        <div className="protected-route__spinner" />
      </div>
    );
  }

  if (!authenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}
