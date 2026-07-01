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
You are helping a software intern write a short, professional daily work report.
Here are today's git commit messages from the project:

${commits || '(no commits found today)'}

Write a 4-6 line daily report in first person, summarizing what was worked on today.
Keep it simple and professional, no fluff, no headings.
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
  return data.response;
}

async function main() {
  console.log("Reading today's commits...");
  const commits = getTodaysCommits(REPO_PATH);
  console.log('\nCommits found:\n', commits || '(none)');

  console.log('\nAsking local AI model to draft the report... (this may take a few seconds)');
  const report = await generateReport(commits);

  const today = new Date().toISOString().split('T')[0];
  const filename = `daily-report-${today}.md`;
  fs.writeFileSync(filename, `# Daily Report - ${today}\n\n${report}`);

  console.log(`\nSaved to ${filename}`);
  console.log('\n--- REPORT ---\n');
  console.log(report);
}

main();