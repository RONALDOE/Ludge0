import BaseController from './base.c';
import { IGame, GameDocument, gameZod } from '@interfaces/games.i';
import GameModel from '@schemas/games.s';

const Verify = (data: unknown) => gameZod.safeParseAsync(data);

class GameController extends BaseController<GameDocument, IGame> {
  constructor() {
    super(GameModel, Verify);
  }
}

export default GameController;
