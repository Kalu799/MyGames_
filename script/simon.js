/* Sélecteurs HTML */

const $game = document.querySelector("#game");
const $startBtn = document.querySelector(".startBtn");
const $resetBtn = document.querySelector(".resetBtn");
const $colorBtn = document.querySelectorAll(".colorBtn");
const $highScore = document.querySelector("#best-val");


/* Variables */

// Couleurs dispo
const colors = ["GREEN", "RED", "YELLOW", "BLUE"];

// Séquence de l'ordi
let gameSequence = [];

// Séquence du joueur
let playerSequence = [];

// Check pour quand l'ordi joue
let isPlaying = false;


/* Fonctions */

// Fonction pour faire clignoter btn
const flashButton = ($button) => {

  $button.classList.add("blink");
  setTimeout(() => {
    $button.classList.remove("blink");
  }, 300); // Clignote pendant 300ms

};


// L'ordi ajoute une couleur au hasard et joue la séquence
const nextRound = () => {

  playerSequence = []; // On vide la séquence du joueur pour le nouveau tour
  isPlaying = false;   // Bloque les clicks du joueur pendant la démo

  // 1. Choisir une couleur au hasard
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameSequence.push(randomColor);

  // 2. Jouer la séquence de l'ordinateur (avec un délai entre chaque bouton)
  gameSequence.forEach((color, index) => {

    setTimeout(() => {

      // On trouve le bouton HTML qui correspond à la couleur
      const $btn = Array.from($colorBtn).find(btn => btn.innerHTML === color);
      if ($btn) flashButton($btn);

      // Si on arrive au dernier bouton de la liste, le joueur peut commencer à jouer
      if (index === gameSequence.length - 1) {
        setTimeout(() => { isPlaying = true; }, 300);
      }

    }, (index + 1) * 600); // 600ms d'intervalle entre chaque couleur

  });

};


// Gere btn couleur
const HandleBtnClick = (ev) => {

  // Check si c'est un btn et si l'ordi joue
  if (ev.target.localName !== "button" || !isPlaying) return;

  const clickedColor = ev.target.innerHTML;
  flashButton(ev.target); // Fait clignoter le bouton cliqué

  // Enregistre le choix du joueur
  playerSequence.push(clickedColor);

  // Vérification du choix (on compare l'index actuel)
  const currentMoveIndex = playerSequence.length - 1;

  if (playerSequence[currentMoveIndex] !== gameSequence[currentMoveIndex]) {
    // ERREUR ! Le joueur s'est trompé
    alert("Game Over ! Tu as atteint le niveau " + gameSequence.length);
    if (gameSequence.length > $highScore.innerHTML) {
      $highScore.innerHTML = gameSequence.length;
      localStorage.bestSimon = gameSequence.length;
    };
    Reset();
    return;
  };

  // Si le joueur a correctement reproduit TOUTE la séquence
  if (playerSequence.length === gameSequence.length) {
    console.log("nextRound");
    setTimeout(nextRound, 1000); // Lance le tour suivant après 1 seconde
  };

};


// Reset les var
const Reset = (ev) => {

  gameSequence = [];
  playerSequence = [];
  isPlaying = false;
  console.log("Reset");

};


// Start game
const Start = (ev) => {

  if (gameSequence.length > 0) return; // Évite de relancer si une partie est déjà en cours
  console.log("Starting");
  nextRound();

};



/* Initialise l'application */

const Init = () => {

  if (localStorage.bestSimon) {
    $highScore.innerHTML = localStorage.bestSimon;
  };

  Reset();

  // Ecoute les btn couleur
  $game.addEventListener("click", HandleBtnClick);

  // Ecoute le btn start
  $startBtn.addEventListener("click", Start);

  // Ecoute le btn reset
  $resetBtn.addEventListener("click", Reset);

};

Init();