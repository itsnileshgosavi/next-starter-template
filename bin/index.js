#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Please provide a project name");
  process.exit(1);
}

const targetPath = path.join(process.cwd(), projectName);
fs.mkdirSync(targetPath, { recursive: true });

// Copy template files
const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), "template");
execSync(`cp -r ${templatePath}/* ${targetPath}`);

console.log(`✅ Project ${projectName} created!`);
console.log(`cd ${projectName} && npm install`);
