import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, database, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { GoogleIcon } from "./CustonIcons";
import { ref, update } from "firebase/database";

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };
  const updateData = (path: string, newData: object) => {
    const dbRef = ref(database, path); // Yangilash kerak bo'lgan yo'l
    update(dbRef, newData)
      .then(() => {
        console.log("Data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const newData = {
          username: `@${res.user.email?.slice(0, res.user.email.length - 10)}`,
          email: res.user.email,
          logo: res.user.email?.slice(0, 1).toUpperCase(),
          id: res.user.uid,
          active: true,
        };
        const path = "users/" + res.user.uid;
        updateData(path, newData);

        navigate("/"); // Navigate to the home page or any other protected route
      } catch (error) {
        console.error("Error signing in with email and password:", error);
        setEmailError(true);
        setPasswordError(true);
        setEmailErrorMessage("Incorrect email or password. Please try again.");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const newData = {
        username: `@${res.user.email?.slice(0, res.user.email.length - 10)}`,
        email: res.user.email,
        logo: res.user.email?.slice(0, 1).toUpperCase(),
        id: res.user.uid,
        active: true,
      };
      const path = "users/" + res.user.uid;
      updateData(path, newData);
      navigate("/");
    } catch (error) {
      console.error("Error signing up with Google:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/bgImage.jpg')" }}
    >
      <div className="min-w-[365px] bg-white rounded-xl p-6 bg-opacity-[40%]">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "center",
          }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign in
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
                Sign up
              </Link>
            </span>
          </Typography>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignUp}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
        </Box>
      </div>
    </div>
  );
}
