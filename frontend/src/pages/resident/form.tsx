import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams, Link } from "react-router";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";

import { MuiTelInput } from "mui-tel-input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { Resident } from "../../interfaces/Resident";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ResidentForm = () => {
  const [name, setName] = useState<string>("");
  const [photoId, setPhotoId] = useState<File | null>(null);
  const [residentStatus, setResidentStatus] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [marriedStatus, setMarriedStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<Resident>(`residents/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setName(response.data.name);
        // setPhotoId(response.data.photo_id);
        setResidentStatus(response.data.resident_status);
        setPhone(response.data.phone);
        setMarriedStatus(response.data.married_status === 1 ? true : false);
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

    // karena form menggunakan gambar/file
    // kita menggunakan form data
    const formData = new FormData();
    formData.append("name", name);

    // jika photo id ada, tambahkan ke form data
    if (photoId) {
      formData.append("photo_id", photoId);
    }

    formData.append("resident_status", residentStatus);
    formData.append("phone", phone);
    formData.append("married_status", marriedStatus ? "1" : "0");

    if (id) {
      formData.append("_method", "PUT");
    }

    let response;
    if (!id && !photoId) {
      setOpen(true);
      setMessage("Photo ID is required");
      return;
    }

    try {
      setLoading(true);
      if (id) {
        response = await api.post(`residents/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authState.token}`,
          },
        });
      } else {
        response = await api.post("residents", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authState.token}`,
          },
        });
      }

      if (response?.status === 201) {
        setOpen(true);
        setMessage("Penduduk berhasil ditambahkan");
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
            Form {id ? "Edit" : "Tambah"} Penduduk
          </Typography>
          <Typography variant="body2">Isi detail dibawah ini</Typography>
        </div>
        <div>
          <Link
            to="/resident"
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
                id="nama-penduduk"
                label="Nama Penduduk"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}>
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => setPhotoId(event.target.files![0])}
                  multiple
                />
              </Button>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-resident">Status Kependudukan</InputLabel>
              <Select
                labelId="status-resident"
                id="status"
                value={residentStatus}
                label="Status Kependudukan"
                onChange={(e) => setResidentStatus(e.target.value)}>
                <MenuItem value="permanent">Menetap</MenuItem>
                <MenuItem value="contract">Kontrak</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <MuiTelInput value={phone} onChange={(e) => setPhone(e)} />
            </FormControl>

            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    id="status-married"
                    checked={marriedStatus}
                    onChange={(e) => setMarriedStatus(e.target.checked)}
                  />
                }
                label="Menikah"
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

export default ResidentForm;
