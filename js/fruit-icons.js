// Фруктовые иконки для чата
window.fruitIcons = {
    // Основные фрукты
    main: ['🍓', '🍍', '🍇', '🍉', '🍊', '🍋', '🍌', '🍎', '🍑', '🍒'],
    
    // Сезонные фрукты
    seasonal: ['🥭', '🫐', '🍐', '🥝', '🍈', '🥥', '🌰', '🥭'],
    
    // Веселые фрукты
    fun: ['🍏', '🍅', '🍆', '🥑', '🌽', '🥦', '🥬', '🥒'],
    
    // Иконки для категорий фактов
    science: ['🔬', '🧪', '⚗️', '🧫', '🔭', '⚛️', '🧬', '🦠'],
    nature: ['🌿', '🍃', '🌺', '🌸', '🌼', '🌳', '🐝', '🦋'],
    space: ['🚀', '🪐', '🌕', '🌌', '⭐', '🌠', '☄️', '🛰️'],
    history: ['🏛️', '📜', '⚔️', '👑', '🗿', '🏺', '⚱️', '🕰️'],
    tech: ['💻', '📱', '🔌', '🖥️', '⌨️', '🖱️', '💾', '📡'],
    
    // Все фрукты
    all: function() {
        return [...this.main, ...this.seasonal, ...this.fun];
    },
    
    // Получить случайный фрукт
    random: function() {
        const allFruits = this.all();
        return allFruits[Math.floor(Math.random() * allFruits.length)];
    },
    
    // Получить иконку по категории факта
    getByCategory: function(category) {
        const categoryIcons = {
            'science': ['🔬', '🧪', '⚗️', '🧫', '🔭', '⚛️', '🧬', '🦠', '🌡️', '🧲'],
            'nature': ['🌿', '🍃', '🌺', '🌸', '🌼', '🌳', '🐝', '🦋', '🐞', '🌱'],
            'space': ['🚀', '🪐', '🌕', '🌌', '⭐', '🌠', '☄️', '🛰️', '👨‍🚀', '👩‍🚀'],
            'history': ['🏛️', '📜', '⚔️', '👑', '🗿', '🏺', '⚱️', '🕰️', '🗺️', '🏰'],
            'tech': ['💻', '📱', '🔌', '🖥️', '⌨️', '🖱️', '💾', '📡', '🤖', '⚡'],
            'math': ['📐', '🧮', '🔢', '📏', '➕', '➖', '✖️', '➗', 'π', '∞'],
            'general': ['🍓', '🍍', '🍇', '🍉', '🍊', '🍋', '🍌', '🍎', '🍑', '🍒']
        };
        
        const icons = categoryIcons[category] || categoryIcons.general;
        return icons[Math.floor(Math.random() * icons.length)];
    }
};

// Глобальная функция для получения случайной фруктовой иконки
window.getRandomFruitIcon = function() {
    return window.fruitIcons.random();
};

// Функция для получения иконки по категории факта
window.getFactIconByCategory = function(category) {
    return window.fruitIcons.getByCategory(category);
};

// Функция для анимации фруктового дождя
window.animateFruitRain = function(count = 20) {
    const fruitRain = document.getElementById('fruitRain');
    if (!fruitRain) return;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const fruit = document.createElement('div');
            fruit.className = 'fruit';
            fruit.textContent = window.getRandomFruitIcon();
            fruit.style.left = Math.random() * 100 + 'vw';
            fruit.style.fontSize = (Math.random() * 32 + 24) + 'px';
            fruit.style.opacity = Math.random() * 0.4 + 0.3;
            fruit.style.zIndex = '1';
            fruit.style.animation = 'fruit-drop ' + (Math.random() * 1.5 + 1) + 's linear forwards';
            
            fruitRain.appendChild(fruit);
            
            // Удаляем элемент после анимации
            setTimeout(() => {
                if (fruit.parentNode === fruitRain) {
                    fruit.remove();
                }
            }, (Math.random() * 1500 + 1000));
        }, i * 50);
    }
};

// Функция для праздничного фруктового эффекта
window.celebrateWithFruits = function() {
    // Только фруктовый дождь
    window.animateFruitRain(30);
};

// Инициализация фруктовых эффектов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем фруктовые иконки в заголовок
    const title = document.querySelector('title');
    if (title) {
        setInterval(() => {
            title.textContent = title.textContent.replace(/^🍓\s*/, '') + ' 🍓';
            setTimeout(() => {
                title.textContent = title.textContent.replace(/\s*🍓$/, '');
            }, 1000);
        }, 5000);
    }
});