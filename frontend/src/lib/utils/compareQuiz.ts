import { IGame } from '@src/interfaces/games.i';

export const compareQuiz = (quizA: IGame, quizB: IGame) => {
  if (quizA.title !== quizB.title) {
    return false;
  }
  if (quizA.description !== quizB.description) {
    return false;
  }
  if (quizA.activity.length !== quizB.activity.length) {
    return false;
  }
  for (let i = 0; i < quizA.activity.length; i++) {
    const activityA = quizA.activity[i];
    const activityB = quizB.activity[i];
    if (activityA.question !== activityB.question) {
      return false;
    }
    if (activityA.answer !== activityB.answer) {
      return false;
    }
    if (activityA.value !== activityB.value) {
      return false;
    }
  }
  return true;
};
