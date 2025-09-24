# ASCII Арт Генератор

Веб-приложение для преобразования изображений в ASCII арт с использованием Python Flask и современного фронтенда.

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
git clone <repository-url>
cd asci
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

## Запуск

```bash
python app.py
```

Приложение будет доступно по адресу: http://localhost:5000

## Использование

1. Откройте веб-браузер и перейдите на http://localhost:5000
2. Выберите изображение, перетащив файл в область загрузки или нажав кнопку "Выбрать файл"
3. Настройте ширину ASCII арта с помощью слайдера
4. Нажмите "Создать ASCII" для генерации
5. Используйте кнопки "Копировать" или "Скачать" для сохранения результата

## Технологии

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Обработка изображений**: Pillow (PIL)
- **Стилизация**: CSS Grid, Flexbox, CSS Animations

## Структура проекта

```
asci/
├── app.py                 # Flask приложение
├── requirements.txt       # Python зависимости
├── README.md             # Документация
├── templates/
│   └── index.html        # HTML шаблон
└── static/
    ├── style.css         # CSS стили
    └── script.js         # JavaScript код
```

## Лицензия

MIT License
