import React, { useState } from "react";

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

import { MuiTelInput } from "mui-tel-input";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Layout from "../../layout/layout";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      name,
      photoId,
      residentStatus,
      phone,
      marriedStatus,
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
          <Typography variant="h5">Form Tambah Penduduk</Typography>
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
                required
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
    </Layout>
  );
};

export default ResidentForm;
