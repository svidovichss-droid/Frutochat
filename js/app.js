function fruitChatApp() {
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
        firstVisit: true,
        userFruitIcon: '🍓',
        ecoMode: false,
        originalAnimations: null,
        
        // 100 интересных фактов (обновленный список)
        interestingFacts: [
            // Наука (20 фактов)
            {category: 'science', text: 'Человеческое тело содержит достаточно углерода, чтобы сделать 900 карандашей.'},
            {category: 'science', text: 'Свету от Солнца нужно 8 минут 20 секунд, чтобы достичь Земли.'},
            {category: 'science', text: 'Венера - единственная планета, которая вращается против часовой стрелки.'},
            {category: 'science', text: 'Человеческий мозг на 73% состоит из воды.'},
            {category: 'science', text: 'У медуз нет мозга, сердца и костей.'},
            {category: 'science', text: 'Атомы на 99.9999999999999% состоят из пустого пространства.'},
            {category: 'science', text: 'Земля - единственная планета, не названная в честь бога.'},
            {category: 'science', text: 'Один день на Венере длится дольше, чем год на Венере.'},
            {category: 'science', text: 'Банан - это ягода, а клубника - нет.'},
            {category: 'science', text: 'У улитки около 25 000 зубов.'},
            {category: 'science', text: 'Осьминог имеет три сердца.'},
            {category: 'science', text: 'Стекло разлагается более 1 000 000 лет.'},
            {category: 'science', text: 'Молния в пять раз горячее, чем поверхность Солнца.'},
            {category: 'science', text: 'В одном литре морской воды содержится около 13 миллиардных грамма золота.'},
            {category: 'science', text: 'Сердце кита бьется только 9 раз в минуту.'},
            {category: 'science', text: 'Муравьи никогда не спят.'},
            {category: 'science', text: 'Пчелы могут распознавать человеческие лица.'},
            {category: 'science', text: 'У жирафа и человека одинаковое количество шейных позвонков - семь.'},
            {category: 'science', text: 'Комаров привлекает запах людей, которые недавно ели бананы.'},
            {category: 'science', text: 'Змеи могут спать до 3 лет подряд.'},
            
            // Природа (20 фактов)
            {category: 'nature', text: 'Деревья общаются друг с другом через подземную сеть грибов.'},
            {category: 'nature', text: 'Морские выдры держатся за руки во время сна, чтобы их не унесло течением.'},
            {category: 'nature', text: 'Некоторые растения могут "слышать", когда их едят гусеницы.'},
            {category: 'nature', text: 'Панда проводит 14 часов в день за едой бамбука.'},
            {category: 'nature', text: 'Радуга на самом деле круглая, а не полукруглая.'},
            {category: 'nature', text: 'Существуют грибы, которые светятся в темноте.'},
            {category: 'nature', text: 'Некоторые кактусы могут жить до 200 лет.'},
            {category: 'nature', text: 'Пингвины могут прыгать в высоту до 2 метров.'},
            {category: 'nature', text: 'У белых медведей черная кожа под белым мехом.'},
            {category: 'nature', text: 'Дельфины дают друг другу имена.'},
            {category: 'nature', text: 'Бабочки пробуют пищу ногами.'},
            {category: 'nature', text: 'Крокодилы не могут высунуть язык.'},
            {category: 'nature', text: 'Слоны - единственные млекопитающие, которые не умеют прыгать.'},
            {category: 'nature', text: 'У улиток могут отрастать новые глаза.'},
            {category: 'nature', text: 'Морские звезды могут отращивать новые конечности.'},
            {category: 'nature', text: 'Паутина паука в 5 раз прочнее стали той же толщины.'},
            {category: 'nature', text: 'Полярные медведи имеют прозрачный мех, а не белый.'},
            {category: 'nature', text: 'Некоторые виды лягушек могут замерзать и оттаивать без вреда для здоровья.'},
            {category: 'nature', text: 'Растения растут быстрее под приятную музыку.'},
            {category: 'nature', text: 'Один дуб может дать до 10 000 желудей за год.'},
            
            // Космос (20 фактов)
            {category: 'space', text: 'В космосе нет звука - абсолютная тишина.'},
            {category: 'space', text: 'На Луне есть следы астронавтов, которые останутся там миллионы лет.'},
            {category: 'space', text: 'Солнце составляет 99.86% массы всей Солнечной системы.'},
            {category: 'space', text: 'В космосе металлы сплавляются без нагрева.'},
            {category: 'space', text: 'На Сатурне и Юпитере идут дожди из алмазов.'},
            {category: 'space', text: 'Существует планета, полностью состоящая из льда и горящая огнем.'},
            {category: 'space', text: 'Один день на Меркурии равен 59 земным дням.'},
            {category: 'space', text: 'В космосе астронавты могут вырасти на 5 см.'},
            {category: 'space', text: 'Нейтронная звезда весом с чайную ложку весила бы на Земле 10 миллионов тонн.'},
            {category: 'space', text: 'Все планеты Солнечной системы могли бы поместиться между Землей и Луной.'},
            {category: 'space', text: 'Существуют звезды, которые холоднее человеческого тела.'},
            {category: 'space', text: 'В галактике Млечный Путь около 100 миллиардов звезд.'},
            {category: 'space', text: 'Свет от ближайшей звезды (Проксима Центавра) идет до нас 4.2 года.'},
            {category: 'space', text: 'На Марсе самый большой вулкан в Солнечной системе - Олимп высотой 21 км.'},
            {category: 'space', text: 'В космосе нет ни верха, ни низа.'},
            {category: 'space', text: 'Луна удаляется от Земли на 3.8 см каждый год.'},
            {category: 'space', text: 'В космосе можно плакать, но слезы не стекают, а остаются в глазах.'},
            {category: 'space', text: 'Существует планета, где идут стеклянные дожди.'},
            {category: 'space', text: 'Самый большой известный астероид весит примерно 939 000 000 000 000 тонн.'},
            {category: 'space', text: 'МКС облетает Землю за 90 минут.'},
            
            // История (20 фактов)
            {category: 'history', text: 'Клеопатра жила ближе ко времени высадки на Луну, чем ко времени строительства пирамид.'},
            {category: 'history', text: 'В Древнем Риме мочились в рот для чистки зубов.'},
            {category: 'history', text: 'Наполеон боялся кошек.'},
            {category: 'history', text: 'Пирамиды были построены оплачиваемыми рабочими, а не рабами.'},
            {category: 'history', text: 'В средние века кроликов считали рыбой, чтобы их можно было есть во время поста.'},
            {category: 'history', text: 'Джордж Вашингтон выращивал марихуану на своей плантации.'},
            {category: 'history', text: 'Древние египтяни спали на подушках из камня.'},
            {category: 'history', text: 'В викторианскую эпоху было модно делать украшения из волос умерших родственников.'},
            {category: 'history', text: 'Шекспир придумал более 1700 слов английского языка.'},
            {category: 'history', text: 'В древней Спарте было больше рабов, чем свободных граждан.'},
            {category: 'history', text: 'Римские императоры иногда назначали своих лошадей консулами.'},
            {category: 'history', text: 'В древнем Китае врачи получали зарплату только, когда пациенты были здоровы.'},
            {category: 'history', text: 'Альберт Эйнштейн мог стать президентом Израиля, но отказался.'},
            {category: 'history', text: 'В 19 веке кетчуп продавался как лекарство.'},
            {category: 'history', text: 'Древние греки использовали оливковое масло вместо мыла.'},
            {category: 'history', text: 'В средневековой Европе считали, что помидоры ядовиты.'},
            {category: 'history', text: 'Наполеон проиграл битву при Ватерлоо из-за геморроя.'},
            {category: 'history', text: 'В Древнем Египте фараоны никогда не показывали свои волосы.'},
            {category: 'history', text: 'Винстон Черчилль выпивал бутылку коньяка каждый день.'},
            {category: 'history', text: 'Древние римляни использовали паутину как пластырь для ран.'},
            
            // Технологии (20 фактов)
            {category: 'tech', text: 'Первый компьютерный вирус был создан в 1983 году.'},
            {category: 'tech', text: 'Пароль "123456" остается самым популярным в мире.'},
            {category: 'tech', text: 'Первая компьютерная мышь была сделана из дерева.'},
            {category: 'tech', text: 'Каждый день отправляется около 300 миллиардов электронных писем.'},
            {category: 'tech', text: 'Первый сайт в интернете до сих пор работает (info.cern.ch).'},
            {category: 'tech', text: 'У YouTube было первое видео с зоопарком длиной 18 секунд.'},
            {category: 'tech', text: 'Смартфон имеет больше вычислительной мощности, чем компьютеры NASA в 1969 году.'},
            {category: 'tech', text: 'Wi-Fi был изобретен актрисой Хеди Ламарр.'},
            {category: 'tech', text: 'Первая камера на телефоне могла делать фотографии размером 0.1 мегапикселя.'},
            {category: 'tech', text: 'Каждую минуту на YouTube загружается 500 часов видео.'},
            {category: 'tech', text: 'Первый компьютер весил более 27 тонн.'},
            {category: 'tech', text: 'У Google есть козлы для стрижки травы в своем кампусе.'},
            {category: 'tech', text: 'Первый твит был отправлен 21 марта 2006 года.'},
            {category: 'tech', text: '80% фотографий в интернете - это кошки.'},
            {category: 'tech', text: 'Айфон разблокируют около 80 раз в день.'},
            {category: 'tech', text: 'Первый домен в интернете был symbolics.com.'},
            {category: 'tech', text: 'У Amazon изначально назывался Cadabra.'},
            {category: 'tech', text: 'Первый iPod мог хранить около 1000 песен.'},
            {category: 'tech', text: 'Windows 95 стоила 210 долларов при выпуске.'},
            {category: 'tech', text: 'Первый смайлик :-) был использован в 1982 году.'}
        ],
        
        // 100 тем для объяснения
        topics: [
            // Математика (20 тем)
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
            
            // Русский язык (20 тем)
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
            
            // Физика (15 тем)
            'Механическое движение',
            'Законы Ньютона',
            'Закон всемирного тяготения',
            'Электрический ток',
            'Закон Ома',
            'Магнитное поле',
            'Звуковые волны',
            'Свет и оптические явления',
            'Тепловые явления',
            'Давление твердых тел, жидкостей и газов',
            'Работа и мощность',
            'Энергия: кинетическая и потенциальная',
            'Ядерная физика',
            'Квантовая физика',
            'Относительность движения',
            
            // Химия (10 тем)
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
            
            // Биология (15 тем)
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
            
            // История (10 тем)
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
            
            // География (10 тем)
            'Строение Земли',
            'Атмосфера и климат',
            'Гидросфера: океаны, моря, реки',
            'Литосфера: горы, равнины, вулканы',
            'Материки и океаны',
            'Природные зоны Земли',
            'Население Земли',
            'Экономическая география',
            'Политическая карта мира',
            'География России'
        ],
        
        // Computed
        get sortedChats() {
            return [...this.chats].sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
        },
        
        get charCounterClass() {
            if (this.charCount > 900) return 'error';
            if (this.charCount > 800) return 'warning';
            return '';
        },
        
        // Methods
        async init() {
            await this.loadConfig();
            await this.loadChats();
            this.setupEventListeners();
            this.startFruitRain();
            this.updateCharCount();
            this.generateUserFruitIcon();
            
            // Загружаем настройку экономичного режима
            const savedEcoMode = localStorage.getItem('fruitChatEcoMode');
            if (savedEcoMode !== null) {
                this.ecoMode = JSON.parse(savedEcoMode);
                this.applyEcoMode();
            }
            
            // Проверяем устройство на низкую производительность
            this.detectLowPerformance();
            
            // Check if first visit
            const hasVisited = localStorage.getItem('hasVisited');
            if (!hasVisited) {
                this.showWelcomeModal();
                localStorage.setItem('hasVisited', 'true');
            }
            
            // Focus input
            setTimeout(() => {
                document.getElementById('messageInput')?.focus();
            }, 500);
            
            console.log('🍓 Фруктик Чат инициализирован');
        },
        
        // Метод для определения низкой производительности
        detectLowPerformance() {
            // Проверяем наличие прерывистой анимации
            const isLowPerformance = 
                window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
                (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
                (navigator.deviceMemory && navigator.deviceMemory < 4);
            
            if (isLowPerformance && !this.ecoMode) {
                this.ecoMode = true;
                localStorage.setItem('fruitChatEcoMode', JSON.stringify(this.ecoMode));
                this.applyEcoMode();
                this.showStatus('Автоматически включен экономичный режим для улучшения производительности', 'info');
            }
        },
        
        // Метод переключения экономичного режима
        toggleEcoMode() {
            this.ecoMode = !this.ecoMode;
            localStorage.setItem('fruitChatEcoMode', JSON.stringify(this.ecoMode));
            this.applyEcoMode();
            
            if (this.ecoMode) {
                this.showStatus('Экономичный режим включен. Нагрузка на GPU уменьшена.', 'success');
                // Запускаем облегченный дождь
                this.startEcoFruitRain();
            } else {
                this.showStatus('Экономичный режим выключен. Все эффекты восстановлены.', 'success');
                // Запускаем обычный дождь
                this.startFruitRain();
            }
        },
        
        // Метод применения экономичного режима
        applyEcoMode() {
            const body = document.body;
            
            if (this.ecoMode) {
                body.classList.add('eco-mode');
                
                // Останавливаем обычный дождь
                if (this.fruitRainInterval) {
                    clearInterval(this.fruitRainInterval);
                }
                
                // Патчим анимации для экономичного режима
                this.patchAnimationsForEcoMode();
            } else {
                body.classList.remove('eco-mode');
                
                // Восстанавливаем обычные анимации
                this.restoreOriginalAnimations();
            }
        },
        
        // Патчим анимации для экономичного режима
        patchAnimationsForEcoMode() {
            // Сохраняем оригинальные функции
            if (!window._originalAnimations) {
                window._originalAnimations = {
                    fruitShower: window.appAnimations?.fruitShower,
                    startContinuousFruitRain: window.appAnimations?.startContinuousFruitRain,
                    celebrateWithFruits: window.appAnimations?.celebrateWithFruits,
                    fruitShower: window.animateFruitRain || (() => {})
                };
            }
            
            // Облегченная версия фруктового дождя
            if (window.appAnimations) {
                window.appAnimations.fruitShower = function(count = 30) {
                    const fruitRain = document.getElementById('fruitRain');
                    if (!fruitRain || document.body.classList.contains('eco-mode')) return;
                    
                    // Уменьшаем количество фруктов в 3 раза
                    const ecoCount = Math.max(5, Math.floor(count / 3));
                    
                    for (let i = 0; i < ecoCount; i++) {
                        setTimeout(() => {
                            const fruit = document.createElement('div');
                            fruit.className = 'fruit eco-fruit';
                            fruit.textContent = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';
                            fruit.style.position = 'fixed';
                            fruit.style.top = '-100px';
                            fruit.style.left = Math.random() * window.innerWidth + 'px';
                            fruit.style.fontSize = '20px'; // Фиксированный размер
                            fruit.style.zIndex = '1';
                            fruit.style.pointerEvents = 'none';
                            fruit.style.opacity = '0.5'; // Полупрозрачные
                            fruit.style.animation = 'fruit-drop-simple 1s linear forwards';
                            
                            fruitRain.appendChild(fruit);
                            
                            setTimeout(() => {
                                if (fruit.parentNode === fruitRain) {
                                    fruit.remove();
                                }
                            }, 1000);
                        }, i * 100); // Увеличиваем задержку
                    }
                };
                
                // Облегченный непрерывный дождь
                window.appAnimations.startContinuousFruitRain = function() {
                    if (document.body.classList.contains('eco-mode')) {
                        return null; // Отключаем в экономичном режиме
                    }
                    return window._originalAnimations.startContinuousFruitRain ? 
                        window._originalAnimations.startContinuousFruitRain() : null;
                };
                
                // Облегченная праздничная анимация
                window.appAnimations.celebrateWithFruits = function() {
                    if (document.body.classList.contains('eco-mode')) {
                        // Только один легкий дождь
                        window.appAnimations.fruitShower(10);
                    } else {
                        window._originalAnimations.celebrateWithFruits ? 
                            window._originalAnimations.celebrateWithFruits() : null;
                    }
                };
            }
            
            // Также патчим глобальные функции
            if (window.animateFruitRain) {
                window._originalAnimateFruitRain = window.animateFruitRain;
                window.animateFruitRain = function(count = 20) {
                    if (document.body.classList.contains('eco-mode')) {
                        const ecoCount = Math.max(5, Math.floor(count / 3));
                        const fruitRain = document.getElementById('fruitRain');
                        if (!fruitRain) return;
                        
                        for (let i = 0; i < ecoCount; i++) {
                            setTimeout(() => {
                                const fruit = document.createElement('div');
                                fruit.className = 'fruit eco-fruit';
                                fruit.textContent = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';
                                fruit.style.left = Math.random() * 100 + 'vw';
                                fruit.style.fontSize = '20px';
                                fruit.style.opacity = '0.3';
                                fruit.style.zIndex = '1';
                                fruit.style.animation = 'fruit-drop-simple ' + (Math.random() * 0.5 + 0.5) + 's linear forwards';
                                
                                fruitRain.appendChild(fruit);
                                
                                setTimeout(() => {
                                    if (fruit.parentNode === fruitRain) {
                                        fruit.remove();
                                    }
                                }, 800);
                            }, i * 100);
                        }
                    } else {
                        window._originalAnimateFruitRain(count);
                    }
                };
            }
        },
        
        // Восстанавливаем оригинальные анимации
        restoreOriginalAnimations() {
            if (window._originalAnimations) {
                if (window.appAnimations) {
                    window.appAnimations.fruitShower = window._originalAnimations.fruitShower;
                    window.appAnimations.startContinuousFruitRain = window._originalAnimations.startContinuousFruitRain;
                    window.appAnimations.celebrateWithFruits = window._originalAnimations.celebrateWithFruits;
                }
            }
            
            if (window._originalAnimateFruitRain) {
                window.animateFruitRain = window._originalAnimateFruitRain;
            }
        },
        
        // Облегченный фруктовый дождь
        startEcoFruitRain() {
            // Очищаем существующий интервал
            if (this.fruitRainInterval) {
                clearInterval(this.fruitRainInterval);
            }
            
            // Создаем облегченный дождь
            const createEcoFruit = () => {
                if (document.hidden || !this.ecoMode) return;
                
                const fruitRain = document.getElementById('fruitRain');
                if (!fruitRain) return;
                
                const fruit = document.createElement('div');
                fruit.className = 'fruit eco-fruit';
                fruit.textContent = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';
                fruit.style.position = 'fixed';
                fruit.style.top = '-100px';
                fruit.style.left = Math.random() * 100 + 'vw';
                fruit.style.fontSize = '20px';
                fruit.style.zIndex = '1';
                fruit.style.opacity = '0.3';
                fruit.style.pointerEvents = 'none';
                fruit.style.animation = 'fruit-drop-simple 1.5s linear forwards';
                
                fruitRain.appendChild(fruit);
                
                setTimeout(() => {
                    if (fruit.parentNode === fruitRain) {
                        fruit.remove();
                    }
                }, 1500);
            };
            
            // Медленный дождь - 1 фрукт в секунду
            this.fruitRainInterval = setInterval(createEcoFruit, 1000);
            
            // Создаем несколько начальных фруктов
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createEcoFruit(), i * 200);
            }
        },
        
        generateUserFruitIcon() {
            const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍉', '🍌', '🥭', '🍍', '🥝'];
            this.userFruitIcon = fruits[Math.floor(Math.random() * fruits.length)];
            
            // Сохраняем иконку пользователя в localStorage
            localStorage.setItem('userFruitIcon', this.userFruitIcon);
        },
        
        async loadConfig() {
            try {
                // Загружаем иконку пользователя
                const savedUserIcon = localStorage.getItem('userFruitIcon');
                if (savedUserIcon) {
                    this.userFruitIcon = savedUserIcon;
                }
            } catch (error) {
                console.error('Ошибка загрузки конфигурации:', error);
            }
        },
        
        async loadChats() {
            try {
                const saved = localStorage.getItem('fruitChats');
                if (saved) {
                    this.chats = JSON.parse(saved);
                    if (this.chats.length > 0) {
                        const lastActive = localStorage.getItem('lastActiveChat');
                        this.currentChatId = lastActive || this.chats[0].id;
                        this.currentChat = this.chats.find(c => c.id === this.currentChatId);
                        this.renderMessages();
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки чатов:', error);
            }
        },
        
        saveChats() {
            try {
                localStorage.setItem('fruitChats', JSON.stringify(this.chats));
                if (this.currentChatId) {
                    localStorage.setItem('lastActiveChat', this.currentChatId);
                }
            } catch (error) {
                console.error('Ошибка сохранения чатов:', error);
            }
        },
        
        createNewChat() {
            const newChat = {
                id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                title: 'Новый чат',
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.chats.push(newChat);
            this.currentChatId = newChat.id;
            this.currentChat = newChat;
            this.saveChats();
            this.renderMessages();
            this.closeSidebar();
            
            this.showStatus('Новый чат создан!', 'success');
            
            setTimeout(() => {
                document.getElementById('messageInput')?.focus();
            }, 100);
        },
        
        loadChat(chatId) {
            this.currentChatId = chatId;
            this.currentChat = this.chats.find(c => c.id === chatId);
            this.renderMessages();
            this.closeSidebar();
            this.showStatus('Чат загружен', 'success');
        },
        
        deleteChat(chatId) {
            if (this.chats.length <= 1) {
                this.showStatus('Нельзя удалить последний чат', 'error');
                return;
            }
            
            if (!confirm('Удалить этот чат? Все сообщения будут потеряны.')) {
                return;
            }
            
            const index = this.chats.findIndex(c => c.id === chatId);
            this.chats.splice(index, 1);
            
            if (this.currentChatId === chatId) {
                this.currentChatId = this.chats[0]?.id || null;
                this.currentChat = this.chats[0] || null;
                this.renderMessages();
            }
            
            this.saveChats();
            this.showStatus('Чат удалён', 'success');
        },
        
        showClearConfirmModal() {
            if (this.chats.length === 0) {
                this.showStatus('Нет чатов для удаления', 'info');
                return;
            }
            
            const modal = document.getElementById('clearConfirmModal');
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        },
        
        closeClearConfirmModal() {
            const modal = document.getElementById('clearConfirmModal');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        },
        
        confirmClearAllChats() {
            this.chats = [];
            this.currentChatId = null;
            this.currentChat = null;
            this.saveChats();
            this.renderMessages();
            this.closeClearConfirmModal();
            this.showStatus('Все чаты удалены', 'success');
        },
        
        async sendMessage() {
            if (!this.messageInput.trim() || this.isSending) return;
            
            const message = this.messageInput.trim();
            this.messageInput = '';
            this.updateCharCount();
            
            if (!this.currentChat) {
                this.createNewChat();
            }
            
            // Add user message
            this.addMessage('user', message);
            
            // Update chat
            this.currentChat.messages.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });
            
            if (this.currentChat.messages.length === 1) {
                this.currentChat.title = message.length > 30 
                    ? message.substring(0, 30) + '...'
                    : message;
            }
            
            this.currentChat.updatedAt = new Date().toISOString();
            this.saveChats();
            
            // Show typing indicator
            this.isTyping = true;
            this.isSending = true;
            this.scrollToBottom();
            
            try {
                const response = await this.callMistralAPI(message);
                this.addMessage('assistant', response);
                
                this.currentChat.messages.push({
                    role: 'assistant',
                    content: response,
                    timestamp: new Date().toISOString()
                });
                
                this.currentChat.updatedAt = new Date().toISOString();
                this.saveChats();
                
                this.showStatus('Ответ получен!', 'success');
                
                // Фруктовый дождь вместо конфетти
                if (window.appAnimations && window.appAnimations.fruitShower) {
                    if (this.ecoMode) {
                        window.appAnimations.fruitShower(10); // Меньше фруктов
                    } else {
                        window.appAnimations.fruitShower(20);
                    }
                }
                
            } catch (error) {
                console.error('API Error:', error);
                this.handleAPIError(error);
            } finally {
                this.isTyping = false;
                this.isSending = false;
            }
        },
        
        async callMistralAPI(message) {
            // Используем тестовый ключ напрямую
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
   - Отдельные формулы: $$\\int_{a}^{b} f(x) dx$$
10. Объяснять математические понятия как в учебниках
11. Не давать ответы напрямую, а подталкивать к решению
12. Соблюдать законодательство РФ
13. Если в сообщении ребёнка есть грамматическая ошибка то обращать на неё внимание и объяснять как писать правильно

Твой характер: добрый, умный, терпеливый, с чувством юмора.`
                },
                ...this.currentChat.messages.slice(-10).map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: message
                }
            ];
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'mistral-small',
                    messages: messages,
                    max_tokens: 800,
                    temperature: 0.7,
                    stream: false
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Ошибка API');
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        },
        
        handleAPIError(error) {
            let message = 'Ошибка при получении ответа';
            
            if (error.message.includes('401') || error.message.includes('authentication')) {
                message = 'Используется тестовый ключ, попробуйте позже';
            } else if (error.message.includes('429')) {
                message = 'Слишком много запросов. Попробуйте позже.';
            } else if (error.message.includes('network')) {
                message = 'Проблемы с сетью. Проверьте подключение.';
            }
            
            this.showStatus(message, 'error');
            this.addMessage('assistant', `Извини, произошла ошибка: ${message}. Попробуй еще раз! 🍓`);
        },
        
        addMessage(role, content) {
            const messagesList = document.getElementById('messagesList');
            
            // Remove empty state if exists
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            const time = new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Получаем случайную фруктовую иконку для пользователя
            const userFruit = this.userFruitIcon;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role === 'user' ? 'message-user' : 'message-assistant'}`;
            
            messageDiv.innerHTML = `
                <div class="${role === 'user' ? 'message-user' : 'message-assistant'}">
                    ${role !== 'user' ? `
                        <div class="avatar avatar-assistant animated-fruit">
                            <div class="avatar-inner">
                                <span>${window.getRandomFruitIcon()}</span>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="bubble ${role === 'user' ? 'bubble-user' : 'bubble-assistant'}">
                        <div class="message-content">${this.escapeHtml(content)}</div>
                        <div class="message-time">${time}</div>
                    </div>
                    
                    ${role === 'user' ? `
                        <div class="avatar avatar-user animated-fruit">
                            <div class="avatar-inner">
                                <span>${userFruit}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            
            messagesList.appendChild(messageDiv);
            this.scrollToBottom();
            
            // Рендерим математические выражения с помощью KaTeX
            setTimeout(() => {
                if (window.renderMathInElement) {
                    window.renderMathInElement(messageDiv, {
                        delimiters: [
                            {left: '$$', right: '$$', display: true},
                            {left: '$', right: '$', display: false},
                            {left: '\\(', right: '\\)', display: false},
                            {left: '\\[', right: '\\]', display: true}
                        ],
                        throwOnError: false
                    });
                }
            }, 100);
        },
        
        renderMessages() {
            const messagesList = document.getElementById('messagesList');
            messagesList.innerHTML = '';
            
            if (!this.currentChat?.messages?.length) {
                return;
            }
            
            this.currentChat.messages.forEach(msg => {
                this.addMessage(msg.role, msg.content);
            });
            
            this.scrollToBottom();
        },
        
        scrollToBottom() {
            setTimeout(() => {
                const container = document.querySelector('.messages-container');
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 100);
        },
        
        updateCharCount() {
            this.charCount = this.messageInput.length;
            
            const textarea = document.getElementById('messageInput');
            if (textarea) {
                textarea.style.height = 'auto';
                
                // Рассчитываем высоту с учётом отступов
                const computedStyle = window.getComputedStyle(textarea);
                const minHeight = parseInt(computedStyle.minHeight, 10) || 64;
                const maxHeight = parseInt(computedStyle.maxHeight, 10) || 192;
                const lineHeight = parseInt(computedStyle.lineHeight, 10) || 24;
                
                // Вычисляем высоту на основе количества строк
                const rows = textarea.value.split('\n').length;
                const calculatedHeight = Math.max(minHeight, Math.min(maxHeight, rows * lineHeight + 32));
                
                textarea.style.height = calculatedHeight + 'px';
                
                // Адаптируем высоту кнопки отправки
                const sendButton = document.getElementById('sendButton');
                if (sendButton) {
                    sendButton.style.height = calculatedHeight + 'px';
                    sendButton.style.minHeight = calculatedHeight + 'px';
                }
            }
        },
        
        handleEnter(event) {
            if (event.shiftKey) {
                return;
            }
            
            event.preventDefault();
            if (this.messageInput.trim() && !this.isSending) {
                this.sendMessage();
            }
        },
        
        setQuickQuestion(question) {
            this.messageInput = question;
            this.updateCharCount();
            setTimeout(() => {
                document.getElementById('messageInput')?.focus();
            }, 50);
        },
        
        // Метод для случайной темы
        setRandomTopic() {
            if (this.topics.length === 0) {
                this.showStatus('Нет доступных тем', 'error');
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * this.topics.length);
            const topic = this.topics[randomIndex];
            
            this.messageInput = `Объясни тему: "${topic}" простым языком для школьника.`;
            this.updateCharCount();
            
            this.showStatus(`Выбрана тема: ${topic}`, 'success');
            
            setTimeout(() => {
                document.getElementById('messageInput')?.focus();
                document.getElementById('messageInput')?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        },
        
        openSidebar() {
            this.sidebarOpen = true;
            document.body.style.overflow = 'hidden';
        },
        
        closeSidebar() {
            this.sidebarOpen = false;
            document.body.style.overflow = '';
        },
        
        showWelcomeModal() {
            const modal = document.getElementById('welcomeModal');
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        },
        
        closeWelcomeModal() {
            const modal = document.getElementById('welcomeModal');
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.getElementById('messageInput')?.focus();
            }, 300);
        },
        
        // Функция для старта фруктового дождя
        startFruitRain() {
            // Останавливаем существующий интервал
            if (this.fruitRainInterval) {
                clearInterval(this.fruitRainInterval);
            }
            
            if (this.ecoMode) {
                this.startEcoFruitRain();
                return;
            }
            
            // Используем анимации из animations.js
            if (window.appAnimations && window.appAnimations.startContinuousFruitRain) {
                this.fruitRainInterval = window.appAnimations.startContinuousFruitRain();
            } else {
                // Fallback если animations.js не загружен
                const createFruit = () => {
                    if (document.hidden) return;
                    
                    const fruitRain = document.getElementById('fruitRain');
                    if (!fruitRain) return;
                    
                    const fruit = document.createElement('div');
                    fruit.className = 'fruit';
                    fruit.textContent = window.getRandomFruitIcon ? window.getRandomFruitIcon() : '🍓';
                    fruit.style.left = Math.random() * 100 + 'vw';
                    fruit.style.fontSize = (Math.random() * 24 + 24) + 'px';
                    fruit.style.opacity = Math.random() * 0.3 + 0.4;
                    fruit.style.zIndex = '1';
                    fruit.style.animation = 'fruit-drop ' + (Math.random() * 1.5 + 1) + 's linear forwards';
                    
                    fruitRain.appendChild(fruit);
                    
                    // Удаляем элемент после анимации
                    setTimeout(() => {
                        if (fruit.parentNode === fruitRain) {
                            fruit.remove();
                        }
                    }, (Math.random() * 1500 + 1000));
                };
                
                // Initial fruits
                for (let i = 0; i < 15; i++) {
                    setTimeout(() => createFruit(), Math.random() * 2000);
                }
                
                // Continuous rain с увеличенной частотой
                this.fruitRainInterval = setInterval(createFruit, 400);
            }
        },
        
        stopFruitRain() {
            if (this.fruitRainInterval) {
                clearInterval(this.fruitRainInterval);
                this.fruitRainInterval = null;
            }
        },
        
        // Новые функции для работы с фактами
        showRandomFact(category = null) {
            const modal = document.getElementById('factsModal');
            modal.style.display = 'flex';
            
            // Используем requestAnimationFrame для гарантии отображения перед анимацией
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                    
                    let filteredFacts = this.interestingFacts;
                    if (category) {
                        filteredFacts = this.interestingFacts.filter(fact => fact.category === category);
                    }
                    
                    if (filteredFacts.length === 0) {
                        filteredFacts = this.interestingFacts;
                    }
                    
                    const randomIndex = Math.floor(Math.random() * filteredFacts.length);
                    const fact = filteredFacts[randomIndex];
                    
                    // Обновляем иконку фрукта
                    const fruitIconElement = document.getElementById('factFruitIcon');
                    if (fruitIconElement && window.getFactIconByCategory) {
                        fruitIconElement.textContent = window.getFactIconByCategory(fact.category);
                    } else if (fruitIconElement && window.getRandomFruitIcon) {
                        fruitIconElement.textContent = window.getRandomFruitIcon();
                    }
                    
                    // Обновляем категорию факта
                    const factCategoryElement = document.getElementById('factCategory');
                    if (factCategoryElement) {
                        const categoryNames = {
                            'science': '🔬 Наука',
                            'nature': '🌿 Природа',
                            'space': '🚀 Космос',
                            'history': '🏛️ История',
                            'tech': '💻 Технологии'
                        };
                        factCategoryElement.innerHTML = `<span class="category-badge category-${fact.category}">${categoryNames[fact.category] || '📚 Факт'}</span>`;
                    }
                    
                    // Обновляем текст факта
                    const factTextElement = document.getElementById('factText');
                    if (factTextElement) {
                        factTextElement.textContent = fact.text;
                        factTextElement.classList.add('fact-text-entrance');
                        
                        // Анимация появления
                        if (window.appAnimations && window.appAnimations.animateFactText) {
                            window.appAnimations.animateFactText(factTextElement);
                        }
                    }
                    
                    // Обновляем номер факта
                    const factNumberElement = document.getElementById('factNumber');
                    if (factNumberElement) {
                        const factIndex = this.interestingFacts.findIndex(f => f.text === fact.text) + 1;
                        factNumberElement.textContent = factIndex;
                        
                        // Анимация счетчика
                        if (window.appAnimations && window.appAnimations.animateFactCounter) {
                            window.appAnimations.animateFactCounter(factNumberElement);
                        }
                    }
                    
                    // Анимация категории
                    if (factCategoryElement && window.appAnimations && window.appAnimations.animateFactCategory) {
                        window.appAnimations.animateFactCategory(factCategoryElement);
                    }
                    
                    // Анимация иконки
                    if (fruitIconElement && window.appAnimations && window.appAnimations.animateFactIcon) {
                        window.appAnimations.animateFactIcon(fruitIconElement);
                    }
                    
                    // Запускаем фруктовый дождь
                    if (window.appAnimations && window.appAnimations.fruitShower) {
                        if (this.ecoMode) {
                            window.appAnimations.fruitShower(5); // Меньше фруктов
                        } else {
                            window.appAnimations.fruitShower(10);
                        }
                    }
                    
                    // Фокус на кнопке закрытия для доступности
                    setTimeout(() => {
                        const closeBtn = modal.querySelector('.btn-icon');
                        if (closeBtn) {
                            closeBtn.focus();
                        }
                    }, 100);
                    
                });
            });
        },
        
        closeFactsModal() {
            const modal = document.getElementById('factsModal');
            modal.classList.remove('active');
            
            // Ждем окончания анимации перед скрытием
            setTimeout(() => {
                modal.style.display = 'none';
                
                // Возвращаем фокус на предыдущий элемент
                const lastFocused = document.activeElement;
                if (lastFocused && lastFocused.classList.contains('btn-icon')) {
                    // Возвращаем фокус на кнопку, которая открыла модальное окно
                    const factsButton = document.querySelector('.btn-fun-fact, [onclick*="showRandomFact"]');
                    if (factsButton) {
                        factsButton.focus();
                    } else {
                        document.getElementById('messageInput')?.focus();
                    }
                }
            }, 300);
        },
        
        shareFact() {
            const factText = document.getElementById('factText')?.textContent;
            if (!factText) return;
            
            const shareText = `🍓 Интересный факт от Фруктик Чата:\n\n${factText}\n\nПопробуй Фруктик Чат - AI помощник для учёбы!`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Интересный факт',
                    text: shareText,
                    url: window.location.href
                }).then(() => {
                    this.showStatus('Факт успешно отправлен!', 'success');
                }).catch(err => {
                    console.log('Ошибка шаринга:', err);
                    this.fallbackCopy(shareText);
                });
            } else {
                this.fallbackCopy(shareText);
            }
        },
        
        fallbackCopy(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.showStatus('Факт скопирован в буфер обмена!', 'success');
                
                // Анимация успешного копирования
                const shareBtn = document.querySelector('.btn-secondary .fa-share-alt');
                if (shareBtn) {
                    const parent = shareBtn.closest('button');
                    parent.classList.add('share-success');
                    setTimeout(() => {
                        parent.classList.remove('share-success');
                    }, 500);
                }
            }).catch(err => {
                console.log('Ошибка копирования:', err);
                this.showStatus('Не удалось скопировать факт', 'error');
            });
        },
        
        showStatus(message, type = 'info') {
            const statusEl = document.getElementById('statusMessage');
            statusEl.textContent = message;
            statusEl.className = `status-message status-${type}`;
            statusEl.classList.add('show');
            
            setTimeout(() => {
                statusEl.classList.remove('show');
            }, 3000);
        },
        
        getChatPreview(chat) {
            if (!chat.messages?.length) return 'Нет сообщений';
            
            const lastMsg = chat.messages[chat.messages.length - 1];
            const content = lastMsg.content.length > 40 
                ? lastMsg.content.substring(0, 40) + '...'
                : lastMsg.content;
            
            return lastMsg.role === 'user' ? `Вы: ${content}` : `Фруктик: ${content}`;
        },
        
        formatTime(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            
            if (diff < 60000) return 'только что';
            if (diff < 3600000) return Math.floor(diff / 60000) + ' мин назад';
            if (diff < 86400000) return Math.floor(diff / 3600000) + ' ч назад';
            if (diff < 172800000) return 'вчера';
            
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
            });
        },
        
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },
        
        setupEventListeners() {
            // Handle page visibility
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopFruitRain();
                } else {
                    this.startFruitRain();
                }
            });
            
            // Handle beforeunload
            window.addEventListener('beforeunload', (e) => {
                if (this.isSending) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            });
            
            // Close modals on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeWelcomeModal();
                    this.closeSidebar();
                    this.closeFactsModal();
                    this.closeClearConfirmModal();
                }
            });
            
            // Обработка кликов по оверлею для модальных окон
            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        const modal = overlay.closest('.modal');
                        if (modal.id === 'factsModal') {
                            this.closeFactsModal();
                        } else if (modal.id === 'clearConfirmModal') {
                            this.closeClearConfirmModal();
                        } else if (modal.id === 'welcomeModal') {
                            this.closeWelcomeModal();
                        }
                    }
                });
            });
        }
    };
}
