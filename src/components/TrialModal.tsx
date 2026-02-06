import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface TrialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrialModal({ open, onOpenChange }: TrialModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Необходимо согласие на обработку персональных данных');
      return;
    }
    console.log('Form submitted:', formData);
    window.open('https://t.me/razblok_bot', '_blank');
    onOpenChange(false);
    setFormData({ name: '', email: '', phone: '', consent: false });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Попробовать бесплатно</DialogTitle>
          <DialogDescription>
            Оставьте свои контакты, и мы свяжемся с вами для активации пробного периода
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.ru"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, consent: checked as boolean })
              }
              required
            />
            <Label
              htmlFor="consent"
              className="text-sm leading-tight cursor-pointer"
            >
              Я согласен на обработку персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных»
            </Label>
          </div>
          <Button type="submit" className="w-full" size="lg">
            <Icon name="Send" size={20} className="mr-2" />
            Перейти в Telegram
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}