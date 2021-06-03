import tictactoe from 'tictactoe-minimax-ai';
import { replaceAt } from './utility-functions';

const options = {
  computer: 'o',
  opponent: 'x'
};

const convertStringToArray = (board = '') => {
  const newBoard = [];
  for (let i = 0, k = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++, k++) {
      const block = board.charAt(i * 3 + j);
      row.push(block === '-' ? '_' : block.toLowerCase());
    }
    newBoard.push(row);
  }

  return newBoard;
};

const convertArraytoString = (board = [[]]) => {
  let newBoard = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const block = board[i][j];
      newBoard = newBoard.concat(block === '_' ? '-' : block.toUpperCase());
    }
  }

  return newBoard;
};

export const placeMove = (board = '') => {
  const newBoard = convertStringToArray(board);
  const index = tictactoe.bestMove(newBoard, options);
  const stringBoard = convertArraytoString(newBoard);
  return replaceAt(stringBoard, index, options.computer.toUpperCase());
};

export const checkStatus = (board) => {
  const newBoard = convertStringToArray(board);
  return tictactoe.boardEvaluate(newBoard);
};
