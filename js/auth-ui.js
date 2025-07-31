// JavaScript для страницы авторизации
class AuthUI {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.rememberCheckbox = document.getElementById('rememberMe');
        this.loginBtn = document.getElementById('loginBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.demoInfo = document.getElementById('demoInfo');
        this.demoClose = document.getElementById('demoClose');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAutoLogin();
        this.setupDemoButtons();
    }
    
    setupEventListeners() {
        // Обработка формы входа
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Переключение видимости пароля
        this.passwordToggle.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
        
        // Закрытие демо панели
        this.demoClose?.addEventListener('click', () => {
            this.demoInfo.style.display = 'none';
        });
        
        // Очистка ошибок при вводе
        this.usernameInput.addEventListener('input', () => this.clearError());
        this.passwordInput.addEventListener('input', () => this.clearError());
        
        // Enter для быстрого входа
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });
    }
    
    setupDemoButtons() {
        const demoButtons = document.querySelectorAll('.demo-login-btn');
        demoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const login = btn.getAttribute('data-login');
                const password = btn.getAttribute('data-password');
                this.usernameInput.value = login;
                this.passwordInput.value = password;
                this.handleLogin();
            });
        });
    }
    
    async handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        
        if (!username || !password) {
            this.showError('Пожалуйста, заполните все поля');
            return;
        }
        
        this.setLoading(true);
        this.clearError();
        
        try {
            // Используем новый API клиент
            const result = await window.wgarageAPI.login(username, password);
            
            if (result.success) {
                // Сохранение настройки "Запомнить меня"
                if (this.rememberCheckbox.checked) {
                    localStorage.setItem('wgarage-remember-user', username);
                } else {
                    localStorage.removeItem('wgarage-remember-user');
                }
                
                this.showSuccess('Успешный вход в систему!');
                
                // Перенаправление на главную страницу
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                this.showError(result.message || 'Ошибка входа в систему');
                this.setLoading(false);
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            this.showError('Ошибка подключения к серверу');
            this.setLoading(false);
        }
    }
    
    togglePasswordVisibility() {
        const isPassword = this.passwordInput.type === 'password';
        this.passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = this.passwordToggle.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
    
    setLoading(loading) {
        this.loginBtn.classList.toggle('loading', loading);
        this.loginBtn.disabled = loading;
        
        const span = this.loginBtn.querySelector('span');
        const icon = this.loginBtn.querySelector('i');
        
        if (loading) {
            span.textContent = 'Вход в систему...';
            icon.className = 'fas fa-spinner fa-spin';
        } else {
            span.textContent = 'Войти в систему';
            icon.className = 'fas fa-arrow-right';
        }
    }
    
    showError(message) {
        this.errorMessage.style.display = 'flex';
        this.errorMessage.querySelector('span').textContent = message;
        
        // Анимация встряхивания
        this.loginForm.style.animation = 'none';
        setTimeout(() => {
            this.loginForm.style.animation = '';
        }, 10);
    }
    
    showSuccess(message) {
        // Создаем временное сообщение об успехе
        const successMessage = document.createElement('div');
        successMessage.className = 'error-message';
        successMessage.style.cssText = `
            background: #f0fdf4;
            border-color: #bbf7d0;
            color: #166534;
            display: flex;
        `;
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        this.errorMessage.style.display = 'none';
        this.errorMessage.parentNode.insertBefore(successMessage, this.errorMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
    
    clearError() {
        this.errorMessage.style.display = 'none';
    }
    
    checkAutoLogin() {
        // Проверяем, если пользователь уже авторизован
        const token = localStorage.getItem('wgarage-token');
        if (token) {
            window.location.href = '/dashboard';
            return;
        }
        
        // Автозаполнение логина, если включено "Запомнить меня"
        const rememberedUser = localStorage.getItem('wgarage-remember-user');
        if (rememberedUser) {
            this.usernameInput.value = rememberedUser;
            this.rememberCheckbox.checked = true;
            this.passwordInput.focus();
        } else {
            this.usernameInput.focus();
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new AuthUI();
    
    // Добавляем параллакс эффект для фона
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const decorations = document.querySelectorAll('.bg-decoration');
        decorations.forEach((decoration, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            decoration.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});

// Предотвращение возврата на страницу авторизации после входа
window.addEventListener('pageshow', (event) => {
    const token = localStorage.getItem('wgarage-token');
    if (event.persisted && token) {
        window.location.href = '/dashboard';
    }
});
