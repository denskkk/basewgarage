// Инициализация базы данных для деплоя
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Инициализация базы данных для Render...');

// Запускаем скрипт инициализации из папки server
const child = spawn('node', ['scripts/init-db.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit'
});

child.on('close', (code) => {
    if (code === 0) {
        console.log('✅ База данных успешно инициализирована');
    } else {
        console.error('❌ Ошибка инициализации базы данных');
        process.exit(1);
    }
});

child.on('error', (err) => {
    console.error('❌ Ошибка запуска скрипта:', err);
    process.exit(1);
});
