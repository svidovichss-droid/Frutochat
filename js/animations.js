// Анимации для приложения
window.appAnimations = {
    // Анимация входа сообщения
    animateMessageIn: function(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    },
    
    // Анимация праздничных фруктов
    celebrate: function() {
        // Только фруктовый дождь
        this.fruitShower(50);
    },
    
    // Анимация фруктового дождя
    fruitShower: function(count = 30) {
        const fruitRain = document.getElementById('fruitRain');
        if (!fruitRain) return;
        
        const getIcon = window.getRandomFruitIcon || (() => '🍓');
        
        for (let i = 0; i < count; i++) {
            const fruit = document.createElement('div');
            fruit.className = 'fruit';
            fruit.textContent = getIcon();
            fruit.style.position = 'fixed';
            fruit.style.top = '-100px';
            fruit.style.left = Math.random() * window.innerWidth + 'px';
            fruit.style.fontSize = (Math.random() * 24 + 24) + 'px';
            fruit.style.zIndex = '1';
            fruit.style.pointerEvents = 'none';
            fruit.style.animation = 'fruit-drop ' + (Math.random() * 1.5 + 1) + 's linear forwards';
            
            fruit.addEventListener('animationend', function() {
                if (fruit.parentNode === fruitRain) {
                    fruit.remove();
                }
            }, { once: true });
            
            fruitRain.appendChild(fruit);
        }
    },
    
    // Запуск непрерывного фруктового дождя
    startContinuousFruitRain: function() {
        const fruitRain = document.getElementById('fruitRain');
        if (!fruitRain) return null;
        
        const getIcon = window.getRandomFruitIcon || (() => '🍓');
        
        const intervalId = setInterval(() => {
            if (document.hidden) return; // Не создавать фрукты, если вкладка неактивна
            
            const fruit = document.createElement('div');
            fruit.className = 'fruit';
            fruit.textContent = getIcon();
            fruit.style.position = 'fixed';
            fruit.style.top = '-100px';
            fruit.style.left = Math.random() * 100 + 'vw';
            fruit.style.fontSize = (Math.random() * 24 + 24) + 'px';
            fruit.style.zIndex = '1';
            fruit.style.pointerEvents = 'none';
            fruit.style.animation = 'fruit-drop ' + (Math.random() * 1.5 + 1) + 's linear forwards';
            
            fruit.addEventListener('animationend', function() {
                if (fruit.parentNode === fruitRain) {
                    fruit.remove();
                }
            }, { once: true });
            
            fruitRain.appendChild(fruit);
        }, 400);
        
        return intervalId;
    },
    
    // Праздничный фруктовый эффект
    celebrateWithFruits: function() {
        this.fruitShower(30);
    },

    // Добавлена функция для плавного появления элемента
    fadeInElement: function(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration + 10);
    },

    // Анимация для модального окна фактов
    animateFactModal: function(modal) {
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px) scale(0.95)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0) scale(1)';
            }, 10);
        }
    },
    
    // Улучшенная анимация для модального окна фактов
    animateFactModalEnhanced: function(modal) {
        if (!modal) return;
        
        const content = modal.querySelector('.modal-content');
        if (content) {
            // Сбрасываем стили для центрирования
            content.style.position = 'relative';
            content.style.margin = 'auto';
            content.style.opacity = '0';
            content.style.transform = 'translateY(40px) scale(0.95)';
            
            // Используем requestAnimationFrame для плавной анимации
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    content.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0) scale(1)';
                    
                    // Убираем transition после анимации
                    setTimeout(() => {
                        content.style.transition = '';
                    }, 400);
                });
            });
        }
    },

    // Анимация для текста факта
    animateFactText: function(element) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out 0.2s';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
        
        // Удаляем transition после анимации
        setTimeout(() => {
            element.style.transition = '';
        }, 700);
    },

    // Анимация для категории факта
    animateFactCategory: function(element) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.4s ease-out 0.1s';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, 500);
    },

    // Анимация для счетчика фактов
    animateFactCounter: function(element) {
        if (!element) return;
        
        element.classList.add('changed');
        setTimeout(() => {
            element.classList.remove('changed');
        }, 500);
    },

    // Анимация для иконки факта
    animateFactIcon: function(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0) rotate(0deg)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s';
            element.style.transform = 'scale(1) rotate(360deg)';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, 800);
    }
};
