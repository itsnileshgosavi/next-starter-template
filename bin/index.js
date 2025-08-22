#!/usr/bin/env node
import degit from "degit";

const projectName = process.argv[2];

if (!projectName) {
  console.error("❌ Please provide a project name");
  process.exit(1);
}

// GitHub repo path: replace with your repo
const repo = "itsnileshgosavi/next-starter-template";

const emitter = degit(repo, {
  cache: false,
  force: true,
  verbose: true
});

(async () => {
  try {
    await emitter.clone(projectName);
    console.log(`✅ Project ${projectName} created!`);
    console.log(`cd ${projectName} && pnpm install`);
  } catch (err) {
    console.error("❌ Failed to create project:", err);
  }
})();
