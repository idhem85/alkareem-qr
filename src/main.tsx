import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/mushaf.css";

createRoot(document.getElementById("root")!).render(<App />);

/**
 * Register Service Worker with update detection.
 */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      // Check for updates on every page load
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New version available — optionally notify the user
            console.log(
              "[PWA] Nouvelle version disponible. Actualisez pour profiter des mises à jour."
            );
          }
        });
      });

      // Periodically check for updates (every 30 minutes)
      setInterval(() => {
        registration.update().catch(() => {});
      }, 30 * 60 * 1000);
    } catch (err) {
      console.warn("[PWA] Service Worker registration failed:", err);
    }
  });
}
