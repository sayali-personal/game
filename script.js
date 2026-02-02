// Simple helper to switch screens smoothly
function showScreen(idToShow) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    if (screen.id === idToShow) {
      screen.classList.add("active");
      screen.setAttribute("aria-hidden", "false");
    } else {
      screen.classList.remove("active");
      screen.setAttribute("aria-hidden", "true");
    }
  });
}

// Floating hearts background setup
function initFloatingHearts() {
  const container = document.getElementById("floatingHearts");
  if (!container) return;

  const numberOfHearts = 18;
  const containerWidth = window.innerWidth;

  for (let i = 0; i < numberOfHearts; i++) {
    const heart = document.createElement("div");
    heart.className = "float-heart";

    const randomLeft = Math.random() * containerWidth;
    const randomDelay = Math.random() * 10;

    heart.style.left = `${randomLeft}px`;
    heart.style.animationDelay = `${randomDelay}s`;

    container.appendChild(heart);
  }
}

// Confetti hearts when user clicks "Yes"
function spawnConfettiHearts() {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;

  layer.classList.add("active");

  const total = 40;
  const width = window.innerWidth;

  for (let i = 0; i < total; i++) {
    const heart = document.createElement("div");
    heart.className = "confetti-heart";
    heart.style.left = `${Math.random() * width}px`;
    heart.style.animationDelay = `${Math.random() * 0.9}s`;
    heart.style.transform = `translateY(-40px) translateX(0) scale(${0.7 + Math.random() * 0.5})`;

    const colors = ["#ff4f8b", "#ff7ab3", "#ffd1e1", "#ff9fbf"];
    heart.style.backgroundColor = colors[i % colors.length];

    layer.appendChild(heart);

    // Clean up each heart after animation
    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }

  // Hide the confetti layer after a short moment
  setTimeout(() => {
    layer.classList.remove("active");
  }, 3200);
}

// "No" button playful behavior
function initNoButtonShenanigans() {
  const btnNo = document.getElementById("btnNo");
  const wrapper = document.getElementById("noWrapper");
  const tooltip = document.getElementById("noTooltip");
  if (!btnNo || !wrapper) return;

  const phrases = [
    "Are you sure? 🥺",
    "Think again... 😭",
    "But we’re so cute together! 💕",
    "Wrong answer 😤",
    "Try the other button 😏",
  ];
  let phraseIndex = 0;
  let moveCount = 0;

  function moveNoButton() {
    const card = document.querySelector(".card");
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const btnRect = wrapper.getBoundingClientRect();

    const padding = 16;

    const maxX = cardRect.width - btnRect.width - padding;
    const maxY = cardRect.height - btnRect.height - 90;

    const randomX = Math.max(
      padding,
      Math.min(maxX, Math.random() * maxX)
    );
    const randomY = Math.max(
      120,
      Math.min(maxY, 120 + Math.random() * (maxY - 40))
    );

    const offsetX = randomX - (btnRect.left - cardRect.left);
    const offsetY = randomY - (btnRect.top - cardRect.top);

    wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    wrapper.style.transition = "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)";

    if (tooltip) {
      wrapper.classList.add("show-tooltip");
      tooltip.textContent = phrases[phraseIndex];
      phraseIndex = (phraseIndex + 1) % phrases.length;

      setTimeout(() => {
        wrapper.classList.remove("show-tooltip");
      }, 1500);
    }

    moveCount += 1;
  }

  ["mouseenter", "click", "touchstart"].forEach((eventName) => {
    btnNo.addEventListener(eventName, (e) => {
      e.preventDefault();
      moveNoButton();
    });
  });
}

// Simple soft "pop" sound using Web Audio API
function playSoftPop() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 520;
    gain.gain.value = 0.15;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (e) {
    // Best-effort only, ignore failures
  }
}

// Wire up everything on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initFloatingHearts();
  initNoButtonShenanigans();

  const btnOpen = document.getElementById("btnOpen");
  const introEnvelope = document.getElementById("introEnvelope");
  const btnYes = document.getElementById("btnYes");
  const btnReplay = document.getElementById("btnReplay");

  function goToQuestion() {
    showScreen("screenQuestion");
    playSoftPop();
  }

  if (btnOpen) {
    btnOpen.addEventListener("click", goToQuestion);
  }
  if (introEnvelope) {
    introEnvelope.addEventListener("click", goToQuestion);
  }

  if (btnYes) {
    btnYes.addEventListener("click", () => {
      showScreen("screenYes");
      spawnConfettiHearts();
      playSoftPop();
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener("click", () => {
      showScreen("screenIntro");
      playSoftPop();
    });
  }
});


