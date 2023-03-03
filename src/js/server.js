import bodyParser from 'body-parser';
import setUser from './register.js';
import express from 'express';
import { async } from '@firebase/util';
const app = express();

app.use(bodyParser.urlencoded({ extended: true}))


app.get('/', (req, res) => {
    res.send('Open for business!')
})

app.listen(8000, () => {
    console.log('Server listening on port 8000');
})