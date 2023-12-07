import { IMatch } from '@src/interfaces/match.i';

export const compareMatch = (matchA: IMatch, matchB: IMatch) => {
  if (matchA.id !== matchB.id) {
    return false;
  }
  if (matchA.participant !== matchB.participant) {
    return false;
  }
  if (matchA.game !== matchB.game) {
    return false;
  }
  if (matchA.status !== matchB.status) {
    return false;
  }
  if (matchA.score !== matchB.score) {
    return false;
  }
  if (matchA.answers.length !== matchB.answers.length) {
    return false;
  }
  for (let i = 0; i < matchA.answers.length; i++) {
    const answerA = matchA.answers[i];
    const answerB = matchB.answers[i];
    if (answerA.id !== answerB.id) {
      return false;
    }
    if (answerA.answer !== answerB.answer) {
      return false;
    }
  }
  return true;
};
