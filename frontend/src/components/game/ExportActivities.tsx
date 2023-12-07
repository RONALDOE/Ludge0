import { IActivity } from "@src/interfaces/activity.i";
import { useState } from "react";
import Button from "../common/Button";
import { CiExport } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { DownloadBlob, ExportWords as ExportWordsUtil } from "../../lib/utils/exportWords";
import { Button as MUIButton } from "@mui/material";

type ExportWordsProps = {
  words: IActivity[];
  gameType: "wordfind" | "quiz";
}

export default function ExportWords({ words, gameType }: ExportWordsProps) {
  const [exportState, setExportState] = useState("done");
  const setExport = (str: string) => setExportState(str);

  const activitiesName = gameType === "wordfind" ? "Palabras" : "Preguntas";

  return (
    <div>
      {exportState === "done" ? (
        <Button
          className="flex items-center text-zinc-500 text-transform: uppercase"
          onClick={() => ExportWordsUtil(words, setExport)}
        >
          <p className="text-md">{`Exportar ${activitiesName}`}</p>
          <CiExport className="text-lg ml-2 sm:ml-1" />
        </Button>
      ) : (
        <></>
      )}
      {exportState.includes(",") ? (
        <div className="flex">
          <Button
            className="flex pr-1 items-center text-zinc-500 text-transform: uppercase"
            onClick={() => DownloadBlob(exportState, setExport)}
          >
            Descargar archivo
          </Button>
          <MUIButton
            className="pr-2 pl-1 min-w-[0]"
            size="small"
            onClick={() => setExport("done")}
          >
            <IoClose className="text-lg" />
          </MUIButton>
        </div>
      ) : null}
    </div>
  );
};