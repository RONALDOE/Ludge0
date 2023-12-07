import { useState, useEffect } from 'react';
import { IGame } from '@interfaces/games.i';
import { IMatch } from '@src/interfaces/match.i';
import { getMatchById } from '@src/services/matches';
import { useParams } from 'react-router-dom';
import { useAuth } from '@src/context/AuthProvider';
import { getGameById } from '@src/services/games';

export function useMatch() {
  const { auth } = useAuth();
  const { matchId, id } = useParams<{ matchId: string; id: string }>();
  const [match, setMatch] = useState<IMatch>({
    status: 'pending',
    answers: [],
    time: {
      initial: new Date(new Date().getTime() + 1000 * 60 * 60 * 24) as Date,
    },
    participant: auth.user?.id ?? '',
    game: '',
    score: 0,
    createdAt: new Date(),
  });
  const [matchGame, setMatchGame] = useState<IGame>({
    title: '',
    description: '',
    type: 'quiz',
    activity: [],
    createdBy:
      auth?.user?.role === 'teacher' && auth?.data?.id ? auth?.data?.id : '',
    status: 'active',
    createdAt: new Date(),
  });

  useEffect(() => {
    const getMatch = async () => {
      if (matchId) {
        const match = await getMatchById(matchId);
        return setMatch(match);
      }
    };

    const getAnswersQuestions = async () => {
      if (!matchGame.id) return;
      const game = (await getGameById(matchGame.id)) as IGame;
      const answers = match.answers.map((answer, index) => ({
        ...answer,
        id: game.activity[index].id as string,
        answer: answer.answer,
      }));
      setMatch({ ...match, answers });
    };

    getMatch();
    getAnswersQuestions();
  }, [matchId, auth.user?.id, id, matchGame]);

  useEffect(() => {
    const getGame = async () => {
      if (match.game) {
        const game = await getGameById(
          typeof match.game === 'string' ? match.game : match.game.id || ''
        );
        setMatchGame(game);
      }
    };

    getGame();
  }, [match.game]);

  return { match, matchGame, setMatch };
}
