// fruit-icons.js — финальная версия (категории + делегирование дождя)
(function () {
  'use strict';

  const FRUITS_MAIN = ['🍓', '🍍', '🍇', '🍉', '🍊', '🍋', '🍌', '🍎', '🍑', '🍒'];
  const FRUITS_SEASONAL = ['🥭', '🫐', '🍐', '🥝', '🍈', '🥥', '🌰', '🥭'];
  const FRUITS_FUN = ['🍏', '🍅', '🍆', '🥑', '🌽', '🥦', '🥬', '🥒'];

  const CATEGORY_ICONS = {
    science: ['🔬', '🧪', '⚗️', '🧫', '🔭', '⚛️', '🧬', '🦠', '🌡️', '🧲'],
    nature: ['🌿', '🍃', '🌺', '🌸', '🌼', '🌳', '🐝', '🦋', '🐞', '🌱'],
    space: ['🚀', '🪐', '🌕', '🌌', '⭐', '🌠', '☄️', '🛰️', '👨‍🚀', '👩‍🚀'],
    history: ['🏛️', '📜', '⚔️', '👑', '🗿', '🏺', '⚱️', '🕰️', '🗺️', '🏰'],
    tech: ['💻', '📱', '🔌', '🖥️', '⌨️', '🖱️', '💾', '📡', '🤖', '⚡'],
    math: ['📐', '🧮', '🔢', '📏', '➕', '➖', '✖️', '➗', 'π', '∞'],
    general: FRUITS_MAIN
  };

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  window.fruitIcons = {
    main: FRUITS_MAIN,
    seasonal: FRUITS_SEASONAL,
    fun: FRUITS_FUN,

    all() { return [...FRUITS_MAIN, ...FRUITS_SEASONAL, ...FRUITS_FUN]; },
    random() { return rand(this.all()); },

    getByCategory(category) {
      const icons = CATEGORY_ICONS[category] || CATEGORY_ICONS.general;
      return rand(icons);
    }
  };

  window.getRandomFruitIcon = function () {
    return window.fruitIcons.random();
  };

  window.getFactIconByCategory = function (category) {
    return window.fruitIcons.getByCategory(category);
  };

  // Делегируем дождь в движок (если есть), иначе в appAnimations, иначе fallback
  window.animateFruitRain = function (count = 20) {
    if (window.FruitRainEngine && typeof window.FruitRainEngine.burst === 'function') {
      window.FruitRainEngine.burst(count, { eco: document.body.classList.contains('eco-mode') });
      return;
    }
    if (window.appAnimations && typeof window.appAnimations.fruitShower === 'function') {
      window.appAnimations.fruitShower(count);
      return;
    }

    const fruitRain = document.getElementById('fruitRain');
    if (!fruitRain) return;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const fruit = document.createElement('div');
      fruit.className = 'fruit';
      fruit.textContent = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';
      fruit.style.left = `${Math.random() * 100}vw`;
      fruit.style.top = '-100px';
      fruit.style.position = 'fixed';
      fruit.style.fontSize = `${Math.floor(Math.random() * 32 + 24)}px`;
      fruit.style.opacity = String(Math.random() * 0.4 + 0.3);
      fruit.style.pointerEvents = 'none';
      fruit.style.animation = `fruit-drop ${(Math.random() * 1.5 + 1).toFixed(2)}s linear ${i * 50}ms forwards`;
      fruit.addEventListener('animationend', () => fruit.remove(), { once: true });
      frag.appendChild(fruit);
    }
    fruitRain.appendChild(frag);
  };

  window.celebrateWithFruits = function () {
    window.animateFruitRain(30);
  };
})();
