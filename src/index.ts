import express from 'express';
import cors from 'cors';
import router from './routes';
import { sequelize } from './models';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use('/api/v1', router);

// start server
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});