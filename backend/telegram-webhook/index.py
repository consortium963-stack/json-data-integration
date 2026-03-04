import json
import os
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


def send_message(bot_token: str, chat_id: int, text: str):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }).encode()
    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode())


def notify_admin(bot_token: str, admin_chat_id: str, session: dict, tg_user: dict):
    username = tg_user.get("username", "")
    username_str = f"@{username}" if username else "нет"
    tg_id = tg_user.get("id", "")

    message = (
        "🔥 Новая заявка с Telegram-бота!\n\n"
        f"ФИО: {session.get('name', '—')}\n"
        f"Телефон: {session.get('phone', '—')}\n"
        f"Проблема: {session.get('problem', '—')}\n\n"
        f"Telegram: {username_str}\n"
        f"ID: {tg_id}"
    )
    send_message(bot_token, int(admin_chat_id), message)


def handler(event: dict, context) -> dict:
    """Вебхук Telegram-бота РАЗБЛОК — пошаговый сбор заявки и ответы на вопросы"""

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

    message = body.get("message") or body.get("edited_message")
    if not message:
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    chat_id = message["chat"]["id"]
    text = message.get("text", "").strip()
    tg_user = message.get("from", {})

    if not text:
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    session = get_session(chat_id)

    # /start или нет активной сессии
    if text == "/start" or session is None:
        save_session(chat_id, step="ask_name")
        send_message(bot_token, chat_id,
            "Привет! 👋 Я помогу разобраться с блокировкой вашего счёта.\n\n"
            "Для начала скажите — как вас зовут?"
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    step = session["step"]

    # Шаг 1 — ждём имя
    if step == "ask_name":
        save_session(chat_id, step="ask_phone", name=text)
        send_message(bot_token, chat_id,
            f"{text}, приятно познакомиться! 😊\n\n"
            "Укажите ваш номер телефона, чтобы наш специалист мог с вами связаться:"
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # Шаг 2 — ждём телефон
    if step == "ask_phone":
        save_session(chat_id, step="ask_problem", name=session["name"], phone=text)
        send_message(bot_token, chat_id,
            "Отлично, записал! 📝\n\n"
            "Теперь кратко опишите ситуацию:\n"
            "• Какой банк заблокировал счёт?\n"
            "• Какую причину указали?\n"
            "• Когда это произошло?"
        )
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    # Шаг 3 — ждём описание проблемы
    if step == "ask_problem":
        updated_session = {"name": session["name"], "phone": session["phone"], "problem": text}
        delete_session(chat_id)

        if admin_chat_id:
            notify_admin(bot_token, admin_chat_id, updated_session, tg_user)

        send_message(bot_token, chat_id,
            "Спасибо! Заявка принята ✅\n\n"
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
