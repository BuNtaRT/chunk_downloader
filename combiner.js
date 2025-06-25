const fs = require("fs");
const path = require("path");

const combinedFile = "result.js";

if (fs.existsSync(combinedFile)) {
  fs.unlinkSync(combinedFile);
  console.log(`Deleted existing file ${combinedFile}`);
}

const folder = "./js";
const files = fs
  .readdirSync(folder)
  .filter((f) => f.endsWith(".js") && f.startsWith("chunk"));

let combinedCode = "";
files.forEach((file) => {
  combinedCode += fs.readFileSync(path.join(folder, file), "utf8") + "\n\n";
});

fs.writeFileSync(combinedFile, combinedCode);
console.log(`Combined all chunks into ${combinedFile}`);
