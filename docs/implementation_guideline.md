# Node.js PDF Generation Implementation Guide

This guide provides a step-by-step plan for building the PDF generation server using Node.js, as we discussed.

**Project Goal:** To create a server that reads `inspection.json` and generates a `output_pdf.pdf` by programmatically adding text and images onto the `TREC_Template_Blank.pdf`.

**Core Technologies:**
*   **Runtime:** Node.js
*   **Server Framework:** Express.js
*   **PDF Library:** `pdf-lib`

---

## Phase 1: Project Setup

This phase gets your development environment ready.

**1. Initialize Your Node.js Project**
   Open your terminal in the project root and run this command to create a `package.json` file, which will manage your project's metadata and dependencies.
   ```bash
   npm init -y
   ```

**2. Install Dependencies**
   Next, install the necessary libraries: `express` for the web server and `pdf-lib` for PDF manipulation.
   ```bash
   npm install express pdf-lib
   ```

**3. Organize Your Project Files**
   To keep things clean, let's create a recommended folder structure.

   *   Create a directory named `resources`.
   *   Move `inspection.json` and `TREC_Template_Blank.pdf` into the `resources` directory.
   *   Create a directory named `output` where the generated PDF will be saved.
   *   Create a file named `server.js` in the root directory.

   Your project structure should now look like this:
   ```
   /binsr-inspection
   ├── docs/
   ├── node_modules/
   ├── output/
   ├── resources/
   │   ├── TREC_Template_Blank.pdf
   │   └── inspection.json
   ├── package.json
   ├── package-lock.json
   └── server.js
   ```

---

## Phase 2: Core Logic (in `server.js`)

This is where you'll write the code to perform the PDF generation.

**1. Set Up a Basic Express Server**
   Start `server.js` with a simple Express server. We'll create one endpoint, `/generate-pdf`, to trigger the process.

   ```javascript
   const express = require('express');
   const fs = require('fs');
   const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

   const app = express();
   const port = 3000;

   app.get('/generate-pdf', async (req, res) => {
       try {
           // All our PDF logic will go here
           res.send('PDF generation started...');
       } catch (error) {
           console.error(error);
           res.status(500).send('An error occurred during PDF generation.');
       }
   });

   app.listen(port, () => {
       console.log(`Server listening at http://localhost:${port}`);
   });
   ```

**2. Load Your Data and PDF Template**
   Inside the `/generate-pdf` route, use Node's `fs` (File System) module to read your JSON data and the blank PDF template into memory.

   ```javascript
   // Inside the app.get('/generate-pdf', ...);
   const inspectionData = JSON.parse(fs.readFileSync('resources/inspection.json', 'utf8'));
   const templateBytes = fs.readFileSync('resources/TREC_Template_Blank.pdf');

   const pdfDoc = await PDFDocument.load(templateBytes);
   ```

**3. Create a "Coordinate Map"**
   This is the most important part of your task. You need to find the `(x, y)` coordinates for every piece of data you want to write on the PDF.

   *   **How to Find Coordinates:** Open the PDF in a viewer that can show you the cursor's coordinates (e.g., Adobe Acrobat Pro, or free online tools). Alternatively, use trial and error: draw text at a guessed coordinate, check the output PDF, and adjust until it's perfect.
   *   **PDF Coordinate System:** Remember that `pdf-lib`'s coordinate system starts from the **bottom-left corner** of the page.

   Create an object in your code to store these coordinates for easy access.

   ```javascript
   const coordinates = {
       page1: {
           clientName: { x: 120, y: 690 },
           inspectionDate: { x: 450, y: 690 },
           propertyAddress: { x: 120, y: 655 }
           // ...add all other coordinates for page 1
       },
       page3: {
           // ...coordinates for page 3, etc.
       }
   };
   ```

**4. Draw Data onto the PDF**
   Get the pages from the loaded document and use the `drawText()` function to write your data at the positions defined in your coordinate map.

   ```javascript
   const pages = pdfDoc.getPages();
   const firstPage = pages[0];

   const { clientInfo, address } = inspectionData.inspection;

   firstPage.drawText(clientInfo.name, {
       x: coordinates.page1.clientName.x,
       y: coordinates.page1.clientName.y,
       font: await pdfDoc.embedFont(StandardFonts.Helvetica),
       size: 10,
       color: rgb(0, 0, 0),
   });

   firstPage.drawText(address.fullAddress, {
       x: coordinates.page1.propertyAddress.x,
       y: coordinates.page1.propertyAddress.y,
       // ...font options
   });

   // You will need to loop through inspectionData.inspection.sections
   // and their lineItems/comments to populate the main report body on subsequent pages.
   ```

---

## Phase 3: Save the Final PDF

**1. Serialize and Save**
   Once you've drawn all the data, save the modified PDF document into a new file in your `output` directory.

   ```javascript
   // Place this at the end of your app.get('/generate-pdf', ...) block
   const pdfBytes = await pdfDoc.save();
   fs.writeFileSync('output/output_pdf.pdf', pdfBytes);

   console.log('PDF generated successfully!');
   res.send('PDF generated successfully and saved to /output/output_pdf.pdf');
   ```

---

## How to Run Your Application

1.  **Start the server:**
    ```bash
    node server.js
    ```

2.  **Trigger the PDF generation:**
    Open your web browser and go to the following URL:
    [http://localhost:3000/generate-pdf](http://localhost:3000/generate-pdf)

After you access the URL, check your `output` folder. You should see a new `output_pdf.pdf` file with the data from your JSON file placed onto the template. From here, you can continue to add more data fields and refine the coordinates.
