import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './src/routes/index.js';
const app = express();

app.use(routes);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('src'));

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});

// module.exports = app;