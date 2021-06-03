import express from 'express';
import { body } from 'express-validator';
import {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  deleteGame
} from '../controllers';

const GameRouter = express.Router();

GameRouter.get('/', getAllGames);

GameRouter.post('/', body('board').isString(), createGame);

GameRouter.get('/:id', getGame);

GameRouter.put('/:id', body('board').isString(), updateGame);

GameRouter.delete('/:id', deleteGame);

export { GameRouter };
