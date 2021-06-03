import express from 'express';
import { body } from 'express-validator';
import {
  createGame,
  getAllGames,
  getGame,
  updateGame,
  deleteGame
} from '../controllers';
import { sendResponse } from '../utils';

const GameRouter = express.Router();

GameRouter.get('/', getAllGames);

GameRouter.post('/', body('board').isString(), createGame);

GameRouter.get('/:id', getGame);

GameRouter.put('/:id', body('board').isString(), updateGame);

GameRouter.delete('/:id', deleteGame);

GameRouter.get('/:id/move', (req, res) => {
  const board = req.query.board;
  const index = req.query.index;
  const id = req.params.id;

  if (board[index] !== '-') {
    return response400(res, 'Invalid move');
  }

  return sendResponse(res, 200, { moveValidity: true });
});

export { GameRouter };
