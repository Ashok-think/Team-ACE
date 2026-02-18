import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const csvPath = path.join("..", "hypertension_dataset (1).csv"); // In parent dir
const jsonPath = path.join("src", "data", "dataset.json");

try {
  const csvData = fs.readFileSync(csvPath, "utf8");
  const lines = csvData.trim().split("\n");
  const headers = lines[0].trim().split(",");

  const jsonData = lines.slice(1).map((line) => {
    const values = line.trim().split(",");
    const entry = {};
    headers.forEach((header, index) => {
      // Convert numeric values
      let value = values[index];
      if (!isNaN(value) && value !== "") {
        value = Number(value);
      }
      entry[header] = value;
    });
    return entry;
  });

  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  console.log(
    `Successfully converted ${jsonData.length} records to ${jsonPath}`,
  );
} catch (err) {
  console.error("Error converting CSV:", err);
}
