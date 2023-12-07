import api from '@config/axios';
import { IGame, gameZod } from '@src/interfaces/games.i';

export const getGames = async () => {
  const response = await api('/games');
  return response.data;
};

export const getGameById = async (id: string) => {
  const response = await api(`/games/${id}`);
  return response.data;
};

export const getGamesByTypeAndSearch = async (type: string, search: string) => {
  const response = await api(
    `/games?filter={"filter": {"$and": [{"type": {"$regex": "${type}"}}, {"title": {"$regex": "${search}", "$options": "i"}}]}}`
  );
  return response.data;
};

export const createGame = async (game: IGame) => {
  const response = await api.post('/games', { game });
  return response.data;
};

export const updateGame = async (game: IGame) => {
  const result = gameZod.safeParse(game);
  if (!result.success) return;

  const response = await api.put(`/games`, { game });
  return response.data;
};

export const deleteGame = async (id: string) => {
  const response = await api.delete(`/games/${id}`);
  console.log(response);
  return response.data;
};
