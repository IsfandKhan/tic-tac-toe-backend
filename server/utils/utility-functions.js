export const sendResponse = (res, statusCode, data) => {
  try {
    res.status(statusCode).json(data);
  } catch (errors) {
    res.status(500).json({ reason: 'Internal server error' });
  }
};

export const response400 = (res, reason) => {
  return res.status(400).json({ reason });
};

export const response404 = (res) => {
  return res.status(404).json({ reason: 'Resource Not Found' });
};

export const isUUID = (id) => {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return pattern.test(id);
};

export const replaceAt = (str, index, replacement) => {
  if (index >= str.length) {
    return str.valueOf();
  }
  return str.substring(0, index) + replacement + str.substring(index + 1);
};
