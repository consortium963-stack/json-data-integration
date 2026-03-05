import json
import os
import re
import urllib.request
import urllib.parse
import psycopg2


FAQ = [
    {
        "keywords": ["стоит", "цена", "сколько", "стоимость", "тариф", "платно", "бесплатно", "деньги"],
        "answer": (
            "💰 Стоимость услуг РАЗБЛОК:\n\n"
            "• Консультация AI-помощника — бесплатно\n"
            "• Консультация юриста — от 5 000 руб.\n"
            "• Полное сопровождение по разблокировке — от 30 000 руб.\n\n"
            "Начните с бесплатной консультации — опишите вашу ситуацию, и мы скажем, что делать дальше."
        )
    },
    {
        "keywords": ["долго", "сколько времени", "срок", "когда", "быстро", "дней", "недель"],
        "answer": (
            "⏱ Сроки разблокировки зависят от ситуации:\n\n"
            "• Подготовка документов — от 5 минут с нашим AI\n"
            "• Рассмотрение банком — обычно 3–10 рабочих дней\n"
            "• Сложные случаи — до 30 дней\n\n"
            "Мы уже помогли разблокировать 210+ счетов в 2025 году. Расскажите вашу ситуацию — оценим точнее."
        )
    },
    {
        "keywords": ["документ", "справк", "письмо", "бумаг", "что подготовить", "что нужно"],
        "answer": (
            "📄 Документы для разблокировки счёта:\n\n"
            "Зависят от причины блокировки. Чаще всего нужны:\n"
            "• Пояснительное письмо в банк\n"
            "• Договоры с контрагентами\n"
            "• Документы об источнике средств\n"
            "• Подтверждение операций\n\n"
            "Наш AI-помощник автоматически определит, какие именно документы нужны в вашем случае, и поможет их составить."
        )
    },
    {
        "keywords": ["115", "115-фз", "закон", "обнал", "отмывание", "транзит", "подозрительн"],
        "answer": (
            "⚖️ Блокировка по 115-ФЗ (антиотмывочный закон):\n\n"
            "Банки блокируют счета если видят:\n"
            "• Транзитные операции (деньги пришли и сразу ушли)\n"
            "• Подозрительных контрагентов\n"
            "• Операции без экономического смысла\n"
            "• Большие снятия наличных\n\n"
            "Мы специализируемся именно на таких случаях. Расскажите вашу ситуацию!"
        )
    },
    {
        "keywords": ["гарантия", "гарантирует", "точно", "успех", "результат"],
        "answer": (
            "✅ О гарантиях:\n\n"
            "Мы не можем гарантировать 100% результат — это зависит от конкретной ситуации и банка.\n\n"
            "Но: 210+ успешно разблокированных счетов в 2025 году говорят сами за себя.\n\n"
            "Начните с бесплатной консультации — честно скажем, каковы ваши шансы."
        )
    },
    {
        "keywords": ["юрист", "адвокат", "специалист", "эксперт"],
        "answer": (
            "👨‍💼 Наши юристы:\n\n"
            "Специализируются исключительно на разблокировке счетов по 115-ФЗ.\n\n"
            "• Консультация — от 5 000 руб.\n"
            "• Полное сопровождение — от 30 000 руб.\n\n"
            "Сначала попробуйте бесплатный AI-помощник — многие вопросы решаются без юриста."
        )
    },
    {
        "keywords": ["банк", "сбербанк", "тинькофф", "альфа", "втб", "открытие", "райффайзен", "модуль", "точка"],
        "answer": (
            "🏦 Мы работаем со всеми российскими банками:\n\n"
            "Сбербанк, Тинькофф, Альфа-Банк, ВТБ, Открытие, Райффайзен, Модульбанк, Точка и другие.\n\n"
            "Расскажите, какой банк заблокировал счёт — поможем разобраться!"
        )
    },
]


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_session(chat_id: int) -> dict:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT step, name, phone, problem FROM bot_sessions WHERE chat_id = %s", (chat_id,))
    row = cur.fetchone()
    conn.close()
    if row:
        return {"step": row[0], "name": row[1], "phone": row[2], "problem": row[3]}
    return None


def save_session(chat_id: int, step: str, name=None, phone=None, problem=None):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO bot_sessions (chat_id, step, name, phone, problem, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
        ON CONFLICT (chat_id) DO UPDATE
        SET step = EXCLUDED.step,
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            problem = EXCLUDED.problem,
            updated_at = NOW()
        """,
        (chat_id, step, name, phone, problem)
    )
    conn.commit()
    conn.close()


def delete_session(chat_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM bot_sessions WHERE chat_id = %s", (chat_id,))
    conn.commit()
    conn.close()


def find_faq_answer(text: str) -> str:
    text_lower = text.lower()
    for item in FAQ:
        for keyword in item["keywords"]:
            if keyword in text_lower:
                return item["answer"]
    return None


def send_message(bot_token: str, chat_id: int, text: str, reply_markup=None):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        payload["reply_markup"] = json.dumps(reply_markup)
    data = urllib.parse.urlencode(payload).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


def notify_admin(bot_token: str, admin_chat_id: str, name: str, phone: str, email: str, tg_user: dict):
    username = tg_user.get("username", "")
    username_str = f"@{username}" if username else "нет"
    tg_id = tg_user.get("id", "")

    message = (
        "🔥 Новая заявка с Telegram-бота!\n\n"
        f"ФИО: {name}\n"
        f"Телефон: {phone}\n"
        f"Email: {email}\n\n"
        f"Telegram: {username_str}\n"
        f"ID: {tg_id}"
    )
    send_message(bot_token, int(admin_chat_id), message)


def is_valid_phone(text: str) -> bool:
    digits = re.sub(r"[\s\-\(\)\+]", "", text)
    if digits.startswith("8"):
        digits = "7" + digits[1:]
    return bool(re.fullmatch(r"7\d{10}", digits)) and len(digits) == 11


def normalize_phone(text: str) -> str:
    digits = re.sub(r"[\s\-\(\)\+]", "", text)
    if digits.startswith("8"):
        digits = "7" + digits[1:]
    return "+" + digits


def is_valid_fio(text: str) -> bool:
    parts = text.strip().split()
    return len(parts) >= 2 and all(re.fullmatch(r"[А-Яа-яЁёA-Za-z\-]+", p) for p in parts)


def is_valid_email(text: str) -> bool:
    return bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", text.strip()))


def handler(event: dict, context) -> dict:
    """Вебхук Telegram-бота РАЗБЛОК — согласие с политикой, сбор ФИО/телефон/email, ответы на вопросы"""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    admin_chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not bot_token:
        return {"statusCode": 500, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": "no token"})}

    raw_body = event.get("body", "{}")
    if isinstance(raw_body, dict):
        body = raw_body
    else:
        body = json.loads(raw_body) if raw_body else {}

    # Обработка нажатия inline-кнопки (callback_query)
    callback = body.get("callback_query")
    if callback:
        cb_chat_id = callback["message"]["chat"]["id"]
        cb_data = callback.get("data", "")
        cb_user = callback.get("from", {})
        cb_id = callback["id"]

        # Подтверждаем нажатие кнопки
        ack_url = f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery"
        ack_data = urllib.parse.urlencode({"callback_query_id": cb_id}).encode()
        urllib.request.urlopen(urllib.request.Request(ack_url, data=ack_data, method="POST"), timeout=10)

        if cb_data == "agree":
            save_session(cb_chat_id, step="ask_fio")
            send_message(bot_token, cb_chat_id,
                "Спасибо! ✅\n\n"
                "Пожалуйста, введите ваше <b>ФИО</b> полностью\n"
                "(например: Иванов Иван Иванович)"
            )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    message = body.get("message") or body.get("edited_message")
    if not message:
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    chat_id = message["chat"]["id"]
    text = message.get("text", "").strip()
    tg_user = message.get("from", {})

    if not text:
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    session = get_session(chat_id)

    # /start — всегда сбрасываем и показываем приветствие с кнопкой
    if text == "/start" or session is None:
        save_session(chat_id, step="wait_agree")
        send_message(
            bot_token, chat_id,
            "Привет! 👋 Я помогу разобраться с блокировкой вашего счёта.\n\n"
            "Для начала ознакомьтесь с <a href=\"https://razblok.ru/privacy\">политикой обработки персональных данных</a> "
            "и нажмите кнопку ниже, чтобы продолжить.",
            reply_markup={
                "inline_keyboard": [[
                    {"text": "✅ Согласен с политикой", "callback_data": "agree"}
                ]]
            }
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    step = session["step"]

    # Пока не нажата кнопка — напоминаем
    if step == "wait_agree":
        send_message(
            bot_token, chat_id,
            "Пожалуйста, сначала нажмите кнопку <b>«Согласен с политикой»</b> выше 👆",
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # Шаг 1 — ФИО
    if step == "ask_fio":
        if not is_valid_fio(text):
            send_message(bot_token, chat_id,
                "⚠️ Пожалуйста, введите полное ФИО — минимум имя и фамилию, только буквы.\n\n"
                "Например: <b>Иванов Иван Иванович</b>"
            )
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}
        save_session(chat_id, step="ask_phone", name=text)
        send_message(bot_token, chat_id,
            f"Отлично, {text.split()[0]}! 😊\n\n"
            "Введите ваш <b>номер телефона</b> (11 цифр):\n"
            "Например: <b>89001234567</b> или <b>+79001234567</b>"
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # Шаг 2 — Телефон
    if step == "ask_phone":
        if not is_valid_phone(text):
            send_message(bot_token, chat_id,
                "⚠️ Номер телефона должен содержать <b>11 цифр</b>.\n\n"
                "Например: <b>89001234567</b> или <b>+79001234567</b>"
            )
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}
        phone = normalize_phone(text)
        save_session(chat_id, step="ask_email", name=session["name"], phone=phone)
        send_message(bot_token, chat_id,
            "Записал! 📝\n\n"
            "Теперь введите вашу <b>электронную почту</b>:\n"
            "Например: <b>ivan@mail.ru</b>"
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # Шаг 3 — Email
    if step == "ask_email":
        if not is_valid_email(text):
            send_message(bot_token, chat_id,
                "⚠️ Некорректный адрес почты. Попробуйте ещё раз.\n\n"
                "Например: <b>ivan@mail.ru</b>"
            )
            return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

        name = session["name"]
        phone = session["phone"]
        email = text.strip().lower()

        delete_session(chat_id)

        if admin_chat_id:
            notify_admin(bot_token, admin_chat_id, name, phone, email, tg_user)

        send_message(bot_token, chat_id,
            "Спасибо! Заявка принята ✅\n\n"
            f"<b>ФИО:</b> {name}\n"
            f"<b>Телефон:</b> {phone}\n"
            f"<b>Email:</b> {email}\n\n"
            "Наш специалист свяжется с вами в ближайшее время.\n\n"
            "Пока ждёте — можете задать любой вопрос:\n"
            "• Сколько стоит?\n"
            "• Сколько займёт времени?\n"
            "• Какие документы нужны?\n"
            "• Что такое 115-ФЗ?"
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # После заявки — отвечаем на FAQ
    faq_answer = find_faq_answer(text)
    if faq_answer:
        send_message(bot_token, chat_id, faq_answer)
    else:
        send_message(bot_token, chat_id,
            "Я не совсем понял вопрос 🤔\n\n"
            "Вы можете спросить про:\n"
            "• Стоимость услуг\n"
            "• Сроки разблокировки\n"
            "• Документы\n"
            "• Блокировку по 115-ФЗ\n\n"
            "Или напишите /start чтобы оставить новую заявку."
        )

    return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}
