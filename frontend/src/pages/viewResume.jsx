import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ViewResume({ UserId } = props) {
  const { candidateId } = useParams();
  console.log("candidateId", candidateId);
  let Final_RenderId;
  if (candidateId != undefined) {
    Final_RenderId = candidateId;
  } else {
    Final_RenderId = UserId;
  }

  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [error, setError] = useState(null);
  const filename = "1234567";

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/jobs/resume/${Final_RenderId}`,
          {
            responseType: "arraybuffer",
          }
        );

        // Convert ArrayBuffer to Base64
        const base64Data = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        // Set PDF data URL
        setPdfDataUrl(`data:application/pdf;base64,${base64Data}`);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
        setError("Error fetching PDF data. Please try again later.");
      }
    };

    fetchPdfData();
  }, [filename]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <iframe
        src={pdfDataUrl}
        title="PDF Viewer"
        style={{ width: "100%", height: "100vh", border: "none" }}
      />
    </div>
  );
}
