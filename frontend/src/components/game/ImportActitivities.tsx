import Button from "../common/Button";
import { IActivity, activityZod } from "@src/interfaces/activity.i";
import { useState } from "react";
import { CiImport } from "react-icons/ci";
import { Button as MUIButton } from "@mui/material";
import { FaSpinner } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { MdOutlineDownloadDone } from "react-icons/md";
import { z } from "zod";

type ImportWordsProps = {
  setWords:
  | React.Dispatch<React.SetStateAction<IActivity[]>>
  | ((game: IActivity[]) => void);
  gameType: "wordfind" | "quiz";
};

export default function ImportWords({ setWords, gameType }: ImportWordsProps) {
  const [importState, setImportState] = useState<{
    status: "completed" | "loading" | "error" | "done";
    text: string;
  }>({
    status: "done",
    text: "Ready",
  });

  const activitiesName = gameType === "wordfind" ? "Palabras" : "Preguntas";

  return (
    <div className="flex">
      {importState.status === "done" ? (
        <Button
          className="flex items-center text-blue-500 text-transform: uppercase pr-10 sm:pr-3"
          onClick={() => ImportfromFile(setImportState, setWords)}
        >
          <p className="text-md">{`Importar ${activitiesName}`}</p>
          <CiImport className="text-lg text-blue-600 ml-2 sm:ml-1" />
        </Button>
      ) : importState.status === "loading" ? (
        <MUIButton
          disabled
          className="flex items-center text-blue-500 text-transform: uppercase pr-10 sm:pr-3"
        >
          {importState.text}
          <FaSpinner className="text-lg ml-2 sm:ml-1 animate-spin" />
        </MUIButton>
      ) : importState.status === "error" ? (
        <>
          <MUIButton
            disabled
            className="flex items-center my-10 text-blue-500 text-transform: uppercase pr-10 sm:pr-3"
          >
            {importState.text}
          </MUIButton>
          <VscError
            className="text-lg ml-2 sm:ml-1 cursor-pointer"
            onClick={(e) => setImportState({ status: "done", text: "" })}
          />
        </>
      ) : (
        <>
          <MUIButton
            disabled
            className="flex items-center text-blue-500 text-transform:uppercase"
          >
            {importState.text}
          </MUIButton>
          <MUIButton
            className="min-w-0 px-3 mr-5"
            onClick={(e) => setImportState({ status: "done", text: "" })}
          >
            <MdOutlineDownloadDone className="text-lg" />
          </MUIButton>
        </>
      )}
    </div>
  );
};

const ImportfromFile = (
  setImportState: React.Dispatch<
    React.SetStateAction<{
      status: "completed" | "loading" | "error" | "done";
      text: string;
    }>
  >,
  setWords:
    | React.Dispatch<React.SetStateAction<IActivity[]>>
    | ((words: IActivity[]) => void)
) => {
  // import the words from a json file and then set the words

  let input = document.getElementById("hidden-input") as HTMLInputElement;
  if (input) {
    input.click();
    return;
  }
  input = document.createElement("input") as HTMLInputElement;
  input.id = "hidden-input";
  input.type = "file";
  input.accept = "application/json";
  input.onchange = (e) => {
    if (!e.target) return;
    const file = (e.target as any).files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target) {
          setImportState({
            status: "error",
            text: "Error al importar el archivo",
          });
          return;
        }
        const check = z
          .array(activityZod)
          .safeParse(JSON.parse(e.target.result as string));
        if (!check.success) {
          setImportState({
            status: "error",
            text: "Error al importar el archivo, comprueba que tenga palabras validas",
          });
          return;
        }
        setWords(check.data);
        setImportState({
          status: "completed",
          text: "Archivo importado correctamente",
        });
      } catch (e) {
        setImportState({
          status: "error",
          text: "Error al importar el archivo, comprueba que sea válido",
        });
        return;
      }
    };
    reader.readAsText(file);
  };
  input.click();
};