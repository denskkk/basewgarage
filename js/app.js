// Главный файл приложения
class WGarageApp {
    constructor() {
        this.currentRole = null;
        this.theme = localStorage.getItem('theme') || 'light';
        this.sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupSidebar();
        this.setupSearch();
        this.loadWelcomePage();
    }
    
    setupEventListeners() {
        // Переключение боковой панели
        const sidebarToggle = document.getElementById('sidebarToggle');
        sidebarToggle?.addEventListener('click', () => this.toggleSidebar());
        
        // Переключение темы
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Кнопка профиля
        const profileBtn = document.getElementById('profileBtn');
        profileBtn?.addEventListener('click', () => this.openProfile());
        
        // Кнопка возврата в дашборд
        const backToDashboard = document.getElementById('backToDashboard');
        backToDashboard?.addEventListener('click', () => this.returnToDashboard());
        
        // Навигация по ролям
        const navLinks = document.querySelectorAll('[data-role]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const role = e.currentTarget.getAttribute('data-role');
                this.loadRoleContent(role);
                this.setActiveNavLink(e.currentTarget);
            });
        });
        
        // Поиск
        const searchInput = document.getElementById('searchInput');
        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Адаптивность для мобильных устройств
        this.setupMobileHandlers();
        
        // Проверка авторизации при загрузке
        this.checkAuthentication();
    }
    
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (this.sidebarCollapsed) {
            sidebar?.classList.add('collapsed');
        }
    }
    
    setupSearch() {
        // Инициализация поиска
        this.searchIndex = this.buildSearchIndex();
    }
    
    setupMobileHandlers() {
        // Закрытие боковой панели при клике вне её на мобильных устройствах
        if (window.innerWidth <= 768) {
            document.addEventListener('click', (e) => {
                const sidebar = document.getElementById('sidebar');
                const sidebarToggle = document.getElementById('sidebarToggle');
                
                if (!sidebar?.contains(e.target) && !sidebarToggle?.contains(e.target)) {
                    sidebar?.classList.remove('open');
                }
            });
        }
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        
        if (window.innerWidth <= 768) {
            sidebar?.classList.toggle('open');
        } else {
            sidebar?.classList.toggle('collapsed');
            this.sidebarCollapsed = sidebar?.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed);
        }
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
    }
    
    setActiveNavLink(activeLink) {
        // Удаляем активный класс со всех ссылок
        document.querySelectorAll('.nav-section a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Добавляем активный класс к выбранной ссылке
        activeLink.classList.add('active');
    }
    
    loadWelcomePage() {
        const contentArea = document.getElementById('contentArea');
        const currentRole = document.getElementById('currentRole');
        
        currentRole.textContent = 'База знаний W Garage';
        
        // Контент уже загружен в HTML, просто показываем его
        contentArea.innerHTML = `
            <div class="welcome-section">
                <div class="welcome-header">
                    <h1>Добро пожаловать в базу знаний W Garage</h1>
                    <p>Профессиональный дизель-сервис по ремонту топливной аппаратуры</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3>24</h3>
                            <p>Должности</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-content">
                            <h3>150+</h3>
                            <p>Инструкций</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="stat-content">
                            <h3>3</h3>
                            <p>Основных направления</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <h3>24/7</h3>
                            <p>Доступ к базе</p>
                        </div>
                    </div>
                </div>

                <div class="services-overview">
                    <h2>Наши специализации</h2>
                    <div class="services-grid">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-spray-can"></i>
                            </div>
                            <h3>Ремонт форсунок</h3>
                            <p>Диагностика, чистка, калибровка и восстановление дизельных форсунок всех типов</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-fan"></i>
                            </div>
                            <h3>Ремонт турбин</h3>
                            <p>Полный цикл ремонта турбокомпрессоров: балансировка, замена картриджей</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-gas-pump"></i>
                            </div>
                            <h3>Ремонт ТНВД</h3>
                            <p>Восстановление топливных насосов высокого давления любой сложности</p>
                        </div>
                    </div>
                </div>

                <div class="quick-access">
                    <h2>Быстрый доступ</h2>
                    <div class="quick-links">
                        <a href="#" class="quick-link" data-role="diagnosty">
                            <i class="fas fa-search-plus"></i>
                            <span>Диагностика</span>
                        </a>
                        <a href="#" class="quick-link" data-role="toplivshik">
                            <i class="fas fa-gas-pump"></i>
                            <span>Топливная система</span>
                        </a>
                        <a href="#" class="quick-link" data-role="forsunshik">
                            <i class="fas fa-spray-can"></i>
                            <span>Форсунки</span>
                        </a>
                        <a href="#" class="quick-link" data-role="turbo-slesar">
                            <i class="fas fa-fan"></i>
                            <span>Турбины</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Переустанавливаем обработчики событий для быстрых ссылок
        const quickLinks = contentArea.querySelectorAll('[data-role]');
        quickLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const role = e.currentTarget.getAttribute('data-role');
                this.loadRoleContent(role);
            });
        });
    }
    
    loadRoleContent(roleId) {
        const roleData = window.roleDatabase[roleId];
        if (!roleData) {
            console.error('Role data not found:', roleId);
            return;
        }
        
        this.currentRole = roleId;
        const contentArea = document.getElementById('contentArea');
        const currentRole = document.getElementById('currentRole');
        
        currentRole.textContent = roleData.title;
        
        // Трекинг просмотров
        window.WGarageUtils?.analytics.trackPageView(roleId);
        window.WGarageUtils?.history.add(roleId);
        
        contentArea.innerHTML = `
            <div class="role-content">
                <div class="role-header">
                    <h1>${roleData.title}</h1>
                    <p>${roleData.description}</p>
                    <div class="role-actions">
                        <button class="btn-favorite" id="favoriteBtn" data-role="${roleId}">
                            <i class="fas fa-star"></i>
                            <span>В избранное</span>
                        </button>
                        <button class="btn-export" onclick="window.WGarageUtils.exporter.exportToJSON('${roleId}')">
                            <i class="fas fa-download"></i>
                            <span>Экспорт</span>
                        </button>
                    </div>
                </div>
                
                <div class="content-grid">
                    ${this.generateContentCards(roleData)}
                </div>
            </div>
        `;
        
        // Настройка кнопки избранного
        this.setupFavoriteButton(roleId);
    }
    
    generateContentCards(roleData) {
        const sections = [
            {
                icon: 'fas fa-tasks',
                title: 'Основные обязанности',
                items: roleData.responsibilities
            },
            {
                icon: 'fas fa-graduation-cap',
                title: 'Требуемые навыки',
                items: roleData.skills
            },
            {
                icon: 'fas fa-tools',
                title: 'Инструменты и оборудование',
                items: roleData.tools
            },
            {
                icon: 'fas fa-clipboard-list',
                title: 'Процедуры и инструкции',
                items: roleData.procedures
            }
        ];
        
        return sections.map(section => `
            <div class="content-card">
                <div class="content-card-header">
                    <i class="${section.icon}"></i>
                    <h3>${section.title}</h3>
                </div>
                <div class="content-card-body">
                    <ul class="content-list">
                        ${section.items.map(item => `
                            <li>
                                <i class="fas fa-check"></i>
                                <span>${item}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }
    
    buildSearchIndex() {
        const index = [];
        
        Object.entries(window.roleDatabase).forEach(([roleId, roleData]) => {
            // Индексируем название и описание роли
            index.push({
                roleId,
                type: 'role',
                title: roleData.title,
                content: `${roleData.title} ${roleData.description}`,
                searchTerms: this.extractSearchTerms(roleData.title + ' ' + roleData.description)
            });
            
            // Индексируем обязанности
            roleData.responsibilities.forEach(item => {
                index.push({
                    roleId,
                    type: 'responsibility',
                    title: roleData.title,
                    content: item,
                    searchTerms: this.extractSearchTerms(item)
                });
            });
            
            // Индексируем навыки
            roleData.skills.forEach(item => {
                index.push({
                    roleId,
                    type: 'skill',
                    title: roleData.title,
                    content: item,
                    searchTerms: this.extractSearchTerms(item)
                });
            });
            
            // Индексируем инструменты
            roleData.tools.forEach(item => {
                index.push({
                    roleId,
                    type: 'tool',
                    title: roleData.title,
                    content: item,
                    searchTerms: this.extractSearchTerms(item)
                });
            });
            
            // Индексируем процедуры
            roleData.procedures.forEach(item => {
                index.push({
                    roleId,
                    type: 'procedure',
                    title: roleData.title,
                    content: item,
                    searchTerms: this.extractSearchTerms(item)
                });
            });
        });
        
        return index;
    }
    
    extractSearchTerms(text) {
        return text.toLowerCase()
            .replace(/[^\wа-яё\s]/gi, ' ')
            .split(/\s+/)
            .filter(term => term.length > 2);
    }
    
    handleSearch(query) {
        if (!query || query.length < 2) {
            this.clearSearchResults();
            return;
        }
        
        // Трекинг поисковых запросов
        window.WGarageUtils?.analytics.trackSearch(query);
        
        const searchTerms = this.extractSearchTerms(query);
        const results = this.searchIndex.filter(item => {
            return searchTerms.some(term => 
                item.searchTerms.some(searchTerm => 
                    searchTerm.includes(term)
                )
            );
        });
        
        this.displaySearchResults(results, query);
    }
    
    setupFavoriteButton(roleId) {
        const favoriteBtn = document.getElementById('favoriteBtn');
        if (!favoriteBtn || !window.WGarageUtils) return;
        
        const isFavorite = window.WGarageUtils.favorites.has(roleId);
        this.updateFavoriteButton(favoriteBtn, isFavorite);
        
        favoriteBtn.addEventListener('click', () => {
            const isNowFavorite = window.WGarageUtils.favorites.toggle(roleId);
            this.updateFavoriteButton(favoriteBtn, isNowFavorite);
            
            const message = isNowFavorite ? 
                'Добавлено в избранное' : 
                'Удалено из избранного';
            const type = isNowFavorite ? 'success' : 'info';
            
            window.WGarageUtils.notifications.show(message, type, 3000);
        });
    }
    
    updateFavoriteButton(button, isFavorite) {
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (isFavorite) {
            icon.className = 'fas fa-star';
            text.textContent = 'В избранном';
            button.classList.add('active');
        } else {
            icon.className = 'far fa-star';
            text.textContent = 'В избранное';
            button.classList.remove('active');
        }
    }
    
    displaySearchResults(results, query) {
        const contentArea = document.getElementById('contentArea');
        const currentRole = document.getElementById('currentRole');
        
        currentRole.textContent = `Результаты поиска: "${query}"`;
        
        if (results.length === 0) {
            contentArea.innerHTML = `
                <div class="search-results">
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h2>Ничего не найдено</h2>
                        <p>Попробуйте изменить поисковый запрос</p>
                    </div>
                </div>
            `;
            return;
        }
        
        const groupedResults = this.groupResultsByRole(results);
        
        contentArea.innerHTML = `
            <div class="search-results">
                <div class="search-summary">
                    <p>Найдено ${results.length} результатов по запросу "${query}"</p>
                </div>
                <div class="results-grid">
                    ${Object.entries(groupedResults).map(([roleId, items]) => {
                        const roleData = window.roleDatabase[roleId];
                        return `
                            <div class="result-card" data-role="${roleId}">
                                <div class="result-header">
                                    <h3>${roleData.title}</h3>
                                    <span class="result-count">${items.length}</span>
                                </div>
                                <div class="result-items">
                                    ${items.slice(0, 3).map(item => `
                                        <div class="result-item">
                                            <span class="result-type">${this.getTypeLabel(item.type)}</span>
                                            <p>${this.highlightSearchTerms(item.content, query)}</p>
                                        </div>
                                    `).join('')}
                                    ${items.length > 3 ? `<p class="more-results">и еще ${items.length - 3}...</p>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Добавляем обработчики кликов на результаты
        const resultCards = contentArea.querySelectorAll('.result-card');
        resultCards.forEach(card => {
            card.addEventListener('click', () => {
                const roleId = card.getAttribute('data-role');
                this.loadRoleContent(roleId);
                
                // Находим и активируем соответствующую навигационную ссылку
                const navLink = document.querySelector(`[data-role="${roleId}"]`);
                if (navLink) {
                    this.setActiveNavLink(navLink);
                }
            });
        });
    }
    
    groupResultsByRole(results) {
        const grouped = {};
        results.forEach(result => {
            if (!grouped[result.roleId]) {
                grouped[result.roleId] = [];
            }
            grouped[result.roleId].push(result);
        });
        return grouped;
    }
    
    getTypeLabel(type) {
        const labels = {
            'role': 'Должность',
            'responsibility': 'Обязанность',
            'skill': 'Навык',
            'tool': 'Инструмент',
            'procedure': 'Процедура'
        };
        return labels[type] || type;
    }
    
    highlightSearchTerms(text, query) {
        const searchTerms = this.extractSearchTerms(query);
        let highlightedText = text;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }
    
    clearSearchResults() {
        if (this.currentRole) {
            this.loadRoleContent(this.currentRole);
        } else {
            this.loadWelcomePage();
        }
    }
    
    // Новые методы для работы с профилем
    checkAuthentication() {
        // Проверяем есть ли данные о пользователе
        if (window.UserManager && window.UserManager.isLoggedIn()) {
            const user = window.UserManager.getCurrentUser();
            this.showProfileControls(user);
        } else {
            this.hideProfileControls();
        }
    }
    
    hideProfileControls() {
        const profileBtn = document.getElementById('profileBtn');
        const backToDashboard = document.getElementById('backToDashboard');
        
        if (profileBtn) {
            profileBtn.style.display = 'none';
        }
        
        if (backToDashboard) {
            backToDashboard.style.display = 'none';
        }
    }
    
    showProfileControls(user) {
        const profileBtn = document.getElementById('profileBtn');
        const backToDashboard = document.getElementById('backToDashboard');
        
        if (profileBtn) {
            profileBtn.style.display = 'block';
            profileBtn.title = `Профиль: ${user.name}`;
        }
        
        if (backToDashboard) {
            backToDashboard.style.display = 'block';
        }
        
        // Обновляем хлебные крошки
        const currentRole = document.getElementById('currentRole');
        if (currentRole) {
            currentRole.innerHTML = `
                <span class="base-title">База знаний W Garage</span>
                <span class="user-separator"> • </span>
                <span class="user-info">${user.name} (${user.position})</span>
            `;
        }
    }
    
    openProfile() {
        if (window.UserManager && window.UserManager.isLoggedIn()) {
            // Создаем модальное окно профиля
            this.showProfileModal();
        } else {
            alert('Необходимо войти в систему');
        }
    }
    
    showProfileModal() {
        const user = window.UserManager.getCurrentUser();
        
        // Удаляем существующий модал если есть
        const existingModal = document.getElementById('profileModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user-circle"></i> Мой профиль</h3>
                    <button class="modal-close" onclick="document.getElementById('profileModal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            <img src="${user.avatar}" alt="Аватар" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect width=%22100%%22 height=%22100%%22 fill=%22%232563eb%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22>${user.name.charAt(0)}</text></svg>'">
                        </div>
                        <div class="profile-details">
                            <h4>${user.name}</h4>
                            <p class="position">${user.position}</p>
                            <p class="department">${user.department || user.role || 'Сотрудник'}</p>
                            ${user.birthday ? `<p class="birthday"><i class="fas fa-birthday-cake"></i> ${user.birthday}</p>` : ''}
                            <p class="access-level"><i class="fas fa-shield-alt"></i> Уровень доступа: ${this.getAccessLevelText(user.accessLevel)}</p>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">
                            <i class="fas fa-tachometer-alt"></i>
                            Личный кабинет
                        </button>
                        <button class="btn btn-secondary" onclick="document.getElementById('profileModal').remove()">
                            <i class="fas fa-times"></i>
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Закрытие по клику вне модала
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Закрытие по ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    getAccessLevelText(level) {
        switch(level) {
            case 0: return 'Руководитель';
            case 1: return 'Администратор';
            case 2: return 'Сотрудник';
            default: return 'Пользователь';
        }
    }
    
    returnToDashboard() {
        if (window.UserManager && window.UserManager.isLoggedIn()) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
    }
}

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WGarageApp();
});

// Обработчик изменения размера окна для адаптивности
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar?.classList.remove('open');
    }
});
