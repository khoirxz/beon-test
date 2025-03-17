export interface House {
  id: string;
  name: string;
  description: string;
  status: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  residents: Resident[];
}

export interface Resident extends House {
  pivot: Pivot;
}

export interface Pivot {
  id_house: string;
  id_resident: string;
  created_at: string;
  updated_at: string;
}
