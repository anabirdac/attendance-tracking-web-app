import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

export function generateCSV(rows, fields) {
  const parser = new Parser({ fields });
  return parser.parse(rows);
}

export async function generateXLSX(rows, sheetName = 'Sheet1') {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);
  if (rows.length > 0) {
    sheet.columns = Object.keys(rows[0]).map(k => ({ header: k, key: k }));
    rows.forEach(r => sheet.addRow(r));
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
