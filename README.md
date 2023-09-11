## Запуск приложения
```bash
git clone https://github.com/Dh-Kh/python-test-dzenCode.git
```
Запуск используя Docker
```bash
docker-compose build 
docker-compose up
```
Стандартный запуск:
cd backend
```bash
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python manage.py runserver
```
cd frontend
```bash
npm install
npm start
```

## Backend
Backend написан на DRF. За обмен сообщениями отвечают вебсокеты, система 
аутентификации использует JWT токены. Валидация вводимых данных происходит на сервере.
Сообщения сортируются по умолчанию через LIFO. Ответы на сообщения хранятся в форме бинарного дерева, где корень - сообщение, на которое отвечали. Существует возможность сортировки сообщений по времени добавлению, по username и email. Файл схемы БД находится в этой папке.
## Frontend
Frontend написан на React. 
Для того, чтобы начать работу с проектом надо перейти
по этой ссылке - http://localhost:3000/login или http://localhost:3000/register
Дальше переходим - http://localhost:3000/comments
Функционал 
Для сортировки по времени: клик Sort by time
Для сортировки по username-email: кнопка Sort-email username
Для ответа на сообщение: клик на нужное сообщение(появится Reply form)
Для закрытия Reply form: клик на Reply form
Captcha: нужно заполнить один раз , чтобы отправлять сообщения.
Для отображения содержимого .txt файла: Клик Txt file: Click to display
