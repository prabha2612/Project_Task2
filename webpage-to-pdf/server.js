const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// function to convert webpage to pdf
app.post("/convertToPdf", async (req, res) => {
  const { url } = req.body;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred during PDF conversion.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
