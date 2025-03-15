import React, { useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import Layout from "../../layout/layout";

const ServiceForm = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      name,
      description,
      period,
      price,
      type,
    });
  };

  return (
    <Layout>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems="center"
        mb={5}>
        <div>
          <Typography variant="h5">Form Tambah Layanan</Typography>
          <Typography variant="body2">Isi detail dibawah ini</Typography>
        </div>
        <div>
          <Button variant="contained">Kembali</Button>
        </div>
      </Stack>
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={"column"} gap={5}>
            <FormControl fullWidth>
              <TextField
                id="nama-layanan"
                label="Nama Layanan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="deskripsi-layanan"
                label="Deskripsi Layanan"
                multiline
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="period-label">Periode</InputLabel>
              <Select
                labelId="period-label"
                id="period-label"
                value={period}
                label="Periode"
                onChange={(e) => setPeriod(e.target.value)}>
                <MenuItem value="once">Sekali</MenuItem>
                <MenuItem value="weekly">Mingguan</MenuItem>
                <MenuItem value="monthly">Bulanan</MenuItem>
                <MenuItem value="annual">Tahunan</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="harga"
                label="Harga Layanan"
                value={price}
                type="number"
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="expense-label">Jenis</InputLabel>
              <Select
                labelId="expense-label"
                id="expense-label"
                value={type}
                label="Jenis"
                onChange={(e) => setType(e.target.value)}>
                <MenuItem value="expense">Pengeluaran</MenuItem>
                <MenuItem value="income">Pendapatan</MenuItem>
              </Select>
            </FormControl>

            <div>
              <Button variant="contained" type="submit">
                Simpan
              </Button>
            </div>
          </Stack>
        </form>
      </Card>
    </Layout>
  );
};

export default ServiceForm;
