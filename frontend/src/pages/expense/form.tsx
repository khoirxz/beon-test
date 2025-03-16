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
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { Service } from "../../interfaces/Services";
import { Expense } from "../../interfaces/Expense";

type autoCompleteProps = {
  id: string;
  label: string;
};

const ExpenseForm = () => {
  const [dataService, setDataService] = useState<Service[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedService, setSelectedService] =
    useState<autoCompleteProps | null>(null);
  const [expenseDate, setExpenseDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [expenseTotal, setExpenseTotal] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { id } = useParams<string>();

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const { data: dataService } = await api.get<Service[]>("services", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setDataService(dataService);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        const { data } = await api.get<Expense>(`expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setDescription(data.description);
        setSelectedService({
          id: data.id_services,
          label: data.services.name,
        });
        setExpenseDate(data.expense_date);
        setExpenseTotal(data.expense_total);
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
          "expenses",
          {
            description: description,
            id_services: selectedService?.id,
            expense_date: expenseDate,
            expense_total: expenseTotal,
            id_admin: authState.user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
      } else {
        response = await api.put(
          `expenses/${id}`,
          {
            description: description,
            id_services: selectedService?.id,
            expense_date: expenseDate,
            expense_total: expenseTotal,
            id_admin: authState.user?.id,
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
    setExpenseTotal(dataService.find((item) => item.id === id)?.price || 0);
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
            Form {id ? "Ubah" : "Tambah"} Pengeluaran
          </Typography>
          <Typography variant="body2">Isi detail dibawah ini</Typography>
        </div>
        <div>
          <Link
            to="/expense"
            style={{ textDecoration: "none", color: "inherit" }}>
            <Button variant="contained">Kembali</Button>
          </Link>
        </div>
      </Stack>
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack direction={"column"} gap={5}>
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
              <TextField
                id="description"
                label="Deskripsi"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Pembayaran"
                  defaultValue={dayjs(expenseDate)}
                  onChange={(newValue) =>
                    setExpenseDate(newValue!.format("YYYY-MM-DD"))
                  }
                />
              </LocalizationProvider>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="total-payment"
                label="Total Pembayaran"
                type="number"
                value={expenseTotal}
                onChange={(e) => setExpenseTotal(parseInt(e.target.value))}
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

export default ExpenseForm;
