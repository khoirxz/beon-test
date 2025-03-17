import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import Layout from "../../layout/layout";
import { ResidentHistory } from "../../interfaces/Resident";
import { RootState } from "../../store";
import api from "../../api";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nama", width: 200 },
  { field: "house", headerName: "Rumah", width: 150 },
  { field: "date_filled", headerName: "Menduduki", width: 150 },
  { field: "date_out", headerName: "Keluar", width: 150 },
];

type dataProps = {
  id: string;
  name: string;
  house: string;
  date_filled: string;
  date_out: string | null;
};

const ResidenHistorytList = () => {
  const [data, setData] = useState<dataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [signal, setSignal] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<ResidentHistory[]>("residents-history", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        const newData = response.data.map((item) => ({
          id: item.id,
          name: item.resident.name,
          house: item.house.name,
          date_filled: item.date_filled,
          date_out: item.date_out,
        }));

        setData(newData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authState.token, signal]);
  return (
    <Layout loading={loading}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "flex-start", sm: "space-between" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={{ xs: 2, sm: 0 }}
        mb={5}>
        <div>
          <Typography variant="h5">Daftar Riwayat Penduduk</Typography>
          <Typography variant="body2">Daftar semua riwayat penduduk</Typography>
        </div>
        <div>
          <Link
            to="/resident-history/form"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Tambah</Button>
          </Link>
        </div>
      </Stack>

      <DataGrid
        rows={data}
        columns={[
          ...columns,
          {
            field: "action",
            headerName: "Aksi",
            width: 150,
            renderCell: (params) => (
              <ButtonGroup variant="text">
                <Link to={`/resident-history/form/${params.row.id}`}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Link>
                <ButtonDelete id={params.row.id} setSignal={setSignal} />
              </ButtonGroup>
            ),
          },
        ]}
      />
    </Layout>
  );
};

const ButtonDelete: React.FC<{
  id: string;
  setSignal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ id, setSignal }) => {
  const [open, setOpen] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`residents-history/${id}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setOpen(false);
      setSignal(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <DeleteIcon color="error" />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography>Apakah anda yakin ingin menghapus data ini?</Typography>
          <Stack direction={"row"} justifyContent={"flex-end"} mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(id)}>
              Hapus
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidenHistorytList;
