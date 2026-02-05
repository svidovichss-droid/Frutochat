function fruitChatApp() {
  // ===== Utils =====
  const $ = (sel, root = document) => root.querySelector(sel);

  const nowISO = () => new Date().toISOString();

  function safeJsonParse(v, fallback) {
    try { return JSON.parse(v); } catch { return fallback; }
  }

  function uid(prefix = 'chat') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('active'));
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }

  function setTypingVisible(isVisible) {
    const el = document.getElementById('typingIndicator');
    if (!el) return;
    el.style.display = isVisible ? 'block' : 'none';
  }

  // ===== App =====
  return {
    // State
    chats: [],
    currentChatId: null,
    currentChat: null,

    messageInput: '',
    charCount: 0,

    isSending: false,
    isTyping: false,

    sidebarOpen: false,
    fruitRainInterval: null,

    userFruitIcon: '🍓',
    ecoMode: false,

    // Facts/topics
    interestingFacts: [],
    topics: [],

    // internal
    _saveTimer: null,

    // ===== Computed =====
    get sortedChats() {
      return [...this.chats].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    get charCounterClass() {
      if (this.charCount > 900) return 'error';
      if (this.charCount > 800) return 'warning';
      return '';
    },

    // ===== Init =====
    async init() {
      // 1) Данные
      this.interestingFacts = this._getFacts();
      this.topics = this._getTopics();

      // 2) Конфиг/чаты
      await this.loadConfig();
      await this.loadChats();

      // 3) Events + эффекты
      this.setupEventListeners();
      this.updateCharCount();

      // 4) Eco mode
      const savedEcoMode = localStorage.getItem('fruitChatEcoMode');
      if (savedEcoMode !== null) {
        this.ecoMode = !!safeJsonParse(savedEcoMode, false);
      }
      this.detectLowPerformance();
      this.applyEcoMode();

      // 5) Первый визит
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        this.showWelcomeModal();
        localStorage.setItem('hasVisited', 'true');
      }

      // 6) Focus
      setTimeout(() => $('#messageInput')?.focus(), 300);

      console.log('🍓 Фруктик Чат инициализирован');
    },

    // ===== Performance / Eco =====
    detectLowPerformance() {
      const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;

      const isLowPerformance = !!(reducedMotion || lowCores || lowMem);

      if (isLowPerformance && !this.ecoMode) {
        this.ecoMode = true;
        localStorage.setItem('fruitChatEcoMode', JSON.stringify(true));
        this.applyEcoMode();
        this.showStatus('Автоматически включен экономичный режим для улучшения производительности', 'info');
      }
    },

    toggleEcoMode() {
      this.ecoMode = !this.ecoMode;
      localStorage.setItem('fruitChatEcoMode', JSON.stringify(this.ecoMode));
      this.applyEcoMode();
      this.showStatus(
        this.ecoMode ? 'Экономичный режим включен. Нагрузка уменьшена.' : 'Экономичный режим выключен.',
        'success'
      );
    },

    applyEcoMode() {
      document.body.classList.toggle('eco-mode', this.ecoMode);
      this.startFruitRain();
    },

    // ===== Config / Storage =====
    async loadConfig() {
      try {
        const savedUserIcon = localStorage.getItem('userFruitIcon');
        if (savedUserIcon) {
          this.userFruitIcon = savedUserIcon;
        } else {
          this.generateUserFruitIcon();
        }
      } catch (e) {
        console.error('Ошибка загрузки конфигурации:', e);
      }
    },

    async loadChats() {
      try {
        const saved = localStorage.getItem('fruitChats');
        if (!saved) {
          this.createNewChat();
          return;
        }

        const parsed = safeJsonParse(saved, []);
        if (!Array.isArray(parsed)) {
          this.createNewChat();
          return;
        }

        this.chats = parsed;

        if (!this.chats.length) {
          this.createNewChat();
          return;
        }

        const lastActive = localStorage.getItem('lastActiveChat');
        this.currentChatId = lastActive || this.chats[0].id;
        this.currentChat = this.chats.find(c => c.id === this.currentChatId) || this.chats[0];

        this.renderMessages();
      } catch (e) {
        console.error('Ошибка загрузки чатов:', e);
        this.createNewChat();
      }
    },

    saveChats() {
      try {
        localStorage.setItem('fruitChats', JSON.stringify(this.chats));
        if (this.currentChatId) localStorage.setItem('lastActiveChat', this.currentChatId);
      } catch (e) {
        console.error('Ошибка сохранения чатов:', e);
      }
    },

    scheduleSaveChats() {
      clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(() => this.saveChats(), 200);
    },

    // ===== Chat CRUD =====
    createNewChat() {
      const newChat = {
        id: uid('chat'),
        title: 'Новый чат',
        messages: [],
        createdAt: nowISO(),
        updatedAt: nowISO()
      };

      this.chats.push(newChat);
      this.currentChatId = newChat.id;
      this.currentChat = newChat;

      this.scheduleSaveChats();
      this.renderMessages();
      this.closeSidebar();
      this.showStatus('Новый чат создан!', 'success');

      setTimeout(() => $('#messageInput')?.focus(), 100);
    },

    loadChat(chatId) {
      this.currentChatId = chatId;
      this.currentChat = this.chats.find(c => c.id === chatId) || null;
      this.renderMessages();
      this.closeSidebar();
      this.showStatus('Чат загружен', 'success');
    },

    deleteChat(chatId) {
      if (this.chats.length <= 1) {
        this.showStatus('Нельзя удалить последний чат', 'error');
        return;
      }

      if (!confirm('Удалить этот чат? Все сообщения будут потеряны.')) return;

      const idx = this.chats.findIndex(c => c.id === chatId);
      if (idx >= 0) this.chats.splice(idx, 1);

      if (this.currentChatId === chatId) {
        this.currentChat = this.chats[0] || null;
        this.currentChatId = this.currentChat ? this.currentChat.id : null;
        this.renderMessages();
      }

      this.scheduleSaveChats();
      this.showStatus('Чат удалён', 'success');
    },

    // ===== Clear all chats =====
    showClearConfirmModal() {
      if (!this.chats.length) {
        this.showStatus('Нет чатов для удаления', 'info');
        return;
      }
      openModal('clearConfirmModal');
    },

    closeClearConfirmModal() {
      closeModal('clearConfirmModal');
    },

    confirmClearAllChats() {
      this.chats = [];
      this.currentChatId = null;
      this.currentChat = null;

      this.saveChats();
      this.createNewChat();

      this.closeClearConfirmModal();
      this.showStatus('Все чаты удалены', 'success');
    },

    // ===== Sidebar =====
    openSidebar() {
      this.sidebarOpen = true;
      document.body.style.overflow = 'hidden';
    },

    closeSidebar() {
      this.sidebarOpen = false;
      document.body.style.overflow = '';
    },

    // ===== Welcome modal =====
    showWelcomeModal() {
      openModal('welcomeModal');
    },

    closeWelcomeModal() {
      closeModal('welcomeModal');
      setTimeout(() => $('#messageInput')?.focus(), 100);
    },

    // ===== Messages =====
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    addMessage(role, content, opts = {}) {
      const { skipScroll = false, skipKatex = false } = opts;

      const messagesList = document.getElementById('messagesList');
      if (!messagesList) return;

      const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

      const userFruit = this.userFruitIcon;
      const assistantFruit = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';

      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${role === 'user' ? 'message-user' : 'message-assistant'}`;

      messageDiv.innerHTML = `
        <div class="${role === 'user' ? 'message-user' : 'message-assistant'}">
          ${role !== 'user' ? `
            <div class="avatar avatar-assistant animated-fruit">
              <div class="avatar-inner"><span>${assistantFruit}</span></div>
            </div>` : ''
          }

          <div class="bubble ${role === 'user' ? 'bubble-user' : 'bubble-assistant'}">
            <div class="message-content">${this.escapeHtml(content)}</div>
            <div class="message-time">${time}</div>
          </div>

          ${role === 'user' ? `
            <div class="avatar avatar-user animated-fruit">
              <div class="avatar-inner"><span>${userFruit}</span></div>
            </div>` : ''
          }
        </div>
      `;

      messagesList.appendChild(messageDiv);

      if (!skipScroll) this.scrollToBottom();

      if (!skipKatex) {
        setTimeout(() => {
          if (window.renderMathInElement) {
            window.renderMathInElement(messageDiv, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
              ],
              throwOnError: false
            });
          }
        }, 50);
      }
    },

    renderMessages() {
      const messagesList = document.getElementById('messagesList');
      if (!messagesList) return;

      messagesList.innerHTML = '';
      if (!this.currentChat?.messages?.length) return;

      this.currentChat.messages.forEach(msg => {
        this.addMessage(msg.role, msg.content, { skipScroll: true, skipKatex: true });
      });

      this.scrollToBottom();

      setTimeout(() => {
        if (window.renderMathInElement) {
          window.renderMathInElement(messagesList, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
          });
        }
      }, 0);
    },

    scrollToBottom() {
      setTimeout(() => {
        const container = document.querySelector('.messages-container');
        if (container) container.scrollTop = container.scrollHeight;
      }, 50);
    },

    // ===== Input =====
    updateCharCount() {
      this.charCount = this.messageInput.length;

      const textarea = document.getElementById('messageInput');
      if (!textarea) return;

      textarea.style.height = 'auto';

      const cs = window.getComputedStyle(textarea);
      const minHeight = parseInt(cs.minHeight, 10) || 64;
      const maxHeight = parseInt(cs.maxHeight, 10) || 192;
      const lineHeight = parseInt(cs.lineHeight, 10) || 24;

      const rows = (textarea.value || '').split('\n').length;
      const calculated = Math.max(minHeight, Math.min(maxHeight, rows * lineHeight + 32));
      textarea.style.height = calculated + 'px';

      const sendButton = document.getElementById('sendButton');
      if (sendButton) {
        sendButton.style.height = calculated + 'px';
        sendButton.style.minHeight = calculated + 'px';
      }
    },

    handleEnter(event) {
      if (event.shiftKey) return;
      event.preventDefault();
      if (this.messageInput.trim() && !this.isSending) this.sendMessage();
    },

    setQuickQuestion(question) {
      this.messageInput = question;
      this.updateCharCount();
      setTimeout(() => $('#messageInput')?.focus(), 50);
    },

    setRandomTopic() {
      if (!this.topics.length) {
        this.showStatus('Нет доступных тем', 'error');
        return;
      }
      const topic = this.topics[Math.floor(Math.random() * this.topics.length)];
      this.messageInput = `Объясни тему: "${topic}" простым языком для школьника.`;
      this.updateCharCount();
      this.showStatus(`Выбрана тема: ${topic}`, 'success');
      setTimeout(() => $('#messageInput')?.focus(), 50);
    },

    // ===== Send =====
    async sendMessage() {
      if (!this.messageInput.trim() || this.isSending) return;

      const message = this.messageInput.trim();
      this.messageInput = '';
      this.updateCharCount();

      if (!this.currentChat) this.createNewChat();

      this.addMessage('user', message);

      this.currentChat.messages.push({ role: 'user', content: message, timestamp: nowISO() });

      if (this.currentChat.messages.length === 1) {
        this.currentChat.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      }

      this.currentChat.updatedAt = nowISO();
      this.scheduleSaveChats();

      this.isTyping = true;
      this.isSending = true;
      setTypingVisible(true);

      try {
        const response = await this.callMistralAPI(message);

        this.addMessage('assistant', response);

        this.currentChat.messages.push({ role: 'assistant', content: response, timestamp: nowISO() });
        this.currentChat.updatedAt = nowISO();
        this.scheduleSaveChats();

        this.showStatus('Ответ получен!', 'success');

        if (window.appAnimations?.fruitShower) {
          window.appAnimations.fruitShower(this.ecoMode ? 10 : 20);
        } else if (window.animateFruitRain) {
          window.animateFruitRain(this.ecoMode ? 10 : 20);
        }
      } catch (error) {
        console.error('API Error:', error);
        this.handleAPIError(error);
      } finally {
        this.isTyping = false;
        this.isSending = false;
        setTypingVisible(false);
      }
    },

    // ===== API =====
    async callMistralAPI(message) {
      const API_KEY = 'mdrxaCgD40KF6nLH172p9vN59EFJRnhP';
      const API_URL = 'https://api.mistral.ai/v1/chat/completions';

      const messages = [
        {
          role: 'system',
          content: `Ты - Фруктик, дружелюбный AI помощник для детей школьного возраста. Твои задачи:
1. Помогать с учебой (математика, русский язык, окружающий мир и т.д.)
2. Объяснять сложные темы простыми словами
3. Проверять задания на ошибки
4. Мотивировать и поддерживать
5. Использовать эмодзи для дружелюбного общения
6. Всегда быть вежливым и терпеливым
7. Давать развернутые, но понятные ответы
8. Использовать правильное форматирование математических выражений:
 - Дроби: ½ или 3/4
 - Степени: x², a³
 - Квадратный корень: √25
 - Математические символы: ×, ÷, ±, ≈, ≠, ≤, ≥
 - Греческие буквы: π, α, β, γ
9. Использовать KaTeX для сложных математических формул:
 - Инлайн формулы: $E = mc^2$
 - Отдельные формулы: $$\\\\int_{a}^{b} f(x) dx$$
10. Объяснять математические понятия как в учебниках
11. Не давать ответы напрямую, а подталкивать к решению
12. Соблюдать законодательство РФ
13. Если в сообщении ребёнка есть грамматическая ошибка то обращать на неё внимание и объяснять как писать правильно
Твой характер: добрый, умный, терпеливый, с чувством юмора.`
        },
        ...this.currentChat.messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages,
          max_tokens: 800,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Ошибка API');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    },

    handleAPIError(error) {
      let message = 'Ошибка при получении ответа';
      const msg = String(error?.message || '');

      if (msg.includes('401') || msg.toLowerCase().includes('authentication')) {
        message = 'Используется тестовый ключ, попробуйте позже';
      } else if (msg.includes('429')) {
        message = 'Слишком много запросов. Попробуйте позже.';
      } else if (msg.toLowerCase().includes('network')) {
        message = 'Проблемы с сетью. Проверьте подключение.';
      }

      this.showStatus(message, 'error');
      this.addMessage('assistant', `Извини, произошла ошибка: ${message}. Попробуй еще раз! 🍓`);
    },

    // ===== Fruit rain =====
    startFruitRain() {
      this.stopFruitRain();

      if (window.FruitRainEngine?.start) {
        this.fruitRainInterval = window.FruitRainEngine.start({ eco: this.ecoMode });
        return;
      }

      if (window.appAnimations?.startContinuousFruitRain) {
        this.fruitRainInterval = window.appAnimations.startContinuousFruitRain();
        return;
      }

      // fallback: лёгкий дождь
      const createFruit = () => {
        if (document.hidden) return;
        const rain = document.getElementById('fruitRain');
        if (!rain) return;

        const fruit = document.createElement('div');
        fruit.className = this.ecoMode ? 'fruit eco-fruit' : 'fruit';
        fruit.textContent = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';
        fruit.style.position = 'fixed';
        fruit.style.top = '-100px';
        fruit.style.left = `${Math.random() * 100}vw`;
        fruit.style.fontSize = this.ecoMode ? '20px' : `${Math.floor(Math.random() * 24 + 24)}px`;
        fruit.style.opacity = this.ecoMode ? '0.3' : String(Math.random() * 0.4 + 0.3);
        fruit.style.pointerEvents = 'none';
        fruit.style.animation = `${this.ecoMode ? 'fruit-drop-simple' : 'fruit-drop'} ${this.ecoMode ? 1.5 : 2}s linear 0ms forwards`;
        fruit.addEventListener('animationend', () => fruit.remove(), { once: true });
        rain.appendChild(fruit);
      };

      // старт + интервал
      for (let i = 0; i < 8; i++) setTimeout(createFruit, i * 150);
      this.fruitRainInterval = setInterval(createFruit, this.ecoMode ? 1000 : 400);
    },

    stopFruitRain() {
      if (window.FruitRainEngine?.stop) window.FruitRainEngine.stop();
      if (this.fruitRainInterval) {
        clearInterval(this.fruitRainInterval);
        this.fruitRainInterval = null;
      }
    },

    // ===== Facts modal =====
    showRandomFact(category = null) {
      openModal('factsModal');

      let list = this.interestingFacts;
      if (category) list = this.interestingFacts.filter(f => f.category === category);
      if (!list.length) list = this.interestingFacts;

      const fact = list[Math.floor(Math.random() * list.length)];

      const fruitIconEl = document.getElementById('factFruitIcon');
      if (fruitIconEl) {
        fruitIconEl.textContent = window.getFactIconByCategory
          ? window.getFactIconByCategory(fact.category)
          : (window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓');
      }

      const catEl = document.getElementById('factCategory');
      if (catEl) {
        const names = {
          science: '🔬 Наука',
          nature: '🌿 Природа',
          space: '🚀 Космос',
          history: '🏛️ История',
          tech: '💻 Технологии'
        };
        catEl.innerHTML = `<span class="category-badge category-${fact.category}">${names[fact.category] || '📚 Факт'}</span>`;
        if (window.appAnimations?.animateFactCategory) window.appAnimations.animateFactCategory(catEl);
      }

      const textEl = document.getElementById('factText');
      if (textEl) {
        textEl.textContent = fact.text;
        if (window.appAnimations?.animateFactText) window.appAnimations.animateFactText(textEl);
      }

      const numEl = document.getElementById('factNumber');
      if (numEl) {
        const idx = this.interestingFacts.findIndex(f => f.text === fact.text) + 1;
        numEl.textContent = String(idx);
        if (window.appAnimations?.animateFactCounter) window.appAnimations.animateFactCounter(numEl);
      }

      if (fruitIconEl && window.appAnimations?.animateFactIcon) window.appAnimations.animateFactIcon(fruitIconEl);

      if (window.appAnimations?.fruitShower) window.appAnimations.fruitShower(this.ecoMode ? 5 : 10);
    },

    closeFactsModal() {
      closeModal('factsModal');
      setTimeout(() => $('#messageInput')?.focus(), 100);
    },

    shareFact() {
      const factText = document.getElementById('factText')?.textContent;
      if (!factText) return;

      const shareText = `🍓 Интересный факт от Фруктик Чата:\n\n${factText}\n\nПопробуй Фруктик Чат - AI помощник для учёбы!`;

      if (navigator.share) {
        navigator.share({ title: 'Интересный факт', text: shareText, url: window.location.href })
          .then(() => this.showStatus('Факт успешно отправлен!', 'success'))
          .catch(() => this.fallbackCopy(shareText));
      } else {
        this.fallbackCopy(shareText);
      }
    },

    fallbackCopy(text) {
      navigator.clipboard.writeText(text)
        .then(() => this.showStatus('Факт скопирован в буфер обмена!', 'success'))
        .catch(() => this.showStatus('Не удалось скопировать факт', 'error'));
    },

    // ===== Status =====
    showStatus(message, type = 'info') {
      const el = document.getElementById('statusMessage');
      if (!el) return;

      el.textContent = message;
      el.className = `status-message status-${type}`;
      el.classList.add('show');

      setTimeout(() => el.classList.remove('show'), 3000);
    },

    // ===== Preview/time =====
    getChatPreview(chat) {
      if (!chat.messages?.length) return 'Нет сообщений';
      const last = chat.messages[chat.messages.length - 1];
      const content = last.content.length > 40 ? last.content.substring(0, 40) + '...' : last.content;
      return last.role === 'user' ? `Вы: ${content}` : `Фруктик: ${content}`;
    },

    formatTime(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) return 'только что';
      if (diff < 3600000) return Math.floor(diff / 60000) + ' мин назад';
      if (diff < 86400000) return Math.floor(diff / 3600000) + ' ч назад';
      if (diff < 172800000) return 'вчера';

      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    },

    // ===== User icon =====
    generateUserFruitIcon() {
      const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍉', '🍌', '🥭', '🍍', '🥝'];
      this.userFruitIcon = fruits[Math.floor(Math.random() * fruits.length)];
      localStorage.setItem('userFruitIcon', this.userFruitIcon);
    },

    // ===== Events =====
    setupEventListeners() {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stopFruitRain();
        else this.startFruitRain();
      });

      window.addEventListener('beforeunload', (e) => {
        if (this.isSending) {
          e.preventDefault();
          e.returnValue = '';
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeWelcomeModal();
          this.closeFactsModal();
          this.closeClearConfirmModal();
          this.closeSidebar();
        }
      });

      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target !== overlay) return;
          const modal = overlay.closest('.modal');
          if (!modal) return;

          if (modal.id === 'welcomeModal') this.closeWelcomeModal();
          if (modal.id === 'factsModal') this.closeFactsModal();
          if (modal.id === 'clearConfirmModal') this.closeClearConfirmModal();
        });
      });
    },

    // ===== Data providers (ОБНОВЛЕНО с новыми фактами) =====
    _getFacts() {
      return [
        // Наука
        { category: 'science', text: 'Человеческое тело содержит достаточно углерода, чтобы сделать 900 карандашей.' },
        { category: 'science', text: 'Свету от Солнца нужно 8 минут 20 секунд, чтобы достичь Земли.' },
        { category: 'science', text: 'Венера - единственная планета, которая вращается против часовой стрелки.' },
        { category: 'science', text: 'Человеческий мозг на 73% состоит из воды.' },
        { category: 'science', text: 'У медуз нет мозга, сердца и костей.' },
        { category: 'science', text: 'Атомы на 99.9999999999999% состоят из пустого пространства.' },
        { category: 'science', text: 'Земля - единственная планета, не названная в честь бога.' },
        { category: 'science', text: 'Один день на Венере длится дольше, чем год на Венере.' },
        { category: 'science', text: 'Банан - это ягода, а клубника - нет.' },
        { category: 'science', text: 'У улитки около 25 000 зубов.' },
        { category: 'science', text: 'Осьминог имеет три сердца.' },
        { category: 'science', text: 'Стекло разлагается более 1 000 000 лет.' },
        { category: 'science', text: 'Молния в пять раз горячее, чем поверхность Солнца.' },
        { category: 'science', text: 'В одном литре морской воды содержится около 13 миллиардных грамма золота.' },
        { category: 'science', text: 'Сердце кита бьется только 9 раз в минуту.' },
        { category: 'science', text: 'Муравьи никогда не спят.' },
        { category: 'science', text: 'Пчелы могут распознавать человеческие лица.' },
        { category: 'science', text: 'У жирафа и человека одинаковое количество шейных позвонков - семь.' },
        { category: 'science', text: 'Комаров привлекает запах людей, которые недавно ели бананы.' },
        { category: 'science', text: 'Змеи могут спать до 3 лет подряд.' },
        
        // Новые факты о науке
        { category: 'science', text: 'Кровь человека содержит около 0.2 мг золота.' },
        { category: 'science', text: 'Человеческий нос может запомнить 50 000 различных запахов.' },
        { category: 'science', text: 'Сердцебиение синего кита можно услышать на расстоянии 3 километров.' },
        { category: 'science', text: 'У человека 46 хромосом, у картофеля - 48.' },
        { category: 'science', text: 'В мире больше живых людей, чем общее количество умерших за всю историю.' },
        { category: 'science', text: 'Глаз страуса больше, чем его мозг.' },
        { category: 'science', text: 'Акулы существуют на Земле дольше, чем деревья.' },
        { category: 'science', text: 'У панд нет постоянного места для сна.' },
        { category: 'science', text: 'Оргазм свиньи длится 30 минут.' },
        { category: 'science', text: 'Сердце креветки находится в ее голове.' },
        { category: 'science', text: 'У морских коньков беременеют самцы, а не самки.' },
        { category: 'science', text: 'Бабочки пробуют пищу ногами.' },
        { category: 'science', text: 'Глаз у страуса весит больше, чем его мозг.' },
        { category: 'science', text: 'Крокодилы не могут высовывать язык.' },
        { category: 'science', text: 'Жирафы могут чистить уши своим языком.' },
        { category: 'science', text: 'Сердце ежа бьется в среднем 300 раз в минуту.' },
        { category: 'science', text: 'У золотой рыбки память длится 3 секунды.' },
        { category: 'science', text: 'Пингвины могут прыгать на высоту до 2 метров.' },
        { category: 'science', text: 'Ленивцы спускаются с деревьев только раз в неделю.' },
        { category: 'science', text: 'У белых медведей черная кожа под белым мехом.' },

        // Природа
        { category: 'nature', text: 'Деревья общаются друг с другом через подземную сеть грибов.' },
        { category: 'nature', text: 'Морские выдры держатся за руки во время сна, чтобы их не унесло течением.' },
        { category: 'nature', text: 'Некоторые растения могут "слышать", когда их едят гусеницы.' },
        { category: 'nature', text: 'Панда проводит 14 часов в день за едой бамбука.' },
        { category: 'nature', text: 'Радуга на самом деле круглая, а не полукруглая.' },
        { category: 'nature', text: 'Существуют грибы, которые светятся в темноте.' },
        { category: 'nature', text: 'Некоторые кактусы могут жить до 200 лет.' },
        { category: 'nature', text: 'Пингвины могут прыгать в высоту до 2 метров.' },
        { category: 'nature', text: 'У белых медведей черная кожа под белым мехом.' },
        { category: 'nature', text: 'Дельфины дают друг другу имена.' },
        { category: 'nature', text: 'Бабочки пробуют пищу ногами.' },
        { category: 'nature', text: 'Крокодилы не могут высунуть язык.' },
        { category: 'nature', text: 'Слоны - единственные млекопитающие, которые не умеют прыгать.' },
        { category: 'nature', text: 'У улиток могут отрастать новые глаза.' },
        { category: 'nature', text: 'Морские звезды могут отращивать новые конечности.' },
        { category: 'nature', text: 'Паутина паука в 5 раз прочнее стали той же толщины.' },
        { category: 'nature', text: 'Полярные медведи имеют прозрачный мех, а не белый.' },
        { category: 'nature', text: 'Некоторые виды лягушек могут замерзать и оттаивать без вреда для здоровья.' },
        { category: 'nature', text: 'Растения растут быстрее под приятную музыку.' },
        { category: 'nature', text: 'Один дуб может дать до 10 000 желудей за год.' },
        
        // Новые факты о природе
        { category: 'nature', text: 'Некоторые виды бабочек пьют слезы черепах.' },
        { category: 'nature', text: 'У коалы отпечатки пальцев почти идентичны человеческим.' },
        { category: 'nature', text: 'Дерево секвойя может жить до 3000 лет.' },
        { category: 'nature', text: 'Муравьи-листорезы выращивают грибы в своих муравейниках.' },
        { category: 'nature', text: 'Океаны содержат 99% жизненного пространства на Земле.' },
        { category: 'nature', text: 'Колибри - единственная птица, которая может летать назад.' },
        { category: 'nature', text: 'У жирафа такое же количество шейных позвонков, как у человека - 7.' },
        { category: 'nature', text: 'Змеи чувствуют запах языком.' },
        { category: 'nature', text: 'Полярные сияния возникают на высоте 80-1000 км над Землей.' },
        { category: 'nature', text: 'Коала спит 18-22 часа в сутки.' },
        { category: 'nature', text: 'Некоторые виды деревьев "плачут" при повреждении.' },
        { category: 'nature', text: 'У осьминога три сердца и голубая кровь.' },
        { category: 'nature', text: 'Самое большое дерево на Земле - секвойя высотой 115 метров.' },
        { category: 'nature', text: 'Водопад Анхель в Венесуэле самый высокий в мире - 979 метров.' },
        { category: 'nature', text: 'Растение Венерина мухоловка закрывает свои ловушки за 0.1 секунды.' },
        { category: 'nature', text: 'Некоторые виды грибов могут разлагать пластик.' },
        { category: 'nature', text: 'Коралловые рифы - самые большие живые структуры на Земле.' },
        { category: 'nature', text: 'Сок клена можно превратить в сироп, но для 1 литра нужно 40 литров сока.' },
        { category: 'nature', text: 'Некоторые виды мхов могут выжить в космосе.' },
        { category: 'nature', text: 'Самое старое дерево в мире - сосна возрастом 5067 лет.' },

        // Космос
        { category: 'space', text: 'В космосе нет звука - абсолютная тишина.' },
        { category: 'space', text: 'На Луне есть следы астронавтов, которые останутся там миллионы лет.' },
        { category: 'space', text: 'Солнце составляет 99.86% массы всей Солнечной системы.' },
        { category: 'space', text: 'В космосе металлы сплавляются без нагрева.' },
        { category: 'space', text: 'На Сатурне и Юпитере идут дожди из алмазов.' },
        { category: 'space', text: 'Существует планета, полностью состоящая из льда и горящая огнем.' },
        { category: 'space', text: 'Один день на Меркурии равен 59 земным дням.' },
        { category: 'space', text: 'В космосе астронавты могут вырасти на 5 см.' },
        { category: 'space', text: 'Нейтронная звезда весом с чайную ложку весила бы на Земле 10 миллионов тонн.' },
        { category: 'space', text: 'Все планеты Солнечной системы могли бы поместиться между Землей и Луной.' },
        { category: 'space', text: 'Существуют звезды, которые холоднее человеческого тела.' },
        { category: 'space', text: 'В галактике Млечный Путь около 100 миллиардов звезд.' },
        { category: 'space', text: 'Свет от ближайшей звезды (Проксима Центавра) идет до нас 4.2 года.' },
        { category: 'space', text: 'На Марсе самый большой вулкан в Солнечной системе - Олимп высотой 21 км.' },
        { category: 'space', text: 'В космосе нет ни верха, ни низа.' },
        { category: 'space', text: 'Луна удаляется от Земли на 3.8 см каждый год.' },
        { category: 'space', text: 'В космосе можно плакать, но слезы не стекают, а остаются в глазах.' },
        { category: 'space', text: 'Существует планета, где идут стеклянные дожди.' },
        { category: 'space', text: 'Самый большой известный астероид весит примерно 939 000 000 000 000 тонн.' },
        { category: 'space', text: 'МКС облетает Землю за 90 минут.' },
        
        // Новые факты о космосе
        { category: 'space', text: 'На Луне есть запах, похожий на порох.' },
        { category: 'space', text: 'Солнечная система движется со скоростью 828 000 км/ч.' },
        { category: 'space', text: 'На Юпитере и Сатурне идет дождь из гелия.' },
        { category: 'space', text: 'Венера отражает больше света, чем любая другая планета.' },
        { category: 'space', text: 'Сатурн не единственная планета с кольцами: Юпитер, Уран и Нептун тоже имеют кольца.' },
        { category: 'space', text: 'На Луне есть вода в виде льда в кратерах.' },
        { category: 'space', text: 'Марс имеет самый большой каньон в Солнечной системе - Долина Маринер.' },
        { category: 'space', text: 'Нейтронные звезды вращаются со скоростью до 700 раз в секунду.' },
        { category: 'space', text: 'Черные дыры "испаряются" благодаря излучению Хокинга.' },
        { category: 'space', text: 'Кометы имеют два хвоста: газовый и пылевой.' },
        { category: 'space', text: 'Юпитер защищает Землю от многих астероидов.' },
        { category: 'space', text: 'На Титане, спутнике Сатурна, идут метановые дожди.' },
        { category: 'space', text: 'Солнце делает полный оборот вокруг центра Галактики за 225-250 млн лет.' },
        { category: 'space', text: 'На Венере день длиннее года.' },
        { category: 'space', text: 'Луна постепенно удаляется от Земли на 3.8 см в год.' },
        { category: 'space', text: 'Самый большой вулкан в Солнечной системе - Олимп на Марсе.' },
        { category: 'space', text: 'На Нептуне дуют самые сильные ветра - до 2100 км/ч.' },
        { category: 'space', text: 'Меркурий - самая быстрая планета, обращается вокруг Солнца за 88 дней.' },
        { category: 'space', text: 'Плутон меньше, чем Россия по площади.' },
        { category: 'space', text: 'Во Вселенной больше звезд, чем песчинок на всех пляжах Земли.' },

        // История
        { category: 'history', text: 'Клеопатра жила ближе ко времени высадки на Луне, чем ко времени строительства пирамид.' },
        { category: 'history', text: 'В Древнем Риме мочились в рот для чистки зубов.' },
        { category: 'history', text: 'Наполеон боялся кошек.' },
        { category: 'history', text: 'Пирамиды были построены оплачиваемыми рабочими, а не рабами.' },
        { category: 'history', text: 'В средние века кроликов считали рыбой, чтобы их можно было есть во время поста.' },
        { category: 'history', text: 'Джордж Вашингтон выращивал марихуану на своей плантации.' },
        { category: 'history', text: 'Древние египтяне спали на подушках из камня.' },
        { category: 'history', text: 'В викторианскую эпоху было модно делать украшения из волос умерших родственников.' },
        { category: 'history', text: 'Шекспир придумал более 1700 слов английского языка.' },
        { category: 'history', text: 'В древней Спарте было больше рабов, чем свободных граждан.' },
        { category: 'history', text: 'Римские императоры иногда назначали своих лошадей консулами.' },
        { category: 'history', text: 'В древнем Китае врачи получали зарплату только, когда пациенты были здоровы.' },
        { category: 'history', text: 'Альберт Эйнштейн мог стать президентом Израиля, но отказался.' },
        { category: 'history', text: 'В 19 веке кетчуп продавался как лекарство.' },
        { category: 'history', text: 'Древние греки использовали оливковое масло вместо мыла.' },
        { category: 'history', text: 'В средневековой Европе считали, что помидоры ядовиты.' },
        { category: 'history', text: 'Наполеон проиграл битву при Ватерлоо из-за геморроя.' },
        { category: 'history', text: 'В Древнем Египте фараоны никогда не показывали свои волосы.' },
        { category: 'history', text: 'Винстон Черчилль выпивал бутылку коньяка каждый день.' },
        { category: 'history', text: 'Древние римляни использовали паутину как пластырь для ран.' },
        
        // Новые факты об истории
        { category: 'history', text: 'В Древнем Риме в качестве ополаскивателя для рта использовали мочу.' },
        { category: 'history', text: 'В 18 веке в Европе парики посыпали мукой для белизны.' },
        { category: 'history', text: 'Первая в мире пишущая машинка была создана для слепой женщины.' },
        { category: 'history', text: 'В 19 веке таблетки от кашля содержали героин.' },
        { category: 'history', text: 'Во время Второй мировой войны морковь рекламировали как продукт, улучшающий ночное зрение.' },
        { category: 'history', text: 'В Древнем Египте фараонов хоронили с фигурками слуг.' },
        { category: 'history', text: 'Римские гладиаторы редко сражались насмерть.' },
        { category: 'history', text: 'Викинги использовали солнечный камень для навигации в пасмурную погоду.' },
        { category: 'history', text: 'В средневековой Европе апельсины были доступны только богачам.' },
        { category: 'history', text: 'Первый компьютерный вирус был создан в 1983 году.' },
        { category: 'history', text: 'В 19 веке Лондон был покрыт слоем конского навоза толщиной до 3 метров.' },
        { category: 'history', text: 'Древние майя играли в мяч с человеческими черепами.' },
        { category: 'history', text: 'В Древней Греции олимпийцы соревновались обнаженными.' },
        { category: 'history', text: 'Наполеон был ниже среднего роста своего времени.' },
        { category: 'history', text: 'В Викторианскую эпоху женщины ели мышьяк для бледности кожи.' },
        { category: 'history', text: 'Древние китайцы использовали бумажные деньги уже в 7 веке.' },
        { category: 'history', text: 'В 17 веке тюльпаны в Голландии стоили дороже домов.' },
        { category: 'history', text: 'Древние римляне чистили зубы моче.' },
        { category: 'history', text: 'В 18 веке в Париже можно было арендовать кошку для ловли мышей.' },
        { category: 'history', text: 'Первый автомобильный штраф выписали в 1896 году за скорость 13 км/ч.' },

        // Технологии
        { category: 'tech', text: 'Первый компьютерный вирус был создан в 1983 году.' },
        { category: 'tech', text: 'Пароль "123456" остается самым популярным в мире.' },
        { category: 'tech', text: 'Первая компьютерная мышь была сделана из дерева.' },
        { category: 'tech', text: 'Каждый день отправляется около 300 миллиардов электронных писем.' },
        { category: 'tech', text: 'Первый сайт в интернете до сих пор работает (info.cern.ch).' },
        { category: 'tech', text: 'У YouTube было первое видео с зоопарком длиной 18 секунд.' },
        { category: 'tech', text: 'Смартфон имеет больше вычислительной мощности, чем компьютеры NASA в 1969 году.' },
        { category: 'tech', text: 'Wi‑Fi был изобретен актрисой Хеди Ламарр.' },
        { category: 'tech', text: 'Первая камера на телефоне могла делать фотографии размером 0.1 мегапикселя.' },
        { category: 'tech', text: 'Каждую минуту на YouTube загружается 500 часов видео.' },
        { category: 'tech', text: 'Первый компьютер весил более 27 тонн.' },
        { category: 'tech', text: 'У Google есть козлы для стрижки травы в своем кампусе.' },
        { category: 'tech', text: 'Первый твит был отправлен 21 марта 2006 года.' },
        { category: 'tech', text: '80% фотографий в интернете - это кошки.' },
        { category: 'tech', text: 'Айфон разблокируют около 80 раз в день.' },
        { category: 'tech', text: 'Первый домен в интернете был symbolics.com.' },
        { category: 'tech', text: 'У Amazon изначально назывался Cadabra.' },
        { category: 'tech', text: 'Первый iPod мог хранить около 1000 песен.' },
        { category: 'tech', text: 'Windows 95 стоила 210 долларов при выпуске.' },
        { category: 'tech', text: 'Первый смайлик :-) был использован в 1982 году.' },
        
        // Новые факты о технологиях
        { category: 'tech', text: 'Первый компьютерный баг был реальным насекомым - мотыльком.' },
        { category: 'tech', text: 'Изначально Google назывался BackRub.' },
        { category: 'tech', text: 'Первый логотип Apple изображал Исаака Ньютона под яблоней.' },
        { category: 'tech', text: 'Первый телефонный звонок был сделан Александром Беллом в 1876 году.' },
        { category: 'tech', text: 'Первая веб-камера была создана для наблюдения за кофеваркой.' },
        { category: 'tech', text: 'Первый гигабайтный жесткий диск весил 250 кг и стоил 40 000 долларов.' },
        { category: 'tech', text: 'Первый компьютерный вирус назывался "Brain" и был создан в Пакистане.' },
        { category: 'tech', text: 'У первого iPhone не было магазина приложений.' },
        { category: 'tech', text: 'Первое SMS было отправлено в 1992 году и содержало текст "Счастливого Рождества".' },
        { category: 'tech', text: 'Первый компьютерный пароль был придуман в 1961 году.' },
        { category: 'tech', text: 'Первый DVD-диск мог хранить 4.7 ГБ данных.' },
        { category: 'tech', text: 'Первая компьютерная игра была создана в 1962 году и называлась Spacewar!' },
        { category: 'tech', text: 'Первый домен .com был зарегистрирован 15 марта 1985 года.' },
        { category: 'tech', text: 'Первый поисковик назывался Archie и был создан в 1990 году.' },
        { category: 'tech', text: 'Первый компьютер Apple был собран в гараже.' },
        { category: 'tech', text: 'Первый ноутбук весил 11 кг и стоил 1795 долларов.' },
        { category: 'tech', text: 'Первый USB-флеш-накопитель имел емкость 8 МБ.' },
        { category: 'tech', text: 'Первая компьютерная мышь стоила 400 долларов.' },
        { category: 'tech', text: 'Первый компьютер с цветным монитором появился в 1977 году.' },
        { category: 'tech', text: 'Первая кассета VHS могла записывать 2 часа видео.' }
      ];
    },

    _getTopics() {
      return [
        // Математика
        'Дроби и их сложение',
        'Умножение и деление двузначных чисел',
        'Площадь прямоугольника и квадрата',
        'Объем куба и параллелепипеда',
        'Десятичные дроби',
        'Проценты и их вычисление',
        'Обыкновенные дроби',
        'Квадратные уравнения',
        'Теорема Пифагора',
        'Подобные треугольники',
        'Системы линейных уравнений',
        'Функции и графики',
        'Тригонометрия: синус, косинус, тангенс',
        'Логарифмы и их свойства',
        'Производная функции',
        'Интегралы',
        'Вероятность и статистика',
        'Комбинаторика',
        'Векторы на плоскости',
        'Метод математической индукции',

        // Русский язык
        'Части речи в русском языке',
        'Имя существительное: род, число, падеж',
        'Имя прилагательное: степени сравнения',
        'Глагол: время, лицо, спряжение',
        'Причастие и деепричастие',
        'Наречие и его разряды',
        'Синтаксис: предложение и словосочетание',
        'Пунктуация: запятые, тире, двоеточия',
        'Орфография: правописание приставок',
        'Правописание НЕ и НИ с разными частями речи',
        'Сложные предложения',
        'Прямая и косвенная речь',
        'Стили речи: разговорный, научный, художественный',
        'Фонетика: звуки и буквы',
        'Морфемика: состав слова',
        'Лексика: синонимы, антонимы, омонимы',
        'Фразеологизмы русского языка',
        'Словообразование',
        'Текст и его строение',
        'Изложение и сочинение',

        // Физика
        'Механическое движение',
        'Законы Ньютона',
        'Закон всемирного тяготения',
        'Электрический ток',
        'Закон Ома',
        'Магнитное поле',
        'Световые волны',
        'Оптические явления',
        'Тепловые явления',
        'Давление твердых тел, жидкостей и газов',
        'Работа и мощность',
        'Энергия: кинетическая и потенциальная',
        'Ядерная физика',
        'Квантовая физика',
        'Относительность движения',

        // Химия
        'Периодическая таблица Менделеева',
        'Химические элементы',
        'Химические реакции',
        'Кислоты и основания',
        'Соли и их свойства',
        'Органическая химия',
        'Неорганическая химия',
        'Строение атома',
        'Химическая связь',
        'Растворы и их концентрация',

        // Биология
        'Строение клетки',
        'Фотосинтез',
        'Дыхание растений и животных',
        'Строение человека: органы и системы',
        'Генетика и наследственность',
        'Эволюция видов',
        'Экосистемы и пищевые цепи',
        'Вирусы и бактерии',
        'Растения: строение и классификация',
        'Животные: беспозвоночные и позвоночные',
        'Зоология: насекомые, рыбы, птицы, млекопитающие',
        'Ботаника: водоросли, мхи, папоротники, цветковые',
        'Анатомия человека',
        'Физиология человека',
        'Экология и охрана природы',

        // История
        'Древний Египет',
        'Древняя Греция',
        'Древний Рим',
        'Средневековье',
        'Эпоха Возрождения',
        'Великие географические открытия',
        'Первая мировая война',
        'Вторая мировая война',
        'Холодная война',
        'История России: от Рюрика до наших дней',

        // География
        'Строение Земли',
        'Атмосфера и климат',
        'Гидросфера: океаны, моря, реки',
        'Литосфера: горы, равнины, вулканы',
        'Материки и океаны',
        'Природные зоны Земли',
        'Население Земли',
        'Экономическая география',
        'Политическая карта мира',
        'География России',

        // Новые темы (математика)
        'Квадратные уравнения и их решение через дискриминант',
        'Тригонометрические функции и их графики',
        'Производная и ее применение в исследовании функций',
        'Первообразная и интеграл',
        'Комбинаторика: размещения, перестановки, сочетания',
        'Теория вероятностей: случайные события, вероятность',
        'Векторы в пространстве',
        'Многогранники: призма, пирамида',
        'Тела вращения: цилиндр, конус, шар',
        'Стереометрия: взаимное расположение прямых и плоскостей в пространстве',

        // Новые темы (информатика)
        'Основы алгоритмизации',
        'Языки программирования: Python, JavaScript',
        'Базы данных и SQL',
        'Веб-разработка: HTML, CSS',
        'Кибербезопасность',
        'Искусственный интеллект и машинное обучение',
        'Компьютерные сети',
        'Операционные системы',
        'Структуры данных',
        'Объектно-ориентированное программирование',

        // Новые темы (литература)
        'Русские народные сказки',
        'Басни Крылова',
        'Творчество Пушкина',
        'Лирика Лермонтова',
        'Романы Толстого',
        'Рассказы Чехова',
        'Поэзия Серебряного века',
        'Современная литература',
        'Зарубежная классика',
        'Детская литература',

        // Новые темы (обществознание)
        'Гражданское общество',
        'Права и обязанности граждан',
        'Экономические системы',
        'Политические партии',
        'Международные отношения',
        'Культура и традиции народов',
        'Социальные институты',
        'Глобальные проблемы человечества',
        'Правовое государство',
        'Рыночная экономика',

        // Новые темы (искусство)
        'Живопись эпохи Возрождения',
        'Русские художники-передвижники',
        'Музыкальные жанры',
        'Классическая музыка',
        'Театральное искусство',
        'Кинематограф',
        'Архитектурные стили',
        'Народные промыслы России',
        'Современное искусство',
        'Дизайн и его виды',

        // Новые темы (спорт и здоровье)
        'Основы здорового образа жизни',
        'Виды спорта: легкая атлетика, плавание',
        'Олимпийские игры',
        'Первая медицинская помощь',
        'Профилактика заболеваний',
        'Правильное питание',
        'Физическая культура',
        'История спорта',
        'Знаменитые спортсмены',
        'Спортивные соревнования'
      ];
    }
  };
}
