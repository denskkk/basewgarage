// Система навигации профиля между личным кабинетом и базой знаний
class ProfileNavigation {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Даем время для загрузки других скриптов
        setTimeout(() => {
            this.checkUser();
            this.setupReturnButtons();
            this.trackPageHistory();
        }, 100);
    }
    
    checkUser() {
        if (window.UserManager && window.UserManager.isLoggedIn()) {
            this.currentUser = window.UserManager.getCurrentUser();
            console.log('✅ Пользователь найден:', this.currentUser.name);
        } else {
            console.log('ℹ️ Пользователь не авторизован');
        }
    }
    
    // Настройка кнопок возврата
    setupReturnButtons() {
        // Для страницы базы знаний
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            this.setupKnowledgeBaseNavigation();
        }
        
        // Для страницы дашборда
        if (window.location.pathname.includes('dashboard.html')) {
            this.setupDashboardNavigation();
        }
    }
    
    // Настройка навигации для базы знаний
    setupKnowledgeBaseNavigation() {
        // Показываем кнопки если пользователь авторизован
        if (this.currentUser) {
            this.showAuthenticatedControls();
        }
        
        // Добавляем слушатель на кнопку возврата
        const backButton = document.getElementById('backToDashboard');
        if (backButton) {
            backButton.addEventListener('click', this.returnToDashboard.bind(this));
        }
        
        // Добавляем слушатель на кнопку профиля
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                if (window.app && window.app.showProfileModal) {
                    window.app.showProfileModal();
                }
            });
        }
    }
    
    // Настройка навигации для дашборда
    setupDashboardNavigation() {
        // Добавляем улучшенную навигацию в боковую панель
        this.enhanceDashboardSidebar();
    }
    
    // Показ элементов управления для авторизованных пользователей
    showAuthenticatedControls() {
        const user = this.currentUser;
        
        // Показываем кнопки профиля и возврата
        const profileBtn = document.getElementById('profileBtn');
        const backButton = document.getElementById('backToDashboard');
        
        if (profileBtn) {
            profileBtn.style.display = 'flex';
            profileBtn.title = `Профиль: ${user.name}`;
        }
        
        if (backButton) {
            backButton.style.display = 'flex';
        }
        
        // Обновляем информацию о пользователе в хлебных крошках
        this.updateBreadcrumbs(user);
        
        // Добавляем персональную информацию на главную страницу
        this.addPersonalizedWelcome(user);
    }
    
    // Обновление хлебных крошек
    updateBreadcrumbs(user) {
        const currentRole = document.getElementById('currentRole');
        if (currentRole) {
            currentRole.innerHTML = `
                <span class="base-title">База знаний W Garage</span>
                <span class="user-separator">•</span>
                <span class="user-info">${user.name} (${user.position})</span>
            `;
        }
    }
    
    // Добавление персонализированного приветствия
    addPersonalizedWelcome(user) {
        const welcomeSection = document.querySelector('.welcome-section');
        if (welcomeSection && !document.querySelector('.personalized-welcome')) {
            const personalizedInfo = document.createElement('div');
            personalizedInfo.className = 'personalized-welcome';
            personalizedInfo.innerHTML = `
                <div class="user-welcome-card">
                    <div class="user-avatar-small">
                        <img src="${user.avatar}" alt="Аватар ${user.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22><rect width=%22100%%22 height=%22100%%22 fill=%22%232563eb%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2218%22>${user.name.charAt(0)}</text></svg>'">
                    </div>
                    <div class="user-welcome-text">
                        <h3>Добро пожаловать, ${user.name}!</h3>
                        <p>Вы работаете как <strong>${user.position}</strong></p>
                        <div class="quick-actions">
                            <a href="dashboard.html" class="quick-action-btn">
                                <i class="fas fa-tachometer-alt"></i>
                                Личный кабинет
                            </a>
                            <button class="quick-action-btn" onclick="document.querySelector('[data-role=&quot;${user.role}&quot;]')?.click()">
                                <i class="fas fa-user-tag"></i>
                                Моя должность
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Вставляем после заголовка
            const welcomeHeader = welcomeSection.querySelector('.welcome-header');
            if (welcomeHeader) {
                welcomeHeader.after(personalizedInfo);
            }
        }
    }
    
    // Улучшение боковой панели дашборда
    enhanceDashboardSidebar() {
        const sidebar = document.getElementById('dashboardSidebar');
        if (sidebar) {
            // Добавляем быстрые действия в начало сайдбара
            const quickActions = document.createElement('div');
            quickActions.className = 'sidebar-section quick-actions-section';
            quickActions.innerHTML = `
                <h3>Быстрые действия</h3>
                <ul>
                    <li>
                        <a href="index.html" class="nav-link quick-action">
                            <i class="fas fa-book"></i>
                            <span>База знаний</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-link quick-action" onclick="window.open('schedule.html', '_blank')">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Расписание</span>
                        </a>
                    </li>
                </ul>
            `;
            
            // Вставляем в начало сайдбара
            const firstSection = sidebar.querySelector('.sidebar-section');
            if (firstSection) {
                firstSection.before(quickActions);
            }
        }
    }
    
    // Возврат в дашборд
    returnToDashboard() {
        if (this.currentUser) {
            // Сохраняем текущую страницу для возможного возврата
            localStorage.setItem('wgarage-last-knowledge-page', window.location.href);
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
    }
    
    // Отслеживание истории страниц
    trackPageHistory() {
        // Сохраняем информацию о посещенной странице
        const currentPage = window.location.pathname;
        const history = JSON.parse(localStorage.getItem('wgarage-page-history') || '[]');
        
        // Добавляем текущую страницу в историю
        history.push({
            page: currentPage,
            timestamp: Date.now(),
            user: this.currentUser?.id || 'anonymous'
        });
        
        // Ограничиваем историю 10 последними страницами
        if (history.length > 10) {
            history.splice(0, history.length - 10);
        }
        
        localStorage.setItem('wgarage-page-history', JSON.stringify(history));
    }
    
    // Получение последней посещенной страницы
    getLastPage() {
        const history = JSON.parse(localStorage.getItem('wgarage-page-history') || '[]');
        return history.length > 1 ? history[history.length - 2] : null;
    }
    
    // Создание хлебных крошек навигации
    createBreadcrumbs() {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;
        
        const currentPage = window.location.pathname;
        const user = window.UserManager?.getCurrentUser();
        
        let breadcrumbs = '';
        
        if (currentPage.includes('dashboard.html')) {
            breadcrumbs = `
                <a href="index.html" class="breadcrumb-link">
                    <i class="fas fa-home"></i>
                    Главная
                </a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current">Личный кабинет</span>
            `;
        } else if (currentPage.includes('index.html') || currentPage === '/') {
            breadcrumbs = `
                <span class="breadcrumb-current">База знаний</span>
            `;
            
            if (user) {
                breadcrumbs += `
                    <span class="breadcrumb-separator">•</span>
                    <a href="dashboard.html" class="breadcrumb-link">
                        ${user.name}
                    </a>
                `;
            }
        }
        
        breadcrumbContainer.innerHTML = breadcrumbs;
    }
    
    // Инициализация уведомлений о навигации
    initNavigationNotifications() {
        // Показываем уведомление о доступных действиях
        if (this.currentUser) {
            // Проверяем, показывали ли уже подсказку
            const hasSeenTip = localStorage.getItem(`wgarage-navigation-tip-${this.currentUser.id}`);
            
            if (!hasSeenTip) {
                setTimeout(() => {
                    this.showNavigationTip();
                    localStorage.setItem(`wgarage-navigation-tip-${this.currentUser.id}`, 'true');
                }, 2000);
            }
        }
    }
    
    // Показ подсказки по навигации
    showNavigationTip() {
        const tip = document.createElement('div');
        tip.className = 'navigation-tip';
        tip.innerHTML = `
            <div class="tip-content">
                <i class="fas fa-lightbulb"></i>
                <span>Используйте кнопки в верхней панели для быстрой навигации между разделами!</span>
                <button class="tip-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(tip);
        
        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            if (tip.parentElement) {
                tip.remove();
            }
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.profileNavigation = new ProfileNavigation();
    
    // Инициализируем уведомления с задержкой
    setTimeout(() => {
        window.profileNavigation.initNavigationNotifications();
    }, 1000);
});

// Экспорт для использования в других модулях
window.ProfileNavigation = ProfileNavigation;
