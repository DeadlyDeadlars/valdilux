#!/bin/bash

echo "=== Запуск сайта ValDiLux ==="
echo ""

# Создаем директорию для фотографий
echo "1. Создаем директорию для фотографий..."
mkdir -p public/photos
echo "   ✅ Готово"

# Копируем фотографии
echo "2. Копируем фотографии..."
if [ -d "../../Photo" ]; then
    echo "   Найдена папка Photo, копируем файлы..."
    cp ../../Photo/*.jpg public/photos/ 2>/dev/null || true
    cp ../../Photo/*.jpeg public/photos/ 2>/dev/null || true
    echo "   ✅ Фотографии скопированы"
else
    echo "   ⚠️  Папка Photo не найдена"
fi

# Копируем видео
echo "3. Копируем видео..."
if [ -f "../../столрейка.mp4" ]; then
    cp "../../столрейка.mp4" public/
    echo "   ✅ Видео скопировано"
else
    echo "   ⚠️  Видео столрейка.mp4 не найдено"
fi

echo ""
echo "4. Запускаем сайт..."
echo "   npm run dev"
echo ""
echo "=== Готово! ==="
echo "Сайт доступен по адресу: http://localhost:3000"
