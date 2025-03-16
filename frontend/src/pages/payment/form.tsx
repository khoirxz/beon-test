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
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { ResidentHistory } from "../../interfaces/Resident";
import { Service } from "../../interfaces/Services";
import { Payment } from "../../interfaces/Payment";

type autoCompleteProps = {
  id: string;
  label: string;
};

const PaymentForm = () => {
  const [dataResidentHistory, setDataResidentHistory] = useState<
    ResidentHistory[]
  >([]);
  const [dataService, setDataService] = useState<Service[]>([]);
  const [selectedResidentHistory, setSelectedResidentHistory] =
    useState<autoCompleteProps | null>(null);
  const [selectedService, setSelectedService] =
    useState<autoCompleteProps | null>(null);
  const [datePayment, setDatePayment] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [period, setPeriod] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const { data: dataResidentHistory } = await api.get<ResidentHistory[]>(
          "residents-history",
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const { data: dataService } = await api.get<Service[]>("services", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setDataResidentHistory(dataResidentHistory);
        setDataService(dataService);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        const { data } = await api.get<Payment>(`payments/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setSelectedResidentHistory({
          id: data.resident_history.id,
          label: data.resident_history.resident.name,
        });
        setSelectedService({
          id: data.services.id,
          label: data.services.name,
        });
        setDatePayment(data.payment_date);
        setTotalPayment(data.total_payment);
        setStatus(data.status);
        setPeriod(data.billing_period);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdditionalData();

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
          "payments",
          {
            id_resident_history: selectedResidentHistory?.id,
            id_services: selectedService?.id,
            payment_date: datePayment,
            total_payment: totalPayment,
            status: status,
            billing_period: period,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await api.put(
          `payments/${id}`,
          {
            id_resident_history: selectedResidentHistory?.id,
            id_services: selectedService?.id,
            payment_date: datePayment,
            total_payment: totalPayment,
            status: status,
            billing_period: period,
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

  const handelPriceChange = (id: string) => {
    setTotalPayment(dataService.find((item) => item.id === id)?.price || 0);
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
            to="/payment"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Kembali</Button>
          </Link>
        </div>
      </Stack>
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={"column"} gap={5}>
            <SelectedAutoComplete
              label="Pemilik"
              data={dataResidentHistory.map((item) => ({
                id: item.id,
                label: item.resident.name,
              }))}
              selectedValue={selectedResidentHistory}
              setSelectedValue={setSelectedResidentHistory}
            />

            <SelectedAutoComplete
              label="Layanan"
              data={dataService.map((item) => ({
                id: item.id,
                label: item.name,
              }))}
              selectedValue={selectedService}
              setSelectedValue={setSelectedService}
              customHandleChange={handelPriceChange}
            />

            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Pembayaran"
                  defaultValue={dayjs(datePayment)}
                  onChange={(newValue) =>
                    setDatePayment(newValue!.format("YYYY-MM-DD"))
                  }
                />
              </LocalizationProvider>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-label">Status tagihan</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                label="Status tagihan"
                onChange={handleChange}
                defaultValue={id ? status : "available"}>
                <MenuItem value="paid">Lunas</MenuItem>
                <MenuItem value="unpaid">Belum Lunas</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="total-payment"
                label="Total Pembayaran"
                type="number"
                value={totalPayment}
                onChange={(e) => setTotalPayment(parseInt(e.target.value))}
              />
            </FormControl>

            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Bulan yang dibayar"
                  defaultValue={dayjs(period)}
                  onChange={(newValue) =>
                    setPeriod(newValue!.format("YYYY-MM-DD"))
                  }
                />
              </LocalizationProvider>
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

const SelectedAutoComplete = ({
  label,
  data,
  selectedValue,
  setSelectedValue,
  customHandleChange,
}: {
  label: string;
  data: { id: string; label: string }[];
  selectedValue: { id: string; label: string } | null;
  setSelectedValue: React.Dispatch<
    React.SetStateAction<{ id: string; label: string } | null>
  >;
  customHandleChange?: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <FormControl fullWidth>
      <Autocomplete
        value={selectedValue}
        onChange={(_, newValue) => {
          setSelectedValue(newValue || { id: "", label: "" });
          customHandleChange?.(newValue?.id || "");
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={data}
        renderInput={(params) => (
          <TextField {...params} label={`label ${label}`} />
        )}
      />
    </FormControl>
  );
};

export default PaymentForm;
