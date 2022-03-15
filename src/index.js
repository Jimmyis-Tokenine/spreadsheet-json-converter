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
  
  for (let i = 0; i < lines.length; i++) {
    const { filename, data } = convert(lines[i]);
    console.log("Writing:", filename, "=>", data);
    writeJSONFile(filename, data);
  }
}

function readFile(filepath) {
  return FS.readFileSync(filepath, {
    encoding:'utf8', flag:'r'
  });
}


function convert(csvRow) {
  let fieldDelimiter = defaultFieldDelimiter;
  let col = csvRow.split(fieldDelimiter);

  const filename = col[0];
  const data = {
    "dna": col[1],
    "rarity": col[2],
    "name": col[3],
    "description": col[4],
    "image": col[5],
    "edition": col[6],
    "date": col[7],
    "attributes": [],
  }
  for (let i = 9; i < col.length; i++) {
    data.attributes.push(col[i])
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

