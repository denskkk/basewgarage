# W Garage - Многопользовательская система управления автосервисом

## 🚀 Деплой приложения

### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

```bash
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

### Vercel
```bash
npm i -g vercel
vercel
```

### Railway
1. Подключите GitHub репозиторий
2. Railway автоматически определит настройки

### Render
1. Подключите GitHub
2. Build Command: `cd server && npm install`
3. Start Command: `cd server && npm start`

## 🔧 Переменные окружения

Для продакшн деплоя установите:

```env
JWT_SECRET=your-production-secret-key
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-domain.com
```

## 📱 Особенности

- **47 готовых аккаунтов** сотрудников
- **Реальное время** через WebSocket
- **SQLite база данных** (автоматически создается)
- **JWT авторизация**
- **Адаптивный дизайн**

## 🎯 После деплоя

1. Откройте ваш URL
2. Войдите с тестовыми аккаунтами:
   - **Директор:** valerijj.kd / wgarage2025!
   - **Менеджер:** viktor.m / wgarage2025!
   - **Топливщик:** anatolij.t / wgarage2025!

Система готова для корпоративного использования! 🎉
