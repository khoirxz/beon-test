import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

import Layout from "../../layout/layout";

const rows: GridRowsProp = [
  {
    id: 1,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "World",
  },
  {
    id: 2,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "World",
  },
  {
    id: 3,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "World",
  },
];

const columns: GridColDef[] = [
  { field: "col1", headerName: "Nama", width: 200 },
  { field: "col2", headerName: "Kependudukan", width: 150 },
  { field: "col3", headerName: "Nomor", width: 150 },
  { field: "col4", headerName: "Status", width: 150 },
  { field: "col5", headerName: "Dibuat", width: 150 },
  { field: "col6", headerName: "Aksi", width: 150 },
];

const InvoiceList = () => {
  return (
    <Layout>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems="center"
        mb={5}>
        <div>
          <Typography variant="h5">Daftar Invoice</Typography>
          <Typography variant="body2">Daftar semua invoice</Typography>
        </div>
        <div>
          <Button variant="contained">Tambah</Button>
        </div>
      </Stack>

      <DataGrid rows={rows} columns={columns} />
    </Layout>
  );
};

export default InvoiceList;
