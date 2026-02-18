const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'Copy of patient_data - patient_data.csv');
const outputPath = path.join(__dirname, 'src', 'data', 'patient_dataset.json');

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

console.log('Headers:', headers);

const records = [];
for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',').map(v => v.trim().replace(/\r/g, ''));
  if (values.length < headers.length) continue;

  const record = {};
  headers.forEach((h, idx) => {
    record[h] = values[idx];
  });

  // Clean up the Stages field
  record.Stages = record.Stages ? record.Stages.replace(/\.$/, '').trim() : '';

  records.push(record);
}

fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
console.log(`✅ Converted ${records.length} records to patient_dataset.json`);
console.log('Sample record:', JSON.stringify(records[0], null, 2));
