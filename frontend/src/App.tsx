import { Routes, Route } from "react-router-dom";

import { Header } from "./components/layout/Header";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { RecentlyViewedPage } from "./pages/RecentlyViewedPage";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<CatalogPage />} />

        <Route path="/products/:id" element={<ProductPage />} />

        <Route path="/recently-viewed" element={<RecentlyViewedPage />} />

        <Route
          path="*"
          element={
            <main className="container">
              <h1>Página não encontrada</h1>
            </main>
          }
        />
      </Routes>
    </>
  );
}
