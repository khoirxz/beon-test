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
        flexGrow: 1,
        p: { xs: 0, sm: 3 },
      }}>
      <Toolbar />
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Card
            sx={{
              margin: "auto",
              p: 4,
              maxWidth: { xs: "100%", sm: 400 },
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}>
            <Typography>Login</Typography>

            <TextField
              required
              id="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <TextField
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
          </Card>
        </form>
      </Container>
    </Box>
  );
};

export default LoginPage;
