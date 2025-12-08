import React from "react";
import {
  createHashRouter,
  RouterProvider,
} from "react-router";

import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/Dashboard";
import { ChoresPage } from "./pages/Chores";
import { CategoriesPage } from "./pages/Categories";
import { HouseholdPage } from "./pages/Households";
import { RequireAuth } from "./authentication/RequireAuth";
import { AppLayout } from "./layout/AppLayout";
import { RootRedirect } from "./authentication/RootRedirect";
import { ToastProvider } from "./components/ToastProvider";

const router = createHashRouter(
  [
    { path: "/", element: <RootRedirect /> },
    { path: "/login", element: <LoginPage /> },
    {
      element: <RequireAuth />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "/dashboard", element: <DashboardPage /> },
            { path: "/chores", element: <ChoresPage /> },
            { path: "/categories", element: <CategoriesPage /> },
            { path: "/household", element: <HouseholdPage /> },
          ],
        },
      ],
    },
  ],
  {
    basename: "/",
  }
);

export const AppRouter: React.FC = () => {
  return <ToastProvider><RouterProvider router={router} /></ToastProvider>;
};
