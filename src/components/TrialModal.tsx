import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrialModal({ open, onOpenChange }: TrialModalProps) {
  const handleGoToBot = () => {
    window.open('https://t.me/Bot_RazblokBot', '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Получить бесплатную консультацию</DialogTitle>
          <DialogDescription className="text-base">
            Напишите нашему боту в Telegram — он задаст несколько вопросов и передаст заявку специалисту
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="w-full bg-muted rounded-xl p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>1️⃣</span>
              <span>Бот спросит ваше имя и телефон</span>
            </div>
            <div className="flex items-center gap-2">
              <span>2️⃣</span>
              <span>Опишете ситуацию с блокировкой</span>
            </div>
            <div className="flex items-center gap-2">
              <span>3️⃣</span>
              <span>Специалист свяжется с вами в ближайшее время</span>
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleGoToBot}
          >
            <Icon name="Send" size={20} className="mr-2" />
            Написать боту в Telegram
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Нажимая кнопку, вы соглашаетесь с{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
              политикой обработки персональных данных
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
