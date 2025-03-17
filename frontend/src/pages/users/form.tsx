import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { User } from "../../interfaces/User";

const UsersForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<User>(`users/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setName(data.name);
        setEmail(data.email);
        setUsername(data.username);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, authState.token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      let response;
      if (!id) {
        response = await api.post(
          "users",
          {
            name,
            username,
            email,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await api.put(
          `users/${id}`,
          {
            name,
            username,
            email,
            password: password ? password : null,
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
          <Typography variant="h5">
            Form {id ? "Ubah" : "Tambah"} User/Admin
          </Typography>
          <Typography variant="body2">Isi detail dibawah ini</Typography>
        </div>
        <div>
          <Link
            to="/users"
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
                id="nama-user"
                label="Nama User"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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

export default UsersForm;
