import fs from "node:fs";

const required = ["package.json", "index.html", "src/main.jsx", "src/styles.css"];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`missing ${file}`);
    process.exit(1);
  }
}
const source = fs.readFileSync("src/main.jsx", "utf8");
for (const term of ["fake TPS", "fake TVL", "NYXT", "example.com", "changeme", "your_key_here"]) {
  if (source.includes(term)) {
    console.error(`disallowed term: ${term}`);
    process.exit(1);
  }
}
console.log("website verification passed");
