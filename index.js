let express = require(`express`);
let app = express();
let port = 3004;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

// Раздача статики
app.use(express.static(`public`));


// Настройка POST-запроса — JSON
app.use(express.json());


// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/vocabulary');

let wordsSchema = new mongoose.Schema({
    en: {
        type: String,
        required: true
    },
    ru: {
        type: String,
        required: true,
        uniqe: true
    },
    totalCount: Number
},{
    timestamps: true
});

let Words = mongoose.model('words',wordsSchema);


app.get('/words/game',async (req,res)=>{
    let words = await Words.find().sort({totalCount: 1}).limit(3);
    res.send(words);
});

app.post('/words/stats', async (req,res)=>{
    let id = req.body.id;
    let isCorrect = req.body.isCorrect;
    let word = await Words.findOne({_id:id});
    if (isCorrect) {
        word.totalCount++;
    } else {
        word.totalCount--;
    }
    await word.save();
    res.send(word);
});