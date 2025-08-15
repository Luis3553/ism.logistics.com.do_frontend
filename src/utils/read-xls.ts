import * as XLSX from "xlsx";
import { FileData } from "./types";

export function parseXls(file: FileData["url"]) {
    const base64Data = file.split(",")[1];

    // Decode Base64 → ArrayBuffer (browser-safe)
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const workbook = XLSX.read(bytes, { type: "array" });

    // Get first sheet and convert to JSON
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
}
