import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import api from "../../api";
import { RootState } from "../../store";
import Layout from "../../layout/layout";
import { Resident } from "../../interfaces/Resident";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nama", width: 200 },
  { field: "resident_status", headerName: "Kependudukan", width: 150 },
  { field: "phone", headerName: "Nomor", width: 150 },
  { field: "married_status", headerName: "Status", width: 150 },
];

const ResidentList = () => {
  const [data, setData] = useState<Resident[]>([]);
  const [signal, setSignal] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Resident[]>("residents", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setData(response.data);
      } catch {
        console.log("error");
      }
    };

    fetchData();
  }, [authState.token, signal]);

  console.log(data);
  return (
    <Layout>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems="center"
        mb={5}>
        <div>
          <Typography variant="h5">Daftar Penduduk</Typography>
          <Typography variant="body2">Daftar semua penduduk</Typography>
        </div>
        <div>
          <Link
            to="/resident/form"
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
                <Link to={`/resident/form/${params.row.id}`}>
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
      const response = await api.delete(`residents/${id}`, {
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

export default ResidentList;
