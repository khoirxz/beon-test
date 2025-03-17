import { House } from "./House";

export interface Resident {
  id: string;
  name: string;
  photo_id: string;
  resident_status: string;
  phone: string;
  married_status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  houses: HouseHistory[];
}

export interface ResidentHistory {
  id: string;
  id_resident: string;
  id_house: string;
  date_filled: string;
  date_out: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  resident: Resident;
  house: House;
}

export interface HouseHistory extends House {
  pivot: Pivot;
}

export interface Pivot {
  id_resident: string;
  id_house: string;
  created_at: string;
  updated_at: string;
}
