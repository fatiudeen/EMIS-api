import { createServer } from 'http';
// import cluster from 'cluster';
// import { cpus } from 'os';
// import process from 'process';

import app from './src/api/v2/app.js';
import config from './src/config/config.js';
import db from './src/api/v2/helpers/db.js';

const httpServer = createServer(app);
// const numCPUs = cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
const IP = /**process.env.IP || */ '127.0.0.1';
const PORT = config.port;
httpServer.listen(PORT, () => {
  // Database configuration
  db();
  console.log(`Server running on ${IP}:${PORT}`);
});

//   console.log(`Worker ${process.pid} started`);
// }


