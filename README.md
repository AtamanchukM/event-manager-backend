# 📅 Event Manager API

Система управління подіями та реєстрацією учасників на основі Express + TypeScript + PostgreSQL + Sequelize.

## 🎯 Основні можливості

✅ **Авторизація** через JWT токени  
✅ **CRUD операції** для подій  
✅ **Реєстрація учасників** на події  
✅ **Обмеження** на максимальну кількість учасників  
✅ **Перегляд** всіх подій користувача  
✅ **Список учасників** для кожної події  

---

## 🚀 Встановлення та запуск

### 1. Клонування та встановлення залежностей

```bash
# Клонуйте репозиторій
git clone <your-repo-url>
cd event-manager-backend

# Встановіть залежності
npm install
```

### 2. Налаштування PostgreSQL

```bash
# Створіть базу даних
createdb event_manager

# Або через psql:
psql -U postgres
CREATE DATABASE event_manager;
\q
```

### 3. Налаштування .env файлу

Створіть файл `.env` в корені проекту:

```env
# База даних
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_manager
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Сервер
PORT=3000
NODE_ENV=development
```

### 4. Запуск сервера

```bash
# Режим розробки (з автоперезавантаженням)
npm run dev

# Компіляція TypeScript
npm run build

# Запуск з dist
npm start
```

Сервер запуститься на `http://localhost:3000`

---

## 📡 API Ендпоїнти

### 🔐 **Авторизація** (`/api/auth`)

#### POST `/api/auth/register`
Реєстрація нового користувача

**Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**Відповідь (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

---

#### POST `/api/auth/login`
Вхід користувача

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Відповідь (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

---

#### GET `/api/auth/users`
Отримати всіх користувачів

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "username": "jane",
    "email": "jane@example.com"
  }
]
```

---

#### POST `/api/auth/reset-db`
⚠️ **Видалити всіх користувачів, события та учасників** (тільки для розробки)

**Відповідь (200):**
```json
{
  "message": "База даних очищена успішно",
  "deletedUsers": true,
  "deletedEvents": true,
  "deletedParticipants": true
}
```

---

### 📅 **Події** (`/api/events`)

#### GET `/api/events`
Отримати всі события з учасниками

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "name": "Технічна конференція",
    "description": "Конференція про веб-розробку",
    "date": "2025-12-20T10:00:00.000Z",
    "location": "Київ",
    "maxParticipants": 5,
    "registeredCount": 2,
    "registeredUsers": [
      {
        "id": 1,
        "username": "john",
        "email": "john@example.com"
      },
      {
        "id": 2,
        "username": "jane",
        "email": "jane@example.com"
      }
    ]
  }
]
```

---

#### GET `/api/events/:id`
Отримати подію за ID з учасниками

**Приклад:** `GET /api/events/1`

**Відповідь (200):**
```json
{
  "id": 1,
  "name": "Технічна конференція",
  "description": "Конференція про веб-розробку",
  "date": "2025-12-20T10:00:00.000Z",
  "location": "Київ",
  "maxParticipants": 5,
  "registeredCount": 2,
  "registeredUsers": [...]
}
```

---

#### POST `/api/events`
Створити нову подію (потрібен JWT)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Вебінар по TypeScript",
  "description": "Глибокое вивчення TypeScript",
  "date": "2025-12-28T14:00:00Z",
  "location": "Online",
  "maxParticipants": 100
}
```

**Відповідь (201):**
```json
{
  "id": 2,
  "name": "Вебінар по TypeScript",
  "description": "Глибокое вивчення TypeScript",
  "date": "2025-12-28T14:00:00Z",
  "location": "Online",
  "maxParticipants": 100,
  "updatedAt": "2025-12-15T12:00:00.000Z",
  "createdAt": "2025-12-15T12:00:00.000Z"
}
```

---

#### PUT `/api/events/:id`
Оновити подію (потрібен JWT)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Оновлена назва",
  "maxParticipants": 200
}
```

**Відповідь (200):** Оновлена подія

---

#### DELETE `/api/events/:id`
Видалити подію (потрібен JWT)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Відповідь (204):** No Content

---

### 👥 **Учасники** (`/api`)

#### POST `/api/events/:id/register`
Зареєструвати поточного користувача на подію (потрібен JWT)

**Приклад:** `POST /api/events/1/register`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Відповідь (201):**
```json
{
  "id": 1,
  "userId": 1,
  "eventId": 1,
  "createdAt": "2025-12-15T12:05:00.000Z",
  "updatedAt": "2025-12-15T12:05:00.000Z"
}
```

**Помилки:**
- **400** - Досягнуто максимальну кількість учасників
- **400** - Ви вже зареєстровані на цю подію

---

#### GET `/api/user/events`
Отримати всі события, на які зареєстрований поточний користувач (потрібен JWT)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "name": "Технічна конференція",
    "description": "...",
    "date": "2025-12-20T10:00:00.000Z",
    "location": "Київ",
    "maxParticipants": 5,
    "registeredCount": 2,
    "registeredUsers": [...]
  }
]
```

---

## 🧪 Тестування API

### За допомогою Thunder Client / Postman

1. **Реєстрація користувача:**
   - Метод: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Body:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Копіюйте токен** з відповіді

3. **Створення события:**
   - Метод: `POST`
   - URL: `http://localhost:3000/api/events`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body:
   ```json
   {
     "name": "Моя подія",
     "description": "Опис",
     "date": "2025-12-25T10:00:00Z",
     "location": "Київ",
     "maxParticipants": 50
   }
   ```

4. **Реєстрація на подію:**
   - Метод: `POST`
   - URL: `http://localhost:3000/api/events/1/register`
   - Headers: `Authorization: Bearer YOUR_TOKEN`

---

## 📊 Структура БД

### Таблиця `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Таблиця `events`
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  maxParticipants INTEGER NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Таблиця `participants`
```sql
CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL REFERENCES users(id),
  eventId INTEGER NOT NULL REFERENCES events(id),
  UNIQUE(userId, eventId),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## 🛠️ Технологічний стек

- **Runtime:** Node.js
- **Мова:** TypeScript
- **Framework:** Express.js
- **БД:** PostgreSQL
- **ORM:** Sequelize
- **Аутентифікація:** JWT (jsonwebtoken)
- **Хешування паролів:** bcrypt

---

## 📝 Переменні оточення

| Змінна | Опис | Приклад |
|--------|------|---------|
| `DB_HOST` | Хост БД | `localhost` |
| `DB_PORT` | Порт БД | `5432` |
| `DB_NAME` | Назва БД | `event_manager` |
| `DB_USER` | Користувач БД | `postgres` |
| `DB_PASSWORD` | Пароль БД | `password` |
| `JWT_SECRET` | Секрет для JWT | `your-secret-key` |
| `JWT_EXPIRES_IN` | Експірація JWT | `7d` |
| `PORT` | Порт сервера | `3000` |
| `NODE_ENV` | Оточення | `development` |

---

## 🔒 Безпека

- ✅ Паролі хешуються через bcrypt
- ✅ JWT токени для авторизації
- ✅ Унікальні індекси на email/username
- ✅ Foreign keys для целісності даних
- ⚠️ Змініть `JWT_SECRET` для production!

---

## 📁 Структура проекту

```
src/
├── config/           # Конфігурація (БД, JWT)
├── controllers/      # Бізнес-логіка
├── models/          # Sequelize моделі
├── routes/          # API маршрути
├── middleware/      # Middleware (авторизація)
├── utils/           # Утиліти (JWT, пароль)
├── types/           # TypeScript типи
└── server.ts        # Головний файл
```

---

## 🚨 Помилки та вирішення

### Помилка: "Cannot connect to database"
- Перевірте чи запущена PostgreSQL
- Перевірте дані в `.env`

### Помилка: "Database does not exist"
- Виконайте: `createdb event_manager`

### Помилка: "Duplicate key value violates..."
- Користувач/email вже існує
- Використовуйте `POST /api/auth/reset-db` для очищення

---

## 📞 Контакти та підтримка

GitHub: [ваш-репозиторій]

---

## 📄 Ліцензія

MIT

---

**Версія:** 1.0.0  
**Остання оновлення:** 15 грудня 2025
