import { CONFIG } from '@/core/config';
import express from 'express';
import packageJson from 'package.json';
import { createNewspaperService } from '@/services/newspaper.service';

const app = express();
const port = CONFIG.port;

const newspaperService = createNewspaperService();

app.post('/send-today-newspaper', async (req, res) => {
  newspaperService.run();
  res.status(200).send();
});

app.get('/', (_, res) => {
  res.json({
    api: 'iwf-daily-newspaper',
    version: packageJson.version,
  });
});

app.listen(port, () => {
  console.log(`🚀 API running on port ${port}`);
});
