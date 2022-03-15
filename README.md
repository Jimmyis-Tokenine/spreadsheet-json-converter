# Spreadsheet to JSON Converter

### How to use

1. Open "sample.csv" file in "samples" folder
2. Paste any CSV formatted text here.
3. Run ```node ./src/index.js```
4. Result will be written in "outputs" folder

### CSV Schemas

| Column | Field      | Description                                           |
|--------|------------|-------------------------------------------------------|
| 1      | filename   | Will be used as output folder name and json filename. |
| 10+    | attributes | Will be used as attributes.                           |
