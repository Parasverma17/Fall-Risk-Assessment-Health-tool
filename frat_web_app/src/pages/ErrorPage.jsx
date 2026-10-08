import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <Navbar />
      <h2>Error</h2>
      <p>
        Sorry, something went wrong. This may be due to authentication failure or a system error.
      </p>
      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
}

export default ErrorPage;