const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // Default TTL 60 seconds

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.json(cachedResponse);
    } else {
      const originalSend = res.json;
      res.json = (body) => {
        cache.set(key, body, duration);
        originalSend.call(res, body);
      };
      next();
    }
  };
};

module.exports = cacheMiddleware;