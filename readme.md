# Тестовое задание

---

## Требования

- **Node.js 18+**
- **Docker & docker-compose**
- Google Cloud проект с включённым API **Google Sheets**
- Сервисный аккаунт Google с JSON‑ключом (`credentials.json`)
- PostgreSQL (локально или в контейнере)

---

## Настройка окружения

1. Скопируйте `example.env` в корень проекта как `.env` и заполните значения
2. Поместите полученный `credentials.json` в корень проекта.

---

## Google Sheets и сервисный аккаунт

1. Создайте таблицу в Google Sheets и добавьте два листа:
   - `stocks_coefs`
   - `box`
2. Включите API Sheets: https://console.developers.google.com/apis/api/sheets.googleapis.com
3. Создайте сервисный аккаунт:
   - роль **Owner**
   - сгенерируйте ключ JSON и скачайте
4. Откройте `credentials.json`, скопируйте `client_email`.
5. На странице таблицы нажмите **Поделиться**, вставьте e‑mail, дайте роль **Редактор**.

Подробности по созданию аккаунта: https://cloud.google.com/iam/docs/service-accounts-create

---

## Запуск

```bash
docker compose up -d --build app
```
