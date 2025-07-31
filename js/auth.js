// База данных пользователей W Garage
window.usersDatabase = {
    // Руководители (уровень доступа 0 - полный доступ)
    'valerijj.kd': {
        id: 'valerijj.kd',
        password: 'wgarage2025!',
        name: 'Валерий Иванович',
        birthday: '14.04',
        position: 'Ком Директор',
        role: 'kom-director',
        accessLevel: 0,
        canViewAll: true,
        avatar: 'https://ui-avatars.com/api/?name=Валерий+Иванович&background=2563eb&color=fff',
        department: 'Руководство',
        workDays: 27 // Количество рабочих дней в месяц
    },
    'viktoria.fd': {
        id: 'viktoria.fd',
        password: 'wgarage2025!',
        name: 'Виктория Александровна',
        birthday: '29.07',
        position: 'Фин Директор',
        role: 'fin-director',
        accessLevel: 0,
        canViewAll: true,
        avatar: 'https://ui-avatars.com/api/?name=Виктория+Александровна&background=2563eb&color=fff'
    },
    'galiant.zd': {
        id: 'galiant.zd',
        password: 'wgarage2025!',
        name: 'Галянт Володимир',
        birthday: null,
        position: 'Зам директор',
        role: 'zam-director',
        accessLevel: 0,
        canViewAll: true,
        avatar: 'https://ui-avatars.com/api/?name=Галянт+Володимир&background=2563eb&color=fff'
    },
    'igor.rop': {
        id: 'igor.rop',
        password: 'wgarage2025!',
        name: 'Игорь Вирченко',
        birthday: '5.09',
        position: 'РОП',
        role: 'rop',
        accessLevel: 0,
        canViewAll: true,
        avatar: 'https://ui-avatars.com/api/?name=Игорь+Вирченко&background=2563eb&color=fff'
    },
    'julija.gb': {
        id: 'julija.gb',
        password: 'wgarage2025!',
        name: 'Юлия Молодая',
        birthday: '07.06',
        position: 'Главный Бухгалтер',
        role: 'glavbuh',
        accessLevel: 0,
        canViewAll: true,
        avatar: 'https://ui-avatars.com/api/?name=Юлия+Молодая&background=2563eb&color=fff'
    },

    // Менеджеры (уровень доступа 2)
    'viktor.m': {
        id: 'viktor.m',
        password: 'wgarage2025!',
        name: 'Віктор Сусленков',
        birthday: '24.02',
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Віктор+Сусленков&background=64748b&color=fff'
    },
    'danilo.m': {
        id: 'danilo.m',
        password: 'wgarage2025!',
        name: 'Данило Трофименко',
        birthday: '07.09',
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Данило+Трофименко&background=64748b&color=fff'
    },
    'maksim.om': {
        id: 'maksim.om',
        password: 'wgarage2025!',
        name: 'Контарєв Максим',
        birthday: '22.12',
        position: 'Оператор Менеджер',
        role: 'operator',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Контарєв+Максим&background=64748b&color=fff'
    },
    'sergej.m': {
        id: 'sergej.m',
        password: 'wgarage2025!',
        name: 'Маклашевский С.',
        birthday: '28.04',
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Маклашевский+С.&background=64748b&color=fff'
    },
    'vitalij.m': {
        id: 'vitalij.m',
        password: 'wgarage2025!',
        name: 'Садовський Віталій',
        birthday: null,
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Садовський+Віталій&background=64748b&color=fff'
    },
    'jaroslav.m': {
        id: 'jaroslav.m',
        password: 'wgarage2025!',
        name: 'Семенов Ярослав',
        birthday: null,
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Семенов+Ярослав&background=64748b&color=fff'
    },
    'vladimir.smm': {
        id: 'vladimir.smm',
        password: 'wgarage2025!',
        name: 'Щукин Владимир',
        birthday: '21.10',
        position: 'SMM контент менеджер',
        role: 'smm',
        accessLevel: 2,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Щукин+Владимир&background=64748b&color=fff'
    },

    // Технические специалисты (уровень доступа 3-8)
    'anatolij.t': {
        id: 'anatolij.t',
        password: 'wgarage2025!',
        name: 'Анатолий Шелест',
        birthday: '8.05',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 3,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Анатолий+Шелест&background=059669&color=fff'
    },
    'konstantin.t': {
        id: 'konstantin.t',
        password: 'wgarage2025!',
        name: 'Борченко К.',
        birthday: '3.04',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 3,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Борченко+К.&background=059669&color=fff'
    },
    'artem.s': {
        id: 'artem.s',
        password: 'wgarage2025!',
        name: 'Герасимов Артем',
        birthday: '17.10',
        position: 'Слесарь',
        role: 'slesar',
        accessLevel: 3,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Герасимов+Артем&background=059669&color=fff'
    },
    'sergej.t': {
        id: 'sergej.t',
        password: 'wgarage2025!',
        name: 'Резниченко С.',
        birthday: '25.05',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 3,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Резниченко+С.&background=059669&color=fff'
    },
    'stanislav.t': {
        id: 'stanislav.t',
        password: 'wgarage2025!',
        name: 'Станислав Топал',
        birthday: '07.06',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 3,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Станислав+Топал&background=059669&color=fff'
    },
    'nikolaj.t': {
        id: 'nikolaj.t',
        password: 'wgarage2025!',
        name: 'Беденков Николай',
        birthday: '12.01',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 4,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Беденков+Николай&background=059669&color=fff'
    },
    'sergej.f': {
        id: 'sergej.f',
        password: 'wgarage2025!',
        name: 'Давыдов Сергей',
        birthday: '28.08',
        position: 'Топливщик форсунки',
        role: 'forsunshik',
        accessLevel: 4,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Давыдов+Сергей&background=059669&color=fff'
    },
    'ivan.s': {
        id: 'ivan.s',
        password: 'wgarage2025!',
        name: 'Усач Иван',
        birthday: '02.07',
        position: 'Слесарь',
        role: 'slesar',
        accessLevel: 4,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Усач+Иван&background=059669&color=fff'
    },
    'vladimir.t': {
        id: 'vladimir.t',
        password: 'wgarage2025!',
        name: 'Радченко В.',
        birthday: '06.07',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 5,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Радченко+В.&background=059669&color=fff'
    },
    'evgenij.t': {
        id: 'evgenij.t',
        password: 'wgarage2025!',
        name: 'Чернышов Е.',
        birthday: '08.06',
        position: 'Топливщик',
        role: 'toplivshik',
        accessLevel: 5,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Чернышов+Е.&background=059669&color=fff'
    },
    'evgenij.ue': {
        id: 'evgenij.ue',
        password: 'wgarage2025!',
        name: 'Бабилов Евгений',
        birthday: null,
        position: 'Ученик електрика',
        role: 'elektrik',
        accessLevel: 6,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Бабилов+Евгений&background=059669&color=fff'
    },
    'evgenij.meh': {
        id: 'evgenij.meh',
        password: 'wgarage2025!',
        name: 'Коринецкий Евгений',
        birthday: '22.12',
        position: 'Механик',
        role: 'mehanik',
        accessLevel: 6,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Коринецкий+Евгений&background=059669&color=fff'
    },
    'oleg.meh': {
        id: 'oleg.meh',
        password: 'wgarage2025!',
        name: 'Лисий Олег',
        birthday: '20.03',
        position: 'Механик',
        role: 'mehanik',
        accessLevel: 6,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Лисий+Олег&background=059669&color=fff'
    },
    'aurel.meh': {
        id: 'aurel.meh',
        password: 'wgarage2025!',
        name: 'Никоаре Аурел',
        birthday: '16.02',
        position: 'Механик',
        role: 'mehanik',
        accessLevel: 6,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Никоаре+Аурел&background=059669&color=fff'
    },
    'oleksij.ns': {
        id: 'oleksij.ns',
        password: 'wgarage2025!',
        name: 'Шендриченко Олексій',
        birthday: null,
        position: 'Начальник слесарного',
        role: 'slesar',
        accessLevel: 6,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Шендриченко+Олексій&background=059669&color=fff'
    },
    'oleg.s': {
        id: 'oleg.s',
        password: 'wgarage2025!',
        name: 'Юрчак Олег',
        birthday: '18.02',
        position: 'Слесарь',
        role: 'slesar',
        accessLevel: 6,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Юрчак+Олег&background=059669&color=fff'
    },
    'roman.ts': {
        id: 'roman.ts',
        password: 'wgarage2025!',
        name: 'Роман Яковлев',
        birthday: '12.11',
        position: 'Турбо слесарь',
        role: 'turbo-slesar',
        accessLevel: 8,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Роман+Яковлев&background=059669&color=fff'
    },
    'dmitro.meh': {
        id: 'dmitro.meh',
        password: 'wgarage2025!',
        name: 'Стецький Дмитро',
        birthday: '03.11',
        position: 'Механик',
        role: 'mehanik',
        accessLevel: 8,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Стецький+Дмитро&background=059669&color=fff'
    },

    // Обслуживающий персонал (уровень доступа 9)
    'valentina.zb': {
        id: 'valentina.zb',
        password: 'wgarage2025!',
        name: 'Алексеева Валентина',
        birthday: '13.08',
        position: 'Зам Бухгалтера',
        role: 'buhgalter',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Алексеева+Валентина&background=7c3aed&color=fff'
    },
    'denis.m': {
        id: 'denis.m',
        password: 'wgarage2025!',
        name: 'Гайдук Денис',
        birthday: '29.04',
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Гайдук+Денис&background=7c3aed&color=fff'
    },
    'daniil.po': {
        id: 'daniil.po',
        password: 'wgarage2025!',
        name: 'Гузенко Даніїл',
        birthday: '21.02',
        position: 'Приемщик - Оператор',
        role: 'priemshik',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Гузенко+Даніїл&background=7c3aed&color=fff'
    },
    'igor.m2': {
        id: 'igor.m2',
        password: 'wgarage2025!',
        name: 'Игорь Пустовой',
        birthday: '03.11',
        position: 'Менеджер',
        role: 'manager',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Игорь+Пустовой&background=7c3aed&color=fff'
    },
    'aleksej.el': {
        id: 'aleksej.el',
        password: 'wgarage2025!',
        name: 'Литвинов Алексей',
        birthday: '6.02',
        position: 'Електронщик',
        role: 'elektronshik',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Литвинов+Алексей&background=7c3aed&color=fff'
    },
    'maksim.kl': {
        id: 'maksim.kl',
        password: 'wgarage2025!',
        name: 'Максим Марчук',
        birthday: '6.01',
        position: 'Кладовщик',
        role: 'kladovshik',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Максим+Марчук&background=7c3aed&color=fff'
    },
    'evgenij.sn': {
        id: 'evgenij.sn',
        password: 'wgarage2025!',
        name: 'Мартынов Евгений',
        birthday: '11.01',
        position: 'Снабженец Подборщик',
        role: 'snabzhenec',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Мартынов+Евгений&background=7c3aed&color=fff'
    },
    'oleg.kl2': {
        id: 'oleg.kl2',
        password: 'wgarage2025!',
        name: 'Олег Яковлев',
        birthday: '21.11',
        position: 'Кладовщик',
        role: 'kladovshik',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Олег+Яковлев&background=7c3aed&color=fff'
    },
    'stefania.k': {
        id: 'stefania.k',
        password: 'wgarage2025!',
        name: 'Смик Стефанія',
        birthday: '08.04',
        position: 'Кассир',
        role: 'kassir',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Смик+Стефанія&background=7c3aed&color=fff'
    },
    'tatjana.b': {
        id: 'tatjana.b',
        password: 'wgarage2025!',
        name: 'Татьяна Кортунова',
        birthday: null,
        position: 'Бухгалтер',
        role: 'buhgalter',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Татьяна+Кортунова&background=7c3aed&color=fff'
    },
    'tokar.t': {
        id: 'tokar.t',
        password: 'wgarage2025!',
        name: 'Токарь',
        birthday: '28.12',
        position: 'Токарь',
        role: 'tokar',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Токарь&background=7c3aed&color=fff'
    },

    // Дополнительный персонал
    'viktoria.r': {
        id: 'viktoria.r',
        password: 'wgarage2025!',
        name: 'Жукова Виктория',
        birthday: null,
        position: 'Рекрутер/Ассистент',
        role: 'recruiter',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Жукова+Виктория&background=7c3aed&color=fff'
    },
    'ingenium.p': {
        id: 'ingenium.p',
        password: 'wgarage2025!',
        name: 'Ингениум (BAS)',
        birthday: null,
        position: 'Программист',
        role: 'elektronshik',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Ингениум+BAS&background=7c3aed&color=fff'
    },
    'pavlo.om': {
        id: 'pavlo.om',
        password: 'wgarage2025!',
        name: 'Ланьо Павло',
        birthday: null,
        position: 'Оператор/Менеджер',
        role: 'operator',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Ланьо+Павло&background=7c3aed&color=fff'
    },
    'maria.jk': {
        id: 'maria.jk',
        password: 'wgarage2025!',
        name: 'Невидничая Мария',
        birthday: '20.09',
        position: 'Джун/Контент',
        role: 'smm',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Невидничая+Мария&background=7c3aed&color=fff'
    },
    'mihajlo.lm': {
        id: 'mihajlo.lm',
        password: 'wgarage2025!',
        name: 'Павловський Михайло',
        birthday: null,
        position: 'Лид менеджер',
        role: 'lead-manager',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Павловський+Михайло&background=7c3aed&color=fff'
    },
    'artem.jk': {
        id: 'artem.jk',
        password: 'wgarage2025!',
        name: 'Сушков Артем',
        birthday: '22.02',
        position: 'Джун/Контент',
        role: 'smm',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Сушков+Артем&background=7c3aed&color=fff'
    },
    'oleksandr.z': {
        id: 'oleksandr.z',
        password: 'wgarage2025!',
        name: 'Шейко Олександр',
        birthday: null,
        position: 'Запчастист',
        role: 'snabzhenec',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Шейко+Олександр&background=7c3aed&color=fff'
    },
    'dmitro.om': {
        id: 'dmitro.om',
        password: 'wgarage2025!',
        name: 'Шепотатьєв Дмитро',
        birthday: '29.03',
        position: 'Оператор менеджер',
        role: 'operator',
        accessLevel: 9,
        canViewAll: false,
        avatar: 'https://ui-avatars.com/api/?name=Шепотатьєв+Дмитро&background=7c3aed&color=fff'
    }
};

// Система ролей и доступов
window.accessLevels = {
    0: 'Руководство', // Полный доступ ко всем профилям
    2: 'Менеджмент',  // Доступ к своему профилю
    3: 'Технические специалисты уровень 1',
    4: 'Технические специалисты уровень 2', 
    5: 'Технические специалисты уровень 3',
    6: 'Технические специалисты уровень 4',
    8: 'Технические специалисты старшие',
    9: 'Обслуживающий персонал'
};

// Функции для работы с пользователями
window.UserManager = {
    currentUser: null,
    
    // Авторизация пользователя
    login(username, password) {
        const user = window.usersDatabase[username];
        if (user && user.password === password) {
            this.currentUser = user;
            localStorage.setItem('wgarage-current-user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Неверный логин или пароль' };
    },
    
    // Выход из системы
    logout() {
        try {
            // Очищаем текущего пользователя
            this.currentUser = null;
            
            // Удаляем данные из localStorage
            localStorage.removeItem('wgarage-current-user');
            
            // Очищаем sessionStorage (если используется)
            sessionStorage.removeItem('wgarage-current-user');
            
            console.log('Пользователь успешно вышел из системы');
            
            return true;
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            return false;
        }
    },
    
    // Проверка авторизации
    isLoggedIn() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('wgarage-current-user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return !!this.currentUser;
    },
    
    // Получение текущего пользователя
    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('wgarage-current-user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    },
    
    // Проверка доступа к просмотру профиля
    canViewProfile(targetUserId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;
        
        // Руководители могут видеть все профили
        if (currentUser.canViewAll) return true;
        
        // Пользователи могут видеть только свой профиль
        return currentUser.id === targetUserId;
    },
    
    // Получение доступных пользователей для просмотра
    getAvailableUsers() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];
        
        if (currentUser.canViewAll) {
            // Руководители видят всех
            return Object.values(window.usersDatabase);
        } else {
            // Обычные пользователи видят только себя
            return [currentUser];
        }
    },
    
    // Смена пароля
    changePassword(oldPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Пользователь не авторизован' };
        
        if (currentUser.password !== oldPassword) {
            return { success: false, message: 'Неверный текущий пароль' };
        }
        
        // Обновляем пароль
        window.usersDatabase[currentUser.id].password = newPassword;
        currentUser.password = newPassword;
        localStorage.setItem('wgarage-current-user', JSON.stringify(currentUser));
        
        return { success: true, message: 'Пароль успешно изменен' };
    }
};

// Персональные базы знаний сотрудников
window.personalKnowledgeBase = {
    // Руководители
    'valerijj.kd': {
        documents: [
            { id: 1, title: 'Коммерческая стратегия 2025', type: 'strategy', content: 'Основные направления развития коммерческого направления...', created: '2025-01-15' },
            { id: 2, title: 'Планы продаж на квартал', type: 'plan', content: 'Целевые показатели и ключевые метрики...', created: '2025-01-20' },
            { id: 3, title: 'Анализ конкурентов', type: 'analysis', content: 'Обзор рынка дизель-сервисов в регионе...', created: '2025-01-25' }
        ],
        procedures: [
            'Процедура согласования крупных сделок',
            'Алгоритм работы с VIP клиентами',
            'Система мотивации менеджеров'
        ],
        tools: ['CRM система', 'Аналитика продаж', 'Планирование бюджета']
    },
    'viktoria.fd': {
        documents: [
            { id: 1, title: 'Финансовый план 2025', type: 'finance', content: 'Бюджет доходов и расходов на год...', created: '2025-01-10' },
            { id: 2, title: 'Налоговое планирование', type: 'tax', content: 'Стратегия налогового планирования...', created: '2025-01-18' },
            { id: 3, title: 'Cash flow анализ', type: 'analysis', content: 'Анализ денежных потоков...', created: '2025-01-22' }
        ],
        procedures: [
            'Процедура закрытия месяца',
            'Контроль дебиторской задолженности',
            'Планирование инвестиций'
        ],
        tools: ['1С Бухгалтерия', 'Excel аналитика', 'Банк-клиент']
    },
    
    // Менеджеры
    'viktor.m': {
        documents: [
            { id: 1, title: 'База постоянных клиентов', type: 'clients', content: 'Список VIP клиентов с историей заказов...', created: '2025-01-20' },
            { id: 2, title: 'Техники продаж', type: 'sales', content: 'Эффективные скрипты общения с клиентами...', created: '2025-01-25' }
        ],
        procedures: [
            'Алгоритм обработки входящих звонков',
            'Процедура оформления заказа',
            'Работа с возражениями клиентов'
        ],
        tools: ['Телефония', 'CRM', 'Калькулятор стоимости']
    },
    
    // Технические специалисты
    'anatolij.t': {
        documents: [
            { id: 1, title: 'Схемы топливных систем', type: 'technical', content: 'Принципиальные схемы современных топливных систем...', created: '2025-01-15' },
            { id: 2, title: 'Регламент диагностики ТНВД', type: 'procedure', content: 'Пошаговая процедура диагностики...', created: '2025-01-20' }
        ],
        procedures: [
            'Диагностика топливной системы',
            'Калибровка форсунок',
            'Тестирование ТНВД'
        ],
        tools: ['Стенд для ТНВД', 'Сканер диагностики', 'Ультразвуковая ванна']
    }
};

// Оргструктура компании
window.organizationChart = {
    structure: {
        'general': {
            title: 'Генеральное руководство',
            head: 'valerijj.kd',
            members: ['valerijj.kd', 'viktoria.fd', 'galiant.zd', 'igor.rop', 'julija.gb'],
            departments: ['commercial', 'technical', 'support']
        },
        'commercial': {
            title: 'Коммерческий отдел',
            head: 'valerijj.kd',
            members: ['viktor.m', 'danilo.m', 'sergej.m', 'vitalij.m', 'jaroslav.m', 'vladimir.smm'],
            subdepartments: ['sales', 'marketing']
        },
        'technical': {
            title: 'Технический отдел',
            head: 'igor.rop',
            members: [
                'anatolij.t', 'konstantin.t', 'sergej.t', 'stanislav.t', 'nikolaj.t',
                'sergej.f', 'vladimir.t', 'evgenij.t', 'roman.ts', 'dmitro.meh'
            ],
            subdepartments: ['fuel_systems', 'mechanics', 'diagnostics']
        },
        'support': {
            title: 'Административно-хозяйственный отдел',
            head: 'julija.gb',
            members: [
                'valentina.zb', 'tatjana.b', 'maksim.kl', 'oleg.kl2', 
                'stefania.k', 'aleksej.el', 'evgenij.sn'
            ],
            subdepartments: ['accounting', 'warehouse', 'it']
        }
    },
    positions: {
        'director': { level: 1, title: 'Директор', canManage: ['all'] },
        'deputy': { level: 2, title: 'Заместитель директора', canManage: ['department'] },
        'head': { level: 3, title: 'Начальник отдела', canManage: ['team'] },
        'senior': { level: 4, title: 'Старший специалист', canManage: ['junior'] },
        'specialist': { level: 5, title: 'Специалист', canManage: [] },
        'junior': { level: 6, title: 'Младший специалист', canManage: [] }
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
});
