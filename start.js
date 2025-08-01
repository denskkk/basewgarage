// Стартовый скрипт для Render
const express = require('express');
const path = require('path');

// Устанавливаем путь к статическим файлам
const app = express();
app.use(express.static(path.join(__dirname)));

// Запускаем основной сервер
require('./server/server.js');
