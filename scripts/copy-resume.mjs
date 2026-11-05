import { copyFile } from 'node:fs/promises';

const source = new URL('../resume/Alexander-Brodsky-Resume.pdf', import.meta.url);
const destination = new URL('../public/Alex-Brodsky-Resume.pdf', import.meta.url);

await copyFile(source, destination);
