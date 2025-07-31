// Утилиты для расширения функциональности базы знаний W Garage

// Класс для работы с уведомлениями
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }
    
    init() {
        // Создаем контейнер для уведомлений
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        const id = Date.now().toString();
        
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--surface);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            box-shadow: var(--shadow-lg);
            max-width: 350px;
            pointer-events: auto;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        const icon = this.getIcon(type);
        const iconEl = document.createElement('i');
        iconEl.className = icon.class;
        iconEl.style.color = icon.color;
        
        const messageEl = document.createElement('span');
        messageEl.textContent = message;
        messageEl.style.color = 'var(--text-primary)';
        
        notification.appendChild(iconEl);
        notification.appendChild(messageEl);
        
        this.container.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Автоматическое скрытие
        setTimeout(() => {
            this.hide(notification);
        }, duration);
        
        // Клик для закрытия
        notification.addEventListener('click', () => {
            this.hide(notification);
        });
        
        return id;
    }
    
    hide(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    getIcon(type) {
        const icons = {
            'info': { class: 'fas fa-info-circle', color: 'var(--primary-color)' },
            'success': { class: 'fas fa-check-circle', color: 'var(--success-color)' },
            'warning': { class: 'fas fa-exclamation-triangle', color: 'var(--warning-color)' },
            'error': { class: 'fas fa-times-circle', color: 'var(--error-color)' }
        };
        return icons[type] || icons.info;
    }
}

// Класс для работы с избранными элементами
class FavoritesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('wgarage-favorites') || '[]');
    }
    
    add(roleId) {
        if (!this.favorites.includes(roleId)) {
            this.favorites.push(roleId);
            this.save();
            return true;
        }
        return false;
    }
    
    remove(roleId) {
        const index = this.favorites.indexOf(roleId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }
    
    toggle(roleId) {
        if (this.has(roleId)) {
            this.remove(roleId);
            return false;
        } else {
            this.add(roleId);
            return true;
        }
    }
    
    has(roleId) {
        return this.favorites.includes(roleId);
    }
    
    getAll() {
        return [...this.favorites];
    }
    
    save() {
        localStorage.setItem('wgarage-favorites', JSON.stringify(this.favorites));
    }
}

// Класс для экспорта данных
class DataExporter {
    static exportToJSON(roleId = null) {
        const data = roleId ? 
            { [roleId]: window.roleDatabase[roleId] } : 
            window.roleDatabase;
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const filename = roleId ? 
            `wgarage-${roleId}.json` : 
            'wgarage-all-roles.json';
        
        this.downloadFile(blob, filename);
    }
    
    static exportToCSV(roleId = null) {
        const roles = roleId ? [window.roleDatabase[roleId]] : Object.values(window.roleDatabase);
        
        let csv = 'Должность,Описание,Обязанности,Навыки,Инструменты,Процедуры\n';
        
        roles.forEach(role => {
            const row = [
                role.title,
                role.description,
                role.responsibilities.join('; '),
                role.skills.join('; '),
                role.tools.join('; '),
                role.procedures.join('; ')
            ].map(field => `"${field.replace(/"/g, '""')}"`).join(',');
            
            csv += row + '\n';
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const filename = roleId ? 
            `wgarage-${roleId}.csv` : 
            'wgarage-all-roles.csv';
        
        this.downloadFile(blob, filename);
    }
    
    static downloadFile(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }
}

// Класс для аналитики использования
class AnalyticsManager {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('wgarage-analytics') || '{}');
        this.initDefaults();
    }
    
    initDefaults() {
        if (!this.data.pageViews) this.data.pageViews = {};
        if (!this.data.searchQueries) this.data.searchQueries = {};
        if (!this.data.sessions) this.data.sessions = [];
        if (!this.data.startDate) this.data.startDate = new Date().toISOString();
    }
    
    trackPageView(roleId) {
        if (!this.data.pageViews[roleId]) {
            this.data.pageViews[roleId] = 0;
        }
        this.data.pageViews[roleId]++;
        this.save();
    }
    
    trackSearch(query) {
        if (!this.data.searchQueries[query]) {
            this.data.searchQueries[query] = 0;
        }
        this.data.searchQueries[query]++;
        this.save();
    }
    
    startSession() {
        const session = {
            id: Date.now().toString(),
            startTime: new Date().toISOString(),
            pageViews: [],
            searchQueries: []
        };
        this.currentSession = session;
        return session.id;
    }
    
    endSession() {
        if (this.currentSession) {
            this.currentSession.endTime = new Date().toISOString();
            this.data.sessions.push(this.currentSession);
            this.currentSession = null;
            this.save();
        }
    }
    
    getMostViewedRoles(limit = 5) {
        return Object.entries(this.data.pageViews)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([roleId, views]) => ({
                roleId,
                title: window.roleDatabase[roleId]?.title || roleId,
                views
            }));
    }
    
    getMostSearchedQueries(limit = 10) {
        return Object.entries(this.data.searchQueries)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit);
    }
    
    getUsageReport() {
        const totalPageViews = Object.values(this.data.pageViews).reduce((a, b) => a + b, 0);
        const totalSearches = Object.values(this.data.searchQueries).reduce((a, b) => a + b, 0);
        const totalSessions = this.data.sessions.length;
        
        return {
            totalPageViews,
            totalSearches,
            totalSessions,
            startDate: this.data.startDate,
            mostViewedRoles: this.getMostViewedRoles(),
            mostSearchedQueries: this.getMostSearchedQueries()
        };
    }
    
    save() {
        localStorage.setItem('wgarage-analytics', JSON.stringify(this.data));
    }
    
    exportReport() {
        const report = this.getUsageReport();
        DataExporter.exportToJSON('analytics-report');
    }
}

// Класс для работы с настройками
class SettingsManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('wgarage-settings') || '{}');
        this.initDefaults();
    }
    
    initDefaults() {
        const defaults = {
            theme: 'light',
            sidebarCollapsed: false,
            animationsEnabled: true,
            autoSave: true,
            searchResultsLimit: 20,
            notificationsEnabled: true,
            language: 'ru'
        };
        
        Object.keys(defaults).forEach(key => {
            if (this.settings[key] === undefined) {
                this.settings[key] = defaults[key];
            }
        });
    }
    
    get(key) {
        return this.settings[key];
    }
    
    set(key, value) {
        this.settings[key] = value;
        this.save();
        this.applySettings();
    }
    
    getAll() {
        return { ...this.settings };
    }
    
    reset() {
        localStorage.removeItem('wgarage-settings');
        this.settings = {};
        this.initDefaults();
        this.applySettings();
    }
    
    applySettings() {
        // Применяем тему
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        // Применяем состояние боковой панели
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            if (this.settings.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        }
        
        // Применяем настройки анимаций
        if (!this.settings.animationsEnabled) {
            document.body.style.setProperty('--transition-fast', '0s');
            document.body.style.setProperty('--transition-normal', '0s');
            document.body.style.setProperty('--transition-slow', '0s');
        }
    }
    
    save() {
        localStorage.setItem('wgarage-settings', JSON.stringify(this.settings));
    }
}

// Класс для работы с историей просмотров
class HistoryManager {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('wgarage-history') || '[]');
        this.maxItems = 50;
    }
    
    add(roleId) {
        const item = {
            roleId,
            timestamp: new Date().toISOString(),
            title: window.roleDatabase[roleId]?.title || roleId
        };
        
        // Удаляем предыдущий просмотр этой роли
        this.history = this.history.filter(h => h.roleId !== roleId);
        
        // Добавляем в начало
        this.history.unshift(item);
        
        // Ограничиваем размер истории
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }
        
        this.save();
    }
    
    getRecent(limit = 10) {
        return this.history.slice(0, limit);
    }
    
    clear() {
        this.history = [];
        this.save();
    }
    
    save() {
        localStorage.setItem('wgarage-history', JSON.stringify(this.history));
    }
}

// Инициализация утилит
window.WGarageUtils = {
    notifications: new NotificationManager(),
    favorites: new FavoritesManager(),
    analytics: new AnalyticsManager(),
    settings: new SettingsManager(),
    history: new HistoryManager(),
    exporter: DataExporter
};

// Инициализация аналитики при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.WGarageUtils.analytics.startSession();
    window.WGarageUtils.settings.applySettings();
});

// Завершение сессии при закрытии страницы
window.addEventListener('beforeunload', () => {
    window.WGarageUtils.analytics.endSession();
});
