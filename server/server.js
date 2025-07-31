const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Безопасность
app.use(helmet({
    contentSecurityPolicy: false // Отключаем для работы с WebSocket
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // максимум 100 запросов с одного IP
});
app.use('/api/', limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, '../')));

// Инициализация базы данных
const db = new sqlite3.Database('./wgarage.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.message);
    } else {
        console.log('✅ Подключено к базе данных SQLite');
        initDatabase();
    }
});

// Создание таблиц
function initDatabase() {
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
    )`);

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
    )`);

    // Таблица комментариев к задачам
    db.run(`CREATE TABLE IF NOT EXISTS task_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId TEXT NOT NULL,
        userId TEXT NOT NULL,
        comment TEXT NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (taskId) REFERENCES tasks (id),
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);

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
    )`);

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
    )`);

    console.log('✅ Таблицы базы данных инициализированы');
    
    // Добавляем пользователей если их нет
    setTimeout(insertDefaultUsers, 1000);
}

// JWT middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен доступа отсутствует' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'wgarage-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
}

// API маршруты

// Авторизация
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        db.get('SELECT * FROM users WHERE id = ? AND isActive = 1', [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }
            
            if (!user) {
                return res.status(401).json({ error: 'Пользователь не найден' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Неверный пароль' });
            }

            // Обновляем время последнего входа
            db.run('UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            // Логируем вход
            logActivity(user.id, 'login', 'Вход в систему', req.ip, req.get('User-Agent'));

            const token = jwt.sign(
                { userId: user.id, role: user.role, accessLevel: user.accessLevel },
                process.env.JWT_SECRET || 'wgarage-secret-key',
                { expiresIn: '8h' }
            );

            // Убираем пароль из ответа
            delete user.password;

            res.json({
                success: true,
                token,
                user
            });
        });
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Получение профиля пользователя
app.get('/api/auth/profile', authenticateToken, (req, res) => {
    db.get('SELECT id, name, birthday, position, role, accessLevel, canViewAll, avatar, department, workDays, lastLogin FROM users WHERE id = ?', 
        [req.user.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.json(user);
    });
});

// Смена пароля
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    
    try {
        db.get('SELECT password FROM users WHERE id = ?', [req.user.userId], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }

            const isValidPassword = await bcrypt.compare(oldPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Неверный текущий пароль' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.run('UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?', 
                [hashedPassword, req.user.userId], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Ошибка обновления пароля' });
                }
                
                logActivity(req.user.userId, 'password_change', 'Смена пароля', req.ip, req.get('User-Agent'));
                res.json({ success: true, message: 'Пароль успешно изменен' });
            });
        });
    } catch (error) {
        console.error('Ошибка смены пароля:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Получение списка пользователей (для назначения задач)
app.get('/api/users', authenticateToken, (req, res) => {
    const query = req.user.accessLevel === 0 ? 
        'SELECT id, name, position, role, avatar, department FROM users WHERE isActive = 1' :
        'SELECT id, name, position, role, avatar, department FROM users WHERE isActive = 1 AND id != ?';
    
    const params = req.user.accessLevel === 0 ? [] : [req.user.userId];
    
    db.all(query, params, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        res.json(users);
    });
});

// API для задач

// Получение задач
app.get('/api/tasks', authenticateToken, (req, res) => {
    let query = `
        SELECT t.*, 
               ua.name as assignedToName, ua.position as assignedToPosition, ua.avatar as assignedToAvatar,
               ub.name as assignedByName, ub.position as assignedByPosition, ub.avatar as assignedByAvatar
        FROM tasks t
        LEFT JOIN users ua ON t.assignedTo = ua.id
        LEFT JOIN users ub ON t.assignedBy = ub.id
    `;
    
    let params = [];
    
    if (req.user.accessLevel === 0) {
        // Руководители видят все задачи
        query += ' ORDER BY t.created DESC';
    } else {
        // Остальные видят только свои задачи
        query += ' WHERE (t.assignedTo = ? OR t.assignedBy = ?) ORDER BY t.created DESC';
        params = [req.user.userId, req.user.userId];
    }
    
    db.all(query, params, (err, tasks) => {
        if (err) {
            console.error('Ошибка получения задач:', err);
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }
        res.json(tasks);
    });
});

// Создание задачи
app.post('/api/tasks', authenticateToken, (req, res) => {
    const { title, description, assignedTo, priority, deadline } = req.body;
    
    if (!title || !assignedTo) {
        return res.status(400).json({ error: 'Заголовок и исполнитель обязательны' });
    }
    
    const taskId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    db.run(`INSERT INTO tasks (id, title, description, assignedTo, assignedBy, priority, deadline) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [taskId, title, description, assignedTo, req.user.userId, priority || 'medium', deadline],
        function(err) {
            if (err) {
                console.error('Ошибка создания задачи:', err);
                return res.status(500).json({ error: 'Ошибка создания задачи' });
            }
            
            // Создаем уведомление для исполнителя
            createNotification(assignedTo, 'Новая задача', `Вам назначена задача: ${title}`, 'task', taskId);
            
            // Отправляем уведомление через WebSocket
            io.to(assignedTo).emit('newTask', {
                id: taskId,
                title,
                assignedBy: req.user.userId
            });
            
            logActivity(req.user.userId, 'task_create', `Создана задача: ${title}`, req.ip, req.get('User-Agent'));
            
            res.json({ success: true, taskId });
        }
    );
});

// Обновление статуса задачи
app.put('/api/tasks/:id/status', authenticateToken, (req, res) => {
    const { status, comment } = req.body;
    const taskId = req.params.id;
    
    db.run('UPDATE tasks SET status = ?, updated = CURRENT_TIMESTAMP WHERE id = ?',
        [status, taskId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Ошибка обновления статуса' });
            }
            
            // Добавляем комментарий если есть
            if (comment) {
                db.run('INSERT INTO task_comments (taskId, userId, comment) VALUES (?, ?, ?)',
                    [taskId, req.user.userId, comment]);
            }
            
            // Получаем информацию о задаче для уведомления
            db.get('SELECT title, assignedBy, assignedTo FROM tasks WHERE id = ?', [taskId], (err, task) => {
                if (task) {
                    const notifyUserId = req.user.userId === task.assignedTo ? task.assignedBy : task.assignedTo;
                    createNotification(notifyUserId, 'Обновление задачи', 
                        `Статус задачи "${task.title}" изменен на: ${getStatusText(status)}`, 'task', taskId);
                    
                    io.to(notifyUserId).emit('taskUpdate', {
                        taskId,
                        status,
                        title: task.title
                    });
                }
            });
            
            logActivity(req.user.userId, 'task_update', `Обновлен статус задачи ${taskId}: ${status}`, req.ip, req.get('User-Agent'));
            
            res.json({ success: true });
        }
    );
});

// Добавление комментария к задаче
app.post('/api/tasks/:id/comments', authenticateToken, (req, res) => {
    const { comment } = req.body;
    const taskId = req.params.id;
    
    db.run('INSERT INTO task_comments (taskId, userId, comment) VALUES (?, ?, ?)',
        [taskId, req.user.userId, comment], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Ошибка добавления комментария' });
            }
            
            // Уведомляем участников задачи
            db.get('SELECT title, assignedBy, assignedTo FROM tasks WHERE id = ?', [taskId], (err, task) => {
                if (task) {
                    [task.assignedBy, task.assignedTo].forEach(userId => {
                        if (userId !== req.user.userId) {
                            createNotification(userId, 'Новый комментарий', 
                                `Новый комментарий к задаче "${task.title}"`, 'comment', taskId);
                            
                            io.to(userId).emit('newComment', {
                                taskId,
                                comment,
                                title: task.title
                            });
                        }
                    });
                }
            });
            
            res.json({ success: true });
        }
    );
});

// Получение комментариев к задаче
app.get('/api/tasks/:id/comments', authenticateToken, (req, res) => {
    const taskId = req.params.id;
    
    db.all(`SELECT tc.*, u.name, u.avatar 
            FROM task_comments tc 
            LEFT JOIN users u ON tc.userId = u.id 
            WHERE tc.taskId = ? 
            ORDER BY tc.created ASC`, [taskId], (err, comments) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка получения комментариев' });
        }
        res.json(comments);
    });
});

// API для уведомлений

// Получение уведомлений
app.get('/api/notifications', authenticateToken, (req, res) => {
    db.all('SELECT * FROM notifications WHERE userId = ? ORDER BY created DESC LIMIT 50',
        [req.user.userId], (err, notifications) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка получения уведомлений' });
            }
            res.json(notifications);
        }
    );
});

// Отметка уведомления как прочитанного
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
    db.run('UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?',
        [req.params.id, req.user.userId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Ошибка обновления уведомления' });
            }
            res.json({ success: true });
        }
    );
});

// Отметка всех уведомлений как прочитанных
app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
    db.run('UPDATE notifications SET isRead = 1 WHERE userId = ?',
        [req.user.userId], function(err) {
            if (err) {
                return res.status(500).json({ error: 'Ошибка обновления уведомлений' });
            }
            res.json({ success: true });
        }
    );
});

// Статистика и аналитика (только для руководителей)
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
    if (req.user.accessLevel !== 0) {
        return res.status(403).json({ error: 'Недостаточно прав доступа' });
    }
    
    // Множественные запросы для сбора статистики
    const queries = {
        totalUsers: 'SELECT COUNT(*) as count FROM users WHERE isActive = 1',
        totalTasks: 'SELECT COUNT(*) as count FROM tasks',
        activeTasks: 'SELECT COUNT(*) as count FROM tasks WHERE status IN ("new", "in_progress")',
        completedTasks: 'SELECT COUNT(*) as count FROM tasks WHERE status = "completed"',
        recentActivity: `SELECT al.*, u.name FROM activity_logs al 
                         LEFT JOIN users u ON al.userId = u.id 
                         ORDER BY al.created DESC LIMIT 10`
    };
    
    const results = {};
    let completed = 0;
    const total = Object.keys(queries).length;
    
    Object.entries(queries).forEach(([key, query]) => {
        db.all(query, [], (err, rows) => {
            if (!err) {
                results[key] = rows;
            }
            completed++;
            if (completed === total) {
                res.json(results);
            }
        });
    });
});

// WebSocket подключения
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('Пользователь подключился:', socket.id);
    
    socket.on('userConnect', (userId) => {
        connectedUsers.set(userId, socket.id);
        socket.join(userId);
        console.log(`Пользователь ${userId} подключен с socket ${socket.id}`);
    });
    
    socket.on('disconnect', () => {
        // Удаляем пользователя из списка подключенных
        for (let [userId, socketId] of connectedUsers) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                console.log(`Пользователь ${userId} отключился`);
                break;
            }
        }
    });
});

// Вспомогательные функции

function createNotification(userId, title, message, type = 'info', relatedId = null) {
    db.run('INSERT INTO notifications (userId, title, message, type, relatedId) VALUES (?, ?, ?, ?, ?)',
        [userId, title, message, type, relatedId], (err) => {
            if (err) {
                console.error('Ошибка создания уведомления:', err);
            }
        }
    );
}

function logActivity(userId, action, details, ipAddress, userAgent) {
    db.run('INSERT INTO activity_logs (userId, action, details, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?)',
        [userId, action, details, ipAddress, userAgent], (err) => {
            if (err) {
                console.error('Ошибка логирования активности:', err);
            }
        }
    );
}

function getStatusText(status) {
    const statuses = {
        'new': 'Новая',
        'in_progress': 'В работе',
        'completed': 'Выполнена',
        'cancelled': 'Отменена',
        'rejected': 'Отклонена'
    };
    return statuses[status] || status;
}

// Вставка пользователей по умолчанию
async function insertDefaultUsers() {
    const users = [
        { id: 'valerijj.kd', password: 'wgarage2025!', name: 'Валерий Иванович', birthday: '14.04', position: 'Ком Директор', role: 'kom-director', accessLevel: 0, canViewAll: 1, department: 'Руководство', workDays: 27 },
        { id: 'viktoria.fd', password: 'wgarage2025!', name: 'Виктория Александровна', birthday: '29.07', position: 'Фин Директор', role: 'fin-director', accessLevel: 0, canViewAll: 1, department: 'Руководство' },
        { id: 'galiant.zd', password: 'wgarage2025!', name: 'Галина Антоновна', birthday: '15.03', position: 'Зам Директор', role: 'zam-director', accessLevel: 0, canViewAll: 1, department: 'Руководство' },
        // ... остальные пользователи будут добавлены аналогично
    ];
    
    for (const user of users) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;
            
            db.run(`INSERT OR IGNORE INTO users (id, password, name, birthday, position, role, accessLevel, canViewAll, avatar, department, workDays) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [user.id, user.password, user.name, user.birthday, user.position, user.role, user.accessLevel, user.canViewAll, user.avatar, user.department, user.workDays || 20]
            );
        } catch (error) {
            console.error(`Ошибка добавления пользователя ${user.id}:`, error);
        }
    }
    
    console.log('✅ Пользователи по умолчанию добавлены');
}

// Главная страница - перенаправление на страницу входа
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

// HTML страницы (проверка токена происходит на клиентской стороне)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, '../schedule.html'));
});

// Публичные страницы
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

// Страница диагностики системы
app.get('/status', (req, res) => {
    res.sendFile(path.join(__dirname, '../status.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер W Garage запущен на порту ${PORT}`);
    console.log(`📱 Клиент доступен по адресу: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket сервер готов к подключениям`);
});

// Обработка завершения приложения
process.on('SIGINT', () => {
    console.log('\n🛑 Завершение работы сервера...');
    db.close((err) => {
        if (err) {
            console.error('Ошибка закрытия базы данных:', err.message);
        } else {
            console.log('✅ База данных закрыта');
        }
        process.exit(0);
    });
});

module.exports = app;
