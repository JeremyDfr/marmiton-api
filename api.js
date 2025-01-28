import express from 'express';

const app = express();

app.use(express.json());

app.get('/recipes', async (req, res) => {

});

app.get('/recipes/:id', async (req, res) => {

});

app.listen(3000, () => {
    console.log('Node API started');
});