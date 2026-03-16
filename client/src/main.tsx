import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.addEventListener("unhandledrejection", (e) => {
  console.warn("[unhandled rejection]", e.reason);
});

createRoot(document.getElementById("root")!).render(<App />);
