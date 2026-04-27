import fs from "fs";
import path from "path";
console.log("START");
const OUTPUT = "project_dump.txt";
const IGNORE = ["node_modules", ".git", ".env"];

function shouldIgnore(filePath) {
  return IGNORE.some((ignore) => filePath.includes(ignore));
}

function buildTree(dir, prefix = "") {
  let result = "";
  const items = fs.readdirSync(dir);

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);

    if (shouldIgnore(fullPath)) return;

    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";

    result += prefix + connector + item + "\n";

    if (fs.statSync(fullPath).isDirectory()) {
      result += buildTree(fullPath, prefix + (isLast ? "    " : "│   "));
    }
  });

  return result;
}

function dumpFiles(dir, output) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);

    if (shouldIgnore(fullPath)) return;

    if (fs.statSync(fullPath).isDirectory()) {
      dumpFiles(fullPath, output);
    } else {
      output.push(`===== ${fullPath} =====\n`);
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        output.push(content + "\n\n");
      } catch {
        output.push("[BINARY OR UNREADABLE FILE]\n\n");
      }
    }
  });
}

function main() {
  let output = [];

  output.push("===== PROJECT TREE =====\n");
  output.push(buildTree("."));

  output.push("\n===== FILE CONTENTS =====\n\n");
  dumpFiles(".", output);

  fs.writeFileSync(OUTPUT, output.join(""), "utf-8");

  console.log(`Zapisano do ${OUTPUT}`);
}

main();
