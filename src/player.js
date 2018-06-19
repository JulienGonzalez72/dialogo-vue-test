var currentSound;
var playing = false;
var sounds = [];

export function init(name, phrasesCount) {
    sounds = getSounds(name, phrasesCount);
}

function getSounds(name, phrasesCount) {
    var path = 'ressources/sounds/' + name;
    var sounds = [];
    for (let i = 0; i < phrasesCount; i++) {
        var num = (i + 1).toString();
        while (num.length < 3) {
            num = '0' + num;
        }
        sounds.push(new Object());
        sounds[i] = new Audio(path + '/' + name + '(' + num + ').wav');
    }
    return sounds;
}

export function play(n) {
    currentSound = sounds[n];
    currentSound.load();
    currentSound.play();
    playing = true;
}

export function stop() {
    for (const sound of sounds) {
        sound.pause();
    }
    currentSound = null;
    playing = false;
}

export function isPlaying() {
    return playing;
}

export function setOnEnded(onended) {
    currentSound.onended = onended;
}

export function getDuration() {
    return isPlaying ? currentSound.duration : 0;
}