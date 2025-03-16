import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

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

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { Payment } from "../../interfaces/Payment";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nama", width: 200 },
  { field: "service", headerName: "Layanan", width: 150 },
  { field: "total", headerName: "Total", width: 150 },
  { field: "billing", headerName: "Tagihan", width: 150 },
  { field: "paymentDate", headerName: "Dibayar", width: 150 },
  { field: "createdAt", headerName: "Buat", width: 150 },
];

const PaymentList = () => {
  const [data, setData] = useState<
    {
      id: string;
      name: string;
      service: string;
      total: number;
      billing: string;
      paymentDate: string;
      createdAt: string;
    }[]
  >([]);
  const [signal, setSignal] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Payment[]>("payments", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setData(
          response.data.map((item) => ({
            id: item.id,
            name: item.resident_history.resident.name,
            service: item.services.name,
            total: item.total_payment,
            billing: item.billing_period,
            paymentDate: item.payment_date,
            createdAt: item.created_at,
          }))
        );
      } catch {
        console.log("error");
      }
    };

    fetchData();
  }, [authState.token, signal]);

  return (
    <Layout>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems="center"
        mb={5}>
        <div>
          <Typography variant="h5">Daftar Pembayaran</Typography>
          <Typography variant="body2">Daftar semua pembayaran</Typography>
        </div>
        <div>
          <Link
            to="/payment/form"
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
                <Link to={`/payment/form/${params.row.id}`}>
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
      const response = await api.delete(`payments/${id}`, {
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

export default PaymentList;
