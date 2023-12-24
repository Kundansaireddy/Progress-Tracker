const express = require("express");
const fs = require("fs");
const csvParser = require("papaparse");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.get("/questions", (req, res) => {
  fs.readFile("./Amazon.csv", "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    const parsedData = csvParser.parse(data, { header: true });
    res.json(parsedData.data);
  });
});

app.post("/update", (req, res) => {
  const updatedData = req.body;

  // Convert updatedData to CSV string
  const csvContent = csvParser.unparse(updatedData);

  // Write the updated CSV content back to Amazon.csv
  fs.writeFile("./Amazon.csv", csvContent, "utf8", (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("Updated successfully!");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
