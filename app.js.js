// =============================================
// 🌸 ЦВЕТОЧНЫЙ МАГАЗИН - Telegram Mini App
// =============================================

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализируем приложение
function initApp() {
    // Раскрываем на весь экран
    tg.expand();
    
    // Включаем подтверждение закрытия
    tg.enableClosingConfirmation();
    
    // Показываем кнопку "Назад"
    tg.BackButton.show();
    tg.BackButton.onClick(handleBackButton);
    
    // Загружаем данные
    loadProducts();
    setupCategoryTabs();
    updateCartDisplay();
    
    console.log('🌸 Цветочный магазин загружен!');
    console.log('Пользователь:', tg.initDataUnsafe?.user);
}

// Обработчик кнопки "Назад"
function handleBackButton() {
    if (isProductPageVisible()) {
        showMainPage();
    }
}

// Проверка видимости страницы товара
function isProductPageVisible() {
    return !document.getElementById('productPage').classList.contains('hidden');
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
    },
    {
        id: 7,
        name: "Розовые пионы",
        description: "7 пушистых пионов в нежных тонах",
        price: 3800,
        category: "mixed",
        emoji: "🌺",
        features: ["Нежный аромат", "Пышные бутоны", "В моде сезона"]
    },
    {
        id: 8,
        name: "Классические розы",
        description: "15 алых роз классической формы",
        price: 2900,
        category: "roses",
        emoji: "🌹",
        features: ["Идеальная форма", "Длинный стебель", "Вечная классика"]
    }
];

// Корзина и состояние приложения
let cart = [];
let currentCategory = 'all';

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
    
    // Показываем кнопку "Назад"
    tg.BackButton.show();
    
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

// Вернуться на главную страницу
function showMainPage() {
    document.getElementById('mainPage').classList.remove('hidden');
    document.getElementById('productPage').classList.add('hidden');
    tg.BackButton.hide();
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
    
    // Тактильный отклик
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Показываем уведомление
    showNotification(`✅ ${product.name} добавлен в корзину`);
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
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

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        tg.showPopup({
            title: 'Корзина пуста',
            message: 'Добавьте товары в корзину перед оформлением заказа',
            buttons: [{ type: 'ok' }]
        });
        return;
    }
    
    const orderDetails = cart.map(item => 
        `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Создаем сообщение для отправки
    const orderMessage = `💐 *Новый заказ из цветочного магазина*\\n\\n` +
                        `${orderDetails}\\n\\n` +
                        `*Итого:* ${total.toLocaleString()} ₽\\n\\n` +
                        `_Для подтверждения заказа свяжитесь с клиентом_`;
    
    tg.showPopup({
        title: '💐 Ваш заказ',
        message: `Спасибо за выбор нашей цветочной лавки!\n\n${orderDetails}\n\nИтого: ${total.toLocaleString()} ₽\n\nДля завершения заказа наш менеджер свяжется с вами в течение 5 минут.`,
        buttons: [
            {
                type: 'default',
                text: '📞 Связаться с менеджером',
                id: 'contact_manager'
            },
            {
                type: 'destructive', 
                text: '✏️ Изменить заказ',
                id: 'cancel'
            }
        ]
    });
    
    // Обработка действий в попапе
    const popupHandler = (data) => {
        if (data.button_id === 'contact_manager') {
            // Открываем чат с менеджером
            tg.openTelegramLink('https://t.me/your_flower_manager');
        }
        tg.offEvent('popupClosed', popupHandler);
    };
    
    tg.onEvent('popupClosed', popupHandler);
}

// Очистка корзины (для тестирования)
function clearCart() {
    cart = [];
    updateCartDisplay();
    showNotification('🛒 Корзина очищена');
}

// =============================================
// 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
// =============================================

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем функции для глобального доступа
window.showProductDetail = showProductDetail;
window.showMainPage = showMainPage;
window.addToCart = addToCart;
window.checkout = checkout;
window.clearCart = clearCart;

console.log('🌸 app.js загружен успешно!');