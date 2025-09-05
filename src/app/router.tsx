import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";

const Home = lazy(() => import("../features/people/pages/Home"));
const DetalhePessoa = lazy(() => import("../features/people/pages/DetalhePessoa"));

const withSuspense = (el: ReactNode, fb = "Carregando…") =>
  <Suspense fallback={<div>{fb}</div>}>{el}</Suspense>;

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/home" replace /> },
  { path: "/home", element: withSuspense(<Home />, "Carregando lista…") }, 
  { path: "/p/:id", element: withSuspense(<DetalhePessoa />, "Carregando detalhes…") },
]);
