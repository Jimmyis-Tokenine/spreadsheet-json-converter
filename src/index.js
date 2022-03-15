console.error("Spreadsheet to JSON converter");

const FS = require("fs");

const newLine = /\r?\n/;
const defaultFieldDelimiter = ";";

main()

function main() {

  const sampleCSVpath = __dirname + "/../samples/sample.csv";
  const parsedCSV = readFile(sampleCSVpath);
  console.log(parsedCSV);

  let lines = parsedCSV.split(newLine);
  
  for (let i = 1; i < lines.length; i++) {
    const headers = lines[0];
    const { filename, data } = convert(lines[i], headers);
    console.log("Writing:", filename, "=>", data);
    writeJSONFile(filename, data);
  }
}

function readFile(filepath) {
  return FS.readFileSync(filepath, {
    encoding:'utf8', flag:'r'
  });
}


function convert(csvRow, csvHeadersRow = "") {
  let fieldDelimiter = defaultFieldDelimiter;
  let headers = csvHeadersRow.split(fieldDelimiter);
  let col = csvRow.split(fieldDelimiter);

  const filename = col[0];
  const data = {}

  if (headers.length > 0) {
    for (let i = 1; i < headers.length; i++) {
      const header = headers[i].toLowerCase();

      if (header === "attributes") {
        data.attributes = [];
        for (let j = i; j < col.length; j++) {
          if (col[j]) {
            data.attributes.push({ name: col[j] });
          }
        }
      } else {
        data[header] = col[i];
      }
    }
  }

  return { filename, data }
}


function writeJSONFile(filename, data) {
  try {
    const writePath = __dirname + `/../outputs/${filename}`;
    if (!FS.existsSync(writePath)) {
      FS.mkdirSync(writePath, { recursive: true })
    }
    FS.writeFileSync(writePath + "/" + filename + '.json', JSON.stringify(data), { encoding: 'utf8' })

  } catch (e) {
    console.error(e);
  }
}

