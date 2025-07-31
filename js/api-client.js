// API клиент для W Garage
class WGarageAPI {
    constructor() {
        this.baseURL = window.location.protocol + '//' + window.location.host + '/api';
        this.token = localStorage.getItem('wgarage-token');
        this.socket = null;
        this.isOnline = navigator.onLine;
        
        this.setupOnlineDetection();
        this.initSocket();
    }

    // Настройка детекции онлайн/офлайн
    setupOnlineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Инициализация WebSocket
    initSocket() {
        if (this.socket) return;
        
        this.socket = io(window.location.origin);
        
        this.socket.on('connect', () => {
            console.log('✅ WebSocket подключен');
            if (this.token) {
                const user = this.getCurrentUser();
                if (user) {
                    this.socket.emit('userConnect', user.id);
                }
            }
        });

        this.socket.on('disconnect', () => {
            console.log('❌ WebSocket отключен');
        });

        // Обработчики событий
        this.socket.on('newTask', (data) => {
            this.showNotification('Новая задача', `Вам назначена задача: ${data.title}`, 'info');
            this.updateTaskList();
        });

        this.socket.on('taskUpdate', (data) => {
            this.showNotification('Обновление задачи', `Статус задачи "${data.title}" изменен`, 'info');
            this.updateTaskList();
        });

        this.socket.on('newComment', (data) => {
            this.showNotification('Новый комментарий', `Новый комментарий к задаче "${data.title}"`, 'info');
        });
    }

    // Универсальный метод для API запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            }
        };

        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Сессия истекла, необходимо войти заново');
                }
                throw new Error(data.error || 'Ошибка сервера');
            }

            return data;
        } catch (error) {
            if (!this.isOnline) {
                return this.handleOfflineRequest(endpoint, options);
            }
            throw error;
        }
    }

    // Обработка офлайн запросов
    handleOfflineRequest(endpoint, options) {
        const offlineData = JSON.parse(localStorage.getItem('wgarage-offline-data') || '[]');
        
        // Сохраняем запрос для последующей синхронизации
        if (options.method === 'POST' || options.method === 'PUT') {
            offlineData.push({
                endpoint,
                options,
                timestamp: Date.now()
            });
            localStorage.setItem('wgarage-offline-data', JSON.stringify(offlineData));
        }

        throw new Error('Нет подключения к интернету. Данные сохранены для синхронизации.');
    }

    // Синхронизация офлайн данных
    async syncOfflineData() {
        const offlineData = JSON.parse(localStorage.getItem('wgarage-offline-data') || '[]');
        
        if (offlineData.length === 0) return;

        for (const request of offlineData) {
            try {
                await this.request(request.endpoint, request.options);
            } catch (error) {
                console.error('Ошибка синхронизации:', error);
            }
        }

        localStorage.removeItem('wgarage-offline-data');
        this.showNotification('Синхронизация', 'Данные успешно синхронизированы', 'success');
    }

    // Авторизация
    async login(username, password) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (response.success) {
                this.token = response.token;
                localStorage.setItem('wgarage-token', this.token);
                localStorage.setItem('wgarage-current-user', JSON.stringify(response.user));
                
                // Подключаем к WebSocket
                if (this.socket) {
                    this.socket.emit('userConnect', response.user.id);
                }

                return { success: true, user: response.user };
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            return { success: false, message: error.message };
        }
    }

    // Выход
    logout() {
        this.token = null;
        localStorage.removeItem('wgarage-token');
        localStorage.removeItem('wgarage-current-user');
        
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Получение текущего пользователя
    getCurrentUser() {
        const userData = localStorage.getItem('wgarage-current-user');
        return userData ? JSON.parse(userData) : null;
    }

    // Проверка авторизации
    isLoggedIn() {
        return !!this.token && !!this.getCurrentUser();
    }

    // Смена пароля
    async changePassword(oldPassword, newPassword) {
        return await this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword })
        });
    }

    // Получение пользователей
    async getUsers() {
        return await this.request('/users');
    }

    // Работа с задачами

    // Получение задач
    async getTasks() {
        return await this.request('/tasks');
    }

    // Создание задачи
    async createTask(taskData) {
        return await this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    // Обновление статуса задачи
    async updateTaskStatus(taskId, status, comment = '') {
        return await this.request(`/tasks/${taskId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, comment })
        });
    }

    // Добавление комментария
    async addTaskComment(taskId, comment) {
        return await this.request(`/tasks/${taskId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment })
        });
    }

    // Получение комментариев
    async getTaskComments(taskId) {
        return await this.request(`/tasks/${taskId}/comments`);
    }

    // Работа с уведомлениями

    // Получение уведомлений
    async getNotifications() {
        return await this.request('/notifications');
    }

    // Отметка как прочитанное
    async markNotificationAsRead(notificationId) {
        return await this.request(`/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
    }

    // Отметить все как прочитанные
    async markAllNotificationsAsRead() {
        return await this.request('/notifications/read-all', {
            method: 'PUT'
        });
    }

    // Аналитика (только для руководителей)
    async getAnalytics() {
        return await this.request('/analytics/dashboard');
    }

    // Вспомогательные методы

    // Обновление списка задач
    updateTaskList() {
        if (window.dashboard && typeof window.dashboard.refreshTasksPage === 'function') {
            window.dashboard.refreshTasksPage();
        }
    }

    // Показ уведомления
    showNotification(title, message, type = 'info') {
        if (window.NotificationManager) {
            window.NotificationManager[type](message, 5000);
        } else {
            // Fallback на обычное уведомление
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, { body: message });
            }
        }
    }

    // Запрос разрешения на уведомления
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }
}

// Создаем глобальный экземпляр API
window.WGarageAPI = new WGarageAPI();

// Обновляем UserManager для работы с новым API
window.UserManager = {
    // Авторизация
    async login(username, password) {
        return await window.WGarageAPI.login(username, password);
    },

    // Выход
    logout() {
        window.WGarageAPI.logout();
    },

    // Проверка авторизации
    isLoggedIn() {
        return window.WGarageAPI.isLoggedIn();
    },

    // Получение текущего пользователя
    getCurrentUser() {
        return window.WGarageAPI.getCurrentUser();
    },

    // Смена пароля
    async changePassword(oldPassword, newPassword) {
        return await window.WGarageAPI.changePassword(oldPassword, newPassword);
    },

    // Получение доступных пользователей
    async getAvailableUsers() {
        try {
            return await window.WGarageAPI.getUsers();
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            return [];
        }
    }
};

// Обновляем TaskManager для работы с новым API
window.TaskManager = {
    tasks: [],

    // Инициализация
    async init() {
        try {
            await this.loadTasks();
            console.log('✅ TaskManager инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации TaskManager:', error);
        }
    },

    // Загрузка задач
    async loadTasks() {
        try {
            this.tasks = await window.WGarageAPI.getTasks();
            return this.tasks;
        } catch (error) {
            console.error('Ошибка загрузки задач:', error);
            // Fallback на локальные данные
            this.tasks = JSON.parse(localStorage.getItem('wgarage-tasks') || '[]');
            return this.tasks;
        }
    },

    // Создание задачи
    async createTask(taskData) {
        try {
            const result = await window.WGarageAPI.createTask(taskData);
            await this.loadTasks(); // Перезагружаем список
            return { success: true, task: result };
        } catch (error) {
            console.error('Ошибка создания задачи:', error);
            return { success: false, message: error.message };
        }
    },

    // Получение задач для пользователя
    getTasksForUser(userId) {
        return this.tasks.filter(task => 
            task.assignedTo === userId || task.assignedBy === userId
        );
    },

    // Получение всех задач (только для руководителей)
    getAllTasks() {
        const currentUser = window.UserManager.getCurrentUser();
        if (!currentUser || !currentUser.canViewAll) return [];
        return this.tasks;
    },

    // Обновление статуса задачи
    async updateTaskStatus(taskId, status, comment = '') {
        try {
            await window.WGarageAPI.updateTaskStatus(taskId, status, comment);
            await this.loadTasks();
            return { success: true };
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            return { success: false, message: error.message };
        }
    },

    // Добавление комментария
    async addComment(taskId, comment) {
        try {
            await window.WGarageAPI.addTaskComment(taskId, comment);
            return { success: true };
        } catch (error) {
            console.error('Ошибка добавления комментария:', error);
            return { success: false, message: error.message };
        }
    },

    // Получение комментариев
    async getComments(taskId) {
        try {
            return await window.WGarageAPI.getTaskComments(taskId);
        } catch (error) {
            console.error('Ошибка получения комментариев:', error);
            return [];
        }
    },

    // Принятие задачи в работу
    async acceptTask(taskId, comment = '') {
        return await this.updateTaskStatus(taskId, 'in_progress', comment);
    },

    // Завершение задачи
    async completeTask(taskId, comment = '') {
        return await this.updateTaskStatus(taskId, 'completed', comment);
    },

    // Отклонение задачи
    async rejectTask(taskId, reason) {
        return await this.updateTaskStatus(taskId, 'rejected', reason);
    },

    // Получение одной задачи по ID
    getTask(taskId) {
        return this.tasks.find(task => task.id === taskId);
    },

    // Получение текста статуса
    getStatusText(status) {
        const statuses = {
            'new': 'Новая',
            'in_progress': 'В работе',
            'completed': 'Выполнена',
            'cancelled': 'Отменена',
            'rejected': 'Отклонена'
        };
        return statuses[status] || status;
    },

    // Получение доступных пользователей для назначения задач
    async getAvailableAssignees() {
        return await window.UserManager.getAvailableUsers();
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Запрашиваем разрешение на уведомления
    window.WGarageAPI.requestNotificationPermission();
    
    // Инициализируем TaskManager если пользователь авторизован
    if (window.UserManager.isLoggedIn()) {
        window.TaskManager.init();
    }
});

console.log('✅ W Garage API клиент инициализирован');
