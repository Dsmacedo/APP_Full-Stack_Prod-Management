// src/routes/index.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

// Pages
import Dashboard from "../Pages/Dashboard/Dashboard";
import ProductList from "../Pages/Products/ProductList";
import ProductForm from "../Pages/Products/ProductForm";
import CategoryList from "../Pages/Categories/CategoryList";
import CategoryForm from "../Pages/Categories/CategoryForm";
import OrderList from "../Pages/Orders/OrderList";
import OrderForm from "../Pages/Orders/OrderForm";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      {/* Product Routes */}
      <Route
        path="/products"
        element={
          <MainLayout>
            <ProductList />
          </MainLayout>
        }
      />
      <Route
        path="/products/create"
        element={
          <MainLayout>
            <ProductForm />
          </MainLayout>
        }
      />
      <Route
        path="/products/edit/:id"
        element={
          <MainLayout>
            <ProductForm />
          </MainLayout>
        }
      />

      {/* Category Routes */}
      <Route
        path="/categories"
        element={
          <MainLayout>
            <CategoryList />
          </MainLayout>
        }
      />
      <Route
        path="/categories/create"
        element={
          <MainLayout>
            <CategoryForm />
          </MainLayout>
        }
      />
      <Route
        path="/categories/edit/:id"
        element={
          <MainLayout>
            <CategoryForm />
          </MainLayout>
        }
      />

      {/* Order Routes */}
      <Route
        path="/orders"
        element={
          <MainLayout>
            <OrderList />
          </MainLayout>
        }
      />
      <Route
        path="/orders/create"
        element={
          <MainLayout>
            <OrderForm />
          </MainLayout>
        }
      />
      <Route
        path="/orders/edit/:id"
        element={
          <MainLayout>
            <OrderForm />
          </MainLayout>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
