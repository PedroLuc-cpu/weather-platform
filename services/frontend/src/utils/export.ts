import { saveAs } from "file-saver";

export async function downloadCsv(blob: Blob, filename = "weather.csv") {
  saveAs(blob, filename);
}
