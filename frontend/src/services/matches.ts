import api from '@config/axios';
import { IMatch, matchZod } from '@src/interfaces/match.i';

export const getMatches = async () => {
  const response = await api('/matches');
  return response.data;
};

export const getMatchById = async (id: string) => {
  const response = await api(`/matches/${id}`);
  return response.data;
};

export const getMatchesByTypeAndSearch = async (
  type: string,
  search: string
) => {
  const response = await api(
    `/matches?filter={"filter": {"$and": [{"type": {"$regex": "${type}"}}, {"title": {"$regex": "${search}", "$options": "i"}}]}}`
  );
  return response.data;
};

export const getMatchesByUser = async (userId: string) => {
  const response = await api(
    `/matches?filter={"filter": {"participant": "${userId}"}}`
  );
  return response.data;
};

export const getMatchesByGame = async (gameId: string) => {
  const response = await api(
    `/matches?filter={"filter": {"game": "${gameId}"}}`
  );
  return response.data;
};

export const getMatchByGameAndUser = async (gameId: string, userId: string) => {
  const response = await api(
    `/matches?filter={"filter": {"$and": [{"game": "${gameId}"}, {"participant": "${userId}"}]}}`
  );
  console.log(response);
  return response.data[0];
};

export const createMatch = async (match: IMatch) => {
  const response = await api.post('/matches', { match });
  return response.data;
};

export const updateMatch = async (match: IMatch) => {
  const result = matchZod.safeParse(match);
  if (!result.success) return console.log(result.error);

  const response = await api.put(`/matches`, { match });
  return response.data;
};

export const deleteMatch = async (id: string) => {
  const response = await api.delete(`/matches/${id}`);
  console.log(response);
  return response.data;
};
