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

});
