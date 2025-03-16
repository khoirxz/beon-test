import { Service } from "./Services";

export interface Expense {
  id: string;
  description: string;
  expense_date: string;
  expense_total: number;
  id_admin: string;
  id_services: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  admin: {
    id: string;
    username: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    email_verified_at: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  services: Service;
}
