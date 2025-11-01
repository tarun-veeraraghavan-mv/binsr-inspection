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
