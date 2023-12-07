import { useState, useEffect } from 'react';
import { IGame } from '@interfaces/games.i';
import { getGameById, updateGame, createGame } from '@src/services/games';
import { useParams } from 'react-router-dom';
import { useAuth } from '@src/context/AuthProvider';

export function useQuiz() {
  const { auth } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<IGame>({
    title: 'Nuevo Cuestionario',
    description: 'Cuestionario de preguntas y respuestas',
    type: 'quiz',
    activity: [],
    createdBy:
      auth?.user?.role === 'teacher' && auth?.data?.id ? auth?.data?.id : '',
    status: 'active',
    createdAt: new Date(),
  });

  useEffect(() => {
    if (id) {
      getGameById(id).then((game) => {
        setQuiz(game);
      });
    }
  }, [id]);

  return { quiz, setQuiz };
}
