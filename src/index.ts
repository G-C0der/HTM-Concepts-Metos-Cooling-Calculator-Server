import express from 'express';
import cors from 'cors';
import router from './routes';
import { sequelize } from './models';
import {appPort} from "./config";

const app = express();
const port = appPort || 4000;

app.use(express.json());
app.use(cors());
app.use('/api/v1', router);

// start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});