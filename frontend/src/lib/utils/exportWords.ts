import { IActivity } from "@src/interfaces/activity.i";
export const ExportWords = (
  words: IActivity[],
  setExportState: (str: string) => void
) => {
  // export the words to a json file and download it
  setExportState("loading");
  const wordsJSON = JSON.stringify(words);
  const blob = new Blob([wordsJSON], { type: "application/json" });
  // await 5 seconds
  const url = URL.createObjectURL(blob);
  setExportState(["download", url].join(","));
};
export const DownloadBlob = (
  exportState: String,
  setExportState: (str: string) => void
) => {
  const link = document.createElement("a");
  link.href = exportState.split(",")[1];
  link.download = `Palabras-${new Date().toString()}.json`;
  link.click();
  setExportState("done");
};
