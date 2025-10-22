// =============================================
// 🌸 ЦВЕТОЧНЫЙ МАГАЗИН - Telegram Mini App
// =============================================

// Основные переменные
let tg = null;
let cart = [];
let currentCategory = 'all';

// Инициализация Telegram Mini App
function initTelegramApp() {
    // Проверяем, что мы в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        
        // Инициализируем приложение
        tg.ready();
        tg.expand(); // Раскрываем на весь экран
        tg.enableClosingConfirmation(); // Подтверждение закрытия
        
        // Настраиваем кнопку "Назад"
        tg.BackButton.onClick(handleBackButton);
        
        console.log('🌸 Telegram Mini App инициализирован!');
        console.log('Пользователь:', tg.initDataUnsafe?.user);
        
    } else {
        console.log('🌸 Запущено в браузере, не в Telegram');
        // Эмулируем некоторые функции для тестирования
        tg = {
            BackButton: {
                show: () => console.log('BackButton show'),
                hide: () => console.log('BackButton hide'),
                onClick: (cb) => { window.backButtonCallback = cb; }
            },
            showPopup: (params) => {
                alert(params.title + '\n' + params.message);
            },
            showAlert: (message) => {
                alert(message);
            },
            HapticFeedback: {
                impactOccurred: () => console.log('Haptic feedback')
            },
            openTelegramLink: (url) => {
                window.open(url, '_blank');
            }
        };
    }
    
    // Загружаем данные приложения
    loadProducts();
    setupCategoryTabs();
    updateCartDisplay();
    setupDeliveryDate();
}

// Настройка минимальной даты доставки (сегодня + 1 день)
function setupDeliveryDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.min = minDate;
    }
}

// Обработчик кнопки "Назад"
function handleBackButton() {
    if (isProductPageVisible()) {
        showMainPage();
    } else if (isOrderPageVisible()) {
        showMainPage();
    }
}

// Проверка видимости страницы товара
function isProductPageVisible() {
    return !document.getElementById('productPage').classList.contains('hidden');
}

// Проверка видимости страницы заказа
function isOrderPageVisible() {
    return !document.getElementById('orderPage').classList.contains('hidden');
}

// Данные товаров
const products = [
    {
        id: 1,
        name: "Букет красных роз",
        description: "11 роскошных красных роз с зеленью",
        price: 3500,
        category: "roses",
        emoji: "🌹",
        features: ["Свежие цветы", "Бесплатная упаковка", "Доставка за 2 часа"]
    },
    {
        id: 2,
        name: "Весенние тюльпаны",
        description: "15 свежих тюльпанов разных цветов",
        price: 2200,
        category: "tulips",
        emoji: "🌷",
        features: ["Яркие цвета", "Сезонные цветы", "Долго стоят"]
    },
    {
        id: 3,
        name: "Романтический микс",
        description: "Смесь роз, пионов и эустомы",
        price: 4200,
        category: "mixed",
        emoji: "💐",
        features: ["Разные текстуры", "Элегантная упаковка", "Идеально для свидания"]
    },
    {
        id: 4,
        name: "Букет белых роз",
        description: "9 белых роз в элегантной упаковке",
        price: 3200,
        category: "roses",
        emoji: "🥀",
        features: ["Нежные бутоны", "Белая упаковка", "Символ чистоты"]
    },
    {
        id: 5,
        name: "Желтые тюльпаны",
        description: "Солнечный букет из 12 тюльпанов",
        price: 1800,
        category: "tulips",
        emoji: "🌼",
        features: ["Яркий цвет", "Поднимает настроение", "Свежесрезанные"]
    },
    {
        id: 6,
        name: "Премиум сборка",
        description: "Эксклюзивные цветы для особого случая",
        price: 5500,
        category: "mixed",
        emoji: "🎀",
        features: ["Отборные цветы", "Дизайнерская упаковка", "Персональная открытка"]
    }
];

// Загрузка товаров на главную страницу
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    
    // Показываем загрузку
    grid.innerHTML = '<div class="loading">Загрузка цветов...</div>';
    
    // Имитируем загрузку
    setTimeout(() => {
        const filteredProducts = currentCategory === 'all' 
            ? products 
            : products.filter(p => p.category === currentCategory);
        
        if (filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="empty-cart">
                    <div class="icon">🌱</div>
                    <div>В этой категории пока нет цветов</div>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">${product.emoji}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Добавить в корзину
                </button>
            `;
            productCard.onclick = () => showProductDetail(product.id);
            grid.appendChild(productCard);
        });
    }, 300);
}

// Настройка фильтров по категориям
function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            loadProducts();
        });
    });
}

// Показать детальную страницу товара
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Переключаем страницы
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('productPage').classList.remove('hidden');
    document.getElementById('orderPage').classList.add('hidden');
    
    // Показываем кнопку "Назад" в Telegram
    if (tg && tg.BackButton) {
        tg.BackButton.show();
    }
    
    const detailContainer = document.getElementById('productDetail');
    detailContainer.innerHTML = `
        <div class="product-detail">
            <div class="product-image" style="height: 200px; font-size: 64px;">
                ${product.emoji}
            </div>
            <h2 style="margin-bottom: 8px;">${product.name}</h2>
            <p style="margin-bottom: 12px; color: #666;">${product.description}</p>
            
            <div style="margin-bottom: 16px;">
                <h3 style="font-size: 14px; margin-bottom: 8px; color: #333;">Особенности:</h3>
                <ul style="color: #666; font-size: 14px; padding-left: 16px;">
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div style="font-size: 24px; font-weight: bold; color: #e91e63; margin-bottom: 16px;">
                ${product.price.toLocaleString()} ₽
            </div>
            
            <button class="add-to-cart" style="padding: 12px; font-size: 16px;" 
                    onclick="addToCart(${product.id}); showMainPage()">
                Добавить в корзину
            </button>
        </div>
    `;
}

// Показать страницу заказа
function showOrderPage() {
    if (cart.length === 0) {
        showNotification('🛒 Корзина пуста! Добавьте товары.');
        return;
    }
    
    // Переключаем страницы
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('productPage').classList.add('hidden');
    document.getElementById('orderPage').classList.remove('hidden');
    
    // Показываем кнопку "Назад" в Telegram
    if (tg && tg.BackButton) {
        tg.BackButton.show();
    }
    
    // Заполняем страницу заказа
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalContainer = document.getElementById('orderTotal');
    
    let orderHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        orderHTML += `
            <div class="order-item">
                <div>
                    <div style="font-weight: 500;">${item.name}</div>
                    <div style="font-size: 14px; color: #666;">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
                </div>
                <div style="font-weight: bold; color: #e91e63;">
                    ${itemTotal.toLocaleString()} ₽
                </div>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = orderHTML;
    orderTotalContainer.textContent = `Итого: ${total.toLocaleString()} ₽`;
    
    // Очищаем ошибки при открытии формы
    clearFormErrors();
}

// Вернуться на главную страницу
function showMainPage() {
    document.getElementById('mainPage').classList.remove('hidden');
    document.getElementById('productPage').classList.add('hidden');
    document.getElementById('orderPage').classList.add('hidden');
    
    // Скрываем кнопку "Назад" в Telegram
    if (tg && tg.BackButton) {
        tg.BackButton.hide();
    }
}

// Добавление товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // Тактильный отклик в Telegram
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Показываем уведомление
    showNotification(`✅ ${product.name} добавлен в корзину`);
}

// Показать уведомление
function showNotification(message) {
    // В Telegram используем нативные уведомления
    if (tg && tg.showAlert) {
        tg.showAlert(message);
    } else {
        // В браузере показываем свое уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// Обновление отображения корзины
function updateCartDisplay() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('cartTotal').textContent = `${total.toLocaleString()} ₽`;
    document.getElementById('cartCount').textContent = totalCount;
    
    // Блокируем кнопку если корзина пуста
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = totalCount === 0;
}

// Валидация формы
function validateForm() {
    let isValid = true;
    clearFormErrors();
    
    // Проверка даты доставки
    const deliveryDate = document.getElementById('deliveryDate').value;
    if (!deliveryDate) {
        showError('deliveryDate', 'dateError', 'Пожалуйста, выберите дату доставки');
        isValid = false;
    }
    
    // Проверка адреса доставки
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();
    if (!deliveryAddress) {
        showError('deliveryAddress', 'addressError', 'Пожалуйста, укажите адрес доставки');
        isValid = false;
    }
    
    // Проверка телефона отправителя
    const senderPhone = document.getElementById('senderPhone').value.trim();
    if (!senderPhone) {
        showError('senderPhone', 'senderPhoneError', 'Пожалуйста, укажите ваш телефон');
        isValid = false;
    }
    
    // Проверка имени отправителя
    const senderName = document.getElementById('senderName').value.trim();
    if (!senderName) {
        showError('senderName', 'senderNameError', 'Пожалуйста, укажите ваше имя');
        isValid = false;
    }
    
    // Проверка имени получателя
    const receiverName = document.getElementById('receiverName').value.trim();
    if (!receiverName) {
        showError('receiverName', 'receiverNameError', 'Пожалуйста, укажите имя получателя');
        isValid = false;
    }
    
    return isValid;
}

// Показать ошибку поля
function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    
    field.classList.add('error');
    error.textContent = message;
    error.style.display = 'block';
}

// Очистить все ошибки
function clearFormErrors() {
    const errors = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('.form-input');
    
    errors.forEach(error => error.style.display = 'none');
    inputs.forEach(input => input.classList.remove('error'));
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Валидация и подтверждение заказа
function validateAndConfirmOrder() {
    if (!validateForm()) {
        showNotification('❌ Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    confirmOrder();
}

// Подтверждение заказа
function confirmOrder() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    
    // Собираем данные формы
    const formData = {
        deliveryDate: document.getElementById('deliveryDate').value,
        deliveryAddress: document.getElementById('deliveryAddress').value.trim(),
        senderPhone: document.getElementById('senderPhone').value.trim(),
        senderName: document.getElementById('senderName').value.trim(),
        receiverPhone: document.getElementById('receiverPhone').value.trim(),
        receiverName: document.getElementById('receiverName').value.trim(),
        bouquetWishes: document.getElementById('bouquetWishes').value.trim(),
        cardMessage: document.getElementById('cardMessage').value.trim()
    };
    
    const orderDetails = cart.map(item => 
        `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Формируем сообщение для менеджера
    const orderMessage = 
        `💐 *НОВЫЙ ЗАКАЗ ИЗ ЦВЕТОЧНОГО МАГАЗИНА*\n\n` +
        `*📦 Состав заказа:*\n${orderDetails}\n\n` +
        `*💰 Итого:* ${total.toLocaleString()} ₽\n\n` +
        `*🚚 Данные доставки:*\n` +
        `📅 Дата: ${formatDate(formData.deliveryDate)}\n` +
        `📍 Адрес: ${formData.deliveryAddress}\n\n` +
        `*👤 Отправитель:*\n` +
        `📞 Телефон: ${formData.senderPhone}\n` +
        `👤 Имя: ${formData.senderName}\n\n` +
        `*🎯 Получатель:*\n` +
        `📞 Телефон: ${formData.receiverPhone || formData.senderPhone}\n` +
        `👤 Имя: ${formData.receiverName}\n\n` +
        `*💌 Дополнительно:*\n` +
        `Пожелания к букету: ${formData.bouquetWishes || 'не указаны'}\n` +
        `Текст открытки: ${formData.cardMessage || 'не указан'}\n\n` +
        `_Для связи с клиентом используйте телефон отправителя_`;
    
    // Сообщение для клиента
    const clientMessage = 
        `✅ *Ваш заказ подтвержден!*\n\n` +
        `Спасибо за заказ в нашей цветочной лавке! 🌸\n\n` +
        `*Детали заказа:*\n${orderDetails}\n\n` +
        `*Итого:* ${total.toLocaleString()} ₽\n\n` +
        `*Доставка:* ${formatDate(formData.deliveryDate)}\n` +
        `*Адрес:* ${formData.deliveryAddress}\n\n` +
        `Наш менеджер свяжется с вами в течение 5 минут для подтверждения заказа.`;
    
    // Показываем подтверждение в Telegram
    if (tg && tg.showPopup) {
        tg.showPopup({
            title: '✅ Заказ подтвержден!',
            message: clientMessage,
            buttons: [
                {
                    type: 'default',
                    text: '📞 Связаться с менеджером',
                    id: 'contact_manager'
                },
                {
                    type: 'ok',
                    text: 'Понятно',
                    id: 'ok'
                }
            ]
        });
        
        // Обработка действий в попапе
        tg.onEvent('popupClosed', (data) => {
            if (data.button_id === 'contact_manager') {
                // Открываем чат с менеджером
                // ЗАМЕНИТЕ НА РЕАЛЬНЫЙ USERNAME МЕНЕДЖЕРА
                tg.openTelegramLink('https://t.me/your_flower_manager');
            }
            
            // Отправляем данные менеджеру (в реальном приложении это будет API запрос)
            sendOrderToManager(orderMessage);
            
            // Очищаем корзину после заказа
            cart = [];
            updateCartDisplay();
            showMainPage();
        });
    } else {
        // Для браузера
        alert(clientMessage + '\n\nСообщение для менеджера:\n' + orderMessage);
        
        //
