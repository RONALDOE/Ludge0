import React, { useEffect, useState } from "react";
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
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Modal,
  TextField,
  Box,
  TableBody,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import GameHeader from "@src/components/game/GameHeader";
import { IGame } from "@src/interfaces/games.i";
import { AuthContext, useAuth } from "@src/context/AuthProvider";
import { FaEdit } from "react-icons/fa";
import api from "@src/config/axios";
import ExportWords from "@src/components/game/ExportActivities";
import ImportWords from "@src/components/game/ImportActitivities";
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

export default function CreateW() {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const handleOpen = () => {
    setWord({ question: "", answer: "", value: 1 });
    setOpen(true);
  };
  const [game, setGame] = useState<IGame>({
    title: "Worfind",
    description: "Sopa de letras con amigos",
    type: "wordfind",
    createdBy: auth?.data?.id || "",
    activity: [],
    time: 60,
    size: {
      width: 8,
      height: 8,
    },
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
    const resp = await (id ? api.put : api.post)("/games", { game });
    if (resp.data.id && !id) {
      navigate(`/wordfind/${resp.data.id}`);
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
            gameType="wordfind"
            onTitleChange={(e) => {
              setGame({ ...game, title: e.target.value });
            }}
            onDescriptionChange={(e) => {
              setGame({ ...game, description: e.target.value });
            }}
          />
          <div className="flex justify-between items-center">
            <div className="flex ">
              <ImportWords gameType="wordfind" setWords={setWords} />
              <ExportWords gameType="wordfind" words={game.activity} />
            </div>
            <div className="flex">
              <FormControl className="w-36 mr-3">
                <InputLabel id="demo-simple-select-label">Tiempo</InputLabel>
                <Select
                  disabled={!canEdit}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Tiempo"
                  value={(game.time ?? 60) / 60}
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
              <TextField
                id="outlined-basic"
                label="Tamaño"
                type="number"
                variant="outlined"
                disabled={!canEdit}
                InputProps={{ inputProps: { min: 8 } }}
                className="w-36 mr-3 ml-3"
                value={game.size ? game.size.width : 8}
                onChange={(e) =>
                  setGame({
                    ...game,
                    size: {
                      width: parseInt(e.target.value),
                      height: parseInt(e.target.value),
                    },
                  })
                }
              />
              <Button
                variant="outlined"
                className="py-3.5 px-4 ml-3 mr-3 capitalize"
                onClick={handleOpen}
                disabled={!canEdit}
              >
                Agregar Pregunta
              </Button>
              <Button
                variant="contained"
                className="py-3.5 px-9 ml-3 capitalize"
                onClick={handleSend}
                disabled={!canEdit}
              >
                Guardar
              </Button>
              {id ? (
                <Button
                  variant="contained"
                  className="py-3.5 px-9 ml-3 capitalize"
                  onClick={() => navigate(`/wordfind/game/${id}`)}
                >
                  Jugar
                </Button>
              ) : null}
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%" }}>
                    <p className="font-bold">Pregunta</p>
                  </TableCell>
                  <TableCell sx={{ width: "60%" }}>
                    <p className="font-bold">Respuesta</p>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <p className="font-bold">Valor</p>
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
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
                    <TableCell>
                      {canEdit
                        ? row.answer
                        : Array.from({ length: row.answer.length })
                          .map(() => "*")
                          .join("")}
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>
                      <div className="h-full w-full flex items-center">
                        <Button
                          className="mx-0 min-w-0 text-lg"
                          disabled={!canEdit}
                          onClick={() => {
                            setWord({ ...row, id: `${index}` });
                            setOpen(true);
                          }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          className="mx-0 min-w-0 text-base"
                          onClick={() => deleteWord(index)}
                          disabled={!canEdit}
                        >
                          <FaTrashAlt />
                        </Button>
                      </div>
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
            Añadir Pregunta
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
              label="Respuesta"
              variant="outlined"
              sx={{ width: "100%", margin: "1rem 0px 2rem" }}
              value={word.answer}
              onChange={(e) => setWord({ ...word, answer: e.target.value })}
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
