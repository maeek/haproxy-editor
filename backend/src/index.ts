import './load-vars';
import logger from './util/log'
import App from './app';

const PORT = process.env.API_PORT || 8080;

App.listen(PORT, () => {
  logger.log(`Server listening on http://localhost:${PORT}/`);
});

