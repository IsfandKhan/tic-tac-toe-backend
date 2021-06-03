export const get = (req, res, next) => {
  console.log(req.session.board, req.sessionID);
  res.json({ test: 'TEST API' });
};
