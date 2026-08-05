import "@fontsource-variable/elms-sans";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./assets/styles/base/_globals.scss";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(<StrictMode>
  <App />
  <Toaster position="top-right" richColors />
</StrictMode>);