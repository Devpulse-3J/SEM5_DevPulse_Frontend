/**
 * Utility function to convert tabular data into a downloadable CSV file.
 * @param filename Name of the downloaded CSV file (without or with .csv extension)
 * @param rows Array of objects containing row data
 * @param headers Optional custom header mapping or keys order
 */
export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || rows.length === 0) {
    console.warn("exportToCSV called with empty rows");
    return;
  }

  const columnKeys = headers
    ? headers.map((h) => h.key)
    : (Object.keys(rows[0]) as (keyof T)[]);

  const headerLabels = headers
    ? headers.map((h) => h.label)
    : columnKeys.map((k) => String(k));

  const csvRows: string[] = [];

  // Header line
  csvRows.push(headerLabels.map((l) => `"${l.replace(/"/g, '""')}"`).join(","));

  // Data lines
  for (const row of rows) {
    const values = columnKeys.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) {
        return '""';
      }
      if (typeof val === "object") {
        return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      }
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  const finalFileName = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("download", finalFileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
