const express = require("express");
const fs = require("fs");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const path = require("path");

const app = express();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve files from 'resources' directory under the /resources path
app.use('/resources', express.static(path.join(__dirname, 'resources')));

const port = 3003;

app.get("/hello", (req, res) => {
  console.log("Received request for /hello");
  res.send("Hello");
});

app.get("/generate-pdf", async (req, res) => {
  try {
    console.log("--- PDF Generation Start ---");

    console.log("Reading inspection data...");
    const inspectionData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "resources/inspection.json"), "utf8")
    );
    console.log("Inspection data loaded.");

    console.log("Reading PDF template...");
    const templateBytes = fs.readFileSync(
      path.join(__dirname, "resources/TREC_Template_Blank.pdf")
    );
    console.log("PDF template loaded.");

    console.log("Parsing PDF document...");
    const pdfDoc = await PDFDocument.load(templateBytes);
    console.log("PDF document parsed.");

    const coordinates = {
      page1: {
        clientName: { x: 120, y: 640 },
        inspectionDate: { x: 350, y: 690 },
        propertyAddress: { x: 320, y: 655 },
      },
    };
    console.log("Coordinates defined.");

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    console.log("Got first page of PDF.");

    const { clientInfo, address } = inspectionData.inspection;
    console.log("Extracted data from inspection JSON.");

    console.log("Drawing client name...");
    firstPage.drawText(clientInfo.name, {
      x: coordinates.page1.clientName.x,
      y: coordinates.page1.clientName.y,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      size: 10,
      color: rgb(0, 0, 0),
    });
    console.log("Client name drawn.");

    console.log("Drawing property address...");
    firstPage.drawText(address.fullAddress, {
      x: coordinates.page1.propertyAddress.x,
      y: coordinates.page1.propertyAddress.y,
      font: await pdfDoc.embedFont(StandardFonts.Helvetica),
      size: 10,
      color: rgb(0, 0, 0),
    });
    console.log("Property address drawn.");

    console.log("Saving PDF...");
    const pdfBytes = await pdfDoc.save();
    console.log("PDF saved to bytes.");

    console.log("Writing PDF to file...");
    fs.writeFileSync(path.join(__dirname, "output/output_pdf.pdf"), pdfBytes);
    console.log("PDF written to output/output_pdf.pdf.");

    console.log("--- PDF Generation Success ---");
    res.send("PDF generated successfully and saved to /output/output_pdf.pdf");
  } catch (error) {
    console.error("--- PDF Generation Error ---");
    console.error(error);
    res.status(500).send("An error occurred during PDF generation.");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}!!!`);
});
