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

// Подтверждение заказа
function confirmOrder() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }
    
    const orderDetails = cart.map(item => 
        `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderMessage = `💐 *Новый заказ из цветочного магазина*\n\n${orderDetails}\n\n*Итого:* ${total.toLocaleString()} ₽\n\n_Для подтверждения заказа свяжитесь с клиентом_`;
    
    // Показываем подтверждение в Telegram
    if (tg && tg.showPopup) {
        tg.showPopup({
            title: '✅ Заказ подтвержден!',
            message: `Спасибо за заказ!\n\n${orderDetails}\n\nИтого: ${total.toLocaleString()} ₽\n\nНаш менеджер свяжется с вами в течение 5 минут для уточнения деталей.`,
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
                tg.openTelegramLink('https://t.me/Nataliia_Nevzorova');
            }
            // Очищаем корзину после заказа
            cart = [];
            updateCartDisplay();
            showMainPage();
        });
    } else {
        // Для браузера
        const userConfirmed = confirm(`Ваш заказ:\n\n${orderDetails}\n\nИтого: ${total.toLocaleString()} ₽\n\nДля завершения заказа свяжитесь с менеджером: @your_flower_manager`);
        
        if (userConfirmed) {
            window.open('https://t.me/Nataliia_Nevzorova', '_blank');
        }
        
        // Очищаем корзину после заказа
        cart = [];
        updateCartDisplay();
        showMainPage();
    }
}

// Основная функция инициализации
function initApp() {
    initTelegramApp();
}

// =============================================
// 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
// =============================================

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем функции для глобального доступа
window.showProductDetail = showProductDetail;
window.showMainPage = showMainPage;
window.showOrderPage = showOrderPage;
window.addToCart = addToCart;
window.confirmOrder = confirmOrder;

console.log('🌸 Telegram Mini App загружен успешно!');
