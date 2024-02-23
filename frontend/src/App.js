import React, { useState } from "react";
import axios from "axios"; //import axios
import styles from "./styles.module.css"; // Import styles

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleConvert = async () => {
    //handleconvert handles the processof converting webpages to pdf files with the url
    setStatus("Converting...");
    try {
      const response = await axios.post(
        "http://localhost:3001/convertToPdf",
        { url },
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = window.URL.createObjectURL(blob);
      setPdfUrl(pdfUrl);

      setStatus("Converted to PDF");
    } catch (error) {
      setStatus("Conversion failed");
      console.error("Error:", error);
    }
  };

  const handleDownload = () => {
    //handledownload handles the process of downloading the file
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "converted.pdf";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(pdfUrl);
    setUrl("");
  };

  return (
    <body>
      <div className={styles.container}>
        <h1 className={styles.title}>PDF Converter</h1>
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Enter URL"
          className={styles.input}
        />
        <button onClick={handleConvert} className={styles.button}>
          Convert to PDF
        </button>
        {status && <div className={styles.status}>{status}</div>}
        {pdfUrl && (
          <button
            type="button"
            onClick={handleDownload}
            className={`${styles.button} ${styles.downloadbutton}`}
          >
            Download
          </button>
        )}
      </div>
    </body>
  );
}

export default App;
