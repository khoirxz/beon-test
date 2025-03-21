import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import Box from "@mui/material/Box";
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
import Home from "@mui/icons-material/Home";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { House } from "../../interfaces/House";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nama", width: 200 },
  {
    field: "status",
    headerName: "Ketersediaan",
    width: 150,
    renderCell: (params) => (
      <>{params.row.status === "available" ? "Tersedia" : "Tidak Tersedia"}</>
    ),
  },
  {
    field: "created_at",
    headerName: "Dibuat",
    width: 150,
    renderCell: (params) => <>{params.row.created_at.split("T")[0]}</>,
  },
];

const HouseList = () => {
  const [data, setData] = useState<House[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [signal, setSignal] = useState<boolean>(false);
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await api.get<House[]>("houses", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setData(response.data);
      } catch {
        console.log("error");
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
          <Typography variant="h5">Daftar Rumah</Typography>
          <Typography variant="body2">Daftar semua rumah</Typography>
        </div>
        <div>
          <Link
            to="/house/form"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Tambah</Button>
          </Link>
        </div>
      </Stack>

      <DataGrid
        sx={{
          maxHeight: 450,
        }}
        rows={data}
        columns={[
          ...columns,
          {
            field: "detail",
            headerName: "Detail",
            renderCell: (params) => (
              <ButtonGroup>
                <ButtonDetail data={params.row.residents} />
              </ButtonGroup>
            ),
          },
          {
            field: "action",
            headerName: "Aksi",
            width: 150,
            renderCell: (params) => (
              <ButtonGroup variant="text">
                <Link to={`/house/form/${params.row.id}`}>
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
      const response = await api.delete(`houses/${id}`, {
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

const ButtonDetail: React.FC<{ data: House["residents"] }> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <Home />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ p: 3, width: { xs: "100%", md: 600 } }}>
          <Typography>Tempat tinggal</Typography>
          <Box mt={2}>
            <Home />
            {data.length === 0 ? (
              <Typography>Tidak ada data</Typography>
            ) : (
              <Stack>
                {data.map((item) => (
                  <Box key={item.id}>
                    <Typography>{item.name}</Typography>
                    <Typography>{item.description}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
          <Stack direction={"row"} justifyContent={"flex-end"} mt={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HouseList;
