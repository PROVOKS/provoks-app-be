import type { Block } from "../helpers";

const cellStyle =
  "border:1px solid #d4d4d8;padding:8px 10px;vertical-align:top;text-align:left;";

/**
 * Tabel HTML dengan inline style, karena FE belum punya styling tabel
 * khusus di dalam rich-text. Bisa berisi HTML kecil seperti <code> dan <a>.
 */
export function table(headers: string[], rows: string[][]): Block {
  const head = headers
    .map(
      (header) =>
        `<th style="${cellStyle}background:#f4f4f5;font-weight:600;">${header}</th>`,
    )
    .join("");

  const body = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td style="${cellStyle}">${cell}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  return {
    type: "PARAGRAPH",
    content: {
      html: `<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`,
    },
  };
}
