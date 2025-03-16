import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { House } from "../../interfaces/House";
import { Resident } from "../../interfaces/Resident";

const PaymentForm = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get<House>(`houses/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setName(data.name);
        setDescription(data.description);
        setStatus(data.status);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, authState.token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let response;
      if (!id) {
        response = await api.post(
          "houses",
          {
            name,
            description,
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await api.put(
          `houses/${id}`,
          {
            name,
            description,
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      }

      if (response?.status === 201 || response?.status === 200) {
        setOpen(true);
        setMessage(`Data berhasil ${id ? "diubah" : "ditambahkan"}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Terjadi kesalahan");
      }
      setOpen(true);
    }
  };

  return (
    <Layout>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={5}>
        <div>
          <Typography variant="h5">
            Form {id ? "Ubah" : "Tambah"} Pembayaran
          </Typography>
          <Typography variant="body2">Isi detail dibawah ini</Typography>
        </div>
        <div>
          <Link
            to="/house"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Kembali</Button>
          </Link>
        </div>
      </Stack>
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={"column"} gap={5}>
            <ModalUser />
            <FormControl fullWidth>
              <TextField
                id="deskripsi-rumah"
                label="Deskripsi rumah"
                multiline
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-label">Status Rumah</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                label="Status Rumah"
                onChange={handleChange}
                defaultValue={id ? status : "available"}>
                <MenuItem value="available">Tersedia</MenuItem>
                <MenuItem value="occupied">Sudah Dihuni</MenuItem>
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: 2,
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ModalUser = () => {
  const [data, setData] = useState<Resident[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Resident[]>(`residents/search`, {
          params: {
            name: search,
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [authState.token, search]);

  return (
    <Box width={"100%"}>
      <Button
        fullWidth
        onClick={() => setOpen(true)}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          color: "black",
          gap: 2,
          border: 1,
          borderRadius: 1,
          p: 2,
        }}>
        <Avatar />
        <Typography variant="body2">Pilih User</Typography>
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cari penduduk
          </Typography>
          <TextField
            size="small"
            label="Cari penduduk"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            {data.map((item) => (
              <Button
                onClick={() => setOpen(false)}
                fullWidth
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: "black",
                }}
                key={item.id}>
                <Avatar />
                <Typography>{item.name}</Typography>
              </Button>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PaymentForm;
