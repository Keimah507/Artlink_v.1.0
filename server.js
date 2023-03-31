import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import routes from './backend/routes';
const app = express();
const __dirname = path.resolve()

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('src'));
app.use(routes);

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/src/404.html');
    next();
  });

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});

// module.exports = app;