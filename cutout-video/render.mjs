// Renders scene.html frame-by-frame and encodes a 1080x1920 MP4.
// Usage: node render.mjs [out.mp4] [fps]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const out = process.argv[2] || 'out.mp4';
const fps = Number(process.argv[3] || 24);
const here = path.dirname(new URL(import.meta.url).pathname);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(here, 'scene.html')).href + '?render');
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every(i => i.complete));
const duration = await page.evaluate(() => window.SCENE.duration);
const stage = await page.$('#stage');

const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });

const frames = Math.round(duration * fps);
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => window.seek(t), f / fps);
  ff.stdin.write(await stage.screenshot({ type: 'png' }));
  if (f % fps === 0) process.stdout.write(`\r${f}/${frames}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log(`\nwrote ${out}`);
