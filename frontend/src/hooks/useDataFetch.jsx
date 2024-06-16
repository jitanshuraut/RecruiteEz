import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function useDataFetch(url) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const separator = url.includes("?") ? "&" : "?";
    const tokenUrl = `${url}${separator}token=${token}`;

    fetch(tokenUrl)
      .then((response) => {
        console.log("Response is", response);
        if (response.status === 401) {
          navigate("/");
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, [url, navigate]);

  return data;
}

export default useDataFetch;
