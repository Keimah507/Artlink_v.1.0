import express from 'express';
import path from 'path';
import cors from 'cors';
import router from './backend/routes/index.js';
import cookieParser from 'cookie-parser'; 
const app = express();
const __dirname = path.resolve()

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('src'));
app.use(router);

//TODO: move error handling middleware to ErrorController 
app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + '/src/404.html');

    return;
  });

app.listen(process.env.PORT || 5000, () => {
    console.log('Server listening on port 5000');
});

// module.exports = app;