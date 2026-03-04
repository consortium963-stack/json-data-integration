import json
import os
import urllib.request
import urllib.parse


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
        "keywords": ["начать", "начало", "как работает", "что делать", "с чего", "первый шаг", "помогите", "помощь"],
        "answer": (
            "🚀 Как начать работу с РАЗБЛОК:\n\n"
            "1️⃣ Опишите проблему — какой банк, какой код блокировки (115-ФЗ, 161-ФЗ или служба безопасности)\n"
            "2️⃣ AI-помощник составит пошаговый план и нужные документы за 5 минут\n"
            "3️⃣ При необходимости подключим юриста\n\n"
            "Просто напишите нам о своей ситуации прямо сейчас!"
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

DEFAULT_ANSWER = (
    "Здравствуйте! Я бот сервиса РАЗБЛОК 👋\n\n"
    "Помогаем предпринимателям разблокировать банковские счета по 115-ФЗ.\n\n"
    "Вы можете спросить меня про:\n"
    "• Стоимость услуг\n"
    "• Сроки разблокировки\n"
    "• Как начать / что делать\n"
    "• Какие документы нужны\n"
    "• Блокировку по 115-ФЗ\n\n"
    "Или просто опишите вашу ситуацию — передам её нашим специалистам!"
)

LEAD_KEYWORDS = ["заблокировали", "заблокирован", "счет", "счёт", "заморозили", "не работает счет", "ограничен"]


def find_answer(text: str) -> str:
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


def notify_admin(bot_token: str, admin_chat_id: str, user_text: str, user_info: dict):
    first = user_info.get("first_name", "")
    last = user_info.get("last_name", "")
    username = user_info.get("username", "")
    user_id = user_info.get("id", "")

    name_str = f"{first} {last}".strip() or "Не указано"
    username_str = f"@{username}" if username else "нет"

    message = (
        f"📩 Новое сообщение от пользователя\n\n"
        f"Имя: {name_str}\n"
        f"Username: {username_str}\n"
        f"ID: {user_id}\n\n"
        f"Сообщение:\n{user_text}"
    )
    send_message(bot_token, int(admin_chat_id), message)


def handler(event: dict, context) -> dict:
    """Вебхук для Telegram-бота РАЗБЛОК — отвечает на вопросы пользователей по FAQ"""

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
    user_text = message.get("text", "")
    user_info = message.get("from", {})

    if not user_text:
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}

    answer = find_answer(user_text)

    if answer:
        send_message(bot_token, chat_id, answer)
    else:
        send_message(bot_token, chat_id, DEFAULT_ANSWER)
        if admin_chat_id:
            notify_admin(bot_token, admin_chat_id, user_text, user_info)

    return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": "ok"}