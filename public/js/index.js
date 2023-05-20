axios.defaults.headers.post['Content-Type'] = 'application/json';

let leftSide = document.querySelector('.left');
let rightSide = document.querySelector('.right');
let wordNode = document.querySelector('.word');
let input = document.querySelector('.translation-input');

// массив слов
let WORDS;

// индекс текущего слова
let WORD_INDEX = 0;

loadWords();

async function loadWords() {
    let response = await axios.get('/words/game');
    WORDS = response.data;
    WORD_INDEX = -1;
    console.log(WORDS);
    nextWord();
}

function nextWord() {
    WORD_INDEX++;
    rightSide.classList.remove('incorrect');
    input.value = '';
    let word = WORDS[WORD_INDEX];
    if (word) {
        wordNode.innerHTML = word.ru;
    } else {
        wordNode.innerHTML = 'THE END';
        rightSide.classList.add('hide');
    }
}

leftSide.addEventListener('click', () => {
    nextWord();
});

input.addEventListener('keydown',async function (evt) {
    if (evt.key == 'Enter') {
        let word = WORDS[WORD_INDEX];
        if (input.value == word.en) {
            nextWord();
            await axios.post('/words/stats',{
                id: word._id,
                isCorrect: true
            });
        } else {
            rightSide.classList.add('incorrect');
            await axios.post('/words/stats',{
                id: word._id,
                isCorrect: false
            });
        }
    }
});