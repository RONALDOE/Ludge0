import app from './app';
import Checkcon from '@libs/mongoose';
import Logger from '@libs/logger';
import setUp from '@utils/setup';
//import server from '@libs/socket' <-- This is causing the mongo error when u replace it for app in the listen

const port = Number(process.env.port) || 3000;

app.listen(port, async () => {
  const logger = new Logger();
  logger.Success(`Server is listening on http://localhost:${port}`);

  const db = await Checkcon();

  if (db) {
    logger.Success('Connected to MongoDB');
    await setUp();
  } else {
    logger.Warn('Not Connected to MongoDB');
    process.exit(1);
  }
});
