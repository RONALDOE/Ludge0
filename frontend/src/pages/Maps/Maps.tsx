import React, { useEffect, useState } from "react";
import PageLayout from "@src/components/layout/PageLayout";
import DataGroup from "@src/components/wordfind/DataGroup";
import WordGroup from "@src/components/maps/WordGroup";
import { useContext } from "react";
import { AuthContext } from "@src/context/AuthProvider";
import { WorlistWords } from "@src/interfaces/activity.i";
import { useTimer } from "react-timer-hook";
import { useParams } from "react-router-dom";
import api from "@src/config/axios";
import { IGame } from "@src/interfaces/games.i";
import { IMatch } from "@src/interfaces/match.i";
import { ReactSVG } from "react-svg";
const MapGame = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<IGame>({
    title: "Worfind",
    description: "Sopa de letras con amigos",
    type: "map",
    createdBy: auth?.data?.id || "",
    activity: [],
    time: 60,
    status: "active",
  });
  const [match, _setMatch] = useState<IMatch>({
    participant: auth?.user?.id || "",
    game: id || "",
    status: "pending",
    answers: [],
  });
  const setMatch = async (match: IMatch) => {
    try {
      const response = await api.put(`/matches/`, { match });
      if (response.status === 200) {
        _setMatch(response.data);
        if (match.status === "in-progress") timerHook.start();
        else timerHook.pause();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [words, _setWords] = useState<WorlistWords[]>([]);
  const setWords = (words: WorlistWords[]) => {
    _setWords(words);
    if (words.length === 0) return;
    if (words.filter((word) => word.isGuessed === true).length === 0) return;
    const answers = words
      .filter((word) => word.isGuessed === true)
      .map((word) => {
        return { id: word.id || "", answer: word.answer };
      });
    setMatch({
      ...match,
      answers,
      status:
        answers.length === game.activity.length ? "finished" : "in-progress",
    });
  };

  useEffect(() => {
    if (!id) return;
    const fetchActivity = async () => {
      try {
        const response = await api.get(`/games/${id}`);
        if (response.status !== 200) {
          console.log(response);
        }
        setGame(response.data);
        if (match.id) {
          return;
        }
        const createResponse = await api.post("/matches", { match });
        if (createResponse.status === 200) {
          _setMatch(createResponse.data);
        }
      } catch (error) {
        console.log("hubo error");
        console.log(error);
        _setMatch({ ...match, status: "error" });
      }
    };
    fetchActivity();
  }, [id]);
  useEffect(() => {
    if (!game) return;
    setWords(
      game.activity.map((acti) => {
        return { ...acti, isGuessed: false };
      })
    );
  }, [game]);
  const ChangeMatchStatus = (bool: Boolean) => {
    setMatch({
      ...match,
      status: bool ? "in-progress" : "finished",
    });
  };
  if (match.status === "error") {
    return (
      <PageLayout>
        <h1>Hubo un error</h1>
      </PageLayout>
    );
  }
  const EndMatch = async () => {
    setMatch({ ...match, status: "finished" });
  };
  const reuseTimer = () => {
    let date = new Date();
    date.setSeconds(date.getSeconds() + (game?.time ?? 60));
    return date;
  };
  const timerHook = useTimer({
    expiryTimestamp: reuseTimer(),
    onExpire: EndMatch,
    autoStart: false,
  });
  return (
    <PageLayout>
      <main className="grow bg-white px-10 py-10">
        <div className="max-w-screen-xl h-auto mx-auto">
          <div className="h-auto flex justify-center p-4">
            <DataGroup
              tiempo={
                match.status === "in-progress"
                  ? timerHook.minutes > 0
                    ? timerHook.minutes +
                      " minutos" +
                      (timerHook.seconds > 0
                        ? " y " + timerHook.seconds + " segundos"
                        : "")
                    : timerHook.seconds + " segundos"
                  : match.status === "finished"
                  ? "Game Over"
                  : (game.time ?? 0) / 60 + " minutos"
              }
              preguntas={game.activity.length - match.answers.length}
              puntuacion={match.score || 0}
              started={match.status !== "pending"}
              startGame={() => ChangeMatchStatus(true)}
            />
          </div>

          <div className="flex justify-between px-36 h-96 w-auto flex-row-reverse">
            <WordGroup words={words} />
            {match.status !== "pending" ? (
              <ReactSVG
                src={`${import.meta.env.VITE_HOSTAPI}/maps/${id}.svg`}
                id="svg"
                fallback={() => <span>Error!</span>}
                onError={(er) => console.warn(er)}
                loading={() => <span>Loading</span>}
                onClick={(e) => {
                  if (match.status !== "in-progress") return;
                  const target = e.target as HTMLElement;
                  if (target.tagName === "path") {
                    const answer: string = target.id
                      .split("-")
                      .slice(0, 2)
                      .join("-");
                    setWords(
                      words.map((word, i) => {
                        if (word.answer === answer) {
                          return { ...word, isGuessed: true };
                        }
                        return word;
                      })
                    );
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default MapGame;
