console.error("Spreadsheet to JSON converter");

const FS = require("fs");

const newLine = /\r?\n/;
const defaultFieldDelimiter = ";";

main()

function main() {

  const sampleCSVpath = __dirname + "/../samples/sample.csv";
  const totalHeaderRow = 2
  const parsedCSV = readFile(sampleCSVpath);

  let lines = parsedCSV.split(newLine);
  const geo = createColumnGeological(lines, totalHeaderRow);
  
  for (let i = totalHeaderRow; i < lines.length; i++) {
    const { filename, data } = convert(lines[i], geo);
    console.log("Writing:", filename, "=>", data);
    writeJSONFile(filename, data);
  }
}

function readFile(filepath) {
  return FS.readFileSync(filepath, {
    encoding:'utf8', flag:'r'
  });
}

function createColumnGeological(rows, totalHeaderRow) {
  const __ = [];
  const fieldDelimiter = defaultFieldDelimiter;
  const h_main = rows[0].split(fieldDelimiter);
  let prev_parent = "";

  for (let i = 0; i < h_main.length; i += 1) {
    let parent = h_main[i];
    let type = "primitive";
    let key = parent;
    if (parent === "") {
      parent = prev_parent;
    }
    if (parent[0] === "[" && parent[1] === "]") {
      type = "array";
      key = parent.split("[]")[1];
    }
    const subs = rows[totalHeaderRow - 1].split(fieldDelimiter);
    const sub = subs[i];
    if (sub !== "") {
      __.push({ key, subkey: sub, type })
    } else {
      __.push({ key, type })
    }

    prev_parent = parent;

  }
  
  return __
}

function convert(csvRow, colgeo) {
  let fieldDelimiter = defaultFieldDelimiter;
  let col = csvRow.split(fieldDelimiter);

  const filename = col[0];
  const data = {}

  if (colgeo.length > 0) {
    for (let i = 1; i < colgeo.length; i++) {
      const header = colgeo[i];
      const key =  header.key.toLowerCase();

      if (header.type === "primitive") {
        data[key] = col[i];
      } else if (header.type === "array") {
        if (!data[key]) { data[key] = [] }

        data[key].push({ trait_type: header.subkey, value: col[i] });
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

