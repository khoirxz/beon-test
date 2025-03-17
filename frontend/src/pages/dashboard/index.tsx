import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";

import Layout from "../../layout/layout";
import api from "../../api";
import { RootState } from "../../store";
import { ReportProps } from "../../interfaces/Report";

type summaryType = {
  month: string;
  income: string;
  expense: string;
  balance: string;
};

const DashboardPage = () => {
  const [report, setReport] = useState<ReportProps | null>(null);
  const [summary, setSummary] = useState<{ data: number[] }[]>([
    {
      data: [0, 0, 0],
    },
  ]);
  const [month, setMonth] = useState<string>(dayjs().format("YYYY-MM"));
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ summary: summaryType[] }>("summary", {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setSummary(
          response.data.summary.map((item) => ({
            data: [
              Number(item.income),
              Number(item.expense),
              Number(item.balance),
            ],
          }))
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReport = async () => {
      try {
        setLoading(true);

        const response = await api.get<ReportProps>(`report`, {
          params: {
            month: month.split("-")[0] + "-" + month.split("-")[1],
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });

        setReport(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
    fetchSummary();
  }, [authState.token, month]);

  return (
    <Layout loading={loading}>
      <h1>Dashboard</h1>
      <Box sx={{ width: "100%" }}>
        <Typography>Grafik Keseluruhan</Typography>
        <BarChart
          sx={{ width: "100%", m: 2 }}
          xAxis={[
            { scaleType: "band", data: ["pemasukan", "pengeluaran", "total"] },
          ]}
          series={summary}
          height={300}
        />
      </Box>

      <Box>
        <Typography>Report Bulanan</Typography>
        <FormControl sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month"]}
              label="Tanggal Pembayaran"
              defaultValue={dayjs(month)}
              onChange={(newValue) => setMonth(newValue!.format("YYYY-MM-DD"))}
            />
          </LocalizationProvider>
        </FormControl>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: { xs: 10, md: 2 },
            mt: 2,
          }}>
          <Box>
            <Typography>Pemasukan</Typography>
            <Typography sx={{ mb: 2 }}>{report?.total_income}</Typography>
            <DataGrid
              sx={{
                maxHeight: 300,
              }}
              rows={report?.income_details || []}
              columns={[
                { field: "total_payment", headerName: "Total", flex: 1 },
                { field: "resident_name", headerName: "Pemilik", flex: 1 },
                { field: "service_name", headerName: "Layanan", flex: 1 },
                { field: "payment_date", headerName: "Tanggal", flex: 1 },
              ]}
            />
          </Box>
          <Box>
            <Typography>Pengeluaran</Typography>
            <Typography sx={{ mb: 2 }}>{report?.total_expense}</Typography>
            <DataGrid
              sx={{
                maxHeight: 300,
              }}
              rows={report?.expense_details || []}
              columns={[
                { field: "expense_total", headerName: "Total", flex: 1 },
                { field: "service_name", headerName: "Layanan", flex: 1 },
                { field: "admin_name", headerName: "Admin", flex: 1 },
                { field: "expense_date", headerName: "Tanggal", flex: 1 },
              ]}
            />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
