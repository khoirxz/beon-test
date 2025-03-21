import { createBrowserRouter, RouterProvider } from "react-router";

import DashboardPage from "./pages/dashboard";
import ResidentList from "./pages/resident";
import ResidentForm from "./pages/resident/form";
import ResidenHistorytList from "./pages/resident-history";
import ResidentHistoryForm from "./pages/resident-history/form";
import HouseList from "./pages/house";
import HouseForm from "./pages/house/form";
import PaymentList from "./pages/payment";
import PaymentForm from "./pages/payment/form";
import ServicesList from "./pages/services";
import ServiceForm from "./pages/services/form";
import ExpenseList from "./pages/expense";
import ExpenseForm from "./pages/expense/form";
import LoginPage from "./pages/auth/login";
import UsersList from "./pages/users";
import UsersForm from "./pages/users/form";
import ProtectedRoute from "./utils/ProtectedRoute";
import SignupPage from "./pages/auth/signup";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
    path: "/resident/form/:id",
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
    path: "/resident-history/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ResidentHistoryForm />,
      },
    ],
  },
  {
    path: "/resident-history/form/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ResidentHistoryForm />,
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
    path: "/payment/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <PaymentForm />,
      },
    ],
  },
  {
    path: "/payment/form/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <PaymentForm />,
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
    path: "/service/form/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ServiceForm />,
      },
    ],
  },
  {
    path: "/expense",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ExpenseList />,
      },
    ],
  },
  {
    path: "/expense/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ExpenseForm />,
      },
    ],
  },
  {
    path: "/expense/form/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <ExpenseForm />,
      },
    ],
  },
  {
    path: "/users",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <UsersList />,
      },
    ],
  },
  {
    path: "/users/form",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <UsersForm />,
      },
    ],
  },
  {
    path: "/users/form/:id",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <UsersForm />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
