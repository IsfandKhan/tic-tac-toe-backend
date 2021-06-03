import { validationResult } from 'express-validator';

import { GamesModel } from '../models';
import {
  isUUID,
  sendResponse,
  response400,
  response404,
  replaceAt
} from '../utils';

const gamesModel = GamesModel();

export const getAllGames = (req, res) => {
  const { games } = req.session;
  return sendResponse(res, 200, gamesModel.getAll(games));
};

export const createGame = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response400(res, 'board has ' + errors.array()[0].msg);
  }

  const { games } = req.session;
  const { board } = req.body;

  const game = gamesModel.create(games, board);

  return sendResponse(res, 201, { location: `/${game.id}` });
};

export const getGame = (req, res) => {
  const { games } = req.session;
  const { id } = req.params;

  if (!isUUID(id)) {
    return response400(res, 'Invalid Game URL');
  }

  const game = gamesModel.getOne(games, id);

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
    return response400(res, errors.array());
  }

  const { games } = req.session;
  const { id } = req.params;

  let { board, index } = req.body;

  if (!isUUID(id)) {
    return response400(res, 'Invalid Game URL');
  }

  const savedGame = gamesModel.getOne(games, id);

  if (board !== savedGame?.board) {
    return response400(res, 'Invalid board');
  }

  if (board[index] !== '-') {
    return response400(res, 'Invalid move');
  }

  board = replaceAt(board, index, 'X');

  const game = gamesModel.updateOne(games, id, board);

  if (!game) {
    return response404(res);
  }

  return sendResponse(res, 200, game);
};

export const deleteGame = (req, res) => {
  const { games } = req.session;
  const { id } = req.params;

  const game = gamesModel.getOne(games, id);

  if (!isUUID(id)) {
    return response400(res, 'Not a valid Game URL');
  }

  if (!game) {
    return response404(res);
  }

  gamesModel.deleteOne(games, id);
  sendResponse(res, 200, { message: 'Game successfully deleted' });
};
