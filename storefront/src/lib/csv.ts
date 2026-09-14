/**
 * A small, dependency-free RFC 4180 CSV reader.
 *
 * Written by hand rather than pulled from npm because the whole job is one
 * function and the failure modes matter: Crosslist descriptions contain commas,
 * newlines and doubled quotes, and a parser that splits on "," would quietly
 * shred a listing rather than fail loudly.
 *
 * Handles: quoted fields, escaped quotes (""), embedded newlines, CRLF, and a
 * UTF-8 byte-order mark left behind by Excel and Google Sheets.
 */

/** Split raw CSV text into rows of raw string cells. */
export function parseCsv(text: string): string[][] {
  // Excel and Sheets both like to write a BOM. Left in place it becomes part
  // of the first header name and every lookup against it misses.
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  // A file that does not end in a newline still has one last field in hand.
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Trailing blank lines are normal in exported sheets and are not listings.
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/**
 * Parse CSV text into objects keyed by header name.
 *
 * Header names are returned as written in the file — normalisation is the
 * caller's job, so that an unrecognised column can still be reported back
 * using the spelling the owner actually sees in their spreadsheet.
 */
export function parseCsvRecords(text: string): {
  headers: string[];
  rows: Record<string, string>[];
} {
  const table = parseCsv(text);
  if (table.length === 0) return { headers: [], rows: [] };

  const headers = table[0].map((h) => h.trim());
  const rows = table.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      if (header === "") return;
      record[header] = (cells[i] ?? "").trim();
    });
    return record;
  });

  return { headers, rows };
}
