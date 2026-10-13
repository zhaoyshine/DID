#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { createHash } = require('crypto');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const stateDir = path.join(claudeDir, 'did-onset');
const skillPath = path.join(__dirname, '..', 'skills', 'onset', 'SKILL.md');

function statePathFor(sessionId) {
  return path.join(stateDir, createHash('sha256').update(sessionId).digest('hex'));
}

function markActive(sessionId) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(statePathFor(sessionId), 'active');
}

function isActive(sessionId) {
  return fs.existsSync(statePathFor(sessionId));
}

const REINFORCEMENT = 'DID onset skill 生效中且优先级最高，必须遵守，规则文件：' + skillPath + '。';

function writeOut(text) {
  fs.writeSync(1, text);
}

function handle(raw) {
  let data;
  try {
    data = JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (e) {
    return;
  }

  const prompt = typeof data.prompt === 'string' ? data.prompt.trim() : '';
  const sessionId = typeof data.session_id === 'string' ? data.session_id : '';
  if (!sessionId) return;

  if (/^\/did:onset(?:\s|$)/.test(prompt)) {
    markActive(sessionId);
    return;
  }

  if (isActive(sessionId)) {
    writeOut(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: REINFORCEMENT,
      },
    }));
  }
}

let input = '';
let done = false;

function finish() {
  if (done) return;
  done = true;
  try {
    handle(input);
  } catch (e) {}
  process.exit(0);
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
  try { JSON.parse(input); } catch (e) { return; }
  finish();
});
process.stdin.on('end', finish);
process.stdin.on('error', finish);
setTimeout(finish, 1000);
