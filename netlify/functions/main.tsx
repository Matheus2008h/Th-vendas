import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Admin from "./Admin";

// /admin abre o painel; qualquer outro endereço abre o site
const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isAdmin ? <Admin /> : <App />}</StrictMode>
);
