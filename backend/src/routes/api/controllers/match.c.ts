import BaseController from './base.c';
import { IMatch, MatchDocument, matchZod } from '@interfaces/match.i';
import MatchModel from '@schemas/matches.s';

const Verify = (data: unknown) => matchZod.safeParseAsync(data);

class MatchController extends BaseController<MatchDocument, IMatch> {
  constructor() {
    super(MatchModel, Verify);
  }
}

export default MatchController;
