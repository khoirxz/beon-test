import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import api from "../../api";
import { login } from "../../features/authSlice";
import { User } from "../../interfaces/User";
import { RootState } from "../../store";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (authState.token) {
      navigate("/");
    }
  }, [authState.token, navigate]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      dispatch(login({ user: JSON.parse(savedUser), token: savedToken }));
      navigate("/");
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data }: { data: { user: User; token: string } } = await api.post(
        "login",
        {
          email,
          password,
        }
      );
      dispatch(login({ user: data.user, token: data.token }));
      // localStorage.setItem("token", data.token);
      console.log(data.token);
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
      }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Toolbar />
        <Card
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            width: { xs: "100%", md: 400 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Sistem Administrasi
          </Typography>

          <TextField
            fullWidth
            required
            id="email"
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField
            fullWidth
            required
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <Typography color="error">{error}</Typography>}

          <Button variant="contained" type="submit" loading={loading}>
            Login
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Belum punya akun?{" "}
            <Button variant="text" onClick={() => navigate("/signup")}>
              Daftar
            </Button>
          </Typography>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
