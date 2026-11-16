import { Routes, Route, Navigate } from "react-router-dom";

import { CatalogPage } from "./pages/CatalogPage";
import { ProductPage } from "./pages/ProductPage";
import { RecentlyViewedPage } from "./pages/RecentlyViewedPage";

import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";

import { Header } from "./components/layout/Header";

export default function App() {
  return (
    <Routes>
      {/* Loja */}
      <Route
        path="/"
        element={
          <>
            <Header />
            <CatalogPage />
          </>
        }
      />

      <Route
        path="/products/:id"
        element={
          <>
            <Header />
            <ProductPage />
          </>
        }
      />

      <Route
        path="/recently-viewed"
        element={
          <>
            <Header />
            <RecentlyViewedPage />
          </>
        }
      />

      {/* Login administrativo */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Área administrativa protegida */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/products" replace />} />

          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
