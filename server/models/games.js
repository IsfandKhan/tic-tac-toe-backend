import { v4 } from 'uuid';
import { checkStatus, placeMove } from '../utils';

const STATUS = Object.freeze({
  running: 'RUNNING',
  x_won: 'X_WON',
  o_won: 'O_WON',
  draw: 'DRAW'
});

export const GamesModel = () => {
  return {
    getAll: (games) => games,
    getOne: (games, id) => games.find((game) => game.id === id) || null,
    deleteOne: (games, id) => {
      const index = games.findIndex((game) => game.id === id);
      games.splice(index, 1);
    },
    create: (games, board) => {
      const game = {
        id: v4(),
        board,
        status: STATUS.running
      };
      games.push(game);
      return game;
    },
    updateOne: (games, id, board) => {
      const game = games.find((game) => game.id === id);

      if (!game) {
        return null;
      }

      game.board = placeMove(board);
      const status = checkStatus(game.board);
      switch (status.status) {
        case 'win':
          game.status = STATUS.x_won;
          break;
        case 'loss':
          game.status = STATUS.o_won;
          break;
        case 'tie':
          game.status = STATUS.draw;
          break;
        case 'none':
          game.status = STATUS.running;
          break;
      }
      return game;
    }
  };
};
