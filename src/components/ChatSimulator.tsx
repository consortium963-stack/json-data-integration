import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  options?: string[];
}

const ChatSimulator = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! Я РАЗБЛОК — помогу разобраться с блокировкой счета. Расскажи, что случилось?',
      isBot: true,
      options: [
        'Счет заблокировали',
        'Хочу проверить операцию',
        'Нужна консультация'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const scenarios: Record<string, Message[]> = {
    'Счет заблокировали': [
      {
        id: 2,
        text: 'Счет заблокировали',
        isBot: false
      },
      {
        id: 3,
        text: 'Понимаю, что сейчас паника. Сейчас разберемся! Скажи, что написано в уведомлении от банка? "115-ФЗ", "161-ФЗ" или "служба безопасности"?',
        isBot: true,
        options: ['115-ФЗ', '161-ФЗ', 'Служба безопасности']
      }
    ],
    '115-ФЗ': [
      {
        id: 4,
        text: '115-ФЗ',
        isBot: false
      },
      {
        id: 5,
        text: 'Ясно! Это блокировка по закону о противодействии отмыванию денег. Обычно причины:\n\n• "Транзитные" операции (пришло → сразу ушло)\n• Подозрительные контрагенты\n• Операции без экономического смысла\n\nСейчас узнаю детали. Какая была последняя крупная операция по счету?',
        isBot: true,
        options: ['Получил оплату от клиента', 'Перевел деньги партнеру', 'Снял наличные']
      }
    ],
    'Получил оплату от клиента': [
      {
        id: 6,
        text: 'Получил оплату от клиента',
        isBot: false
      },
      {
        id: 7,
        text: 'Вижу проблему! Банк подозревает "транзитность": деньги пришли и сразу ушли. Это классическая причина блокировки.\n\n✅ Что нужно сделать:\n\n1. Подготовить договор с клиентом\n2. Показать акт выполненных работ\n3. Объяснить экономический смысл операции\n\nЯ сгенерирую все документы за 5 минут. Продолжим в Telegram?',
        isBot: true,
        options: ['Открыть в Telegram', 'Начать заново']
      }
    ],
    'Хочу проверить операцию': [
      {
        id: 8,
        text: 'Хочу проверить операцию',
        isBot: false
      },
      {
        id: 9,
        text: 'Отлично! Проверка до блокировки — лучшая стратегия 🛡️\n\nРасскажи об операции:\n• Сумма\n• Кому отправляешь\n• За что (назначение платежа)\n\nЯ проанализирую риски по базе 115-ФЗ.',
        isBot: true,
        options: ['Открыть в Telegram', 'Начать заново']
      }
    ],
    'Нужна консультация': [
      {
        id: 10,
        text: 'Нужна консультация',
        isBot: false
      },
      {
        id: 11,
        text: 'Конечно! Я отвечу на любые вопросы по 115-ФЗ:\n\n• Почему блокируют счета\n• Как избежать блокировки\n• Что делать, если уже заблокировали\n• Как правильно оформлять операции\n\nЗадай свой вопрос в Telegram — отвечу за 30 секунд!',
        isBot: true,
        options: ['Открыть в Telegram', 'Начать заново']
      }
    ]
  };

  const handleOptionClick = (option: string) => {
    if (option === 'Начать заново') {
      setMessages([
        {
          id: 1,
          text: 'Привет! Я РАЗБЛОК — помогу разобраться с блокировкой счета. Расскажи, что случилось?',
          isBot: true,
          options: [
            'Счет заблокировали',
            'Хочу проверить операцию',
            'Нужна консультация'
          ]
        }
      ]);
      return;
    }

    if (option === 'Открыть в Telegram') {
      window.open('https://t.me/razblok_bot', '_blank');
      return;
    }

    const scenario = scenarios[option];
    if (scenario) {
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prev => [...prev, scenario[0]]);
        setIsTyping(false);
        
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, scenario[1]]);
            setIsTyping(false);
          }, 1000);
        }, 500);
      }, 300);
    }
  };

  const currentOptions = messages[messages.length - 1]?.options;

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl">
      <CardContent className="p-0">
        <div className="bg-primary text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Icon name="Bot" className="text-primary" size={24} />
          </div>
          <div>
            <div className="font-bold">РАЗБЛОК</div>
            <div className="text-xs opacity-80">AI-помощник • онлайн</div>
          </div>
        </div>

        <div className="h-[400px] overflow-y-auto p-4 bg-muted/20 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.isBot
                    ? 'bg-white border border-gray-200'
                    : 'bg-primary text-white'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {currentOptions && !isTyping && (
          <div className="p-4 border-t bg-white space-y-2">
            {currentOptions.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleOptionClick(option)}
                variant={option === 'Открыть в Telegram' ? 'default' : 'outline'}
                className={`w-full justify-start ${
                  option === 'Открыть в Telegram' 
                    ? 'bg-primary hover:bg-secondary' 
                    : ''
                }`}
              >
                {option === 'Открыть в Telegram' && (
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                )}
                {option}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatSimulator;
