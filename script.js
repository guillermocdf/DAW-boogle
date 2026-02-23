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
  const clearRankingBtn = document.getElementById('clear-ranking');
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
      showMessage('Ingresa tu nombre antes de comenzar el juego.');
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

  submitWordBtn.addEventListener('click', submitWord);
  showRankingBtn.addEventListener('click', showRanking);
  closeRankingBtn.addEventListener('click', closeRanking);
  closeMessageBtn.addEventListener('click', closeMessage);
  clearRankingBtn.addEventListener('click', clearRanking);

  contactBtn.addEventListener('click', () => { // conecta el botón "Contacto" con una navegación a otra página
  window.location.href = 'contacto.html';    // cambia la página actual por contacto.html
});

  cells.forEach(cell => cell.addEventListener('click', selectCell));

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

  function resetAll() {
    score = 0;
    selectedWord = '';
    selectedCells = [];

    wordList.innerHTML = '';
    scoreDisplay.textContent = score;
    timerDisplay.textContent = 'Tiempo restante: 00:00';
    timerDisplay.style.color = '#fff';

    selectedWordInput.value = '';

    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('selected', 'last-selected', 'can-select');
    });
  }

  function resetGameBoardOnly() {
    score = 0;
    scoreDisplay.textContent = score;
    wordList.innerHTML = '';

    clearSelection();
    cells.forEach(cell => cell.classList.remove('selected', 'last-selected', 'can-select'));
  }

  function generateGrid() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const vowels = 'AEIOU';
    const numVowels = 5;

    const vowelIndices = [];
    while (vowelIndices.length < numVowels) {
      const randomIndex = Math.floor(Math.random() * cells.length);
      if (!vowelIndices.includes(randomIndex)) vowelIndices.push(randomIndex);
    }

    vowelIndices.forEach(index => {
      const randomVowel = vowels.charAt(Math.floor(Math.random() * vowels.length));
      cells[index].textContent = randomVowel;
    });

    cells.forEach((cell, index) => {
      if (!vowelIndices.includes(index)) {
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        cell.textContent = randomLetter;
      }
    });

    updateSelectableCells();
  }

  function selectCell(event) {
    if (!isGameStarted) return;

    const cell = event.target;

    if (selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1];
      const lastIndex = Array.from(cells).indexOf(lastCell);
      const currentIndex = Array.from(cells).indexOf(cell);

      const lastRow = Math.floor(lastIndex / 4);
      const lastCol = lastIndex % 4;
      const currentRow = Math.floor(currentIndex / 4);
      const currentCol = currentIndex % 4;

      const isAdjacent =
        Math.abs(lastRow - currentRow) <= 1 &&
        Math.abs(lastCol - currentCol) <= 1;

      if (!isAdjacent) return;
    }

    if (!cell.classList.contains('selected')) {
      if (selectedCells.length > 0) {
        selectedCells[selectedCells.length - 1].classList.remove('last-selected');
      }

      cell.classList.add('selected');
      selectedCells.push(cell);

      selectedWord += cell.textContent.toLowerCase();

      selectedWordInput.value = selectedWord;

      cell.classList.add('last-selected');

      updateSelectableCells();
    }
  }

  function updateSelectableCells() {
    cells.forEach(cell => cell.classList.remove('can-select'));
  }

  function submitWord() {
    if (!isGameStarted) return;

    if (selectedWord.length < 3) {
      showMessage('Palabra demasiado corta');
      clearSelection();
      return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`)
      .then(response => {
        if (!response.ok) throw new Error('Palabra no encontrada');
        return response.json();
      })
      .then(() => {
        addWordToList(selectedWord);
        updateScore(selectedWord);
        clearSelection();
      })
      .catch(() => {
        showMessage('Palabra no válida');
        clearSelection();
      });
  }

  function clearSelection() {
    selectedWord = '';
    selectedCells.forEach(cell => cell.classList.remove('selected', 'last-selected'));
    selectedCells = [];

    selectedWordInput.value = '';

    updateSelectableCells();
  }

  function addWordToList(word) {
    const li = document.createElement('li');
    li.textContent = word;
    wordList.appendChild(li);
  }

  function updateScore(word) {
  const len = word.length;

  let points = 0;
  if (len >= 8) points = 11;
  else if (len === 7) points = 5;
  else if (len === 6) points = 3;
  else if (len === 5) points = 2;
  else if (len >= 3) points = 1;

  score += points;
  scoreDisplay.textContent = score;
  }

  function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent =
      `Tiempo restante: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function saveGameResult() {
    const result = {
      name: playerName,
      score: score,
      date: new Date().toLocaleString()
    };

    const rankings = JSON.parse(localStorage.getItem('boggleRankings')) || [];
    rankings.push(result);
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem('boggleRankings', JSON.stringify(rankings));
  }

  function showRanking() {
    const rankings = JSON.parse(localStorage.getItem('boggleRankings')) || [];
    rankingTableBody.innerHTML = '';

    rankings.forEach(rank => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${rank.name}</td>
        <td>${rank.score}</td>
        <td>${rank.date}</td>
      `;
      rankingTableBody.appendChild(row);
    });

    rankingModal.style.display = 'flex';
  }

  function closeRanking() {
    rankingModal.style.display = 'none';
  }

  function clearRanking() {
    localStorage.removeItem('boggleRankings');
    rankingTableBody.innerHTML = '';
    showMessage('Ranking borrado');
  }

  function showMessage(message) {
    modalMessage.textContent = message;
    messageModal.style.display = 'flex';
  }

  function closeMessage() {
    messageModal.style.display = 'none';
  }

});
