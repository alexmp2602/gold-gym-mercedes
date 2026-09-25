export type ImportMember = {
  name: string;
  dni: string;
  phone: string;
  plan: string;
  status: "active" | "paused";
  expires: string;
};
// RFC-style quoted fields, including delimiters, escaped quotes and newlines.
export function parseMembersCsv(source: string): ImportMember[] {
  if (source.length > 160000)
    throw Error("El archivo supera el tamaño permitido (160 KB de texto).");
  const text = source.replace(/^\uFEFF/, "");
  const separator = text.split(/\r?\n/, 1)[0].includes(";") ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [],
    field = "",
    quoted = false,
    closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else field += c;
      continue;
    }
    if (c === '"') {
      if (field || closed) throw Error("Comillas mal ubicadas en el CSV.");
      quoted = true;
      continue;
    }
    if (c === separator) {
      row.push(field);
      field = "";
      closed = false;
      continue;
    }
    if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      field = "";
      closed = false;
      continue;
    }
    if (closed && c.trim())
      throw Error("Hay texto después del cierre de comillas.");
    if (!closed) field += c;
  }
  if (quoted) throw Error("Hay un campo con comillas sin cerrar.");
  row.push(field);
  if (row.some((v) => v.trim())) rows.push(row);
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const headings = (rows.shift() ?? []).map(normalize),
    expected = ["nombre", "dni", "telefono", "plan", "estado", "vencimiento"];
  if (
    headings.length !== 6 ||
    new Set(headings).size !== 6 ||
    expected.some((h) => !headings.includes(h))
  )
    throw Error(
      "Usá estas seis columnas: Nombre, DNI, Teléfono, Plan, Estado, Vencimiento.",
    );
  if (!rows.length || rows.length > 200)
    throw Error("Importá entre 1 y 200 socios por archivo.");
  return rows.map((r, index) => {
    if (r.length !== 6)
      throw Error(`Fila ${index + 2}: faltan o sobran columnas.`);
    const read = (h: string) => r[headings.indexOf(h)].trim();
    const state = normalize(read("estado"));
    if (!["active", "paused", "activo", "pausado"].includes(state))
      throw Error(`Fila ${index + 2}: Estado debe ser activo o pausado.`);
    return {
      name: read("nombre"),
      dni: read("dni"),
      phone: read("telefono"),
      plan: read("plan"),
      status: ["active", "activo"].includes(state) ? "active" : "paused",
      expires: read("vencimiento"),
    };
  });
}
