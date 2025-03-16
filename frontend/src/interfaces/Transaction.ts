import { Service } from "./Services";

export interface Transaction {
  id: string;
  id_resident_history: string;
  id_services: string;
  payment_date: string;
  total_payment: number;
  status: string;
  billing_period: string;
  created_at: string;
  updated_at: string;
  services: Service;
}
