// Система уведомлений для W Garage
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.attachToWindow();
    }

    createContainer() {
        // Создаем контейнер для уведомлений
        this.container = document.createElement('div');
        this.container.id = 'notifications-container';
        this.container.className = 'notifications-container';
        document.body.appendChild(this.container);
    }

    attachToWindow() {
        window.NotificationManager = this;
    }

    // Показать уведомление
    show(message, type = 'info', duration = 5000, actions = null) {
        const notification = {
            id: Date.now() + Math.random(),
            message,
            type,
            duration,
            actions,
            timestamp: new Date()
        };

        this.notifications.push(notification);
        this.render(notification);

        // Автоматическое удаление
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, duration);
        }

        return notification.id;
    }

    // Показать успешное уведомление
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    // Показать уведомление об ошибке
    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    // Показать предупреждение
    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    // Показать информационное уведомление
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    // Показать подтверждение с действиями
    confirm(message, onConfirm, onCancel = null, options = {}) {
        const actions = [
            {
                text: options.confirmText || 'Подтвердить',
                type: 'primary',
                action: () => {
                    if (onConfirm) onConfirm();
                    this.remove(notificationId);
                }
            },
            {
                text: options.cancelText || 'Отмена',
                type: 'secondary',
                action: () => {
                    if (onCancel) onCancel();
                    this.remove(notificationId);
                }
            }
        ];

        const notificationId = this.show(message, 'confirm', 0, actions);
        return notificationId;
    }

    // Показать запрос ввода
    prompt(message, onSubmit, options = {}) {
        const promptId = 'prompt-' + Date.now();
        
        const actions = [
            {
                text: options.submitText || 'Отправить',
                type: 'primary',
                action: () => {
                    const input = document.getElementById(promptId);
                    const value = input ? input.value.trim() : '';
                    
                    if (!value && options.required !== false) {
                        this.error('Поле не может быть пустым');
                        return;
                    }
                    
                    if (onSubmit) onSubmit(value);
                    this.remove(notificationId);
                }
            },
            {
                text: options.cancelText || 'Отмена',
                type: 'secondary',
                action: () => {
                    this.remove(notificationId);
                }
            }
        ];

        const customContent = `
            <div class="prompt-content">
                <p>${message}</p>
                <input type="text" id="${promptId}" placeholder="${options.placeholder || ''}" 
                       value="${options.defaultValue || ''}" class="prompt-input" />
            </div>
        `;

        const notificationId = this.show(customContent, 'prompt', 0, actions);
        
        // Фокус на input
        setTimeout(() => {
            const input = document.getElementById(promptId);
            if (input) {
                input.focus();
                input.select();
                
                // Enter для отправки
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        actions[0].action();
                    }
                });
            }
        }, 100);

        return notificationId;
    }

    // Удалить уведомление
    remove(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;

        const element = document.querySelector(`[data-notification-id="${id}"]`);
        if (element) {
            element.classList.add('notification-exit');
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    // Очистить все уведомления
    clear() {
        this.notifications.forEach(n => this.remove(n.id));
    }

    // Отрендерить уведомление
    render(notification) {
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.setAttribute('data-notification-id', notification.id);

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            confirm: 'fas fa-question-circle',
            prompt: 'fas fa-edit'
        };

        let actionsHtml = '';
        if (notification.actions && notification.actions.length > 0) {
            actionsHtml = `
                <div class="notification-actions">
                    ${notification.actions.map(action => `
                        <button class="btn btn-${action.type} btn-sm notification-btn" 
                                data-action="${notification.actions.indexOf(action)}">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            `;
        }

        element.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <i class="${icons[notification.type] || icons.info}"></i>
                    <div class="notification-message">${notification.message}</div>
                    ${notification.duration > 0 ? `
                        <button class="notification-close" data-close="${notification.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
                ${actionsHtml}
            </div>
            ${notification.duration > 0 ? `<div class="notification-progress"></div>` : ''}
        `;

        // Добавляем обработчики событий
        this.attachEventListeners(element, notification);

        // Анимация появления
        this.container.appendChild(element);
        setTimeout(() => {
            element.classList.add('notification-enter');
        }, 10);

        // Прогресс-бар
        if (notification.duration > 0) {
            const progressBar = element.querySelector('.notification-progress');
            if (progressBar) {
                progressBar.style.animationDuration = `${notification.duration}ms`;
            }
        }
    }

    // Прикрепить обработчики событий
    attachEventListeners(element, notification) {
        // Кнопка закрытия
        const closeBtn = element.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.remove(notification.id);
            });
        }

        // Кнопки действий
        const actionBtns = element.querySelectorAll('.notification-btn');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (notification.actions[index] && notification.actions[index].action) {
                    notification.actions[index].action();
                }
            });
        });
    }

    // Показать загрузку
    showLoading(message = 'Загрузка...') {
        return this.show(`
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <span>${message}</span>
            </div>
        `, 'loading', 0);
    }

    // Показать прогресс
    showProgress(message, current, total) {
        const percentage = Math.round((current / total) * 100);
        return this.show(`
            <div class="progress-content">
                <div class="progress-message">${message}</div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text">${current}/${total} (${percentage}%)</div>
            </div>
        `, 'progress', 0);
    }
}

// CSS стили для уведомлений
const notificationStyles = `
.notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    pointer-events: none;
}

.notification {
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    margin-bottom: 12px;
    overflow: hidden;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: auto;
    position: relative;
}

.notification.notification-enter {
    opacity: 1;
    transform: translateX(0);
}

.notification.notification-exit {
    opacity: 0;
    transform: translateX(100%);
    margin-bottom: 0;
    max-height: 0;
}

.notification-content {
    padding: 16px;
}

.notification-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.notification-header i {
    font-size: 18px;
    margin-top: 2px;
    flex-shrink: 0;
}

.notification-message {
    flex: 1;
    line-height: 1.4;
    color: var(--text-primary);
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    flex-shrink: 0;
}

.notification-close:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
}

.notification-actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.notification-btn {
    font-size: 0.875rem;
    padding: 6px 12px;
}

.notification-progress {
    height: 3px;
    background: var(--border-color);
    position: relative;
    overflow: hidden;
}

.notification-progress::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: var(--primary-color);
    animation: progress-shrink linear forwards;
}

@keyframes progress-shrink {
    from { width: 100%; }
    to { width: 0%; }
}

/* Типы уведомлений */
.notification-success {
    border-left: 4px solid #10b981;
}

.notification-success .notification-header i {
    color: #10b981;
}

.notification-error {
    border-left: 4px solid #ef4444;
}

.notification-error .notification-header i {
    color: #ef4444;
}

.notification-warning {
    border-left: 4px solid #f59e0b;
}

.notification-warning .notification-header i {
    color: #f59e0b;
}

.notification-info {
    border-left: 4px solid #3b82f6;
}

.notification-info .notification-header i {
    color: #3b82f6;
}

.notification-confirm {
    border-left: 4px solid #8b5cf6;
}

.notification-confirm .notification-header i {
    color: #8b5cf6;
}

.notification-prompt {
    border-left: 4px solid #06b6d4;
}

.notification-prompt .notification-header i {
    color: #06b6d4;
}

.notification-loading {
    border-left: 4px solid var(--primary-color);
}

.notification-progress {
    border-left: 4px solid var(--primary-color);
}

/* Специальные компоненты */
.prompt-content {
    margin-top: 8px;
}

.prompt-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    margin-top: 8px;
    font-size: 0.9rem;
}

.prompt-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.loading-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-top: 2px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.progress-content {
    min-width: 250px;
}

.progress-message {
    margin-bottom: 8px;
    font-weight: 500;
}

.progress-bar-container {
    background: var(--border-color);
    border-radius: 4px;
    height: 8px;
    overflow: hidden;
    margin-bottom: 4px;
}

.progress-bar {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    text-align: right;
}

/* Адаптивность */
@media (max-width: 768px) {
    .notifications-container {
        left: 20px;
        right: 20px;
        max-width: none;
    }
    
    .notification-actions {
        flex-direction: column;
    }
    
    .notification-btn {
        width: 100%;
    }
}
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Инициализируем систему уведомлений
document.addEventListener('DOMContentLoaded', () => {
    new NotificationManager();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
