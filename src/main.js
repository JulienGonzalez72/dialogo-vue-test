import Vue from 'vue'
import App from './App.vue'

const utils = require('./utils.js');

const AUTOMATIC_LAUNCH = false;

var app = new Vue({
  el: '#app',
  data: {
    state: AUTOMATIC_LAUNCH ? 'exercice' : 'params',
    /**
     * nom des polices disponibles
     */
    fontNames: ['Andika', 'Arial', 'Lexia', 'OpenDyslexic', 'Times New Roman'],
    fontName: 'OpenDyslexic',
    fontSize: 42,
    /**
     * surlignage permanent du segment actuel
     */
    guidedHighlight: false,
    rightColor: '#00FF00',
    wrongColor: '#FF0000',
    /**
     * si les boutons de contrôle sont affichés
     */
    showControls: true,
    /**
     * si la consigne est affichée
     */
    showExerciceState: true,
    automaticRead: true,
    /**
     * si le son est répété après chaque erreur
     */
    replaySound: true,
    /**
     * pourcentage du temps d'attente par rapport au temps de lecture
     */
    waitTime: 100,
    /**
     * Premier segment à afficher (en partant de 1)
     */
    firstPhrase: 1,
    currentPhraseIndex: 0,
    /**
     * La liste des segments. Chaque segment contient une liste de mots, un index et un style.
     */
    phrases: [],
    stop: false,
    canClick: true,
    exerciceState: '',
    /**
     * Son en cours de lecture.
     */
    currentSound: null,
    /**
     * Nombre d'erreurs total
     */
    errors: 0,
    utils: utils
  },
  methods: {
    launchExercice: function() {
      this.errors = 0;
      this.state = 'exercice';
      savePreferences();
      utils.removeAllHighlight();
      utils.goTo(this.firstPhrase - 1);
    },
    /**
     * Si au moins un des paramètres est invalide.
     */
    hasError: function() {
      return this.firstPhrase < 1 || this.firstPhrase > utils.getPhrasesCount()
        || this.fontSize <= 0;
    },
    /**
     * Applique le preset de lecture guidée.
     */
    guidedReadPreset: function() {
      this.guidedHighlight = true;
      this.automaticRead = true;
      this.replaySound = false;
    },
    /**
     * Applique le preset de lecture segmentée.
     */
    segmentedReadPreset: function() {
      this.guidedHighlight = false;
      this.automaticRead = false;
      this.replaySound = true;
    },
    /**
     * Applique le preset de lecture suivie.
     */
    followedReadPreset: function() {
      this.segmentedReadPreset();
      this.guidedHighlight = true;
    }
  },
  updated: function() {
    if (this.state == 'exercice') {
      var textPane = document.getElementById('textPane');
      textPane.style.fontFamily = this.fontName;
      textPane.style.fontSize = this.fontSize + 'px';  
    }
  }
});

var read = new XMLHttpRequest();
read.open('GET', 'ressources/textes/Aha take on me.txt', false);
read.send();

utils.init(app, read.responseText);

applyPreferences();

/// enregistre les paramètres dans des cookies ///
function savePreferences() {
  utils.setCookie({
    fontSize: app.fontSize,
    firstPhrase: app.firstPhrase,
    showControls: app.showControls,
    automaticRead: app.automaticRead,
    rightColor: app.rightColor,
    wrongColor: app.wrongColor,
    guidedHighlight: app.guidedHighlight,
    fontName: app.fontName,
    replaySound: app.replaySound,
    waitTime: app.waitTime,
    showExerciceState: app.showExerciceState});
}
  
/// initialise les paramètres à partir des cookies ///
function applyPreferences() {
  var params = utils.getCookie('params');
  if (params != null) {
    params = JSON.parse(params);
    app.fontSize = params['fontSize'];
    app.currentPhraseIndex = app.firstPhrase = params['firstPhrase'];
    app.showControls = params['showControls'];
    app.automaticRead = params['automaticRead'];
    app.rightColor = params['rightColor'];
    app.wrongColor = params['wrongColor'];
    app.guidedHighlight = params['guidedHighlight'];
    app.fontName = params['fontName'];
    app.replaySound = params['replaySound'];
    app.waitTime = params['waitTime'];
    app.showExerciceState = params['showExerciceState'];
  }
}