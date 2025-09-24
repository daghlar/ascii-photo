# ASCII Photo Generator

Веб-приложение для преобразования изображений в ASCII арт с использованием Python HTTP сервера и современного фронтенда.

## 🎨 Демо

Приложение доступно по адресу: http://localhost:8080 (после запуска сервера)

## 🚀 Быстрый старт

## Возможности

- Загрузка изображений различных форматов (PNG, JPG, JPEG, GIF, BMP, WEBP)
- Настройка ширины ASCII арта (20-120 символов)
- Drag & Drop интерфейс для загрузки файлов
- Копирование результата в буфер обмена
- Скачивание ASCII арта как текстовый файл
- Адаптивный дизайн для мобильных устройств

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/daghlar/ascii-photo.git
cd ascii-photo
```

2. Убедитесь, что у вас установлен Python 3.12+ и Pillow:
```bash
python3 -c "import PIL; print('Pillow установлен')"
```

## Запуск

```bash
python3 simple_server.py
```

Приложение будет доступно по адресу: http://localhost:8080

## Использование

1. Откройте веб-браузер и перейдите на http://localhost:8080
2. Выберите изображение, перетащив файл в область загрузки или нажав кнопку "Выбрать файл"
3. Настройте ширину ASCII арта с помощью слайдера
4. Нажмите "Создать ASCII" для генерации
5. Используйте кнопки "Копировать" или "Скачать" для сохранения результата

## Технологии

- **Backend**: Python HTTP Server (built-in)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Обработка изображений**: Pillow (PIL)
- **Стилизация**: CSS Grid, Flexbox, CSS Animations

## Структура проекта

```
ascii-photo/
├── simple_server.py      # Python HTTP сервер
├── requirements.txt      # Python зависимости
├── README.md            # Документация
├── templates/
│   └── index.html       # HTML шаблон
└── static/
    ├── style.css        # CSS стили
    └── script.js        # JavaScript код
```

## Лицензия

MIT License
