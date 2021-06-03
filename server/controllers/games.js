import { validationResult } from 'express-validator';

import { GamesModel } from '../models';
import { isUUID, sendResponse, response400, response404, replaceAt } from '../utils';

const gameModel = GamesModel();

export const getAllGames = (_req, res) =>
  sendResponse(res, 200, gameModel.getAll());

export const createGame = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response400(res, 'board has ' + errors.array()[0].msg);
  }

  const { board } = req.body;
  const game = gameModel.create(board);

  return sendResponse(res, 201, { location: `/${game.id}` });
};

export const getGame = (req, res) => {
  const id = req.params.id;

  if (!isUUID(id)) {
    return response400(res, 'Invalid Game URL');
  }

  const game = gameModel.getOne(id);

  if (!game) {
    return res.status(404).json({
      reason: 'Resource Not Found'
    });
  }

  return sendResponse(res, 200, game);
};

export const updateGame = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response400(res, 'board has ' + errors.array()[0].msg);
  }

  const id = req.params.id;
  let { board, index } = req.body;

  if (!isUUID(id)) {
    return response400(res, 'Invalid Game URL');
  }

  if (board[index] !== '-') {
    return response400(res, 'Invalid move');
  }

  board = replaceAt(board, index, 'X');

  const game = gameModel.updateOne(id, board);

  if (!game) {
    return response404(res);
  }

  return sendResponse(res, 200, game);
};

export const deleteGame = (req, res) => {
  const id = req.params.id;
  const game = gameModel.getOne(id);

  if (!isUUID(id)) {
    return response400(res, 'Not a valid Game URL');
  }

  if (!game) {
    return response404(res);
  }

  gameModel.deleteOne(id);
  sendResponse(res, 200, { message: 'Game successfully deleted' });
};
