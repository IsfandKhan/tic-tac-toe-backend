import express from 'express';
import { body, validationResult } from 'express-validator';

import { GamesModel } from '../models/games';
import { isUUID, sendResponse, response400, response404 } from '../utils/utility-functions';
import { replaceAt } from '../utils/utility-functions';

const router = express.Router();
const gameModel = GamesModel();

router.get('/', (_req, res) => sendResponse(res, 200, gameModel.getAll()));

router.post('/', body('board').isString(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response400(res, 'board has ' + errors.array()[0].msg);
  }

  const { board } = req.body;
  const game = gameModel.create(board);

  return sendResponse(res, 201, { location: `/${game.id}` });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  
  if (!isUUID(id)) {
    return response400(res, 'Not a valid id');
  }

  const game = gameModel.getOne(id);

  if (!game) {
    return res.status(404).json({
      reason: 'Resource Not Found'
    });
  }

  return sendResponse(res, 200, game);
});

router.put('/:id',body('board').isString(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response400(res, 'board has ' + errors.array()[0].msg);
  }
  
  const id = req.params.id;
  let { board, index } = req.body;

  if (!isUUID(id)) {
    return response400(res, 'Not a valid id');
  }

  if (board[index] !== '-') {
    return response400(res, 'Not a valid move');
  }

  board = replaceAt(board, index, 'X');

  const game = gameModel.updateOne(id, board);

  if (!game) {
    return response404(res);
  }

  return sendResponse(res, 200, game);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const game = gameModel.getOne(id);

  if (!isUUID(id)) {
    return response400(res, 'Not a valid id');
  }

  if (!game) {
    return response404(res);
  }

  gameModel.deleteOne(id);
  sendResponse(res, 200, { message: 'Game successfully deleted' });
});

export { router };
