import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { smartCallback } from "../api/fhir";
import Loader from "../components/Loader";

function CallBackPage() {
  const navigate = useNavigate();
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      smartCallback(code)
        .then(() => {
          setAuthenticating(false);
          navigate("/");
        })
        .catch(() => {
          setAuthenticating(false);
          navigate("/error");
        });
    } else {
      setAuthenticating(false);
      navigate("/error");
    }
  }, [navigate]);

  return (
    <>
      {authenticating && <Loader message="Authenticating..." subtitle="Please wait while we complete authentication." />}
    </>
  );
}

export default CallBackPage;
