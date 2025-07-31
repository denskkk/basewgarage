const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wgarage.db');

console.log('🔍 Проверяем пользователей maria.jk и denis.m...');

db.serialize(() => {
    // Проверяем всех пользователей
    db.all('SELECT id, name, position FROM users WHERE id LIKE "%maria%" OR id LIKE "%denis%"', (err, users) => {
        if (err) {
            console.error('Ошибка:', err);
        } else {
            console.log('Найденные пользователи:');
            console.log(JSON.stringify(users, null, 2));
        }
        
        // Проверяем задачи
        db.all('SELECT id, title, assignedTo, assignedBy FROM tasks LIMIT 5', (err, tasks) => {
            if (err) {
                console.error('Ошибка задач:', err);
            } else {
                console.log('\nПоследние задачи:');
                console.log(JSON.stringify(tasks, null, 2));
            }
            db.close();
        });
    });
});
