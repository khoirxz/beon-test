import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";

const ServiceForm = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`services/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setName(response.data.name);
        setDescription(response.data.description);
        setPeriod(response.data.period);
        setPrice(response.data.price);
        setType(response.data.type);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [authState.token, id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      let response;

      if (id) {
        response = await api.put(
          `services/${id}`,
          {
            name,
            description,
            period,
            price,
            type,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await api.post(
          "services",
          {
            name,
            description,
            period,
            price,
            type,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      }
      if (response.status === 201 || response.status === 200) {
        setMessage("Layanan berhasil ditambahkan");
        setOpen(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Terjadi kesalahan");
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout loading={loading}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "flex-start", sm: "space-between" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={{ xs: 2, sm: 0 }}
        mb={5}>
        <div>
          <Typography variant="h5">Form Tambah Layanan</Typography>
          <Typography variant="body2">Isi detail dibawah ini</Typography>
        </div>
        <div>
          <Link
            to="/service"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Kembali</Button>
          </Link>
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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </Layout>
  );
};

export default ServiceForm;
