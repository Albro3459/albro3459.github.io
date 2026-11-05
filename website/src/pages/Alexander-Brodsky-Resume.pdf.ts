import { readFile } from 'node:fs/promises';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const pdf = await readFile('../resume/Alexander-Brodsky-Resume.pdf');

  return new Response(new Uint8Array(pdf), {
    headers: { 'Content-Type': 'application/pdf' },
  });
};
