const AUDIO_NAME = 'Aha take on me';

var app;
var instance;

/**
 * Initialise les fonctions à partir d'une vue et d'un texte.
 */
export function init(vue, text) {
    instance = this;
    app = vue;
    var textPhrases = text.split('/');
    for (let i = 0; i < textPhrases.length; i++) {
        if (textPhrases[i].length > 1) {
            textPhrases[i] = textPhrases[i].replace('\r', '').replace('\n', '');
            app.phrases.push(new Object());
            app.phrases[i].words = getWords(textPhrases[i]);
            app.phrases[i].index = i;
            app.phrases[i].style = '';
        }
    }
    return textPhrases;
}

/** 
 * Enlève tout le surlignage du texte.
 */
export function removeAllHighlight() {
    for (const p of app.phrases) {
        p.style = '';
    }
    removeWrongHighlight();
}

export function getPhrases() {
    return app.phrases;
}

export function getPhrasesCount() {
    return app != null ? app.phrases.length : 0;
}

export function getWords(phrase) {
    return app.phrases[i].words;
}

export function getShowText() {
    var text = '';
    for (let i = 0; i < app.phrases.length; i++) {
        text += app.phrases[i];
    }
    return text;
}

/**
 * Se place sur le segment n.
 */
export function goTo(n) {
    this.doStop();
    app.stop = false;
    app.currentPhraseIndex = n;
    if (app.guidedHighlight) {
        this.highlightPhrase(n);
    }
    this.play(n);
    var phraseSpan = document.getElementById('phraseSpan' + app.currentPhraseIndex);
    if (phraseSpan != null && !isVisibleInScroll(phraseSpan)) {
        phraseSpan.scrollIntoView();
    }
}

function isVisibleInScroll(span) {
    var spanY = span.offsetTop;
    var scrollY = span.parentElement.scrollTop;
    var height = span.parentElement.clientHeight;
    var spanHeight = span.offsetHeight;
    return spanY >= scrollY
        && spanY - scrollY <= height - spanHeight / 1.1;
}

export function doNext() {
    this.goTo(app.currentPhraseIndex + 1);
}

export function doPrevious() {
    this.goTo(app.currentPhraseIndex - 1);
}

export function doPlay() {
    this.goTo(app.currentPhraseIndex);
}

export function doStop() {
    app.stop = true;
    if (app.currentSound != null) {
        app.currentSound.pause();
    }
}

export function doClick(word) {
    /// ne fait rien si l'utilisateur n'a pas le droit de cliquer ///
    if (!app.canClick)
        return;
    var phrase = app.phrases[app.currentPhraseIndex];
    /// mot sur lequel il faut cliquer ///
    var correctWord = phrase.words[phrase.words.length - 1];
    /// si c'est le bon mot ///
    if (word == correctWord) {
       this.nextPhrase();
    }
    /// sinon affiche l'erreur ///
    else {
        app.errors++;
        this.highlightWrongWord(word);
        if (app.replaySound) {
            this.goTo(app.currentPhraseIndex);
        }
    }
}

export function nextPhrase() {
    /// passe au segment suivant ///
    if (app.currentPhraseIndex < this.getPhrasesCount() - 1) {
        this.removeWrongHighlight();
        this.doNext();
    }
    /// affiche le compte rendu ///
    else {
        app.state = 'report';
    }
}

/**
 * Retourne l'indice du segment actuel.
 */
export function  getCurrentPhraseIndex() {
    return n;
}

/**
 * Surligne le segment de numéro indiqué.
 */
export function highlightPhrase(n) {
    for (const p of app.phrases) {
        if (p == app.phrases[n]) {
            p.style = 'background-color: ' + app.rightColor;
        }
        else {
            p.style = '';
        }
    }
}

/**
 * Surligne le mot indiqué lorsque l'utilisateur se trompe.
 */
export function highlightWrongWord(word) {
    this.removeWrongHighlight();
    word.style = 'background-color: ' + app.wrongColor;
    app.$forceUpdate();
}

export function removeWrongHighlight() {
    for (const p of app.phrases) {
        for (const w of p.words) {
            w.style = '';
        }
    }
}

/**
 * Joue l'enregistrement audio qui correspond au segment indiqué.
 */
export function play(phrase) {
    app.exerciceState = 'Écoutez l\'enregistrement';
    app.canClick = false;
    app.currentSound = this.getSounds(AUDIO_NAME)[phrase];
    app.currentSound.play();
    app.currentSound.onended = function() {
        instance.doWait();
        app.currentSound = null;
    }
}

/**
 * Marque un temps de pause avant d'exécuter la suite de l'exercice.
 */
export function doWait() {
    if (app.waitTime > 0) {
        app.exerciceState = 'Répétez la phrase';
    }
    var timer = setTimeout(() => {
        if (app.stop) {
            clearTimeout(timer);
            return;
        }
        else if (app.automaticRead) {
            instance.nextPhrase();
        }
        else {
            app.exerciceState = 'Cliquez sur le dernier mot prononcé';
            app.canClick = true;
        }
    }, app.currentSound.duration * app.waitTime * 10);
}

/** 
 * si l'enregistrement est en train de jouer
 */
export function isPlaying() {
    return app.currentSound != null && !app.stop;
}

export function getSounds(name) {
    var path = 'ressources/sounds/' + name;
    var sounds = [];
    for (let i = 0; i < this.getPhrasesCount(); i++) {
        var num = (i + 1).toString();
        while (num.length < 3) {
            num = '0' + num;
        }
        sounds.push(new Object());
        sounds[i] = new Audio(path + '/' + name + '(' + num + ').wav');
    }
    return sounds;
}

export function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(name + '=') == 0)
            return c.substring(name.length + 1, c.length);
    }
    return null;
}

export function setCookie(tab) {
    var s = JSON.stringify(tab);
    document.cookie = 'params=' + s + '; expires=18 Dec 2027 12:00:00 UTC; path=/';
}

/**
 * Retourne un tableau des mots du segment indiqué.
 */
function getWords(phrase) {
    var textWords = phrase.split(' ');
    var words = [];
    for (let i = 0; i < textWords.length; i++) {
        if (textWords[i].length > 0) {
            words.push(new Object());
            words[i].text = textWords[i];
            words[i].style = '';
        }
    }
    return words;
}