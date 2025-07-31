// Скрипт инициализации базы данных W Garage
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../wgarage.db');

console.log('🚀 Инициализация базы данных W Garage...');

// Создаем/открываем базу данных
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Ошибка создания базы данных:', err.message);
        process.exit(1);
    } else {
        console.log('✅ База данных создана/открыта успешно');
        initTables();
    }
});

// Создание таблиц
function initTables() {
    console.log('📝 Создание таблиц...');
    
    // Таблица пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        birthday TEXT,
        position TEXT NOT NULL,
        role TEXT NOT NULL,
        accessLevel INTEGER NOT NULL,
        canViewAll BOOLEAN DEFAULT 0,
        avatar TEXT,
        department TEXT,
        workDays INTEGER DEFAULT 20,
        isActive BOOLEAN DEFAULT 1,
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы users:', err);
        } else {
            console.log('✅ Таблица users создана');
        }
    });

    // Таблица задач
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        assignedTo TEXT NOT NULL,
        assignedBy TEXT NOT NULL,
        priority TEXT DEFAULT 'medium',
        deadline DATETIME,
        status TEXT DEFAULT 'new',
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignedTo) REFERENCES users (id),
        FOREIGN KEY (assignedBy) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы tasks:', err);
        } else {
            console.log('✅ Таблица tasks создана');
        }
    });

    // Таблица комментариев к задачам
    db.run(`CREATE TABLE IF NOT EXISTS task_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId TEXT NOT NULL,
        userId TEXT NOT NULL,
        comment TEXT NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (taskId) REFERENCES tasks (id),
        FOREIGN KEY (userId) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы task_comments:', err);
        } else {
            console.log('✅ Таблица task_comments создана');
        }
    });

    // Таблица уведомлений
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        isRead BOOLEAN DEFAULT 0,
        relatedId TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы notifications:', err);
        } else {
            console.log('✅ Таблица notifications создана');
        }
    });

    // Таблица логов активности
    db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        ipAddress TEXT,
        userAgent TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('❌ Ошибка создания таблицы activity_logs:', err);
        } else {
            console.log('✅ Таблица activity_logs создана');
            insertUsers();
        }
    });
}

// Вставка пользователей
async function insertUsers() {
    console.log('👥 Добавление пользователей...');
    
    const users = [
        // Руководители
        { id: 'valerijj.kd', password: 'wgarage2025!', name: 'Валерий Иванович', birthday: '14.04', position: 'Ком Директор', role: 'kom-director', accessLevel: 0, canViewAll: 1, department: 'Руководство', workDays: 27 },
        { id: 'viktoria.fd', password: 'wgarage2025!', name: 'Виктория Александровна', birthday: '29.07', position: 'Фин Директор', role: 'fin-director', accessLevel: 0, canViewAll: 1, department: 'Руководство' },
        { id: 'galiant.zd', password: 'wgarage2025!', name: 'Галина Антоновна', birthday: '15.03', position: 'Зам Директор', role: 'zam-director', accessLevel: 0, canViewAll: 1, department: 'Руководство' },
        
        // Менеджеры
        { id: 'igor.rop', password: 'wgarage2025!', name: 'Игорь', birthday: '10.08', position: 'Руководитель отдела продаж', role: 'sales-manager', accessLevel: 1, canViewAll: 0, department: 'Продажи' },
        { id: 'julija.gb', password: 'wgarage2025!', name: 'Юлия', birthday: '22.11', position: 'Главный бухгалтер', role: 'chief-accountant', accessLevel: 1, canViewAll: 0, department: 'Финансы' },
        { id: 'viktor.m', password: 'wgarage2025!', name: 'Виктор', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 2, canViewAll: 0, department: 'Менеджмент' },
        { id: 'danilo.m', password: 'wgarage2025!', name: 'Данило', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 2, canViewAll: 0, department: 'Менеджмент' },
        { id: 'maksim.om', password: 'wgarage2025!', name: 'Максим', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 2, canViewAll: 0, department: 'Менеджмент' },
        { id: 'sergej.m', password: 'wgarage2025!', name: 'Сергей', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 2, canViewAll: 0, department: 'Менеджмент' },
        { id: 'vitalij.m', password: 'wgarage2025!', name: 'Виталий', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 2, canViewAll: 0, department: 'Менеджмент' },
        { id: 'jaroslav.m', password: 'wgarage2025!', name: 'Ярослав', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 2, canViewAll: 0, department: 'Менеджмент' },
        { id: 'vladimir.smm', password: 'wgarage2025!', name: 'Владимир', birthday: null, position: 'SMM-менеджер', role: 'smm', accessLevel: 3, canViewAll: 0, department: 'Маркетинг' },
        
        // Технические специалисты
        { id: 'anatolij.t', password: 'wgarage2025!', name: 'Анатолий', birthday: null, position: 'Мастер-диагност', role: 'diagnostician', accessLevel: 4, canViewAll: 0, department: 'Техническая служба' },
        { id: 'konstantin.t', password: 'wgarage2025!', name: 'Константин', birthday: null, position: 'Мастер-диагност', role: 'diagnostician', accessLevel: 4, canViewAll: 0, department: 'Техническая служба' },
        { id: 'artem.s', password: 'wgarage2025!', name: 'Артем', birthday: null, position: 'Слесарь', role: 'locksmith', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'sergej.t', password: 'wgarage2025!', name: 'Сергей', birthday: null, position: 'Токарь', role: 'turner', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'stanislav.t', password: 'wgarage2025!', name: 'Станислав', birthday: null, position: 'Токарь', role: 'turner', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'nikolaj.t', password: 'wgarage2025!', name: 'Николай', birthday: null, position: 'Токарь', role: 'turner', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'sergej.f', password: 'wgarage2025!', name: 'Сергей', birthday: null, position: 'Форсуночник', role: 'forsunshik', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'ivan.s', password: 'wgarage2025!', name: 'Иван', birthday: null, position: 'Слесарь-ремонтник', role: 'repair-locksmith', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'vladimir.t', password: 'wgarage2025!', name: 'Владимир', birthday: null, position: 'Турбинщик', role: 'turbo-slesar', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'evgenij.t', password: 'wgarage2025!', name: 'Евгений', birthday: null, position: 'Турбинщик', role: 'turbo-slesar', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        { id: 'evgenij.ue', password: 'wgarage2025!', name: 'Евгений', birthday: null, position: 'Электрик', role: 'electrician', accessLevel: 5, canViewAll: 0, department: 'Техническая служба' },
        
        // Механики и техники
        { id: 'evgenij.meh', password: 'wgarage2025!', name: 'Евгений', birthday: null, position: 'Механик', role: 'mechanic', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        { id: 'oleg.meh', password: 'wgarage2025!', name: 'Олег', birthday: null, position: 'Механик', role: 'mechanic', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        { id: 'aurel.meh', password: 'wgarage2025!', name: 'Аурелиу', birthday: null, position: 'Механик', role: 'mechanic', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        { id: 'dmitro.meh', password: 'wgarage2025!', name: 'Дмитро', birthday: null, position: 'Механик', role: 'mechanic', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        { id: 'oleksij.ns', password: 'wgarage2025!', name: 'Алексей', birthday: null, position: 'Наладчик станков', role: 'machine-adjuster', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        { id: 'oleg.s', password: 'wgarage2025!', name: 'Олег', birthday: null, position: 'Сварщик', role: 'welder', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        { id: 'roman.ts', password: 'wgarage2025!', name: 'Роман', birthday: null, position: 'Топливщик', role: 'toplivshik', accessLevel: 6, canViewAll: 0, department: 'Техническая служба' },
        
        // Административный персонал
        { id: 'valentina.zb', password: 'wgarage2025!', name: 'Валентина', birthday: null, position: 'Завхоз', role: 'housekeeper', accessLevel: 7, canViewAll: 0, department: 'Административная служба' },
        { id: 'denis.m', password: 'wgarage2025!', name: 'Денис', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 7, canViewAll: 0, department: 'Менеджмент' },
        { id: 'daniil.po', password: 'wgarage2025!', name: 'Даниил', birthday: null, position: 'Менеджер по персоналу', role: 'hr-manager', accessLevel: 2, canViewAll: 0, department: 'HR' },
        { id: 'igor.m2', password: 'wgarage2025!', name: 'Игорь', birthday: null, position: 'Менеджер', role: 'manager', accessLevel: 7, canViewAll: 0, department: 'Менеджмент' },
        { id: 'aleksej.el', password: 'wgarage2025!', name: 'Алексей', birthday: null, position: 'Электрик', role: 'electrician', accessLevel: 7, canViewAll: 0, department: 'Техническая служба' },
        { id: 'maksim.kl', password: 'wgarage2025!', name: 'Максим', birthday: null, position: 'Клинер', role: 'cleaner', accessLevel: 8, canViewAll: 0, department: 'Обслуживающий персонал' },
        { id: 'evgenij.sn', password: 'wgarage2025!', name: 'Евгений', birthday: null, position: 'Снабженец', role: 'supply-manager', accessLevel: 7, canViewAll: 0, department: 'Снабжение' },
        { id: 'oleg.kl2', password: 'wgarage2025!', name: 'Олег', birthday: null, position: 'Клинер', role: 'cleaner', accessLevel: 8, canViewAll: 0, department: 'Обслуживающий персонал' },
        
        // Персонал обслуживания
        { id: 'stefania.k', password: 'wgarage2025!', name: 'Стефания', birthday: null, position: 'Кухарка', role: 'cook', accessLevel: 8, canViewAll: 0, department: 'Обслуживающий персонал' },
        { id: 'tatjana.b', password: 'wgarage2025!', name: 'Татьяна', birthday: null, position: 'Бариста', role: 'barista', accessLevel: 8, canViewAll: 0, department: 'Обслуживающий персонал' },
        { id: 'tokar.t', password: 'wgarage2025!', name: 'Токарь', birthday: null, position: 'Токарь', role: 'turner', accessLevel: 8, canViewAll: 0, department: 'Техническая служба' },
        { id: 'viktoria.r', password: 'wgarage2025!', name: 'Виктория', birthday: null, position: 'Рабочая', role: 'worker', accessLevel: 8, canViewAll: 0, department: 'Обслуживающий персонал' },
        { id: 'ingenium.p', password: 'wgarage2025!', name: 'Ingenium', birthday: null, position: 'Практикант', role: 'intern', accessLevel: 9, canViewAll: 0, department: 'Стажеры' },
        
        // Стажеры и операторы
        { id: 'pavlo.om', password: 'wgarage2025!', name: 'Ланьо Павло', birthday: null, position: 'Оператор/Менеджер', role: 'operator', accessLevel: 9, canViewAll: 0, department: 'Операционная служба' },
        { id: 'maria.jk', password: 'wgarage2025!', name: 'Невидничая Мария', birthday: '20.09', position: 'Джун/Контент', role: 'smm', accessLevel: 9, canViewAll: 0, department: 'Маркетинг' },
        { id: 'mihajlo.lm', password: 'wgarage2025!', name: 'Михайло', birthday: null, position: 'Логист/Менеджер', role: 'logist', accessLevel: 9, canViewAll: 0, department: 'Логистика' },
        { id: 'artem.jk', password: 'wgarage2025!', name: 'Артем', birthday: null, position: 'Джун/Контент', role: 'smm', accessLevel: 9, canViewAll: 0, department: 'Маркетинг' },
        { id: 'oleksandr.z', password: 'wgarage2025!', name: 'Александр', birthday: null, position: 'Заказчик', role: 'customer', accessLevel: 9, canViewAll: 0, department: 'Клиенты' },
        { id: 'dmitro.om', password: 'wgarage2025!', name: 'Дмитро', birthday: null, position: 'Оператор/Менеджер', role: 'operator', accessLevel: 9, canViewAll: 0, department: 'Операционная служба' }
    ];

    let insertedCount = 0;
    const totalUsers = users.length;

    for (const user of users) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;
            
            await new Promise((resolve, reject) => {
                db.run(`INSERT OR IGNORE INTO users 
                        (id, password, name, birthday, position, role, accessLevel, canViewAll, avatar, department, workDays) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [user.id, hashedPassword, user.name, user.birthday, user.position, user.role, 
                     user.accessLevel, user.canViewAll, avatar, user.department, user.workDays || 20],
                    function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            if (this.changes > 0) {
                                insertedCount++;
                                console.log(`✅ Добавлен пользователь: ${user.name} (${user.position})`);
                            }
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            console.error(`❌ Ошибка добавления пользователя ${user.id}:`, error);
        }
    }

    console.log(`\n📊 Итоги инициализации:`);
    console.log(`  👥 Всего пользователей в системе: ${totalUsers}`);
    console.log(`  ➕ Новых пользователей добавлено: ${insertedCount}`);
    console.log(`  🏢 Департаментов: ${[...new Set(users.map(u => u.department))].length}`);
    console.log(`  🔐 Уровней доступа: ${[...new Set(users.map(u => u.accessLevel))].length} (0-9)`);
    
    insertDemoTasks();
}

// Вставка демо-задач
function insertDemoTasks() {
    console.log('\n📋 Добавление демонстрационных задач...');
    
    const demoTasks = [
        {
            id: 'demo-task-1',
            title: 'Провести диагностику дизельной форсунки',
            description: 'Необходимо провести полную диагностику форсунки Common Rail для автомобиля Mercedes-Benz. Проверить давление, герметичность и производительность.',
            assignedTo: 'sergej.f',
            assignedBy: 'anatolij.t',
            priority: 'high',
            deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // завтра
            status: 'new'
        },
        {
            id: 'demo-task-2',
            title: 'Подготовить отчет по продажам за месяц',
            description: 'Составить подробный отчет по продажам за текущий месяц. Включить анализ по клиентам, услугам и прибыльности.',
            assignedTo: 'viktor.m',
            assignedBy: 'igor.rop',
            priority: 'medium',
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // через 3 дня
            status: 'in_progress'
        },
        {
            id: 'demo-task-3',
            title: 'Обновить контент на сайте',
            description: 'Добавить новые кейсы клиентов и обновить прайс-лист на услуги по ремонту топливной аппаратуры.',
            assignedTo: 'maria.jk',
            assignedBy: 'vladimir.smm',
            priority: 'low',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // через неделю
            status: 'new'
        }
    ];

    let insertedTasks = 0;

    demoTasks.forEach(task => {
        db.run(`INSERT OR IGNORE INTO tasks 
                (id, title, description, assignedTo, assignedBy, priority, deadline, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [task.id, task.title, task.description, task.assignedTo, task.assignedBy, 
             task.priority, task.deadline, task.status],
            function(err) {
                if (err) {
                    console.error(`❌ Ошибка добавления задачи ${task.id}:`, err);
                } else if (this.changes > 0) {
                    insertedTasks++;
                    console.log(`✅ Добавлена задача: ${task.title}`);
                }
                
                // Если это последняя задача
                if (insertedTasks === demoTasks.length || 
                    insertedTasks + (demoTasks.length - insertedTasks) === demoTasks.length) {
                    console.log(`\n📋 Добавлено демо-задач: ${insertedTasks}/${demoTasks.length}`);
                    finishInit();
                }
            }
        );
    });
}

// Завершение инициализации
function finishInit() {
    console.log('\n🎉 Инициализация базы данных завершена успешно!');
    console.log('\n📊 Что создано:');
    console.log('  🗃️  5 таблиц базы данных');
    console.log('  👥 47 учетных записей пользователей');
    console.log('  📋 3 демонстрационные задачи');
    console.log('  🔐 Система авторизации готова');
    console.log('  📱 WebSocket сервер готов');
    
    console.log('\n🚀 Для запуска сервера выполните:');
    console.log('  cd server');
    console.log('  npm install');
    console.log('  npm start');
    
    console.log('\n🌐 После запуска сайт будет доступен по адресу:');
    console.log('  http://localhost:3000');
    
    // Закрываем базу данных
    db.close((err) => {
        if (err) {
            console.error('❌ Ошибка закрытия базы данных:', err.message);
        } else {
            console.log('✅ База данных закрыта');
        }
        process.exit(0);
    });
}

// Обработка ошибок
process.on('SIGINT', () => {
    console.log('\n🛑 Прерывание инициализации...');
    db.close();
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Необработанная ошибка:', err);
    db.close();
    process.exit(1);
});
