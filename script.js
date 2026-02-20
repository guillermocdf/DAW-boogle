'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const timeSelect = document.getElementById('time-select');
  const cells = document.querySelectorAll('.cell');

  const submitWordBtn = document.getElementById('submit-word');
  const wordList = document.getElementById('word-list');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');

  const selectedWordInput = document.getElementById('selected-word-input');

  const showRankingBtn = document.getElementById('show-ranking');
  const rankingModal = document.getElementById('ranking-modal');
  const closeRankingBtn = document.getElementById('close-ranking');
  const rankingTableBody = document.querySelector('#ranking-table tbody');

  const playerNameInput = document.getElementById('player-name');

  const messageModal = document.getElementById('message-modal');
  const modalMessage = document.getElementById('modal-message');
  const closeMessageBtn = document.getElementById('close-message');

  const contactBtn = document.getElementById('contact-btn');

  let isGameStarted = false;
  let timer;
  let score = 0;
  let selectedWord = '';
  let selectedCells = [];
  let playerName = '';

  startBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();

    if (playerName === '') {
      showMessage('Por favor, ingresa tu nombre antes de comenzar el juego.');
      return;
    }

    playerNameInput.disabled = true;

    startBtn.disabled = true;
    resetBtn.disabled = false;

    resetGameBoardOnly();

    const timeLimit = parseInt(timeSelect.value, 10) * 60;
    startTimer(timeLimit);

    generateGrid();
    isGameStarted = true;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timer);

    resetAll();

    startBtn.disabled = false;
    resetBtn.disabled = true;
    isGameStarted = false;

    playerNameInput.disabled = false;
  });

  function startTimer(duration) {
    let timeRemaining = duration;

    timerDisplay.style.color = '#fff';
    updateTimerDisplay(timeRemaining);

    timer = setInterval(() => {
      timeRemaining--;
      updateTimerDisplay(timeRemaining);

      if (timeRemaining <= 10) {
        timerDisplay.style.color = '#FF5722';
      }

      if (timeRemaining <= 0) {
        clearInterval(timer);
        timerDisplay.style.color = '#fff';

        showMessage('Tiempo terminado');
        saveGameResult();

        startBtn.disabled = false;
        isGameStarted = false;

        playerNameInput.disabled = false;
      }
    }, 1000);
  }

  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent =
      `Tiempo restante: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

function resetGameBoardOnly() {}
function generateGrid() {}
function saveGameResult() {}
function showMessage(msg){ alert(msg); }
function resetAll() {}

});
