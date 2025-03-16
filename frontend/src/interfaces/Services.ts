export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  type: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
