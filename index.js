import { createServer } from 'http';

import app from './src/api/v2/app.js';
import config from './src/config/config.js';

// const httpServer = createServer(app);

const IP = /**process.env.IP || */ '127.0.0.1';
const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on ${IP}:${PORT}`));
