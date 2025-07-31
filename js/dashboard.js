// JavaScript для панели управления
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'overview';
        
        this.init();
    }
    
    init() {
        // Проверка авторизации
        if (!window.UserManager.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        
        this.currentUser = window.UserManager.getCurrentUser();
        
        // Инициализируем TaskManager если он доступен
        if (window.TaskManager && typeof window.TaskManager.init === 'function') {
            window.TaskManager.init();
            console.log('✅ TaskManager успешно инициализирован');
        } else {
            console.error('❌ TaskManager не найден или не инициализирован');
        }
        
        // Инициализируем ScheduleManager если он доступен
        if (window.ScheduleManager) {
            window.scheduleManager = new window.ScheduleManager();
            console.log('✅ ScheduleManager успешно инициализирован');
        } else {
            console.error('❌ ScheduleManager не найден');
        }
        
        // Проверяем доступность базы пользователей
        if (window.usersDatabase) {
            console.log(`✅ База пользователей доступна: ${Object.keys(window.usersDatabase).length} пользователей`);
        } else {
            console.error('❌ База пользователей недоступна');
        }
        
        this.setupUI();
        this.setupEventListeners();
        this.loadPage('overview');
        this.updateNotificationBadge();
        
        // Автоматическое обновление счетчика уведомлений каждые 30 секунд
        setInterval(() => {
            this.updateNotificationBadge();
        }, 30000);
    }
    
    setupUI() {
        // Настройка информации о пользователе
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userPosition').textContent = this.currentUser.position;
        document.getElementById('avatarImg').src = this.currentUser.avatar;
        
        // Показать навигацию для руководителей
        if (this.currentUser.canViewAll) {
            document.getElementById('employeeListNav').style.display = 'block';
        }
        
        // Применить сохраненную тему
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    setupEventListeners() {
        // Навигация
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.loadPage(page);
            });
        });
        
        // Выход из системы
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Кнопка выхода нажата');
                this.logout();
            });
            console.log('✅ Обработчик выхода установлен успешно');
        } else {
            console.error('❌ Элемент logoutLink не найден на странице');
            // Попробуем найти его через небольшую задержку
            setTimeout(() => {
                const delayedLogoutLink = document.getElementById('logoutLink');
                if (delayedLogoutLink) {
                    console.log('✅ Элемент logoutLink найден с задержкой');
                    delayedLogoutLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('Кнопка выхода нажата (через задержку)');
                        this.logout();
                    });
                } else {
                    console.error('❌ Элемент logoutLink так и не найден');
                }
            }, 1000);
        }
        
        // Временная тестовая кнопка выхода
        const testLogoutBtn = document.getElementById('testLogoutBtn');
        if (testLogoutBtn) {
            testLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Тестовая кнопка выхода нажата');
                this.logout();
            });
            console.log('✅ Тестовая кнопка выхода установлена');
        }
        
        // Переключение темы
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Смена пароля
        document.getElementById('changePasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showChangePasswordModal();
        });
        
        // Кнопка профиля в выпадающем меню
        document.getElementById('profileLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadPage('my-profile');
        });
        
        // Модальные окна
        this.setupModals();
    }
    
    setupModals() {
        // Модальное окно смены пароля
        const changePasswordModal = document.getElementById('changePasswordModal');
        const closePasswordModal = document.getElementById('closePasswordModal');
        const cancelPasswordChange = document.getElementById('cancelPasswordChange');
        const changePasswordForm = document.getElementById('changePasswordForm');
        
        closePasswordModal.addEventListener('click', () => {
            this.hideChangePasswordModal();
        });
        
        cancelPasswordChange.addEventListener('click', () => {
            this.hideChangePasswordModal();
        });
        
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordChange();
        });
        
        // Закрытие модалов по клику вне их
        changePasswordModal.addEventListener('click', (e) => {
            if (e.target === changePasswordModal) {
                this.hideChangePasswordModal();
            }
        });
    }
    
    loadPage(pageId) {
        this.currentPage = pageId;
        
        // Обновление активной навигации
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
        
        // Загрузка контента
        const content = this.getPageContent(pageId);
        document.getElementById('dashboardContent').innerHTML = content;
        document.getElementById('currentPage').textContent = this.getPageTitle(pageId);
        
        // Инициализация специфичных для страницы обработчиков
        this.initPageHandlers(pageId);
    }
    
    getPageTitle(pageId) {
        const titles = {
            'overview': 'Обзор',
            'my-profile': 'Мой профиль',
            'knowledge-base': 'База знаний',
            'orgchart': 'Оргструктура',
            'employees': 'Сотрудники',
            'schedule': 'Расписание',
            'tasks': 'Задачи',
            'reports': 'Отчеты'
        };
        return titles[pageId] || 'Личный кабинет';
    }
    
    getPageContent(pageId) {
        switch (pageId) {
            case 'overview':
                return this.getOverviewContent();
            case 'my-profile':
                return this.getProfileContent();
            case 'knowledge-base':
                return this.getKnowledgeBaseContent();
            case 'orgchart':
                return this.getOrgChartContent();
            case 'employees':
                return this.getEmployeesContent();
            case 'schedule':
                return this.getScheduleContent();
            case 'tasks':
                return this.getTasksContent();
            case 'reports':
                return this.getReportsContent();
            default:
                return '<p>Страница не найдена</p>';
        }
    }
    
    getOverviewContent() {
        const roleData = window.roleDatabase[this.currentUser.role];
        const birthdayToday = this.checkBirthday();
        
        return `
            <div class="page-header">
                <h1 class="page-title">Добро пожаловать, ${this.currentUser.name}!</h1>
                <p class="page-subtitle">Личный кабинет сотрудника W Garage</p>
            </div>
            
            ${birthdayToday ? `
                <div class="birthday-banner">
                    <i class="fas fa-birthday-cake"></i>
                    <div>
                        <h3>🎉 С Днем Рождения!</h3>
                        <p>Поздравляем с днем рождения! Желаем успехов в работе и личной жизни!</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3 class="card-title">Моя должность</h3>
                    </div>
                    <div class="card-content">
                        <p><strong>${this.currentUser.position}</strong></p>
                        <p>Уровень доступа: ${window.accessLevels[this.currentUser.accessLevel]}</p>
                        ${this.currentUser.birthday ? `<p>День рождения: ${this.currentUser.birthday}</p>` : ''}
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <h3 class="card-title">Мои обязанности</h3>
                    </div>
                    <div class="card-content">
                        <p>Основных обязанностей: <strong>${roleData?.responsibilities?.length || 0}</strong></p>
                        <p>Требуемых навыков: <strong>${roleData?.skills?.length || 0}</strong></p>
                        <p>Инструментов: <strong>${roleData?.tools?.length || 0}</strong></p>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3 class="card-title">Рабочий день</h3>
                    </div>
                    <div class="card-content">
                        <p>Сегодня: <strong>${new Date().toLocaleDateString('ru-RU', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</strong></p>
                        <p>Время: <strong>${new Date().toLocaleTimeString('ru-RU')}</strong></p>
                    </div>
                </div>
                
                ${this.currentUser.canViewAll ? `
                    <div class="dashboard-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="card-title">Команда</h3>
                        </div>
                        <div class="card-content">
                            <p>Всего сотрудников: <strong>${Object.keys(window.usersDatabase).length}</strong></p>
                            <p>Руководителей: <strong>${Object.values(window.usersDatabase).filter(u => u.accessLevel === 0).length}</strong></p>
                            <p>Специалистов: <strong>${Object.values(window.usersDatabase).filter(u => u.accessLevel > 0).length}</strong></p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    getProfileContent() {
        const roleData = window.roleDatabase[this.currentUser.role];
        
        return `
            <div class="page-header">
                <h1 class="page-title">Мой профиль</h1>
                <p class="page-subtitle">Детальная информация о вашей должности</p>
            </div>
            
            <div class="profile-info">
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}">
                        </div>
                        <div class="profile-details">
                            <h2>${this.currentUser.name}</h2>
                            <p class="profile-position">${this.currentUser.position}</p>
                            <p class="profile-access">${window.accessLevels[this.currentUser.accessLevel]}</p>
                            ${this.currentUser.birthday ? `<p class="profile-birthday">День рождения: ${this.currentUser.birthday}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <h3 class="card-title">Основные обязанности</h3>
                    </div>
                    <div class="card-content">
                        <ul class="responsibilities-list">
                            ${roleData?.responsibilities?.map(resp => `<li>${resp}</li>`).join('') || '<li>Данные не найдены</li>'}
                        </ul>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h3 class="card-title">Требуемые навыки</h3>
                    </div>
                    <div class="card-content">
                        <ul class="skills-list">
                            ${roleData?.skills?.map(skill => `<li>${skill}</li>`).join('') || '<li>Данные не найдены</li>'}
                        </ul>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <h3 class="card-title">Инструменты и оборудование</h3>
                    </div>
                    <div class="card-content">
                        <ul class="tools-list">
                            ${roleData?.tools?.map(tool => `<li>${tool}</li>`).join('') || '<li>Данные не найдены</li>'}
                        </ul>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="card-header">
                        <div class="card-icon">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <h3 class="card-title">Процедуры и инструкции</h3>
                    </div>
                    <div class="card-content">
                        <ul class="procedures-list">
                            ${roleData?.procedures?.map(proc => `<li>${proc}</li>`).join('') || '<li>Данные не найдены</li>'}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    getKnowledgeBaseContent() {
        const currentUser = window.UserManager.getCurrentUser();
        const personalKB = window.personalKnowledgeBase[currentUser.id];
        
        let content = `
            <div class="page-header">
                <h1 class="page-title">Персональная база знаний</h1>
                <p class="page-subtitle">Ваши документы, процедуры и инструменты</p>
            </div>
        `;
        
        if (personalKB) {
            // Документы
            if (personalKB.documents && personalKB.documents.length > 0) {
                content += `
                    <div class="knowledge-section">
                        <h3><i class="fas fa-file-alt"></i> Документы</h3>
                        <div class="documents-grid">
                            ${personalKB.documents.map(doc => `
                                <div class="document-card">
                                    <div class="document-header">
                                        <h4>${doc.title}</h4>
                                        <span class="document-type">${this.getDocumentTypeText(doc.type)}</span>
                                    </div>
                                    <p class="document-content">${doc.content.substring(0, 150)}...</p>
                                    <div class="document-footer">
                                        <span class="document-date">Создан: ${this.formatDate(doc.created)}</span>
                                        <button class="btn btn-sm btn-outline" onclick="window.dashboard.showDocument('${doc.id}')">
                                            Открыть
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Процедуры
            if (personalKB.procedures && personalKB.procedures.length > 0) {
                content += `
                    <div class="knowledge-section">
                        <h3><i class="fas fa-list-ol"></i> Рабочие процедуры</h3>
                        <div class="procedures-list">
                            ${personalKB.procedures.map(procedure => `
                                <div class="procedure-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>${procedure}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Инструменты
            if (personalKB.tools && personalKB.tools.length > 0) {
                content += `
                    <div class="knowledge-section">
                        <h3><i class="fas fa-tools"></i> Рабочие инструменты</h3>
                        <div class="tools-list">
                            ${personalKB.tools.map(tool => `
                                <div class="tool-item">
                                    <i class="fas fa-wrench"></i>
                                    <span>${tool}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        } else {
            content += `
                <div class="no-knowledge">
                    <i class="fas fa-book"></i>
                    <h3>База знаний пока пуста</h3>
                    <p>Ваша персональная база знаний будет наполняться по мере работы</p>
                </div>
            `;
        }
        
        // Ссылка на общую базу знаний
        content += `
            <div class="knowledge-section">
                <h3><i class="fas fa-external-link-alt"></i> Общая база знаний</h3>
                <div class="external-knowledge">
                    <div class="redirect-card">
                        <h4>Полная база знаний W Garage</h4>
                        <p>Все должности, процедуры и технические инструкции</p>
                        <button class="btn btn-primary" onclick="window.location.href='index.html'">
                            Открыть базу знаний
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }
    
    getEmployeesContent() {
        if (!this.currentUser.canViewAll) {
            return `
                <div class="page-header">
                    <h1 class="page-title">Доступ запрещен</h1>
                    <p class="page-subtitle">У вас нет прав для просмотра списка сотрудников</p>
                </div>
            `;
        }
        
        const employees = Object.values(window.usersDatabase);
        const groupedEmployees = this.groupEmployeesByAccessLevel(employees);
        
        let content = `
            <div class="page-header">
                <h1 class="page-title">Сотрудники</h1>
                <p class="page-subtitle">Список всех сотрудников W Garage</p>
            </div>
        `;
        
        Object.entries(groupedEmployees).forEach(([level, employees]) => {
            content += `
                <div class="employee-group">
                    <h3 class="group-title">${window.accessLevels[level]} (${employees.length})</h3>
                    <div class="employees-grid">
                        ${employees.map(emp => this.getEmployeeCard(emp)).join('')}
                    </div>
                </div>
            `;
        });
        
        return content;
    }
    
    getEmployeeCard(employee) {
        return `
            <div class="employee-card" onclick="dashboard.showEmployeeDetails('${employee.id}')">
                <div class="employee-header">
                    <div class="employee-avatar">
                        <img src="${employee.avatar}" alt="${employee.name}">
                    </div>
                    <div class="employee-info">
                        <h3>${employee.name}</h3>
                        <p class="employee-position">${employee.position}</p>
                        <p class="employee-access">${window.accessLevels[employee.accessLevel]}</p>
                    </div>
                </div>
                <div class="employee-details">
                    <div class="detail-item">
                        <span class="detail-label">День рождения</span>
                        <span class="detail-value">${employee.birthday || 'Не указан'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Логин</span>
                        <span class="detail-value">${employee.id}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getScheduleContent() {
        const scheduleManager = window.scheduleManager || new ScheduleManager();
        
        return `
            <div class="page-header">
                <h1 class="page-title">Расписание - Июль 2025</h1>
                <p class="page-subtitle">Рабочее расписание и график сотрудников</p>
            </div>
            
            <div class="schedule-table-container">
                ${this.renderScheduleTable(scheduleManager)}
            </div>
            
            <div class="schedule-legend">
                <h4>Обозначения:</h4>
                <div class="legend-items">
                    <span class="legend-item"><span class="legend-color working"></span> 1 - Рабочий день</span>
                    <span class="legend-item"><span class="legend-color weekend"></span> В - Выходной</span>
                    <span class="legend-item"><span class="legend-color total"></span> Кол-во дней - Всего рабочих дней</span>
                </div>
            </div>
        `;
    }
    
    // Метод для рендеринга таблицы расписания как на изображении
    renderScheduleTable(scheduleManager) {
        const scheduleData = scheduleManager.getScheduleTableData();
        
        // Группируем сотрудников по отделам
        const departmentGroups = {};
        Object.entries(scheduleData.employees).forEach(([userId, employee]) => {
            const dept = employee.department;
            if (!departmentGroups[dept]) {
                departmentGroups[dept] = [];
            }
            departmentGroups[dept].push({
                userId,
                ...employee
            });
        });
        
        // Создаем заголовок таблицы
        let tableHTML = `
            <div class="schedule-table">
                <table class="schedule-main-table">
                    <thead>
                        <tr class="schedule-header">
                            <th class="dept-header">Отдел</th>
                            <th class="name-header">ФИО</th>
                            ${Array.from({length: 31}, (_, i) => 
                                `<th class="day-header">${i + 1}</th>`
                            ).join('')}
                            <th class="total-header">Кол-во дней</th>
                        </tr>
                        <tr class="weekday-header">
                            <th colspan="2">ИЮЛЬ 2025</th>
                            ${this.generateWeekdayHeaders()}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Цвета для разных отделов
        const departmentColors = {
            'Руководство': '#4CAF50',
            'Менеджмент': '#FF9800', 
            'Приемная': '#2196F3',
            'Офис': '#9C27B0',
            'Топливщики твёрд': '#FFEB3B',
            'Топливщики Н-Ф': '#FFC107',
            'Топливщики форсунки': '#FF5722',
            'Слесарный цех': '#795548',
            'Слесарь': '#607D8B',
            'Турбинный цех': '#8BC34A',
            'Бухгалтерия': '#E91E63'
        };
        
        // Добавляем строки для каждого отдела
        Object.entries(departmentGroups).forEach(([deptName, employees]) => {
            const deptColor = departmentColors[deptName] || '#757575';
            
            employees.forEach((employee, index) => {
                const isFirstInDept = index === 0;
                const deptRowspan = employees.length;
                
                tableHTML += `
                    <tr class="employee-row" data-department="${deptName}">
                        ${isFirstInDept ? `<td class="dept-cell" rowspan="${deptRowspan}" style="background-color: ${deptColor}; color: white; font-weight: bold;">${deptName}</td>` : ''}
                        <td class="name-cell">${employee.name}</td>
                        ${this.renderEmployeeScheduleDays(employee.schedule)}
                        <td class="total-cell">${employee.workDays}</td>
                    </tr>
                `;
            });
        });
        
        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        return tableHTML;
    }
    
    // Генерирует заголовки дней недели
    generateWeekdayHeaders() {
        const weekdays = ['ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ'];
        return weekdays.map(day => `<th class="weekday-cell">${day}</th>`).join('');
    }
    
    // Рендерит дни расписания для сотрудника
    renderEmployeeScheduleDays(schedule) {
        let daysHTML = '';
        for (let day = 1; day <= 31; day++) {
            const dayStatus = schedule[day];
            const cellClass = dayStatus === 'work' ? 'work-day' : 'weekend-day';
            const cellContent = dayStatus === 'work' ? '1' : 'В';
            
            daysHTML += `<td class="schedule-day ${cellClass}">${cellContent}</td>`;
        }
        return daysHTML;
    }
    
    // Методы для работы с расписанием
    getMonthName(monthIndex) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[monthIndex];
    }
    
    renderScheduleCalendar(year, month) {
        const scheduleManager = window.scheduleManager || new ScheduleManager();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();
        
        // Получаем всех сотрудников
        const employees = Object.values(window.usersDatabase || {}).filter(user => user.role !== 'admin');
        
        let calendarHTML = `
            <div class="calendar-header">
                <div class="calendar-day-header">Сотрудник</div>
                ${Array.from({length: daysInMonth}, (_, i) => {
                    const date = new Date(year, month, i + 1);
                    const dayName = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
                    return `<div class="calendar-day-header">${i + 1}<br><span class="day-name">${dayName}</span></div>`;
                }).join('')}
            </div>
        `;
        
        // Добавляем строки для каждого сотрудника
        employees.forEach(employee => {
            const schedule = scheduleManager.getEmployeeSchedule(employee.username, year, month);
            
            calendarHTML += `
                <div class="calendar-row">
                    <div class="employee-info">
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-department">${employee.department || 'Без отдела'}</div>
                    </div>
                    ${Array.from({length: daysInMonth}, (_, i) => {
                        const daySchedule = schedule[i + 1] || 'weekend';
                        const cssClass = this.getScheduleClass(daySchedule);
                        const tooltip = this.getScheduleTooltip(daySchedule);
                        
                        return `<div class="calendar-day ${cssClass}" title="${tooltip}"></div>`;
                    }).join('')}
                </div>
            `;
        });
        
        return `<div class="calendar-grid">${calendarHTML}</div>`;
    }
    
    getScheduleClass(scheduleType) {
        const classes = {
            'work': 'working',
            'weekend': 'weekend',
            'vacation': 'vacation',
            'sick': 'sick'
        };
        return classes[scheduleType] || 'weekend';
    }
    
    getScheduleTooltip(scheduleType) {
        const tooltips = {
            'work': 'Рабочий день',
            'weekend': 'Выходной',
            'vacation': 'Отпуск',
            'sick': 'Больничный'
        };
        return tooltips[scheduleType] || 'Выходной';
    }
    
    changeScheduleMonth(direction) {
        // Этот метод будет вызываться кнопками навигации
        const currentTitle = document.getElementById('current-month-title');
        if (!currentTitle) return;
        
        // Парсим текущий месяц и год
        const titleText = currentTitle.textContent;
        const [monthName, yearStr] = titleText.split(' ');
        const currentYear = parseInt(yearStr);
        let currentMonth = this.getMonthIndex(monthName);
        
        // Изменяем месяц
        currentMonth += direction;
        let newYear = currentYear;
        
        if (currentMonth < 0) {
            currentMonth = 11;
            newYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            newYear++;
        }
        
        // Обновляем заголовок
        currentTitle.textContent = `${this.getMonthName(currentMonth)} ${newYear}`;
        
        // Обновляем календарь
        const calendarContainer = document.getElementById('schedule-calendar');
        if (calendarContainer) {
            calendarContainer.innerHTML = this.renderScheduleCalendar(newYear, currentMonth);
        }
    }
    
    getMonthIndex(monthName) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months.indexOf(monthName);
    }
    
    filterByDepartment(department) {
        const calendarRows = document.querySelectorAll('.calendar-row');
        
        calendarRows.forEach(row => {
            const employeeDepartment = row.querySelector('.employee-department').textContent;
            
            if (department === 'all' || employeeDepartment === department || 
                (department === 'Без отдела' && employeeDepartment === 'Без отдела')) {
                row.style.display = 'flex';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    getReportsContent() {
        return `
            <div class="page-header">
                <h1 class="page-title">Отчеты</h1>
                <p class="page-subtitle">Аналитика и отчеты</p>
            </div>
            
            <div class="reports-placeholder">
                <div class="placeholder-card">
                    <i class="fas fa-chart-bar"></i>
                    <h3>Раздел в разработке</h3>
                    <p>Система отчетов будет добавлена в ближайших обновлениях</p>
                </div>
            </div>
        `;
    }
    
    initPageHandlers(pageId) {
        console.log('=== initPageHandlers вызван для страницы:', pageId, '===');
        
        // Здесь можно добавить специфичные для страницы обработчики
        if (pageId === 'overview') {
            // Обновление времени каждую секунду
            this.startTimeUpdate();
        } else if (pageId === 'tasks') {
            console.log('Инициализируем обработчики для страницы задач...');
            
            // Обработчики для вкладок задач
            this.initTasksTabs();
            this.initTaskEnhancements();
            
            // Привязываем обработчик к кнопке создания задачи
            setTimeout(() => {
                console.log('Ищем кнопку createTaskBtn через 200ms...');
                
                const createBtn = document.getElementById('createTaskBtn');
                console.log('Результат поиска кнопки createTaskBtn:', createBtn);
                
                if (createBtn) {
                    console.log('✅ Кнопка найдена! Привязываем обработчик...');
                    console.log('Кнопка - текст:', createBtn.textContent);
                    console.log('Кнопка - класс:', createBtn.className);
                    
                    createBtn.onclick = () => {
                        console.log('🎯 Клик по кнопке создания задачи обнаружен!');
                        this.showCreateTaskModal();
                    };
                    
                    console.log('✅ Обработчик успешно привязан к кнопке');
                } else {
                    console.error('❌ Кнопка createTaskBtn не найдена!');
                    console.log('Поиск альтернативных кнопок...');
                    
                    // Ищем все кнопки на странице для отладки
                    const allButtons = document.querySelectorAll('button');
                    console.log('Найдено кнопок на странице:', allButtons.length);
                    allButtons.forEach((btn, index) => {
                        console.log(`Кнопка ${index + 1}:`, {
                            id: btn.id,
                            className: btn.className,
                            text: btn.textContent.trim()
                        });
                    });
                }
            }, 200);
        }
        
        console.log('=== initPageHandlers завершен ===');
    }
    
    initTasksTabs() {
        console.log('🔧 Инициализация вкладок задач...');
        
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Убираем активное состояние со всех кнопок и контента
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Добавляем активное состояние к выбранной вкладке
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Применяем фильтры к новой вкладке
                this.applyTaskFilters();
            });
        });
        
        // Обработчик создания задачи
        const createTaskBtn = document.getElementById('createTaskBtn');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => {
                this.showCreateTaskModal();
            });
        }
        
        // Обработчик обновления задач
        const refreshTasksBtn = document.getElementById('refreshTasksBtn');
        if (refreshTasksBtn) {
            refreshTasksBtn.addEventListener('click', () => {
                this.refreshTasksPage();
            });
        }
        
        // Обработчик экспорта задач
        const exportTasksBtn = document.getElementById('exportTasksBtn');
        if (exportTasksBtn) {
            exportTasksBtn.addEventListener('click', () => {
                this.exportTasks();
            });
        }
        
        // Обработчики фильтров
        const statusFilter = document.getElementById('taskStatusFilter');
        const priorityFilter = document.getElementById('taskPriorityFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.applyTaskFilters();
            });
        }
        
        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => {
                this.applyTaskFilters();
            });
        }
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (this.currentPage === 'tasks' && (e.ctrlKey || e.metaKey)) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.showCreateTaskModal();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshTasksPage();
                        break;
                }
            }
        });
        
        // Применяем фильтры по умолчанию
        setTimeout(() => this.applyTaskFilters(), 100);
        
        console.log('✅ Вкладки задач инициализированы');
    }
    
    // Новые методы для работы с фильтрами
    applyTaskFilters() {
        const statusFilter = document.getElementById('taskStatusFilter')?.value || '';
        const priorityFilter = document.getElementById('taskPriorityFilter')?.value || '';
        
        // Получаем активную вкладку
        const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');
        const activeGrid = document.querySelector(`#${activeTab} .tasks-grid`);
        
        if (!activeGrid) return;
        
        const taskCards = activeGrid.querySelectorAll('.task-card');
        
        taskCards.forEach(card => {
            const taskStatus = card.getAttribute('data-status');
            const taskPriority = card.getAttribute('data-priority');
            
            const statusMatch = !statusFilter || taskStatus === statusFilter;
            const priorityMatch = !priorityFilter || taskPriority === priorityFilter;
            
            if (statusMatch && priorityMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        this.updateFilteredTasksCount();
    }
    
    updateFilteredTasksCount() {
        const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');
        const activeGrid = document.querySelector(`#${activeTab} .tasks-grid`);
        
        if (!activeGrid) return;
        
        const visibleTasks = activeGrid.querySelectorAll('.task-card[style*="display: block"], .task-card:not([style*="display: none"])').length;
        const totalTasks = activeGrid.querySelectorAll('.task-card').length;
        
        // Обновляем счетчик в заголовке вкладки если есть фильтрация
        if (visibleTasks !== totalTasks) {
            const activeTabButton = document.querySelector('.tab-btn.active');
            if (activeTabButton) {
                const originalText = activeTabButton.textContent.split(' (')[0];
                activeTabButton.textContent = `${originalText} (${visibleTasks}/${totalTasks})`;
            }
        }
    }
    
    refreshTasksPage() {
        window.NotificationManager.info('Обновление задач...');
        this.loadPage('tasks');
    }
    
    startTimeUpdate() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        
        this.timeInterval = setInterval(() => {
            if (this.currentPage === 'overview') {
                const timeElement = document.querySelector('.card-content strong');
                if (timeElement && timeElement.textContent.includes(':')) {
                    timeElement.textContent = new Date().toLocaleTimeString('ru-RU');
                }
            }
        }, 1000);
    }
    
    groupEmployeesByAccessLevel(employees) {
        const grouped = {};
        
        employees.forEach(emp => {
            if (!grouped[emp.accessLevel]) {
                grouped[emp.accessLevel] = [];
            }
            grouped[emp.accessLevel].push(emp);
        });
        
        // Сортируем по уровню доступа
        const sortedGrouped = {};
        Object.keys(grouped)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .forEach(key => {
                sortedGrouped[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name));
            });
        
        return sortedGrouped;
    }
    
    showEmployeeDetails(employeeId) {
        const employee = window.usersDatabase[employeeId];
        if (!employee) return;
        
        const roleData = window.roleDatabase[employee.role];
        
        // Создаем модальное окно с деталями сотрудника
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${employee.name}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="employee-details-modal">
                    <div class="employee-profile">
                        <img src="${employee.avatar}" alt="${employee.name}">
                        <div class="employee-info">
                            <h4>${employee.position}</h4>
                            <p>Уровень доступа: ${window.accessLevels[employee.accessLevel]}</p>
                            <p>День рождения: ${employee.birthday || 'Не указан'}</p>
                            <p>Логин: ${employee.id}</p>
                        </div>
                    </div>
                    
                    ${roleData ? `
                        <div class="role-details">
                            <h4>Обязанности:</h4>
                            <ul>${roleData.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
                            
                            <h4>Навыки:</h4>
                            <ul>${roleData.skills.map(s => `<li>${s}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Обработчик закрытия
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    checkBirthday() {
        if (!this.currentUser.birthday) return false;
        
        const today = new Date();
        const [day, month] = this.currentUser.birthday.split('.');
        
        return today.getDate() === parseInt(day) && 
               today.getMonth() + 1 === parseInt(month);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    showChangePasswordModal() {
        document.getElementById('changePasswordModal').classList.add('show');
    }
    
    hideChangePasswordModal() {
        document.getElementById('changePasswordModal').classList.remove('show');
        document.getElementById('changePasswordForm').reset();
    }
    
    handlePasswordChange() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            window.NotificationManager.error('Новые пароли не совпадают!');
            return;
        }
        
        if (newPassword.length < 6) {
            window.NotificationManager.warning('Пароль должен содержать минимум 6 символов!');
            return;
        }
        
        const result = window.UserManager.changePassword(currentPassword, newPassword);
        
        if (result.success) {
            window.NotificationManager.success('Пароль успешно изменен!');
            this.hideChangePasswordModal();
        } else {
            window.NotificationManager.error(result.message);
        }
    }
    
    logout() {
        try {
            if (window.NotificationManager && typeof window.NotificationManager.confirm === 'function') {
                window.NotificationManager.confirm(
                    'Вы уверены, что хотите выйти из системы?',
                    () => {
                        // Выполняем выход через API клиент
                        if (window.wgarageAPI && typeof window.wgarageAPI.logout === 'function') {
                            window.wgarageAPI.logout();
                        }
                        // Перенаправляем на страницу входа
                        window.location.href = '/login';
                    },
                    null,
                    {
                        confirmText: 'Да, выйти',
                        cancelText: 'Отмена'
                    }
                );
            } else {
                // Если NotificationManager недоступен, делаем простое подтверждение
                if (confirm('Вы уверены, что хотите выйти из системы?')) {
                    if (window.wgarageAPI && typeof window.wgarageAPI.logout === 'function') {
                        window.wgarageAPI.logout();
                    }
                    window.location.href = '/login';
                }
            }
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            // В случае ошибки все равно пытаемся выйти
            if (window.wgarageAPI && typeof window.wgarageAPI.logout === 'function') {
                window.wgarageAPI.logout();
            }
            window.location.href = '/login';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Глобальная функция для выхода (для отладки)
window.logout = () => {
    if (window.dashboard && typeof window.dashboard.logout === 'function') {
        window.dashboard.logout();
    } else {
        console.error('Dashboard не инициализирован');
    }
};

// Глобальная функция для доступа из HTML
window.showEmployeeDetails = (employeeId) => {
    window.dashboard.showEmployeeDetails(employeeId);
};

// Добавляем новые методы в класс Dashboard
Dashboard.prototype.getOrgChartContent = function() {
    const orgChart = window.organizationChart;
    
    return `
        <div class="orgchart-container">
            <div class="orgchart-header">
                <h2>Организационная структура W Garage</h2>
                <p>Структура подразделений и иерархия компании</p>
            </div>
            
            <div class="departments-grid">
                ${Object.entries(orgChart.structure).map(([key, dept]) => `
                    <div class="department-card">
                        <div class="department-header">
                            <h3>${dept.title}</h3>
                            <span class="member-count">${dept.members.length} сотрудников</span>
                        </div>
                        <div class="department-head">
                            <strong>Руководитель:</strong> ${this.getUserName(dept.head)}
                        </div>
                        <div class="department-members">
                            <h4>Состав отдела:</h4>
                            <ul>
                                ${dept.members.map(memberId => `
                                    <li>
                                        <span class="member-name">${this.getUserName(memberId)}</span>
                                        <span class="member-position">${this.getUserPosition(memberId)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

Dashboard.prototype.getTasksContent = function() {
    const currentUser = window.UserManager.getCurrentUser();
    const userTasks = window.TaskManager.getTasksForUser(currentUser.id);
    const allTasks = currentUser.canViewAll ? window.TaskManager.getAllTasks() : [];
    
    const content = `
        <div class="tasks-container">
            <div class="tasks-header">
                <h2>Управление задачами</h2>
                <div class="tasks-header-actions">
                    <button class="btn btn-primary" id="createTaskBtn">
                        <i class="fas fa-plus"></i> Создать задачу
                    </button>
                    <button class="btn btn-secondary" id="refreshTasksBtn">
                        <i class="fas fa-sync-alt"></i> Обновить
                    </button>
                    <button class="btn btn-outline" id="exportTasksBtn">
                        <i class="fas fa-download"></i> Экспорт
                    </button>
                    <div class="tasks-filters">
                        <select id="taskStatusFilter" class="form-control">
                            <option value="">Все статусы</option>
                            <option value="new">Новые</option>
                            <option value="in_progress">В работе</option>
                            <option value="completed">Завершенные</option>
                            <option value="cancelled">Отмененные</option>
                            <option value="rejected">Отклоненные</option>
                        </select>
                        <select id="taskPriorityFilter" class="form-control">
                            <option value="">Все приоритеты</option>
                            <option value="urgent">Срочный</option>
                            <option value="high">Высокий</option>
                            <option value="medium">Средний</option>
                            <option value="low">Низкий</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="tasks-stats">
                ${this.renderTasksStats(userTasks, allTasks, currentUser)}
            </div>
            
            <div class="tasks-tabs">
                <button class="tab-btn active" data-tab="my-tasks">Мои задачи (${userTasks.length})</button>
                ${currentUser.canViewAll ? `<button class="tab-btn" data-tab="all-tasks">Все задачи (${allTasks.length})</button>` : ''}
                <button class="tab-btn" data-tab="created-by-me">Созданные мной (${this.getTasksCreatedByUser(currentUser.id).length})</button>
            </div>
            
            <div class="tab-content active" id="my-tasks">
                <div class="tasks-grid" id="myTasksGrid">
                    ${userTasks.length ? userTasks.map(task => this.renderTaskCard(task)).join('') : '<div class="no-tasks"><i class="fas fa-tasks"></i><p>У вас нет задач</p></div>'}
                </div>
            </div>
            
            ${currentUser.canViewAll ? `
                <div class="tab-content" id="all-tasks">
                    <div class="tasks-grid" id="allTasksGrid">
                        ${allTasks.length ? allTasks.map(task => this.renderTaskCard(task)).join('') : '<div class="no-tasks"><i class="fas fa-list"></i><p>Задач пока нет</p></div>'}
                    </div>
                </div>
            ` : ''}
            
            <div class="tab-content" id="created-by-me">
                <div class="tasks-grid" id="createdTasksGrid">
                    ${this.renderCreatedByMeTasks(currentUser.id)}
                </div>
            </div>
        </div>
    `;
    
    return content;
};

Dashboard.prototype.renderTasksStats = function(userTasks, allTasks, currentUser) {
    const stats = this.calculateTasksStats(userTasks, allTasks, currentUser);
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #3b82f6;">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-content">
                    <h4>Всего задач</h4>
                    <p class="stat-value">${stats.total}</p>
                    <div class="stat-detail">Активных: ${stats.active}</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #10b981;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                    <h4>Завершено</h4>
                    <p class="stat-value">${stats.completed}</p>
                    <div class="stat-detail">${stats.completionRate}% завершения</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #f59e0b;">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <h4>Просрочено</h4>
                    <p class="stat-value">${stats.overdue}</p>
                    <div class="stat-detail">Требует внимания</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #ef4444;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="stat-content">
                    <h4>Срочные</h4>
                    <p class="stat-value">${stats.urgent}</p>
                    <div class="stat-detail">Высокий приоритет</div>
                </div>
            </div>
        </div>
    `;
};

Dashboard.prototype.calculateTasksStats = function(userTasks, allTasks, currentUser) {
    const tasks = currentUser.canViewAll ? allTasks : userTasks;
    const now = new Date();
    
    return {
        total: tasks.length,
        active: tasks.filter(t => ['new', 'in_progress'].includes(t.status)).length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < now && t.status !== 'completed').length,
        urgent: tasks.filter(t => t.priority === 'urgent').length,
        completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
    };
};

Dashboard.prototype.getTasksCreatedByUser = function(userId) {
    const allTasks = window.TaskManager.getAllTasks();
    return allTasks.filter(task => task.assignedBy === userId);
};

Dashboard.prototype.renderCreatedByMeTasks = function(userId) {
    const createdTasks = this.getTasksCreatedByUser(userId);
    
    if (createdTasks.length === 0) {
        return '<div class="no-tasks"><i class="fas fa-plus-circle"></i><p>Вы еще не создавали задач</p></div>';
    }
    
    return createdTasks.map(task => this.renderTaskCard(task)).join('');
};

Dashboard.prototype.renderTaskCard = function(task) {
    const assignedUser = window.usersDatabase[task.assignedTo];
    const assignedByUser = window.usersDatabase[task.assignedBy];
    const currentUser = window.UserManager.getCurrentUser();
    
    const priorityColors = {
        'low': '#10b981',
        'medium': '#f59e0b', 
        'high': '#ef4444',
        'urgent': '#dc2626'
    };
    
    const statusColors = {
        'new': '#6b7280',
        'in_progress': '#3b82f6',
        'completed': '#10b981',
        'cancelled': '#ef4444',
        'rejected': '#ef4444'
    };
    
    const isAssignedToMe = task.assignedTo === currentUser.id;
    const isCreatedByMe = task.assignedBy === currentUser.id;
    const canManage = currentUser.canViewAll || isCreatedByMe;
    
    // Определяем доступные действия в зависимости от статуса и роли
    let actions = '';
    
    if (isAssignedToMe) {
        if (task.status === 'new') {
            actions += `<button class="btn btn-sm btn-success btn-action" onclick="window.dashboard.acceptTask('${task.id}')">
                <i class="fas fa-play"></i> Принять
            </button>`;
            actions += `<button class="btn btn-sm btn-danger btn-action ml-1" onclick="window.dashboard.rejectTask('${task.id}')">
                <i class="fas fa-times"></i> Отклонить
            </button>`;
        } else if (task.status === 'in_progress') {
            actions += `<button class="btn btn-sm btn-success btn-action" onclick="window.dashboard.completeTask('${task.id}')">
                <i class="fas fa-check"></i> Завершить
            </button>`;
        }
    }
    
    if (canManage && task.status !== 'completed' && task.status !== 'cancelled') {
        actions += `<button class="btn btn-sm btn-warning btn-action ml-1" onclick="window.dashboard.editTask('${task.id}')">
            <i class="fas fa-edit"></i> Редактировать
        </button>`;
        actions += `<button class="btn btn-sm btn-danger btn-action ml-1" onclick="window.dashboard.cancelTask('${task.id}')">
            <i class="fas fa-ban"></i> Отменить
        </button>`;
    }
    
    actions += `<button class="btn btn-sm btn-details ml-1" onclick="window.dashboard.showTaskDetails('${task.id}')">
        <i class="fas fa-info-circle"></i> Подробнее
    </button>`;
    
    // Определяем цвет карточки в зависимости от приоритета и просрочки
    let cardClass = 'task-card';
    if (task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed') {
        cardClass += ' overdue';
    }
    if (task.priority === 'urgent') {
        cardClass += ' urgent';
    }
    
    return `
        <div class="${cardClass}" data-task-id="${task.id}" data-status="${task.status}" data-priority="${task.priority}">
            <div class="task-header">
                <h3>${task.title}</h3>
                <div class="task-badges">
                    <div class="task-priority" style="background: ${priorityColors[task.priority]}">
                        ${this.getPriorityText(task.priority)}
                    </div>
                    <div class="task-status" style="background: ${statusColors[task.status]}; color: white;">
                        ${this.getStatusText(task.status)}
                    </div>
                </div>
            </div>
            <div class="task-info">
                <p><i class="fas fa-user"></i> <strong>Исполнитель:</strong> ${assignedUser?.name || 'Неизвестно'}</p>
                <p><i class="fas fa-user-tie"></i> <strong>Постановщик:</strong> ${assignedByUser?.name || 'Неизвестно'}</p>
                <p><i class="fas fa-calendar"></i> <strong>Создана:</strong> ${this.formatDate(task.created)}</p>
                ${task.deadline ? `<p><i class="fas fa-clock"></i> <strong>Срок:</strong> ${this.formatDate(task.deadline)} ${new Date(task.deadline) < new Date() && task.status !== 'completed' ? '<span class="overdue-text">ПРОСРОЧЕНО</span>' : ''}</p>` : ''}
                ${task.acceptedAt ? `<p><i class="fas fa-play"></i> <strong>Принята:</strong> ${this.formatDate(task.acceptedAt)}</p>` : ''}
                ${task.completedAt ? `<p><i class="fas fa-check"></i> <strong>Завершена:</strong> ${this.formatDate(task.completedAt)}</p>` : ''}
            </div>
            <div class="task-description">
                <p>${task.description || 'Без описания'}</p>
            </div>
            ${task.comments && task.comments.length > 0 ? `
                <div class="task-comments-preview">
                    <p><i class="fas fa-comments"></i> Комментариев: ${task.comments.length}</p>
                    <div class="last-comment">
                        ${this.renderLastComment(task.comments[task.comments.length - 1])}
                    </div>
                </div>
            ` : ''}
            <div class="task-footer">
                <div class="task-actions">
                    ${actions}
                </div>
            </div>
        </div>
    `;
};

Dashboard.prototype.getUserName = function(userId) {
    const user = window.usersDatabase[userId];
    return user ? user.name : 'Неизвестно';
};

Dashboard.prototype.getUserPosition = function(userId) {
    const user = window.usersDatabase[userId];
    return user ? user.position : 'Неизвестно';
};

Dashboard.prototype.getPriorityText = function(priority) {
    const priorities = {
        'low': 'Низкий',
        'medium': 'Средний',
        'high': 'Высокий',
        'urgent': 'Срочный'
    };
    return priorities[priority] || priority;
};

Dashboard.prototype.renderLastComment = function(comment) {
    const author = window.usersDatabase[comment.author];
    const timeAgo = this.getTimeAgo(comment.timestamp);
    
    return `
        <div class="comment-preview">
            <strong>${author?.name || 'Неизвестно'}:</strong> 
            <span class="comment-text">${comment.text}</span>
            <small class="comment-time">${timeAgo}</small>
        </div>
    `;
};

Dashboard.prototype.getTimeAgo = function(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return time.toLocaleDateString('ru-RU');
};

Dashboard.prototype.getStatusText = function(status) {
    const statuses = {
        'new': 'Новая',
        'in_progress': 'В работе',
        'completed': 'Выполнена',
        'cancelled': 'Отменена',
        'rejected': 'Отклонена'
    };
    return statuses[status] || status;
};

Dashboard.prototype.formatDate = function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
};

Dashboard.prototype.showCreateTaskModal = function() {
    console.log('=== showCreateTaskModal вызван ===');
    console.log('Показываем модальное окно создания задачи...');
    
    // Удаляем существующее модальное окно если есть
    const existingModal = document.getElementById('createTaskModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем новое модальное окно
    this.createTaskModal();
    
    // Ищем созданное модальное окно
    const modal = document.getElementById('createTaskModal');
    if (!modal) {
        console.error('Не удалось создать модальное окно!');
        window.NotificationManager.error('Ошибка: не удалось открыть форму создания задачи');
        return;
    }
    
    console.log('Модальное окно найдено, отображаем...');
    modal.style.display = 'flex';
    // Добавляем класс show для правильного отображения
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Очищаем форму
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDescription');
    const assigneeSelect = document.getElementById('taskAssignee');
    const prioritySelect = document.getElementById('taskPriority');
    const deadlineInput = document.getElementById('taskDeadline');
    
    console.log('Очищаем поля формы...');
    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';
    if (assigneeSelect) assigneeSelect.value = '';
    if (prioritySelect) prioritySelect.value = 'medium';
    if (deadlineInput) {
        deadlineInput.value = '';
        // Устанавливаем минимальную дату как сегодня
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        deadlineInput.min = today.toISOString().slice(0, 16);
    }
    
    // Фокус на первое поле
    if (titleInput) {
        titleInput.focus();
    }
    
    // Закрытие по клику на фон
    modal.onclick = (e) => {
        if (e.target === modal) {
            this.hideCreateTaskModal();
        }
    };
    
    // Закрытие по Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            this.hideCreateTaskModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    console.log('Модальное окно успешно отображено');
};

Dashboard.prototype.hideCreateTaskModal = function() {
    console.log('Скрываем модальное окно создания задачи...');
    const modal = document.getElementById('createTaskModal');
    if (modal) {
        // Убираем класс show для анимации скрытия
        modal.classList.remove('show');
        console.log('Модальное окно скрыто');
        
        // Полностью удаляем модальное окно из DOM после анимации
        setTimeout(() => {
            if (modal.parentNode) {
                modal.style.display = 'none';
                modal.parentNode.removeChild(modal);
                console.log('Модальное окно удалено из DOM');
            }
        }, 300);
    } else {
        console.log('Модальное окно не найдено для скрытия');
    }
};

Dashboard.prototype.createTask = function() {
    console.log('Создание задачи...');
    
    try {
        // Получаем данные из формы
        const titleElement = document.getElementById('taskTitle');
        const descriptionElement = document.getElementById('taskDescription');
        const assigneeElement = document.getElementById('taskAssignee');
        const priorityElement = document.getElementById('taskPriority');
        const deadlineElement = document.getElementById('taskDeadline');
        
        if (!titleElement || !assigneeElement) {
            console.error('Элементы формы не найдены');
            window.NotificationManager.error('Ошибка: форма не загружена корректно');
            return;
        }
        
        const title = titleElement.value.trim();
        const description = descriptionElement ? descriptionElement.value.trim() : '';
        const assignedTo = assigneeElement.value;
        const priority = priorityElement ? priorityElement.value : 'medium';
        const deadline = deadlineElement ? deadlineElement.value : '';
        
        console.log('Собранные данные формы:', { title, description, assignedTo, priority, deadline });
        
        // Валидация
        if (!title) {
            window.NotificationManager.warning('Пожалуйста, введите название задачи');
            titleElement.focus();
            return;
        }
        
        if (!assignedTo) {
            window.NotificationManager.warning('Пожалуйста, выберите исполнителя');
            assigneeElement.focus();
            return;
        }
        
        // Проверяем, что TaskManager доступен
        if (!window.TaskManager || typeof window.TaskManager.createTask !== 'function') {
            console.error('TaskManager недоступен');
            window.NotificationManager.error('Ошибка: система управления задачами недоступна');
            return;
        }
        
        // Формируем данные задачи
        const taskData = {
            title: title,
            description: description || 'Без описания',
            assignedTo: assignedTo,
            priority: priority,
            deadline: deadline || null
        };
        
        // Проверяем доступность исполнителя по расписанию
        if (window.scheduleManager && deadline) {
            const deadlineDate = new Date(deadline);
            const isAvailable = window.scheduleManager.isEmployeeAvailable(assignedTo, deadlineDate);
            
            if (!isAvailable) {
                const confirmMessage = `⚠️ Исполнитель "${assignedTo}" не работает в указанную дату дедлайна (${deadline}).\n\nВы хотите создать задачу всё равно?`;
                
                window.NotificationManager.confirm(
                    confirmMessage,
                    () => {
                        this.proceedWithTaskCreation(taskData);
                    },
                    () => {
                        console.log('Создание задачи отменено из-за недоступности исполнителя');
                    },
                    {
                        confirmText: 'Да, создать',
                        cancelText: 'Отмена'
                    }
                );
                return;
            }
        }
        
        this.proceedWithTaskCreation(taskData);
    } catch (error) {
        console.error('Исключение в createTask:', error);
        window.NotificationManager.error('Произошла ошибка при создании задачи. Проверьте консоль для деталей.');
    }
};

Dashboard.prototype.proceedWithTaskCreation = function(taskData) {
    try {
        console.log('Данные задачи для создания:', taskData);
        
        // Создаем задачу через TaskManager
        const result = window.TaskManager.createTask(taskData);
        
        console.log('Результат создания:', result);
        
        if (result && result.success) {
            window.NotificationManager.success('Задача создана успешно!');
            this.hideCreateTaskModal();
            
            // Обновляем страницу задач, если мы на ней
            if (this.currentPage === 'tasks') {
                this.loadPage('tasks');
            }
            
            // Увеличиваем счетчик уведомлений
            this.updateNotificationBadge();
        } else {
            const errorMessage = result ? result.message : 'Неизвестная ошибка при создании задачи';
            console.error('Ошибка создания задачи:', errorMessage);
            window.NotificationManager.error('Ошибка при создании задачи: ' + errorMessage);
        }
    } catch (error) {
        console.error('Исключение в createTask:', error);
        window.NotificationManager.error('Произошла ошибка при создании задачи. Проверьте консоль для деталей.');
    }
};

Dashboard.prototype.showTaskDetails = function(taskId) {
    const task = window.TaskManager.getTask(taskId);
    if (!task) {
        window.NotificationManager.error('Задача не найдена');
        return;
    }
    
    this.showTaskDetailModal(task);
};

// Принятие задачи
Dashboard.prototype.acceptTask = function(taskId) {
    window.NotificationManager.prompt(
        'Комментарий при принятии задачи (необязательно):',
        (reason) => {
            const result = window.TaskManager.acceptTask(taskId, reason);
            if (result.success) {
                window.NotificationManager.success('Задача принята в работу!');
                this.refreshCurrentPage();
            } else {
                window.NotificationManager.error(`Ошибка: ${result.message}`);
            }
        },
        {
            placeholder: 'Введите комментарий...',
            required: false,
            submitText: 'Принять задачу',
            cancelText: 'Отмена'
        }
    );
};

// Завершение задачи
Dashboard.prototype.completeTask = function(taskId) {
    window.NotificationManager.prompt(
        'Комментарий о выполнении (необязательно):',
        (comment) => {
            const result = window.TaskManager.completeTask(taskId, comment);
            if (result.success) {
                window.NotificationManager.success('Задача завершена!');
                this.refreshCurrentPage();
            } else {
                window.NotificationManager.error(`Ошибка: ${result.message}`);
            }
        },
        {
            placeholder: 'Опишите результат выполнения...',
            required: false,
            submitText: 'Завершить задачу',
            cancelText: 'Отмена'
        }
    );
};

// Отклонение задачи
Dashboard.prototype.rejectTask = function(taskId) {
    window.NotificationManager.prompt(
        'Укажите причину отклонения задачи:',
        (reason) => {
            if (!reason || reason.trim() === '') {
                window.NotificationManager.error('Необходимо указать причину отклонения');
                return;
            }
            
            const result = window.TaskManager.rejectTask(taskId, reason);
            if (result.success) {
                window.NotificationManager.warning('Задача отклонена');
                this.refreshCurrentPage();
            } else {
                window.NotificationManager.error(`Ошибка: ${result.message}`);
            }
        },
        {
            placeholder: 'Причина отклонения...',
            required: true,
            submitText: 'Отклонить задачу',
            cancelText: 'Отмена'
        }
    );
};

// Отмена задачи
Dashboard.prototype.cancelTask = function(taskId) {
    window.NotificationManager.confirm(
        'Вы уверены, что хотите отменить эту задачу?',
        () => {
            window.NotificationManager.prompt(
                'Причина отмены:',
                (reason) => {
                    if (!reason || reason.trim() === '') {
                        window.NotificationManager.error('Необходимо указать причину отмены');
                        return;
                    }
                    
                    const result = window.TaskManager.updateTaskStatus(taskId, 'cancelled', reason);
                    if (result.success) {
                        window.NotificationManager.info('Задача отменена');
                        this.refreshCurrentPage();
                    } else {
                        window.NotificationManager.error(`Ошибка: ${result.message}`);
                    }
                },
                {
                    placeholder: 'Причина отмены...',
                    required: true,
                    submitText: 'Отменить задачу',
                    cancelText: 'Назад'
                }
            );
        },
        null,
        {
            confirmText: 'Да, отменить',
            cancelText: 'Нет'
        }
    );
};

// Редактирование задачи
Dashboard.prototype.editTask = function(taskId) {
    const task = window.TaskManager.getTask(taskId);
    if (!task) {
        alert('Задача не найдена');
        return;
    }
    
    this.showEditTaskModal(task);
};

Dashboard.prototype.refreshCurrentPage = function() {
    if (this.currentPage === 'tasks') {
        this.loadPage('tasks');
    }
};

Dashboard.prototype.showTaskDetailModal = function(task) {
    const assignedUser = window.usersDatabase[task.assignedTo];
    const assignedByUser = window.usersDatabase[task.assignedBy];
    const currentUser = window.UserManager.getCurrentUser();
    
    const modal = document.createElement('div');
    modal.className = 'modal task-detail-modal';
    modal.id = 'taskDetailModal';
    
    const priorityColors = {
        'low': '#10b981',
        'medium': '#f59e0b', 
        'high': '#ef4444',
        'urgent': '#dc2626'
    };
    
    const statusColors = {
        'new': '#6b7280',
        'in_progress': '#3b82f6',
        'completed': '#10b981',
        'cancelled': '#ef4444',
        'rejected': '#ef4444'
    };
    
    modal.innerHTML = `
        <div class="modal-content task-detail-content">
            <div class="modal-header">
                <h3>${task.title}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="task-detail-info">
                    <div class="task-badges">
                        <span class="badge priority-badge" style="background: ${priorityColors[task.priority]}">
                            ${this.getPriorityText(task.priority)}
                        </span>
                        <span class="badge status-badge" style="background: ${statusColors[task.status]}">
                            ${this.getStatusText(task.status)}
                        </span>
                    </div>
                    
                    <div class="task-meta">
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <strong>Исполнитель:</strong> ${assignedUser?.name || 'Неизвестно'} (${assignedUser?.position || ''})
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-user-tie"></i>
                            <strong>Постановщик:</strong> ${assignedByUser?.name || 'Неизвестно'} (${assignedByUser?.position || ''})
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-plus"></i>
                            <strong>Создана:</strong> ${this.formatDate(task.created)}
                        </div>
                        ${task.deadline ? `
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <strong>Срок выполнения:</strong> ${this.formatDate(task.deadline)}
                                ${new Date(task.deadline) < new Date() && task.status !== 'completed' ? '<span class="overdue-text">ПРОСРОЧЕНО</span>' : ''}
                            </div>
                        ` : ''}
                        ${task.acceptedAt ? `
                            <div class="meta-item">
                                <i class="fas fa-play"></i>
                                <strong>Принята в работу:</strong> ${this.formatDate(task.acceptedAt)}
                            </div>
                        ` : ''}
                        ${task.completedAt ? `
                            <div class="meta-item">
                                <i class="fas fa-check"></i>
                                <strong>Завершена:</strong> ${this.formatDate(task.completedAt)}
                            </div>
                        ` : ''}
                        <div class="meta-item">
                            <i class="fas fa-edit"></i>
                            <strong>Последнее обновление:</strong> ${this.formatDate(task.updated)}
                        </div>
                    </div>
                    
                    <div class="task-description">
                        <h4><i class="fas fa-file-text"></i> Описание</h4>
                        <p>${task.description || 'Описание не указано'}</p>
                    </div>
                </div>
                
                <div class="task-comments-section">
                    <h4><i class="fas fa-comments"></i> Комментарии и история (${task.comments?.length || 0})</h4>
                    <div class="comments-list" id="commentsContainer">
                        ${this.renderComments(task.comments || [])}
                    </div>
                    
                    <div class="add-comment-section">
                        <div class="form-group">
                            <textarea id="newComment" placeholder="Добавить комментарий..." rows="3"></textarea>
                        </div>
                        <button class="btn btn-primary" onclick="window.dashboard.addTaskComment('${task.id}')">
                            <i class="fas fa-paper-plane"></i> Добавить комментарий
                        </button>
                    </div>
                </div>
                
                <div class="task-actions-section">
                    ${this.renderTaskActions(task)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
};

Dashboard.prototype.renderComments = function(comments) {
    if (!comments || comments.length === 0) {
        return '<p class="no-comments">Комментариев пока нет</p>';
    }
    
    return comments.map(comment => {
        const author = window.usersDatabase[comment.author];
        const typeIcons = {
            'comment': 'fas fa-comment',
            'status_change': 'fas fa-exchange-alt',
            'accept': 'fas fa-play',
            'complete': 'fas fa-check',
            'reject': 'fas fa-times'
        };
        
        const typeColors = {
            'comment': '#6b7280',
            'status_change': '#3b82f6',
            'accept': '#10b981',
            'complete': '#10b981',
            'reject': '#ef4444'
        };
        
        return `
            <div class="comment-item ${comment.type || 'comment'}">
                <div class="comment-header">
                    <div class="comment-author">
                        <i class="${typeIcons[comment.type] || 'fas fa-comment'}" style="color: ${typeColors[comment.type] || '#6b7280'}"></i>
                        <strong>${author?.name || 'Неизвестно'}</strong>
                        <span class="author-position">${author?.position || ''}</span>
                    </div>
                    <div class="comment-time">${this.formatDate(comment.timestamp)}</div>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
    }).join('');
};

Dashboard.prototype.renderTaskActions = function(task) {
    const currentUser = window.UserManager.getCurrentUser();
    const isAssignedToMe = task.assignedTo === currentUser.id;
    const isCreatedByMe = task.assignedBy === currentUser.id;
    const canManage = currentUser.canViewAll || isCreatedByMe;
    
    let actions = [];
    
    if (isAssignedToMe) {
        if (task.status === 'new') {
            actions.push(`<button class="btn btn-success" onclick="window.dashboard.acceptTaskFromModal('${task.id}')"><i class="fas fa-play"></i> Принять в работу</button>`);
            actions.push(`<button class="btn btn-danger" onclick="window.dashboard.rejectTaskFromModal('${task.id}')"><i class="fas fa-times"></i> Отклонить</button>`);
        } else if (task.status === 'in_progress') {
            actions.push(`<button class="btn btn-success" onclick="window.dashboard.completeTaskFromModal('${task.id}')"><i class="fas fa-check"></i> Завершить</button>`);
        }
    }
    
    if (canManage && task.status !== 'completed' && task.status !== 'cancelled') {
        actions.push(`<button class="btn btn-warning" onclick="window.dashboard.editTaskFromModal('${task.id}')"><i class="fas fa-edit"></i> Редактировать</button>`);
        if (task.status !== 'cancelled') {
            actions.push(`<button class="btn btn-danger" onclick="window.dashboard.cancelTaskFromModal('${task.id}')"><i class="fas fa-ban"></i> Отменить</button>`);
        }
    }
    
    if (actions.length === 0) {
        return '<p class="no-actions">Нет доступных действий</p>';
    }
    
    return `
        <h4><i class="fas fa-cogs"></i> Действия</h4>
        <div class="actions-grid">
            ${actions.join('')}
        </div>
    `;
};

Dashboard.prototype.addTaskComment = function(taskId) {
    const commentText = document.getElementById('newComment')?.value?.trim();
    if (!commentText) {
        window.NotificationManager.warning('Введите текст комментария');
        return;
    }
    
    const result = window.TaskManager.addComment(taskId, commentText);
    if (result.success) {
        // Обновляем комментарии в модальном окне
        const task = window.TaskManager.getTask(taskId);
        const commentsContainer = document.getElementById('commentsContainer');
        if (commentsContainer && task) {
            commentsContainer.innerHTML = this.renderComments(task.comments || []);
        }
        
        // Очищаем поле ввода
        document.getElementById('newComment').value = '';
        
        // Обновляем страницу задач
        this.refreshCurrentPage();
        
        window.NotificationManager.success('Комментарий добавлен');
    } else {
        window.NotificationManager.error(`Ошибка: ${result.message}`);
    }
};

// Функции для действий из модального окна
Dashboard.prototype.acceptTaskFromModal = function(taskId) {
    const result = window.TaskManager.acceptTask(taskId);
    if (result.success) {
        document.querySelector('.modal').remove();
        this.refreshCurrentPage();
        window.NotificationManager.success('Задача принята в работу!');
    } else {
        window.NotificationManager.error(`Ошибка: ${result.message}`);
    }
};

Dashboard.prototype.completeTaskFromModal = function(taskId) {
    const result = window.TaskManager.completeTask(taskId);
    if (result.success) {
        document.querySelector('.modal').remove();
        this.refreshCurrentPage();
        window.NotificationManager.success('Задача завершена!');
    } else {
        window.NotificationManager.error(`Ошибка: ${result.message}`);
    }
};

Dashboard.prototype.rejectTaskFromModal = function(taskId) {
    window.NotificationManager.prompt(
        'Укажите причину отклонения:',
        (reason) => {
            if (!reason || reason.trim() === '') {
                window.NotificationManager.error('Необходимо указать причину отклонения');
                return;
            }
            
            const result = window.TaskManager.rejectTask(taskId, reason);
            if (result.success) {
                document.querySelector('.modal').remove();
                this.refreshCurrentPage();
                window.NotificationManager.warning('Задача отклонена');
            } else {
                window.NotificationManager.error(`Ошибка: ${result.message}`);
            }
        },
        {
            placeholder: 'Причина отклонения...',
            required: true,
            submitText: 'Отклонить',
            cancelText: 'Отмена'
        }
    );
};

Dashboard.prototype.cancelTaskFromModal = function(taskId) {
    window.NotificationManager.confirm(
        'Вы уверены, что хотите отменить задачу?',
        () => {
            window.NotificationManager.prompt(
                'Причина отмены:',
                (reason) => {
                    if (!reason || reason.trim() === '') {
                        window.NotificationManager.error('Необходимо указать причину отмены');
                        return;
                    }
                    
                    const result = window.TaskManager.updateTaskStatus(taskId, 'cancelled', reason);
                    if (result.success) {
                        document.querySelector('.modal').remove();
                        this.refreshCurrentPage();
                        window.NotificationManager.info('Задача отменена');
                    } else {
                        window.NotificationManager.error(`Ошибка: ${result.message}`);
                    }
                },
                {
                    placeholder: 'Причина отмены...',
                    required: true,
                    submitText: 'Отменить',
                    cancelText: 'Назад'
                }
            );
        },
        null,
        {
            confirmText: 'Да, отменить',
            cancelText: 'Нет'
        }
    );
};

Dashboard.prototype.editTaskFromModal = function(taskId) {
    const task = window.TaskManager.getTask(taskId);
    document.querySelector('.modal').remove();
    this.showEditTaskModal(task);
};

Dashboard.prototype.showEditTaskModal = function(task) {
    const modal = document.createElement('div');
    modal.id = 'editTaskModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Редактировать задачу</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <form id="editTaskForm" class="modal-form">
                <div class="form-group">
                    <label for="editTaskTitle">Название задачи *</label>
                    <input type="text" id="editTaskTitle" value="${task.title}" required>
                </div>
                <div class="form-group">
                    <label for="editTaskDescription">Описание</label>
                    <textarea id="editTaskDescription" rows="4">${task.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="editTaskAssignee">Назначить сотруднику *</label>
                    <select id="editTaskAssignee" required>
                        ${window.TaskManager.getAvailableAssignees().map(user => 
                            `<option value="${user.id}" ${user.id === task.assignedTo ? 'selected' : ''}>${user.name} (${user.position})</option>`
                        ).join('')}
                        ${task.assignedTo ? `<option value="${task.assignedTo}" selected>${window.usersDatabase[task.assignedTo]?.name || 'Текущий исполнитель'}</option>` : ''}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editTaskPriority">Приоритет</label>
                    <select id="editTaskPriority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Низкий</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Средний</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Высокий</option>
                        <option value="urgent" ${task.priority === 'urgent' ? 'selected' : ''}>Срочный</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editTaskDeadline">Срок выполнения</label>
                    <input type="datetime-local" id="editTaskDeadline" value="${task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''}">
                </div>
                <div class="form-group">
                    <label for="editTaskStatus">Статус</label>
                    <select id="editTaskStatus">
                        <option value="new" ${task.status === 'new' ? 'selected' : ''}>Новая</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>В работе</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Выполнена</option>
                        <option value="cancelled" ${task.status === 'cancelled' ? 'selected' : ''}>Отменена</option>
                        <option value="rejected" ${task.status === 'rejected' ? 'selected' : ''}>Отклонена</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editComment">Комментарий к изменениям</label>
                    <textarea id="editComment" rows="3" placeholder="Опишите внесенные изменения (необязательно)"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Отмена</button>
                    <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Обработчик формы
    const form = document.getElementById('editTaskForm');
    form.onsubmit = (e) => {
        e.preventDefault();
        this.updateTask(task.id);
    };
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
};

Dashboard.prototype.updateTask = function(taskId) {
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const assignedTo = document.getElementById('editTaskAssignee').value;
    const priority = document.getElementById('editTaskPriority').value;
    const deadline = document.getElementById('editTaskDeadline').value;
    const status = document.getElementById('editTaskStatus').value;
    const comment = document.getElementById('editComment').value.trim();
    
    if (!title || !assignedTo) {
        alert('Пожалуйста, заполните обязательные поля');
        return;
    }
    
    const taskIndex = window.TaskManager.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        alert('Задача не найдена');
        return;
    }
    
    const oldTask = { ...window.TaskManager.tasks[taskIndex] };
    const currentUser = window.UserManager.getCurrentUser();
    
    // Обновляем задачу
    window.TaskManager.tasks[taskIndex] = {
        ...window.TaskManager.tasks[taskIndex],
        title,
        description,
        assignedTo,
        priority,
        deadline: deadline || null,
        status,
        updated: new Date().toISOString()
    };
    
    // Добавляем комментарий об изменениях
    let changeComment = 'Задача отредактирована.';
    const changes = [];
    
    if (oldTask.title !== title) changes.push(`название изменено с "${oldTask.title}" на "${title}"`);
    if (oldTask.assignedTo !== assignedTo) {
        const oldUser = window.usersDatabase[oldTask.assignedTo];
        const newUser = window.usersDatabase[assignedTo];
        changes.push(`исполнитель изменен с "${oldUser?.name}" на "${newUser?.name}"`);
    }
    if (oldTask.priority !== priority) changes.push(`приоритет изменен с "${oldTask.priority}" на "${priority}"`);
    if (oldTask.status !== status) changes.push(`статус изменен с "${oldTask.status}" на "${status}"`);
    
    if (changes.length > 0) {
        changeComment += ' ' + changes.join(', ') + '.';
    }
    
    if (comment) {
        changeComment += ` Комментарий: ${comment}`;
    }
    
    window.TaskManager.tasks[taskIndex].comments.push({
        text: changeComment,
        author: currentUser.id,
        timestamp: new Date().toISOString(),
        type: 'edit'
    });
    
    window.TaskManager.saveTasks();
    
    // Закрываем модальное окно и обновляем страницу
    document.getElementById('editTaskModal').remove();
    this.refreshCurrentPage();
    alert('Задача успешно обновлена!');
};

Dashboard.prototype.getDocumentTypeText = function(type) {
    const types = {
        'strategy': 'Стратегия',
        'plan': 'План',
        'analysis': 'Анализ',
        'finance': 'Финансы',
        'tax': 'Налоги',
        'clients': 'Клиенты',
        'sales': 'Продажи',
        'technical': 'Техническая',
        'procedure': 'Процедура'
    };
    return types[type] || type;
};

Dashboard.prototype.showDocument = function(docId) {
    const currentUser = window.UserManager.getCurrentUser();
    const personalKB = window.personalKnowledgeBase[currentUser.id];
    
    if (!personalKB || !personalKB.documents) return;
    
    const document = personalKB.documents.find(doc => doc.id == docId);
    if (!document) return;
    
    // Показываем модальное окно с документом
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content document-modal">
            <div class="modal-header">
                <h3>${document.title}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="document-meta">
                    <span class="document-type">${this.getDocumentTypeText(document.type)}</span>
                    <span class="document-date">Создан: ${this.formatDate(document.created)}</span>
                </div>
                <div class="document-content">
                    <p>${document.content}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
};

Dashboard.prototype.updateNotificationBadge = function() {
    const currentUser = window.UserManager.getCurrentUser();
    if (!currentUser || !window.TaskManager || !window.TaskManager.tasks) {
        return;
    }
    
    const userTasks = window.TaskManager.getTasksForUser(currentUser.id);
    const newTasksCount = userTasks.filter(task => 
        task.assignedTo === currentUser.id && task.status === 'new'
    ).length;
    
    const badge = document.getElementById('notificationCount');
    if (badge) {
        badge.textContent = newTasksCount;
        if (newTasksCount > 0) {
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
};

Dashboard.prototype.createTaskModal = function() {
    console.log('Создаем модальное окно задач...');
    
    // Удаляем существующее модальное окно, если есть
    const existingModal = document.getElementById('createTaskModal');
    if (existingModal) {
        existingModal.remove();
        console.log('Удалено существующее модальное окно');
    }
    
    // Создаем новое модальное окно
    const modal = document.createElement('div');
    modal.id = 'createTaskModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Создать новую задачу</h3>
                <span class="close" id="closeCreateTaskModal">&times;</span>
            </div>
            <form id="createTaskForm" class="modal-form">
                <div class="form-group">
                    <label for="taskTitle">Название задачи *</label>
                    <input type="text" id="taskTitle" required placeholder="Введите название задачи">
                </div>
                <div class="form-group">
                    <label for="taskDescription">Описание</label>
                    <textarea id="taskDescription" rows="4" placeholder="Подробное описание задачи (необязательно)"></textarea>
                </div>
                <div class="form-group">
                    <label for="taskAssignee">Назначить сотруднику *</label>
                    <select id="taskAssignee" required>
                        <option value="">Выберите сотрудника</option>
                        ${window.TaskManager.getAvailableAssignees().map(user => 
                            `<option value="${user.id}">${user.name} (${user.position})</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskPriority">Приоритет</label>
                    <select id="taskPriority">
                        <option value="low">Низкий</option>
                        <option value="medium" selected>Средний</option>
                        <option value="high">Высокий</option>
                        <option value="urgent">Срочный</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="taskDeadline">Срок выполнения</label>
                    <input type="datetime-local" id="taskDeadline">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancelCreateTask">Отмена</button>
                    <button type="submit" class="btn btn-primary">Создать задачу</button>
                </div>
            </form>
        </div>
    `;
    
    // Добавляем в body
    document.body.appendChild(modal);
    console.log('Модальное окно добавлено в DOM');
    
    // Привязываем обработчики
    setTimeout(() => {
        const closeBtn = document.getElementById('closeCreateTaskModal');
        const cancelBtn = document.getElementById('cancelCreateTask');
        const form = document.getElementById('createTaskForm');
        
        if (closeBtn) {
            closeBtn.onclick = () => this.hideCreateTaskModal();
            console.log('Обработчик закрытия привязан');
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => this.hideCreateTaskModal();
            console.log('Обработчик отмены привязан');
        }
        
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.createTask();
            };
            console.log('Обработчик формы привязан');
        }
    }, 100);
    
    console.log('Модальное окно создания задачи добавлено в DOM');
};

// ============= ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ДЛЯ УЛУЧШЕНИЯ UX =============

// Поиск по задачам
Dashboard.prototype.initTaskSearch = function() {
    // Добавляем поле поиска если его нет
    if (!document.getElementById('taskSearchInput')) {
        const searchHtml = `
            <div class="task-search">
                <input type="text" id="taskSearchInput" placeholder="Поиск задач..." class="form-control">
                <button id="clearSearch" class="btn btn-ghost btn-sm">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        const tasksFilters = document.querySelector('.tasks-filters');
        if (tasksFilters) {
            tasksFilters.insertAdjacentHTML('beforebegin', searchHtml);
            
            // Обработчики поиска
            document.getElementById('taskSearchInput').addEventListener('input', (e) => {
                this.searchTasks(e.target.value);
            });
            
            document.getElementById('clearSearch').addEventListener('click', () => {
                document.getElementById('taskSearchInput').value = '';
                this.searchTasks('');
            });
        }
    }
};

Dashboard.prototype.searchTasks = function(query) {
    const activeGrid = document.querySelector('.tab-content.active .tasks-grid');
    if (!activeGrid) return;
    
    const taskCards = activeGrid.querySelectorAll('.task-card');
    const searchLower = query.toLowerCase();
    
    let visibleCount = 0;
    
    taskCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.task-description p')?.textContent.toLowerCase() || '';
        const assigneeText = card.querySelector('.task-info p')?.textContent.toLowerCase() || '';
        
        const matches = title.includes(searchLower) || 
                       description.includes(searchLower) || 
                       assigneeText.includes(searchLower);
        
        if (matches || query === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    this.updateSearchResults(visibleCount, taskCards.length);
};

Dashboard.prototype.updateSearchResults = function(visible, total) {
    const activeTabButton = document.querySelector('.tab-btn.active');
    if (activeTabButton && visible !== total) {
        const originalText = activeTabButton.textContent.split(' (')[0];
        activeTabButton.textContent = `${originalText} (${visible}/${total})`;
    }
};

// Проверка просроченных задач
Dashboard.prototype.checkOverdueTasks = function() {
    const currentUser = window.UserManager.getCurrentUser();
    const userTasks = window.TaskManager.getTasksForUser(currentUser.id);
    const now = new Date();
    
    const overdueTasks = userTasks.filter(task => 
        task.deadline && 
        new Date(task.deadline) < now && 
        task.status !== 'completed' && 
        task.status !== 'cancelled'
    );
    
    if (overdueTasks.length > 0) {
        const message = overdueTasks.length === 1 
            ? `У вас 1 просроченная задача: "${overdueTasks[0].title}"` 
            : `У вас ${overdueTasks.length} просроченных задач`;
            
        window.NotificationManager.warning(message, 8000);
    }
};

// Автосохранение черновика задачи
Dashboard.prototype.saveDraftTask = function() {
    const form = document.getElementById('createTaskForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const draft = {};
    
    for (let [key, value] of formData.entries()) {
        draft[key] = value;
    }
    
    localStorage.setItem('taskDraft', JSON.stringify(draft));
};

Dashboard.prototype.loadDraftTask = function() {
    const draft = localStorage.getItem('taskDraft');
    if (!draft) return;
    
    try {
        const draftData = JSON.parse(draft);
        const form = document.getElementById('createTaskForm');
        if (!form) return;
        
        Object.keys(draftData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = draftData[key];
            }
        });
        
        window.NotificationManager.info('Восстановлен черновик задачи');
    } catch (error) {
        console.error('Ошибка восстановления черновика:', error);
    }
};

Dashboard.prototype.clearDraftTask = function() {
    localStorage.removeItem('taskDraft');
};

// Экспорт задач
Dashboard.prototype.exportTasks = function() {
    const currentUser = window.UserManager.getCurrentUser();
    const tasks = currentUser.canViewAll ? 
        window.TaskManager.getAllTasks() : 
        window.TaskManager.getTasksForUser(currentUser.id);
    
    const csvContent = this.tasksToCSV(tasks);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `tasks_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.NotificationManager.success('Задачи экспортированы в CSV');
    }
};

Dashboard.prototype.tasksToCSV = function(tasks) {
    const headers = ['ID', 'Название', 'Описание', 'Исполнитель', 'Постановщик', 'Приоритет', 'Статус', 'Создана', 'Срок', 'Завершена'];
    const rows = tasks.map(task => [
        task.id,
        task.title,
        task.description || '',
        window.usersDatabase[task.assignedTo]?.name || '',
        window.usersDatabase[task.assignedBy]?.name || '',
        this.getPriorityText(task.priority),
        this.getStatusText(task.status),
        this.formatDate(task.created),
        task.deadline ? this.formatDate(task.deadline) : '',
        task.completedAt ? this.formatDate(task.completedAt) : ''
    ]);
    
    return [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');
};

// Горячие клавиши
Dashboard.prototype.initHotkeys = function() {
    document.addEventListener('keydown', (e) => {
        if (this.currentPage !== 'tasks') return;
        
        // Ctrl/Cmd + N - новая задача
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showCreateTaskModal();
        }
        
        // Ctrl/Cmd + R - обновить
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.refreshTasksPage();
        }
        
        // Ctrl/Cmd + F - поиск
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('taskSearchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape - закрыть модальные окна
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.remove();
            }
        }
    });
};

// Инициализация улучшений при загрузке страницы задач
Dashboard.prototype.initTaskEnhancements = function() {
    if (this.currentPage === 'tasks') {
        setTimeout(() => {
            this.initTaskSearch();
            this.checkOverdueTasks();
            this.initHotkeys();
        }, 500);
    }
};
