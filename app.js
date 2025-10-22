// =============================================
// 🌸 ЦВЕТОЧНЫЙ МАГАЗИН - Telegram Mini App
// =============================================

// Основные переменные
let tg = null;
let cart = [];
let currentCategory = 'all';

// Инициализация Telegram Mini App
function initTelegramApp() {
    console.log('🌸 Инициализация приложения...');
    
    // Проверяем, что мы в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        
        // Инициализируем приложение
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();
        
        // Настраиваем кнопку "Назад"
        tg.BackButton.onClick(handleBackButton);
        
        console.log('🌸 Telegram Mini App инициализирован!');
        
    } else {
        console.log('🌸 Запущено в браузере, не в Telegram');
        tg = {
            BackButton: {
                show: () => console.log('BackButton show'),
                hide: () => console.log('BackButton hide'),
                onClick: (cb) => { window.backButtonCallback = cb; }
            },
            showPopup: (params) => alert(params.title + '\n' + params.message),
            showAlert: (message) => alert(message),
            HapticFeedback: { impactOccurred: () => console.log('Haptic feedback') },
            openTelegramLink: (url) => window.open(url, '_blank')
        };
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

// ПРОСТЫЕ ДАННЫЕ ТОВАРОВ (для тестирования)
const products = [
    {
        id: 1,
        name: "Букет красных роз",
        shortDescription: "11 роскошных красных роз",
        price: 3500,
        category: "roses",
        emoji: "🌹",
        image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400&h=300&fit=crop",
        features: ["Свежие цветы", "Бесплатная упаковка"]
    },
    {
        id: 2,
        name: "Весенние тюльпаны",
        shortDescription: "15 свежих тюльпанов",
        price: 2200,
        category: "tulips",
        emoji: "🌷",
        image: "https://images.unsplash.com/photo-1582799165859-2bb5e2e9c0d1?w=400&h=300&fit=crop",
        features: ["Яркие цвета", "Сезонные цветы"]
    },
    {
        id: 3,
        name: "Романтический микс",
        shortDescription: "Смесь роз и пионов",
        price: 4200,
        category: "mixed",
        emoji: "💐",
        image: "https://images.unsplash.com/photo-1487070183333-13a19e8d6d8d?w=400&h=300&fit=crop",
        features: ["Разные текстуры", "Элегантная упаковка"]
    },
    {
        id: 4,
        name: "Букет белых роз",
        shortDescription: "9 белых роз",
        price: 3200,
        category: "roses",
        emoji: "🥀",
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=300&fit=crop",
        features: ["Нежные бутоны", "Белая упаковка"]
    },
    {
        id: 5,
        name: "Желтые тюльпаны",
        shortDescription: "12 солнечных тюльпанов",
        price: 1800,
        category: "tulips",
        emoji: "🌼",
        image: "https://images.unsplash.com/photo-1597848212624-e6d4bd6deb47?w=400&h=300&fit=crop",
        features: ["Яркий цвет", "Свежесрезанные"]
    },
    {
        id: 6,
        name: "Премиум сборка",
        shortDescription: "Эксклюзивные цветы",
        price: 5500,
        category: "mixed",
        emoji: "🎀",
        image: "https://images.unsplash.com/photo-1572853139777-6e6d0b21cd8e?w=400&h=300&fit=crop",
        features: ["Отборные цветы", "Дизайнерская упаковка"]
    }
];

// Загрузка товаров на главную страницу
function loadProducts() {
    console.log('🔄 Загрузка товаров...', currentCategory);
    
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('❌ Не найден productsGrid');
        return;
    }

    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);

    console.log('📦 Отфильтровано товаров:', filteredProducts.length);

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
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='${product.emoji}'">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.shortDescription}</div>
            <div class="product-price">${product.price.toLocaleString()} ₽</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                Добавить в корзину
            </button>
        `;
        productCard.onclick = () => showProductDetail(product.id);
        grid.appendChild(productCard);
    });
}

// Настройка фильтров по категориям
function setupCategoryTabs() {
    console.log('🎯 Настройка категорий...');
    
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            console.log('🔽 Выбрана категория:', currentCategory);
            loadProducts();
        });
    });
}

// Показать детальную страницу товара
function showProductDetail(productId) {
    console.log('📖 Показать товар:', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('productPage').classList.remove('hidden');
    document.getElementById('orderPage').classList.add('hidden');

    if (tg && tg.BackButton) {
        tg.BackButton.show();
    }

    const detailContainer = document.getElementById('productDetail');
    detailContainer.innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}" class="product-detail-image" onerror="this.style.display='none'">
            <h2>${product.name}</h2>
            <p class="product-full-description">${product.shortDescription}</p>
            
            <div class="product-features">
                <h3>Особенности:</h3>
                <ul class="feature-list">
                    ${product.features.map(feature => `
                        <li>
                            <span class="feature-icon">✓</span>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="font-size: 24px; font-weight: bold; color: #e91e63; margin: 20px 0;">
                ${product.price.toLocaleString()} ₽
            </div>
            
            <button class="add-to-cart" style="padding: 16px; font-size: 18px;" 
                    onclick="addToCart(${product.id}); showMainPage()">
                Добавить в корзину
            </button>
        </div>
    `;
}

// Показать страницу заказа
function showOrderPage() {
    console.log('📦 Показать страницу заказа');
    
    if (cart.length === 0) {
        showNotification('🛒 Корзина пуста! Добавьте товары.');
        return;
    }

    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('productPage').classList.add('hidden');
    document.getElementById('orderPage').classList.remove('hidden');

    if (tg && tg.BackButton) {
        tg.BackButton.show();
    }

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
    
    clearFormErrors();
    setupDeliveryDate();
}

// Вернуться на главную страницу
function showMainPage() {
    console.log('🏠 Вернуться на главную');
    
    document.getElementById('mainPage').classList.remove('hidden');
    document.getElementById('productPage').classList.add('hidden');
    document.getElementById('orderPage').classList.add('hidden');

    if (tg && tg.BackButton) {
        tg.BackButton.hide();
    }
}

// Настройка минимальной даты доставки
function setupDeliveryDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.min = minDate;
        if (!dateInput.value) {
            dateInput.value = minDate;
        }
    }
}

// Добавление товара в корзину
function addToCart(productId) {
    console.log('➕ Добавить в корзину:', productId);
    
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

    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }

    showNotification(`✅ ${product.name} добавлен в корзину`);
}

// Показать уведомление
function showNotification(message) {
    console.log('💬 Уведомление:', message);
    
    if (tg && tg.showAlert) {
        tg.showAlert(message);
    } else {
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
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = totalCount === 0;
    
    console.log('🛒 Корзина обновлена:', totalCount, 'товаров на', total, '₽');
}

// Валидация формы
function validateForm() {
    let isValid = true;
    clearFormErrors();

    const fields = [
        { id: 'deliveryDate', errorId: 'dateError', message: 'Выберите дату доставки' },
        { id: 'deliveryAddress', errorId: 'addressError', message: 'Укажите адрес доставки' },
        { id: 'senderPhone', errorId: 'senderPhoneError', message: 'Укажите ваш телефон' },
        { id: 'senderName', errorId: 'senderNameError', message: 'Укажите ваше имя' },
        { id: 'receiverName', errorId: 'receiverNameError', message: 'Укажите имя получателя' }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element || !element.value.trim()) {
            showError(field.id, field.errorId, field.message);
            isValid = false;
        }
    });

    return isValid;
}

// Показать ошибку поля
function showError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    
    if (field && error) {
        field.classList.add('error');
        error.textContent = message;
        error.style.display = 'block';
    }
}

// Очистить все ошибки
function clearFormErrors() {
    const errors = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('.form-input');
    
    errors.forEach(error => error.style.display = 'none');
    inputs.forEach(input => input.classList.remove('error'));
}

// Валидация и подтверждение заказа
function validateAndConfirmOrder() {
    if (!validateForm()) {
        showNotification('❌ Заполните все обязательные поля');
        return;
    }
    
    confirmOrder();
}

// Подтверждение заказа
function confirmOrder() {
    console.log('✅ Подтверждение заказа');
    
    const formData = collectFormData();
    if (!formData) return;

    const total = formData.total;
    const orderDetails = cart.map(item => 
        `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');

    const clientMessage = 
        `✅ *Ваш заказ подтвержден!*\n\n` +
        `Спасибо за заказ в нашей цветочной лавке! 🌸\n\n` +
        `*Детали заказа:*\n${orderDetails}\n\n` +
        `*Итого:* ${total.toLocaleString()} ₽\n\n` +
        `Наш менеджер свяжется с вами в течение 5 минут.`;

    if (tg && tg.showPopup) {
        tg.showPopup({
            title: '✅ Заказ подтвержден!',
            message: clientMessage,
            buttons: [{
                type: 'default',
                text: '📞 Связаться с менеджером',
                id: 'contact_manager'
            }]
        });

        tg.onEvent('popupClosed', (data) => {
            if (data.button_id === 'contact_manager') {
                tg.openTelegramLink('https://t.me/your_flower_manager');
            }
            sendOrderToManager(formData);
            clearCartAndReset();
        });
    } else {
        alert(clientMessage);
        sendOrderToManager(formData);
        clearCartAndReset();
    }
}

// Сбор данных формы
function collectFormData() {
    if (!validateForm()) return null;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        deliveryDate: document.getElementById('deliveryDate').value,
        deliveryAddress: document.getElementById('deliveryAddress').value.trim(),
        senderPhone: document.getElementById('senderPhone').value.trim(),
        senderName: document.getElementById('senderName').value.trim(),
        receiverPhone: document.getElementById('receiverPhone').value.trim(),
        receiverName: document.getElementById('receiverName').value.trim(),
        bouquetWishes: document.getElementById('bouquetWishes').value.trim(),
        cardMessage: document.getElementById('cardMessage').value.trim(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total
    };
}

// Отправка заказа менеджеру
function sendOrderToManager(formData, paymentMethod = 'не указан') {
    console.log('📤 Отправка заказа менеджеру:', formData);
    
    const orderMessage = 
        `💐 *НОВЫЙ ЗАКАЗ ИЗ ЦВЕТОЧНОГО МАГАЗИНА*\n\n` +
        `*📦 Состав заказа:*\n${formData.items.map(item => 
            `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ₽`
        ).join('\n')}\n\n` +
        `*💰 Итого:* ${formData.total.toLocaleString()} ₽\n\n` +
        `*🚚 Данные доставки:*\n` +
        `📅 Дата: ${new Date(formData.deliveryDate).toLocaleDateString('ru-RU')}\n` +
        `📍 Адрес: ${formData.deliveryAddress}\n\n` +
        `*👤 Отправитель:*\n` +
        `📞 Телефон: ${formData.senderPhone}\n` +
        `👤 Имя: ${formData.senderName}\n\n` +
        `*🎯 Получатель:*\n` +
        `📞 Телефон: ${formData.receiverPhone || formData.senderPhone}\n` +
        `👤 Имя: ${formData.receiverName}\n\n` +
        `*💌 Дополнительно:*\n` +
        `Пожелания: ${formData.bouquetWishes || 'не указаны'}\n` +
        `Открытка: ${formData.cardMessage || 'не указана'}`;

    console.log('📋 Сообщение для менеджера:\n', orderMessage);
    
    // Здесь можно добавить отправку на сервер или в Telegram бота
    showNotification('📤 Заказ отправлен менеджеру!');
}

// Очистка корзины и сброс
function clearCartAndReset() {
    cart = [];
    updateCartDisplay();
    showMainPage();
}

// Основная функция инициализации
function initApp() {
    console.log('🚀 Запуск приложения...');
    initTelegramApp();
    loadProducts();
    setupCategoryTabs();
    updateCartDisplay();
    setupDeliveryDate();
    console.log('✅ Приложение запущено успешно!');
}

// =============================================
// 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
// =============================================

document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем функции для глобального доступа
window.showProductDetail = showProductDetail;
window.showMainPage = showMainPage;
window.showOrderPage = showOrderPage;
window.addToCart = addToCart;
window.validateAndConfirmOrder = validateAndConfirmOrder;
