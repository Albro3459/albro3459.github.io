import sharp from 'sharp';
import { readdir, mkdir, rename } from 'node:fs/promises';

await mkdir('artifacts/source-images', { recursive: true });
for (const name of await readdir('public/images')) {
  if (!name.endsWith('.png')) continue;
  const source = `public/images/${name}`;
  const destination = source.replace(/\.png$/, '.webp');
  await sharp(source).resize({ width: name.includes('desktop') || name.includes('web') ? 1600 : 1000, withoutEnlargement: true }).webp({ quality: 86 }).toFile(destination);
  await rename(source, `artifacts/source-images/${name}`);
  console.log(destination);
}
await sharp('public/social-preview.svg').png().toFile('public/social-preview.png');
