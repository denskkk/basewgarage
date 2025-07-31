// Система уведомлений в реальном времени для W Garage
class RealTimeNotificationManager {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.socket = null;
        this.container = null;
        this.badge = null;
        
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupEventListeners();
        this.loadNotifications();
        this.updateBadge();
        
        // Подключаемся к WebSocket если API клиент уже инициализирован
        this.connectToSocket();
        
        // Проверяем подключение каждые 2 секунды если не подключены
        this.connectionInterval = setInterval(() => {
            if (!this.socket) {
                this.connectToSocket();
            }
        }, 2000);
    }
    
    connectToSocket() {
        // Используем сокет из API клиента
        if (window.wgarageAPI && window.wgarageAPI.socket) {
            this.socket = window.wgarageAPI.socket;
            this.setupSocketListeners();
            clearInterval(this.connectionInterval);
        }
    }

    createNotificationContainer() {
        // Создаем контейнер для уведомлений
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);

        // Создаем стили
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }

            .notification-item {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                padding: 1rem;
                margin-bottom: 0.5rem;
                min-width: 300px;
                max-width: 400px;
                pointer-events: auto;
                transform: translateX(100%);
                transition: all 0.3s ease;
                opacity: 0;
                color: #000000 !important; /* Черный цвет текста */
            }

            .notification-item * {
                color: #000000 !important; /* Все элементы внутри черным цветом */
            }

            .notification-item.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification-item.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .notification-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }

            .notification-title {
                font-weight: 600;
                color: #000000 !important;
                font-size: 0.9rem;
            }

            .notification-close {
                background: none;
                border: none;
                color: #64748b !important;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .notification-close:hover {
                background: var(--surface-hover);
                color: var(--text-primary);
            }

            .notification-message {
                color: var(--text-secondary);
                font-size: 0.85rem;
                line-height: 1.4;
                margin-bottom: 0.5rem;
            }

            .notification-time {
                font-size: 0.75rem;
                color: var(--text-muted);
            }

            .notification-actions {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.75rem;
            }

            .notification-action {
                padding: 0.375rem 0.75rem;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                background: var(--surface);
                color: var(--text-primary);
                text-decoration: none;
                font-size: 0.8rem;
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .notification-action:hover {
                background: var(--surface-hover);
            }

            .notification-action.primary {
                background: var(--primary);
                color: white;
                border-color: var(--primary);
            }

            .notification-action.primary:hover {
                background: var(--primary-dark);
            }

            /* Типы уведомлений */
            .notification-item.success {
                border-left: 4px solid var(--success);
            }

            .notification-item.error {
                border-left: 4px solid var(--danger);
            }

            .notification-item.warning {
                border-left: 4px solid var(--warning);
            }

            .notification-item.info {
                border-left: 4px solid var(--info);
            }

            /* Список уведомлений */
            .notifications-panel {
                position: fixed;
                top: 70px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: var(--surface);
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                pointer-events: none;
            }

            .notifications-panel.show {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }

            .notifications-panel-header {
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .notifications-panel-title {
                font-weight: 600;
                color: var(--text-primary);
            }

            .notifications-panel-actions {
                display: flex;
                gap: 0.5rem;
            }

            .notifications-panel-action {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: var(--border-radius);
                font-size: 0.8rem;
            }

            .notifications-panel-action:hover {
                color: var(--text-primary);
                background: var(--surface-hover);
            }

            .notifications-panel-list {
                max-height: 400px;
                overflow-y: auto;
            }

            .notification-list-item {
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: var(--transition-fast);
            }

            .notification-list-item:hover {
                background: var(--surface-hover);
            }

            .notification-list-item.unread {
                background: rgba(var(--primary-rgb), 0.05);
                border-left: 3px solid var(--primary);
            }

            .notification-list-item:last-child {
                border-bottom: none;
            }

            .notification-empty {
                padding: 2rem;
                text-align: center;
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Обработчик кнопки уведомлений
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNotificationsPanel();
            });
        }

        // Закрытие панели при клике вне её
        document.addEventListener('click', (e) => {
            const panel = document.querySelector('.notifications-panel');
            const btn = document.getElementById('notificationsBtn');
            
            if (panel && panel.classList.contains('show') && 
                !panel.contains(e.target) && !btn?.contains(e.target)) {
                this.hideNotificationsPanel();
            }
        });
    }

    setupSocketListeners() {
        if (!this.socket) return;

        // Новая задача (общее уведомление)
        this.socket.on('newTask', (data) => {
            console.log('📋 Уведомление о создании задачи:', data);
        });

        // Персональная задача (для конкретного пользователя)
        this.socket.on('personalTask', (data) => {
            console.log('🎯 Персональная задача получена:', data);
            this.showToast('🎯 Вам назначена новая задача!', `${data.title}`, 'success', [
                {
                    text: 'Просмотреть',
                    action: () => this.openTask(data.id)
                }
            ]);
            this.addNotification({
                title: 'Новая задача назначена',
                message: `${data.title}${data.deadline ? ` (Дедлайн: ${new Date(data.deadline).toLocaleDateString()})` : ''}`,
                type: 'task',
                relatedId: data.id,
                isRead: false
            });
        });

        // Обновление задачи
        this.socket.on('taskUpdate', (data) => {
            this.showToast('Обновление задачи', `Статус задачи "${data.title}" изменен`, 'info');
            this.addNotification({
                title: 'Обновление задачи',
                message: `Статус задачи "${data.title}" изменен`,
                type: 'task',
                relatedId: data.taskId,
                isRead: false
            });
        });

        // Новый комментарий
        this.socket.on('newComment', (data) => {
            this.showToast('Новый комментарий', `Новый комментарий к задаче "${data.title}"`, 'info');
            this.addNotification({
                title: 'Новый комментарий',
                message: `Новый комментарий к задаче "${data.title}"`,
                type: 'comment',
                relatedId: data.taskId,
                isRead: false
            });
        });
    }

    // Показать всплывающее уведомление
    showToast(title, message, type = 'info', actions = [], duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-time">${new Date().toLocaleTimeString()}</div>
            ${actions.length > 0 ? `
                <div class="notification-actions">
                    ${actions.map(action => `
                        <button class="notification-action ${action.primary ? 'primary' : ''}" 
                                data-action="${actions.indexOf(action)}">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        // Добавляем обработчики
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hideToast(notification));

        // Обработчики действий
        actions.forEach((action, index) => {
            const btn = notification.querySelector(`[data-action="${index}"]`);
            if (btn) {
                btn.addEventListener('click', () => {
                    action.action();
                    this.hideToast(notification);
                });
            }
        });

        this.container.appendChild(notification);

        // Показываем с анимацией
        setTimeout(() => notification.classList.add('show'), 100);

        // Автоматически скрываем
        if (duration > 0) {
            setTimeout(() => this.hideToast(notification), duration);
        }

        return notification;
    }

    // Скрыть всплывающее уведомление
    hideToast(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Загрузить уведомления с сервера
    async loadNotifications() {
        if (!window.WGarageAPI || !window.UserManager.isLoggedIn()) {
            return;
        }

        try {
            this.notifications = await window.WGarageAPI.getNotifications();
            this.updateUnreadCount();
            this.updateBadge();
        } catch (error) {
            console.error('Ошибка загрузки уведомлений:', error);
            // Fallback на локальные данные
            this.notifications = JSON.parse(localStorage.getItem('wgarage-notifications') || '[]');
        }
    }

    // Добавить уведомление
    addNotification(notification) {
        notification.id = Date.now();
        notification.created = new Date().toISOString();
        this.notifications.unshift(notification);
        
        // Ограничиваем количество уведомлений
        if (this.notifications.length > 100) {
            this.notifications = this.notifications.slice(0, 100);
        }

        this.updateUnreadCount();
        this.updateBadge();
        this.saveNotificationsLocally();
        
        // Обновляем панель если она открыта
        const panel = document.querySelector('.notifications-panel');
        if (panel && panel.classList.contains('show')) {
            this.renderNotificationsList();
        }
    }

    // Обновить счетчик непрочитанных
    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }

    // Обновить бейдж
    updateBadge() {
        const badge = document.getElementById('notificationCount');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Показать/скрыть панель уведомлений
    toggleNotificationsPanel() {
        const existingPanel = document.querySelector('.notifications-panel');
        
        if (existingPanel) {
            if (existingPanel.classList.contains('show')) {
                this.hideNotificationsPanel();
            } else {
                this.showNotificationsPanel();
            }
        } else {
            this.showNotificationsPanel();
        }
    }

    // Показать панель уведомлений
    showNotificationsPanel() {
        this.hideNotificationsPanel(); // Убираем существующую

        const panel = document.createElement('div');
        panel.className = 'notifications-panel';
        
        panel.innerHTML = `
            <div class="notifications-panel-header">
                <div class="notifications-panel-title">Уведомления</div>
                <div class="notifications-panel-actions">
                    <button class="notifications-panel-action" id="markAllRead">
                        Отметить все
                    </button>
                    <button class="notifications-panel-action" id="closeNotifications">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="notifications-panel-list" id="notificationsList">
                <!-- Список уведомлений -->
            </div>
        `;

        document.body.appendChild(panel);

        // Обработчики
        panel.querySelector('#markAllRead').addEventListener('click', () => {
            this.markAllAsRead();
        });

        panel.querySelector('#closeNotifications').addEventListener('click', () => {
            this.hideNotificationsPanel();
        });

        this.renderNotificationsList();

        // Показываем с анимацией
        setTimeout(() => panel.classList.add('show'), 100);
    }

    // Скрыть панель уведомлений
    hideNotificationsPanel() {
        const panel = document.querySelector('.notifications-panel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => {
                if (panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }
            }, 300);
        }
    }

    // Отрендерить список уведомлений
    renderNotificationsList() {
        const list = document.getElementById('notificationsList');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="notification-empty">Нет уведомлений</div>';
            return;
        }

        list.innerHTML = this.notifications.map(notification => `
            <div class="notification-list-item ${!notification.isRead ? 'unread' : ''}" 
                 data-id="${notification.id}">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${this.formatTime(notification.created)}</div>
            </div>
        `).join('');

        // Добавляем обработчики кликов
        list.querySelectorAll('.notification-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.handleNotificationClick(id);
            });
        });
    }

    // Обработка клика по уведомлению
    async handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        // Отмечаем как прочитанное
        await this.markAsRead(notificationId);

        // Выполняем действие в зависимости от типа
        if (notification.type === 'task' && notification.relatedId) {
            this.openTask(notification.relatedId);
        }

        this.hideNotificationsPanel();
    }

    // Отметить как прочитанное
    async markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification || notification.isRead) return;

        notification.isRead = true;
        this.updateUnreadCount();
        this.updateBadge();
        this.saveNotificationsLocally();

        // Отправляем на сервер
        if (window.WGarageAPI && notification.serverId) {
            try {
                await window.WGarageAPI.markNotificationAsRead(notification.serverId);
            } catch (error) {
                console.error('Ошибка отметки уведомления как прочитанного:', error);
            }
        }
    }

    // Отметить все как прочитанные
    async markAllAsRead() {
        this.notifications.forEach(n => n.isRead = true);
        this.updateUnreadCount();
        this.updateBadge();
        this.saveNotificationsLocally();
        this.renderNotificationsList();

        // Отправляем на сервер
        if (window.WGarageAPI) {
            try {
                await window.WGarageAPI.markAllNotificationsAsRead();
            } catch (error) {
                console.error('Ошибка отметки всех уведомлений как прочитанных:', error);
            }
        }
    }

    // Открыть задачу
    openTask(taskId) {
        // Переходим на страницу задач и выделяем нужную задачу
        if (window.dashboard) {
            window.dashboard.loadPage('tasks');
            setTimeout(() => {
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (taskElement) {
                    taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    taskElement.classList.add('highlight');
                    setTimeout(() => taskElement.classList.remove('highlight'), 2000);
                }
            }, 500);
        }
    }

    // Форматирование времени
    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) { // меньше минуты
            return 'только что';
        } else if (diff < 3600000) { // меньше часа
            const minutes = Math.floor(diff / 60000);
            return `${minutes} мин назад`;
        } else if (diff < 86400000) { // меньше дня
            const hours = Math.floor(diff / 3600000);
            return `${hours} ч назад`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // Сохранение уведомлений локально
    saveNotificationsLocally() {
        localStorage.setItem('wgarage-notifications', JSON.stringify(this.notifications));
    }

    // Очистка уведомлений
    clearAll() {
        this.notifications = [];
        this.unreadCount = 0;
        this.updateBadge();
        this.saveNotificationsLocally();
        this.renderNotificationsList();
    }
}

// Совместимость со старым NotificationManager
class LegacyNotificationManager {
    constructor() {
        this.realTimeManager = new RealTimeNotificationManager();
    }

    // Методы для совместимости
    show(message, type = 'info', duration = 5000) {
        this.realTimeManager.showToast('Уведомление', message, type, [], duration);
    }

    success(message, duration = 5000) {
        this.realTimeManager.showToast('Успешно', message, 'success', [], duration);
    }

    error(message, duration = 5000) {
        this.realTimeManager.showToast('Ошибка', message, 'error', [], duration);
    }

    warning(message, duration = 5000) {
        this.realTimeManager.showToast('Предупреждение', message, 'warning', [], duration);
    }

    info(message, duration = 5000) {
        this.realTimeManager.showToast('Информация', message, 'info', [], duration);
    }

    confirm(message, onConfirm, onCancel = null, options = {}) {
        const notification = this.realTimeManager.showToast(
            options.title || 'Подтверждение',
            message,
            'warning',
            [
                {
                    text: options.cancelText || 'Отмена',
                    action: () => {
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: options.confirmText || 'Подтвердить',
                    primary: true,
                    action: () => {
                        if (onConfirm) onConfirm();
                    }
                }
            ],
            0 // Не автоматически скрывать
        );

        return notification;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.NotificationManager = new LegacyNotificationManager();
    window.RealTimeNotifications = window.NotificationManager.realTimeManager;
    
    console.log('✅ Система уведомлений в реальном времени инициализирована');
});

// Добавляем стили для выделения задач
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .highlight {
        animation: highlightPulse 2s ease-in-out;
        background: rgba(var(--primary-rgb), 0.1) !important;
        border: 2px solid var(--primary) !important;
    }

    @keyframes highlightPulse {
        0%, 100% { 
            background: rgba(var(--primary-rgb), 0.1); 
            transform: scale(1);
        }
        50% { 
            background: rgba(var(--primary-rgb), 0.2); 
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(highlightStyle);
