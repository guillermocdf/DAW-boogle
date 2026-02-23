'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const sendBtn = document.getElementById('send-btn');
  const backBtn = document.getElementById('back-btn');

  const messageModal = document.getElementById('message-modal');
  const modalMessage = document.getElementById('modal-message');
  const closeMessageBtn = document.getElementById('close-message');

  const DEV_EMAIL = 'cgdelfrade@gmail.com';

  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (name === '') {
      showMessage('Por favor, ingresá tu nombre.');
      return;
    }

    if (email === '' || !isValidEmail(email)) {
      showMessage('Por favor, ingresá un email válido.');
      return;
    }

    if (message.length < 5) {
      showMessage('El mensaje debe tener al menos 5 caracteres.');
      return;
    }

    const subject = encodeURIComponent(`Contacto desde Boggle - ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}\n`
    );

    window.location.href = `mailto:${DEV_EMAIL}?subject=${subject}&body=${body}`;
  });

  backBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  closeMessageBtn.addEventListener('click', closeMessage);

  function showMessage(text) {
    modalMessage.textContent = text;
    messageModal.style.display = 'flex';
  }

  function closeMessage() {
    messageModal.style.display = 'none';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
});