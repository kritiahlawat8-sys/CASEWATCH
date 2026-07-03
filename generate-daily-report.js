import { execSync } from 'child_process';
import fs from 'fs';

const REPO_PATH = process.argv[2] || '.';
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'deepseek-r1:8b';

function getTodaysCommits(repoPath) {
  try {
    const log = execSync(
      `git -C "${repoPath}" log --since="6am" --pretty=format:"- %s"`,
      { encoding: 'utf-8' }
    );
    return log.trim();
  } catch (err) {
    console.error('Could not read git log. Make sure the path is a valid git repo.');
    process.exit(1);
  }
}

async function generateReport(commits) {
  const prompt = `
You are writing a daily internship progress report for a software intern named Kriti Ahlawat, submitted to Mr. Sourav Singh (Project Head), dated ${new Date().toDateString()}.

This project uses the following technology stack — use ONLY these exact facts, do not assume or add any other language or tool:
- Language: JavaScript (Node.js)
- AI engine: Ollama, running the deepseek-r1:8b model locally
- Communicates with Ollama via its local REST API (localhost:11434)
- Version control: Git

Here are today's git commit messages:
${commits || '(no commits found today)'}

Write the report in EXACTLY this markdown structure, nothing extra, no <think> tags, no preamble:

# CASEWATCH Project Report Week 2 day 3

**Prepared by:** Kriti Ahlawat, Nancy Sihag, Nihal Kumar, Sourav Singh (Junior Developer Intern)
**Presented to:** Mr. Sourav Singh, Project Head
**Date:** ${new Date().toDateString()}

## Completed Work
For each item: a numbered bold sub-heading on its own line, followed by 2-3 sentences describing it on the next line. Follow this exact pattern:

1. **Short Heading Here** :
Two to three sentences describing what was done, based on the commits above.

2. **Another Short Heading** :
Two to three sentences describing this point.

(Generate 2-3 such points based on the actual commits given above — do not use the example text itself.)

## Learning Outcome
(2-3 short numbered points on what was learned)

## Technology Used
(a numbered list of relevant technologies, e.g. Ollama, deepseek-r1:8b, Node.js, Git)
`;

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  // deepseek-r1 sometimes adds <think>...</think> reasoning before the real answer — strip it out
  return data.response.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

async function main() {
  console.log("Reading today's commits...");
  const commits = getTodaysCommits(REPO_PATH);
  console.log('\nCommits found:\n', commits || '(none)');

  console.log('\nAsking local AI model to draft the formatted report...');
  const report = await generateReport(commits);

  const today = new Date().toISOString().split('T')[0];
  const mdFile = `daily-report-${today}.md`;
  const docxFile = `daily-report-${today}.docx`;

  fs.writeFileSync(mdFile, report);
  console.log(`\nMarkdown saved to ${mdFile}`);

  console.log('Converting to .docx using pandoc...');
  try {
    execSync(`pandoc "${mdFile}" -o "${docxFile}"`);
    console.log(`Word document saved to ${docxFile}`);
  } catch (err) {
    console.error('Pandoc conversion failed — make sure pandoc is installed (brew install pandoc)');
  }

  console.log('\n--- REPORT ---\n');
  console.log(report);
}

main();