import { createBrowserRouter, RouterProvider } from "react-router";

import DashboardPage from "./pages/dashboard";
import ResidentList from "./pages/resident";
import ResidentForm from "./pages/resident/form";
import ResidenHistorytList from "./pages/resident-history";
import HouseList from "./pages/house";
import HouseForm from "./pages/house/form";
import PaymentList from "./pages/payment";
import ServicesList from "./pages/services";
import ServiceForm from "./pages/services/form";
import InvoiceList from "./pages/invoice";
import LoginPage from "./pages/auth/login";
import ProtectedRoute from "./utils/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/resident",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ResidentList />,
      },
    ],
  },
  {
    path: "/resident/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ResidentForm />,
      },
    ],
  },
  {
    path: "/resident-history",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ResidenHistorytList />,
      },
    ],
  },
  {
    path: "/house",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <HouseList />,
      },
    ],
  },
  {
    path: "/house/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <HouseForm />,
      },
    ],
  },
  {
    path: "/house/form/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <HouseForm />,
      },
    ],
  },
  {
    path: "/payment",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <PaymentList />,
      },
    ],
  },
  {
    path: "/service",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ServicesList />,
      },
    ],
  },
  {
    path: "/service/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ServiceForm />,
      },
    ],
  },
  {
    path: "/invoice",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <InvoiceList />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
