# 🎨 ASCII Art Generator

Современный веб-генератор ASCII искусства с поддержкой 3 языков. Преобразуйте изображения в ASCII произведения искусства.

## 🚀 Быстрый старт

### Локальная разработка
```bash
git clone https://github.com/daghlar/ascii-photo.git
cd ascii-photo
pip install -r requirements.txt
python3 simple_server.py
# Откройте http://localhost:8080
```

### Vercel Deployment
```bash
npm i -g vercel
vercel login
vercel
```

## ✨ Возможности

- 🌍 **3 языка** - Русский, English, Türkçe
- 🎨 **4 стиля ASCII** - Стандартный, Детальный, Минималистичный, Художественный
- 🌈 **3 цветовые схемы** - Красный-Черный, Белый-Черный, Черный-Белый
- 📏 **Настройка ширины** - 20-120 символов
- 🖼️ **Форматы** - PNG, JPG, JPEG, GIF, BMP, WEBP
- 🖱️ **Drag & Drop** - Простая загрузка
- 📋 **Копирование/Скачивание** - В буфер обмена или файл
- 📱 **Адаптивный дизайн** - Для всех устройств

## 🛠️ Технологии

- **Backend**: Vercel Serverless Functions (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Обработка изображений**: Pillow (PIL)
- **Deployment**: Vercel

## 📁 Структура проекта

```
ascii-photo/
├── api/ascii.py          # Vercel serverless функция
├── public/               # Статические файлы
│   ├── index.html
│   ├── about.html
│   ├── style.css
│   ├── script.js
│   └── languages.js
├── vercel.json          # Vercel конфигурация
├── requirements.txt     # Python зависимости
└── package.json         # Node.js зависимости
```

## 🌍 Поддерживаемые языки

- 🇷🇺 **Русский** - Полная локализация
- 🇺🇸 **English** - Complete localization
- 🇹🇷 **Türkçe** - Tam yerelleştirme

## 📱 Vercel Features

- ✅ **Serverless Functions** - Автоматическое масштабирование
- ✅ **Global CDN** - Быстрая загрузка
- ✅ **HTTPS** - Автоматические SSL сертификаты
- ✅ **Custom Domains** - Подключение собственного домена

## 📄 Лицензия

MIT License

---

**Создано с ❤️ для любителей ASCII искусства**