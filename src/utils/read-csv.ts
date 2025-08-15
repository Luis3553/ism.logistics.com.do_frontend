import { toaster } from "rsuite";
import { FileData } from "./types";
import Papa from "papaparse";
import messageToaster from "./toaster";

export function parseCsv(file: FileData["url"]) {
    try {
        const base64Data = file.replace("data:text/csv;base64,", "");
        let csvString = atob(base64Data);
    
        if (csvString.charCodeAt(0) === 0xfeff) {
            csvString = csvString.slice(1);
        }
        csvString = csvString.replace(/^ï»¿/, "");
        csvString = csvString.replace(/^\uFEFF/, "");
    
        const { data } = Papa.parse(csvString, { header: true, skipEmptyLines: true });
        return data;
    } catch (error) {
        toaster.push(messageToaster("Error al leer el archivo", "error"), {
            duration: 2000,
            placement: "topEnd",
        });
        return [];
    }
}
