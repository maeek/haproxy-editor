import './load-vars';

import App from './app';
import logger from './util/log';

const PORT = process.env.API_PORT || 8080;

App.listen(PORT, () => {
  logger.log(`Server listening on http://localhost:${PORT}/`);
});

