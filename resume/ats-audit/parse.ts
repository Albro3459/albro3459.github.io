import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import type { TextItems } from "lib/parse-resume-from-pdf/types";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error("Usage: npm run parse -- /absolute/resume.pdf /absolute/output");
}

const loading = getDocument({
  data: new Uint8Array(await readFile(resolve(input))),
  fontExtraProperties: true,
});
const pdf = await loading.promise;

try {
  const textItems: TextItems = [];
  const pages = [];
  const links = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    await page.getOperatorList();

    const items: TextItems = content.items.flatMap((item) => {
      if (!("str" in item)) return [];
      const { str, dir, transform, fontName: pdfFontName, ...otherProps } = item;
      const font = page.commonObjs.get(pdfFontName) as { name: string };
      return [{
        ...otherProps,
        text: str.replace(/-­‐/g, "-"),
        fontName: font.name,
        x: transform[4],
        y: transform[5],
      }];
    }).filter((item) => item.hasEOL || item.text.trim() !== "");

    textItems.push(...items);
    pages.push({ page: pageNumber, items });
    for (const annotation of await page.getAnnotations()) {
      if (annotation.url) links.push({ page: pageNumber, url: annotation.url });
    }
  }

  const lines = groupTextItemsIntoLines(textItems);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);
  await mkdir(output, { recursive: true });
  const files = {
    "openresume.json": JSON.stringify(resume, null, 2),
    "pdfjs-items.json": JSON.stringify(pages, null, 2),
    "pdfjs-text.txt": lines.map((line) => line.map((item) => item.text).join(" ")).join("\n"),
    "sections.json": JSON.stringify(sections, null, 2),
    "links.json": JSON.stringify(links, null, 2),
  };
  for (const [name, content] of Object.entries(files)) {
    await writeFile(join(output, name), content + "\n");
  }
  console.log(`Parsed ${pdf.numPages} page(s) into ${resolve(output)}`);
} finally {
  await loading.destroy();
}
