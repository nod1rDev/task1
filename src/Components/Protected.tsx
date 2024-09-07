import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

function Protected({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    auth.authStateReady().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="absolute top-5 md:top-10 right-2 md:right-5">
        <Alert severity="info">Please wait, we are checking your data</Alert>
      </div>
    );
  } else {
    if (auth.currentUser) {
      return <>{children}</>;
    }

    return <Navigate to="/signup" />;
  }
}

export default Protected;
