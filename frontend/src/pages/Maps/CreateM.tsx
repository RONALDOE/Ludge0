import React, { useContext, useState, useEffect } from "react";
import PageLayout from "@src/components/layout/PageLayout";
import { IActivity, activityZod } from "@src/interfaces/activity.i";
import Button from "@src/components/common/Button";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Button as MUIButton,
  Modal,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { ReactComponent as ProvincesSVG } from "@src/assets/provinces.svg";
import { CiImport, CiTrash } from "react-icons/ci";
import { ReactSVG } from "react-svg";
import GameHeader from "@src/components/game/GameHeader";
import { IGame } from "@src/interfaces/games.i";
import { AuthContext } from "@src/context/AuthProvider";
import { FaEdit, FaSpinner } from "react-icons/fa";
import api from "@src/config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { VscError } from "react-icons/vsc";
import { MdOutlineDownloadDone } from "react-icons/md";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 10,
  padding: "2.8rem 2.1rem",
  textTransform: "capitalize",
  borderRadius: 2,
};

export default function CreateM() {
  const [open, setOpen] = useState(false);
  const svgRef = React.useRef<HTMLDivElement>(null);
  const [file, _setFile] = useState<string | ArrayBuffer | null>(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleOpen = (idSVG: string) => {
    setOpen(true);
    setWord({
      question: "",
      answer: idSVG,
      value: 1,
    });
  };
  const HandleSVGClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    if (target.tagName !== "path") return;
    const id = target.getAttribute("id");
    if (!id) return;
    handleOpen(id);
  };
  useEffect(() => {
    if (!file) return;
    setWords([]);
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(file as string, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    svgElement.id = "svg";
    const paths = svgElement.getElementsByTagName("path");
    if (!paths) return;
    for (const element of paths) {
      element.addEventListener("click", HandleSVGClick);
    }
    //remove all children and append the new svg
    svgRef.current?.children[0]?.remove();
    svgRef.current?.appendChild(svgElement);
    return () => {
      for (const element of paths) {
        element.removeEventListener("click", HandleSVGClick);
      }
    };
  }, [file]);
  const [game, setGame] = useState<IGame>({
    title: "Nuevo Mapa",
    description: "Localiza las regiones en equipo",
    type: "map",
    createdBy: auth?.data?.id || "",
    activity: [],
    time: 60,
    status: "active",
  });
  const handleClose = () => setOpen(false);
  const setWords = (words: IActivity[]) => {
    setGame({ ...game, activity: words });
  };
  const [word, setword] = useState<IActivity>({
    question: "",
    answer: "",
    value: 1,
  });
  const setWord = (word: IActivity) => {
    setword({ ...word });
  };
  const handleInsertWord = () => {
    if (!word.question || !word.answer) {
      return;
    }
    const result = activityZod.safeParse(word);
    if (!result.success) {
      console.log(result.error);
      return;
    }
    if (result.data.id) {
      const newWords = game.activity;
      newWords[parseInt(result.data.id)] = {
        question: result.data.question,
        answer: result.data.answer,
        value: result.data.value,
      };
      setWords(newWords);
    } else setWords([...game.activity, result.data]);

    setOpen(false);
  };
  const deleteWord = (index: number) => {
    const newWords = game.activity.filter((word, i) => i !== index);
    setWords(newWords);
  };
  const handleSend = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(game);
    const resp = await (id ? api.put : api.post)("/games", { file, game });
    console.log(resp.data);
    if (resp.data?.id && !id) {
      navigate(`/map/${resp.data.id}`);
    }
  };
  const [canEdit, setCanEdit] = useState(true);
  useEffect(() => {
    if (!id) return;
    const getGame = async () => {
      const resp = await api.get(`/games/${id}`);
      if (resp.data.createdBy !== auth?.data?.id) {
        setCanEdit(false);
      }
      setGame(resp.data);
    };
    getGame();
  }, []);
  return (
    <PageLayout>
      <main className="grow bg-white px-10 py-10">
        <div className="max-w-screen-xl h-full mx-auto">
          <GameHeader
            title={game.title}
            description={game.description}
            gameType="map"
            onTitleChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setGame({ ...game, title: event.target.value });
            }}
            onDescriptionChange={(
              event: React.ChangeEvent<HTMLTextAreaElement>
            ) => {
              setGame({ ...game, description: event.target.value });
            }}
          />
          <div className="flex items-center justify-between pt-10">

            <div className=" items-center flex pr-4"><ImportSVG setFile={_setFile} /></div>
            <div>
              <FormControl className="w-36 mr-3">
                <InputLabel id="demo-simple-select-label">Tiempo</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Tiempo"
                  value={(game.time ?? 60) / 60}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setGame({
                      ...game,
                      time:
                        typeof e.target.value == "number"
                          ? e.target.value * 60
                          : 1,
                    })
                  }
                >
                  <MenuItem value={1}>1 Minuto</MenuItem>
                  <MenuItem value={2}>2 Minutos</MenuItem>
                  <MenuItem value={3}>3 Minutos</MenuItem>
                  <MenuItem value={5}>5 Minutos</MenuItem>
                  <MenuItem value={10}>10 Minutos</MenuItem>
                  <MenuItem value={15}>15 Minutos</MenuItem>
                  <MenuItem value={20}>20 Minutos</MenuItem>
                  <MenuItem value={30}>30 Minutos</MenuItem>
                  <MenuItem value={45}>45 Minutos</MenuItem>
                  <MenuItem value={60}>60 Minutos</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                className="py-3.5 px-8 ml-3 capitalize "
                onClick={handleSend}
              >
                Guardar Mapa
              </Button>
              {id ? (
                <Button
                  variant="contained"
                  className="py-3.5 px-8 ml-3 capitalize "
                  onClick={() => {
                    navigate(`/map/game/${id}`);
                  }}
                >
                  Jugar
                </Button>
              ) : null}
            </div>
          </div>
          {file ? (
            <div ref={svgRef} />
          ) : id ? (
            <ReactSVG
              src={`${import.meta.env.VITE_HOSTAPI}/maps/${id}.svg`}
              id="svg"
              fallback={() => <span>Error!</span>}
              onError={(er) => console.warn(er)}
              loading={() => <span>Loading</span>}
              onClick={(e) => {
                if (!canEdit) return;
                const target = e.target as HTMLElement;
                if (target.tagName === "path") {
                  const index = target.id;
                  handleOpen(index);
                }
              }}
              className="flex items-center justify-center"
            />
          ) : null}

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "50%" }}>
                    <p className="font-bold">Pregunta</p>
                  </TableCell>
                  <TableCell sx={{ width: "30%" }}>
                    <p className="font-bold">Valor</p>
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <p className="font-bold">Acciones</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {game.activity.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.question}
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Button
                        onClick={() => deleteWord(index)}
                        disabled={!canEdit}
                      >
                        <CiTrash />
                      </Button>
                      <Button
                        disabled={!canEdit}
                        onClick={() => {
                          setWord({ ...row, id: `${index}` });
                          setOpen(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </div>
      </main>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="div" className="capitalize" sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            className="capitalize"
            sx={{ color: "#3B82F6", marginBottom: "2rem" }}
          >
            Modo Editor
          </Typography>
          <div>
            <TextField
              id="outlined-basic"
              label="Pregunta"
              required
              variant="outlined"
              sx={{ width: "100%", marginBottom: "1rem" }}
              value={word.question}
              onChange={(e) => setWord({ ...word, question: e.target.value })}
            />
            <TextField
              id="outlined-basic"
              label="Valor"
              type="number"
              variant="outlined"
              sx={{ width: "100%", marginBottom: "10px" }}
              InputProps={{ inputProps: { min: 0 } }}
              value={word.value}
              onChange={(e) =>
                setWord({ ...word, value: Number(e.target.value) })
              }
            />
          </div>
          <MUIButton
            variant="contained"
            style={{ width: "100%" }}
            size="large"
            onClick={handleInsertWord}
          >
            Agregar Pregunta
          </MUIButton>
        </Box>
      </Modal>
    </PageLayout>
  );
}
function ImportSVG({
  setFile,
}: {
  setFile: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
}) {
  const [importState, setImportState] = useState<{
    status: "completed" | "loading" | "error" | "done";
    text: string;
  }>({
    status: "done",
    text: "Ready",
  });

  return (
    <div className="flex">
      {importState.status === "done" ? (
        <Button
          className="flex items-center text-blue-500 text-transform: uppercase pr-10 sm:pr-3"
          onClick={() => ImportSVGfromFile(setImportState, setFile)}
        >
          <p className="text-md">{`Importar SVG`}</p>
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
            onClick={() => setImportState({ status: "done", text: "" })}
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
}

const ImportSVGfromFile = (
  setImportState: React.Dispatch<
    React.SetStateAction<{
      status: "completed" | "loading" | "error" | "done";
      text: string;
    }>
  >,
  setFile: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>
) => {
  let input = document.getElementById("hidden-input") as HTMLInputElement;
  if (input) {
    input.click();
    return;
  }
  input = document.createElement("input") as HTMLInputElement;
  input.id = "hidden-input";
  input.type = "file";
  //import svg
  input.accept = "image/svg+xml";
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
        setFile(e.target.result);
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
