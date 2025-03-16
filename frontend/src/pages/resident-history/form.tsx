import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useParams } from "react-router";
import dayjs from "dayjs";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { House } from "../../interfaces/House";
import { Resident, ResidentHistory } from "../../interfaces/Resident";

const ResidentHistoryForm = () => {
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );
  const [selectedHouse, setSelectedHouse] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [dateFilled, setDateFilled] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [dateOut, setDateOut] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [addField, setAddField] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get<ResidentHistory>(
          `residents-history/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        setSelectedResident(data.resident);
        setSelectedHouse({
          id: data.house.id,
          label: data.house.name,
        });
        setDateFilled(dayjs(data.date_filled).format("YYYY-MM-DD"));
        if (data.date_out) {
          setAddField(true);
          setDateOut(
            data.date_out
              ? dayjs(data.date_out).format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD")
          );
        }
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
          "residents-history",
          {
            id_resident: selectedResident?.id,
            id_house: selectedHouse?.id,
            date_filled: dateFilled,
            date_out: addField ? dateOut : null,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await api.put(
          `residents-history/${id}`,
          {
            id_resident: selectedResident?.id,
            id_house: selectedHouse?.id,
            date_filled: dateFilled,
            date_out: addField ? dateOut : null,
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
            Form {id ? "Ubah" : "Tambah"} Kependudukan Rumah
          </Typography>
          <Typography variant="body2">
            Form kependudukan rumah adalah form yang digunakan untuk mengisi
            data kependudukan ke rumah yang akan dihuni
          </Typography>
        </div>
        <div>
          <Link
            to="/resident-history"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Kembali</Button>
          </Link>
        </div>
      </Stack>
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={"column"} gap={5}>
            <ModalUser
              selectedResident={selectedResident}
              setSelectedResident={setSelectedResident}
            />
            <SelectedHouse
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
            />

            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Masuk"
                  defaultValue={dayjs(dateFilled)}
                  onChange={(newValue) =>
                    setDateFilled(newValue!.format("YYYY-MM-DD"))
                  }
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth>
              {!addField && (
                <Button onClick={() => setAddField(true)}>
                  Tambahkan Tanggal keluar
                </Button>
              )}
              {addField ? (
                <Box display={"flex"} gap={2}>
                  <div style={{ width: "100%", flexGrow: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        sx={{ width: "100%" }}
                        label="Tanggal Keluar"
                        defaultValue={id ? dayjs(dateOut) : dayjs()}
                        onChange={(newValue) =>
                          setDateOut(newValue!.format("YYYY-MM-DD"))
                        }
                      />
                    </LocalizationProvider>
                  </div>
                  <Button onClick={() => setAddField(false)}>Hapus</Button>
                </Box>
              ) : null}
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

const ModalUser = ({
  selectedResident,
  setSelectedResident,
}: {
  selectedResident: Resident | null;
  setSelectedResident: React.Dispatch<React.SetStateAction<Resident | null>>;
}) => {
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
  }, [authState.token, search, selectedResident]);

  const handleSelect = (item: Resident) => {
    setSelectedResident(item);
    setOpen(false);
  };

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
        <Typography variant="body2">
          {selectedResident?.name || "Pilih penduduk"}
        </Typography>
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
                onClick={() => handleSelect(item)}
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

const SelectedHouse = ({
  selectedHouse,
  setSelectedHouse,
}: {
  selectedHouse: { id: string; label: string } | null;
  setSelectedHouse: React.Dispatch<
    React.SetStateAction<{ id: string; label: string } | null>
  >;
}) => {
  const [data, setData] = useState<
    {
      id: string;
      label: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState("");

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<House[]>(`houses`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        const newData = response.data.map((item) => ({
          id: item.id,
          label: item.name,
        }));

        setData(newData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [selectedHouse, authState.token]);

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={selectedHouse}
        onChange={(_, newValue) => {
          setSelectedHouse(newValue || { id: "", label: "" });
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={data}
        renderInput={(params) => <TextField {...params} label="Pilih rumah" />}
      />
    </FormControl>
  );
};

export default ResidentHistoryForm;
