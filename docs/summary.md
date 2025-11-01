# Project Summary: Binsr Inspection Report Generator

Based on the problem statement, my understanding is that the main goal is to build a backend application that automates the creation of home inspection reports in PDF format.

## Core Objective

The application must read a provided `inspection.json` file and generate two types of PDF reports:

1.  **TREC Report (Required):** A PDF that accurately fills the official Texas Real Estate Commission (TREC) template (`TREC_Template_Blank.pdf`) with data from `inspection.json`. The final output should be named `output_pdf.pdf` and match the provided `TREC_Sample_Filled.pdf`.

2.  **Creative Report (Optional Bonus):** A custom-designed, modern, and user-friendly inspection report. This report should be an improvement over the standard industry format (`Binsr_Standard_Inspection_Output.pdf`) and will be saved as `bonus_pdf.pdf`.

## Key Requirements & Specifications

*   **Input Data:** All information for the reports will come from a single `inspection.json` file. The data has a clear hierarchy: `Sections` > `Line Items` > `Comments`, with `Photos` and `Videos` attached to comments.
*   **Technology Stack:**
    *   **Backend:** A server-side framework is required (e.g., Node.js, Python/Flask, etc.).
    *   **PDF Generation:** Any suitable library for creating PDFs.
*   **PDF Content:**
    *   All text data from the JSON must be correctly mapped to the corresponding fields in the reports.
    *   Images (from URLs in the JSON) must be embedded directly into the PDF.
    *   Videos should be represented by clickable links that open in a browser.
    *   Checkboxes on the TREC form must be filled correctly based on the data.
    *   Handle missing data gracefully with the placeholder: "Data not found in test data".
*   **Deliverables:**
    *   A GitHub repository containing all source code.
    *   The generated `output_pdf.pdf` in the root of the repository.
    *   The optional `bonus_pdf.pdf` in the root.
    *   A `README.md` file with setup instructions, technology choices, and an explanation of the approach.

## My Role

My task is to build this entire application. I will need to:
1.  Set up a server environment.
2.  Choose and implement a PDF generation library.
3.  Write the logic to parse `inspection.json`.
4.  Map the JSON data to the TREC PDF template fields.
5.  (Optionally) Design and generate a creative report.
6.  Ensure the final output is a professional, well-formatted PDF.
7.  Structure the project according to the submission guidelines.

I will start by setting up the project structure and then focus on the required TREC report generation.
