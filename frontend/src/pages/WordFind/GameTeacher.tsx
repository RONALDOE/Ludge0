import React, { useEffect, useState } from "react";
import PageLayout from "@src/components/layout/PageLayout";
import DataGroup from "@src/components/wordfind/DataGroup";
import WordGroup from "@src/components/wordfind/WordGroup";
import Leaderboard from "@src/components/wordfind/Leaderboard";
import { useAuth } from "@src/context/AuthProvider";
import { IActivity, WorlistWords } from "@src/interfaces/activity.i";
import ExportWords from "@src/components/game/ExportActivities";
import Wordlist from "@src/components/wordfind/Wordlist";
import { useParams } from "react-router-dom";
import api from "@src/config/axios";
import { IGame } from "@src/interfaces/games.i";
import { useTimer } from "react-timer-hook";
import { IMatch } from "@src/interfaces/match.i";
const dataGroup = {
  tiempo: "1:00",
  preguntas: "2",
  puntuacion: "200",
};

const GameTeacher = ({}) => {
  const { auth } = useAuth();

  const { id } = useParams<{ id: string }>();
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

          <div className="flex justify-between px-36 h-full w-auto">
            <WordGroup words={words} />
            {match.status !== "pending" ? (
              <Wordlist
                words={words}
                size={{ width: 15, height: 15 }}
                ended={match.status === "finished"}
                setWords={(words: WorlistWords[]) => setWords(words)}
              />
            ) : null}
          </div>
          <div className="h-auto flex justify-center p-4">
            <ExportWords gameType="wordfind" words={game.activity} />
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default GameTeacher;
