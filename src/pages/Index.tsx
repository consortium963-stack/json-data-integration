import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useEffect, useRef } from "react";
import ChatSimulator from "@/components/ChatSimulator";

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-5 flex justify-between items-center">
          <div className="text-2xl md:text-3xl font-bold text-primary tracking-tight">РАЗБЛОК</div>
          <Button 
            size="sm"
            className="bg-primary hover:bg-secondary text-white text-xs md:text-base md:px-6"
            onClick={() => scrollToSection('pricing')}
          >
            <span className="hidden sm:inline">Попробовать бесплатно</span>
            <span className="sm:hidden">Попробовать</span>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
          Счет <span className="text-accent">заблокировали?</span><br />
          Разблокируем за 7 дней
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 md:mb-10 max-w-3xl mx-auto">
          AI-помощник + юристы уже помогли разблокировать 340+ счетов по 115-ФЗ в 2025 году
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center px-4">
          <Button 
            size="lg" 
            className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-primary hover:bg-secondary w-full sm:w-auto"
            onClick={() => scrollToSection('demo')}
          >
            Попробовать бесплатно
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
            onClick={() => scrollToSection('how-it-works')}
          >
            Как это работает
          </Button>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-50 to-orange-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Знакомая ситуация?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-all duration-300 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">😱</div>
                <CardTitle>Паника и беспомощность</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Банк заблокировал счет без объяснений. Не можешь снять деньги, оплатить покупки. "Усе пропало, шеф!"
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">💸</div>
                <CardTitle>Дорогие юристы</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Консультация — от 5 000 руб. Разблокировка — от 30 000 руб. А гарантий никаких.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">⏰</div>
                <CardTitle>Теряешь время и нервы</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Запросы банка, жалобы в ЦБ, суды — недели ожидания. А деньги нужны сейчас.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-2xl mx-auto text-center bg-white shadow-xl animate-on-scroll opacity-0 translate-y-8">
            <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12">
              <div className="text-4xl md:text-6xl font-bold text-accent mb-3 md:mb-4">Более 2 млн граждан</div>
              <p className="text-base md:text-lg text-muted-foreground">
                Столкнулись с блокировкой своих карт
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="how-it-works" className="container mx-auto px-4 py-12 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16">Как работает РАЗБЛОК</h2>

        <div className="space-y-10 md:space-y-16 max-w-4xl mx-auto">
          <div className="flex gap-4 md:gap-8 items-start animate-on-scroll opacity-0 translate-y-8">
            <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Расскажи о проблеме</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Напиши боту в Telegram: "Мой счет заблокировали". Он задаст несколько уточняющих вопросов и сразу определит тип блокировки.
              </p>
              <Card className="bg-muted/50">
                <CardContent className="p-4 space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <strong className="text-sm text-muted-foreground">Вы:</strong>
                    <p className="mt-1">Счет заблокировали, что делать?!</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                    <strong className="text-sm text-primary">РАЗБЛОК:</strong>
                    <p className="mt-1">Понимаю, что сейчас паника. Сейчас разберемся! Скажи, что написано в уведомлении от банка? "115-ФЗ", "161-ФЗ" или "служба безопасности"?</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4 md:gap-8 items-start flex-row-reverse animate-on-scroll opacity-0 translate-y-8">
            <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
              2
            </div>
            <div className="flex-1 md:text-right">
              <h3 className="text-2xl font-bold mb-4">Получи пошаговый план</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Бот проанализирует твою ситуацию и объяснит причину блокировки простым языком. Узнаешь, какие документы нужны и куда их отправлять.
              </p>
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary text-left">
                    <strong className="text-sm text-primary">РАЗБЛОК:</strong>
                    <p className="mt-1">Вижу проблему: у тебя "поступление → снятие, поступление → снятие". Банк думает, что счет транзитный. Нужно собрать 3 документа и написать пояснение. Покажу как 👇</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4 md:gap-8 items-start animate-on-scroll opacity-0 translate-y-8">
            <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Верни доступ к деньгам</h3>
              <p className="text-lg text-muted-foreground">
                Бот сгенерирует все нужные документы: письмо в банк, жалобу в ЦБ, чек-лист безопасности. Просто скачай, подпиши и отправь.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Попробуй прямо сейчас — бесплатно</h2>
          <p className="text-center text-muted-foreground mb-10 text-lg max-w-2xl mx-auto">
            Задай вопрос боту и получи мгновенный ответ. Это демо-версия с реальными сценариями.
          </p>
          
          <ChatSimulator />

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 mt-16 md:mt-32">Почему РАЗБЛОК, а не юрист?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">⚡</div>
                <CardTitle>Ответ за 30 секунд</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Не 2 недели ожидания консультации юриста — получи план действий прямо сейчас
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">💰</div>
                <CardTitle>990 ₽/мес вместо 35 000 ₽</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Цена юриста за разблокировку — от 35 000 ₽. У нас — подписка 990 ₽/мес с неограниченными консультациями
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">🎯</div>
                <CardTitle>340+ счетов разблокировано</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Только 115-ФЗ и блокировки — узкая специализация с доказанной эффективностью в 2025 году
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">🤖</div>
                <CardTitle>ИИ + проверка юристом</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Искусственный интеллект анализирует ситуацию за секунды, юрист проверяет сложные кейсы вручную
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">📱</div>
                <CardTitle>Прямо в Telegram</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Не нужно ничего устанавливать. Работает там, где ты уже общаешься
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
              <CardHeader>
                <div className="text-5xl mb-4">🛡️</div>
                <CardTitle>Профилактика</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Проверка операций до блокировки. Предупредим о рисках заранее
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Тарифы</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-shadow animate-on-scroll opacity-0 translate-y-8">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-4">Бесплатно</CardTitle>
              <div className="text-5xl font-bold text-primary mb-2">0 ₽</div>
              <CardDescription>&nbsp;</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Диагностика</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Общая информация о 115-ФЗ</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Определение типа блокировки</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-primary hover:bg-secondary" 
                onClick={() => scrollToSection('demo')}
              >
                Начать
              </Button>
            </CardContent>
          </Card>

          <Card className="border-4 border-primary shadow-xl md:scale-105 relative animate-on-scroll opacity-0 translate-y-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold">
              Популярный
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-4">Стандарт</CardTitle>
              <div className="text-5xl font-bold text-primary mb-2">990 ₽</div>
              <CardDescription>в месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Неограниченные консультации</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Генерация документов</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Письма в банк и ЦБ</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Мониторинг рисков</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Шаблоны договоров</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Проверка операций</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-primary hover:bg-secondary"
                onClick={() => scrollToSection('demo')}
              >
                Попробовать
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow animate-on-scroll opacity-0 translate-y-8">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-4">Премиум</CardTitle>
              <div className="text-5xl font-bold text-primary mb-2">2 990 ₽</div>
              <CardDescription>в месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Все из "Стандарт"</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Проверка юристом-человеком</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Сопровождение в ЦБ</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Помощь с судом</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Приоритетная поддержка</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span>Личный менеджер</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline">Связаться</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="demo" className="bg-gradient-to-r from-primary to-secondary py-20 text-white scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Попробуй прямо сейчас — бесплатно</h2>
          <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
            Диагностика бесплатно! Без карты, без регистрации.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
            asChild
          >
            <a href="https://t.me/razblok_bot" target="_blank" rel="noopener noreferrer">
              Открыть в Telegram →
            </a>
          </Button>
        </div>
      </section>

      <footer className="bg-foreground text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-80">© 2026 РАЗБЛОК. AI-помощник по разблокировке счетов</p>
          <p className="opacity-70 mt-2 text-sm">От создателя "Заметки Банкира" — Юлии Левицкой</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;