import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("@/features/people/pages/Home"));
const DetalhePessoa = lazy(() => import("@/features/people/pages/DetalhePessoa"));

const withSuspense = (el: JSX.Element, fb = "Carregando…") =>
  <Suspense fallback={<div>{fb}</div>}>{el}</Suspense>;

export const router = createBrowserRouter([
  { path: "/", element: withSuspense(<Home />, "Carregando lista…") }, 
  { path: "/p/:id", element: withSuspense(<DetalhePessoa />, "Carregando detalhes…") },
]);
