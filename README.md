# Travel Agency Simulation

A full-stack monolithic web application simulating a travel agency. Built using Spring Boot for the backend and React for the frontend. The system allows users to browse tours, filter by parameters, make bookings, and manage the application through an admin panel.



## Test Accounts

You can test the application using the following demo accounts:

- **Admin Account**
    - Email: `admin@admin.com`
    - Password: `Admin123!`

- **User Account**
    - Email: `user@user.com`
    - Password: `User123!`

> These accounts are automatically created on application startup if they don't already exist.

## Live Demo

The application is deployed on Heroku and can be accessed here:

🔗 [https://travel-app01-04b23cb7210b.herokuapp.com/](https://travel-app01-04b23cb7210b.herokuapp.com/)

## Features

- Registration and login with OAuth2 via Google and Facebook
- Dynamic tour pages with image galleries and user reviews
- Filtering by difficulty, availability, type, price
- Booking system with Stripe payment integration
- Admin panel for managing tours, bookings, users, and roles
- Avatar upload and tour gallery
- Email notifications via Gmail SMTP
- Ready for deployment on Heroku

## Technologies Used

- **Backend:** Java, Spring Boot, Spring Security, JPA, PostgreSQL
- **Frontend:** React, Bootstrap, Axios
- **Authentication:** OAuth2 (Google, Facebook)
- **Payment:** Stripe API
- **Dev Tools:** Lombok, Maven, Git, Postman, VS Code / IntelliJ

# Симуляция туристического веб-приложения

Полноценное монолитное веб-приложение, моделирующее работу туристического агентства. Реализовано с использованием Spring Boot на сервере и React на клиентской стороне. Пользователи могут просматривать туры, фильтровать их, бронировать, а администратор управляет системой через панель администратора.

## Тестовые аккаунты

Для тестирования приложения можно использовать следующие аккаунты:

- **Аккаунт администратора**
    - Email: `admin@admin.com`
    - Пароль: `Admin123!`

- **Обычный пользователь**
    - Email: `user@user.com`
    - Пароль: `User123!`

> Эти аккаунты создаются автоматически при первом запуске приложения, если они отсутствуют в базе данных.

## Живая демонстрация

Приложение развёрнуто на Heroku и доступно по ссылке:

🔗 [https://travel-app01-04b23cb7210b.herokuapp.com/](https://travel-app01-04b23cb7210b.herokuapp.com/)

## Функциональность

- Регистрация и вход с поддержкой OAuth2 через Google и Facebook
- Динамические страницы туров с галереей изображений и отзывами
- Фильтрация туров по сложности, доступности, типу, цене
- Система бронирования с интеграцией Stripe для онлайн-оплаты
- Панель администратора для управления турами, бронированиями и пользователями
- Загрузка аватара и изображений туров
- Уведомления на email через Gmail SMTP
- Готово к деплою на Heroku

## Используемые технологии

- **Бэкенд:** Java, Spring Boot, Spring Security, JPA, PostgreSQL
- **Фронтенд:** React, Bootstrap, Axios
- **Авторизация:** OAuth2 (Google, Facebook)
- **Платежи:** Stripe API
- **Инструменты разработки:** Lombok, Maven, Git, Postman, VS Code / IntelliJ
