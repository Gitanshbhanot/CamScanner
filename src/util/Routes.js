import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const PageNotFound = lazy(() => import("../Common/PageNotFound"));
const Home = lazy(() => import("../modules/Home"));

const routes = [
  {
    path: "/",
    element: <Navigate to={"/home"} />,
  },
  {
    path: "/home",
    element: (
      <Suspense fallback={<h1>.</h1>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/*",
    element: (
      <Suspense fallback={<h1>.</h1>}>
        <PageNotFound />
      </Suspense>
    ),
  },
];

export default routes;
