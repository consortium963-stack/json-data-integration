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
  const [nameError, setNameError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateFullName = (name: string): boolean => {
    const trimmedName = name.trim();
    const cyrillicPattern = /^[А-ЯЁа-яё\s-]+$/;
    const words = trimmedName.split(/\s+/).filter(word => word.length > 0);
    
    if (!cyrillicPattern.test(trimmedName)) {
      setNameError('Введите ФИО на русском языке');
      return false;
    }
    
    if (words.length < 2) {
      setNameError('Введите свое полное ФИО');
      return false;
    }
    
    for (const word of words) {
      if (word.length < 2) {
        setNameError('Каждая часть ФИО должна содержать минимум 2 буквы');
        return false;
      }
    }
    
    if (words.length === 2) {
      if (words[0].length < 3 || words[1].length < 3) {
        setNameError('Введите корректные Фамилию и Имя (минимум 3 буквы каждое)');
        return false;
      }
    }
    
    if (words.length >= 3) {
      if (words[0].length < 3 || words[1].length < 3 || words[2].length < 3) {
        setNameError('Введите корректное ФИО (минимум 3 буквы в каждой части)');
        return false;
      }
    }
    
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });
    if (value.trim()) {
      validateFullName(value);
    } else {
      setNameError('');
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    let formatted = '+7';
    
    if (digits.length > 1) {
      formatted += ' (' + digits.substring(1, 4);
    }
    
    if (digits.length >= 4) {
      formatted += ') ' + digits.substring(4, 7);
    }
    
    if (digits.length >= 7) {
      formatted += '-' + digits.substring(7, 9);
    }
    
    if (digits.length >= 9) {
      formatted += '-' + digits.substring(9, 11);
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setFormData({ ...formData, phone: formatted });
  };

  const isFormValid = formData.name.trim() !== '' && 
                      formData.email.trim() !== '' && 
                      formData.phone.trim() !== '' && 
                      formData.consent &&
                      nameError === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFullName(formData.name)) {
      return;
    }
    
    if (!formData.consent) {
      alert('Необходимо согласие на обработку персональных данных');
      return;
    }
    
    try {
      const response = await fetch('https://functions.poehali.dev/dce04ff2-c355-491c-ba7b-d7d24cce51b7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });

      if (response.ok) {
        window.open('https://t.me/Bot_RazblokBot', '_blank');
        setFormData({ name: '', email: '', phone: '', consent: false });
        setNameError('');
        setShowSuccess(true);
      } else {
        alert('Ошибка отправки заявки. Попробуйте позже.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ошибка отправки заявки. Попробуйте позже.');
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setShowSuccess(false);
    }
    onOpenChange(value);
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Icon name="Check" size={32} className="text-green-600" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl">Заявка отправлена ✅</DialogTitle>
              <DialogDescription className="text-base">
                Спасибо, ваши данные успешно получены. В ближайшее время с Вами свяжется наш менеджер.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => handleClose(false)} className="mt-4" size="lg">
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Попробовать бесплатно</DialogTitle>
          <DialogDescription>
            Оставьте свои контакты, и мы свяжемся с вами для активации пробного периода
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Полное ФИО *</Label>
            <Input
              id="name"
              placeholder="Иванов Иван Петрович"
              value={formData.name}
              onChange={handleNameChange}
              required
              className={nameError ? 'border-red-500' : ''}
            />
            {nameError && (
              <p className="text-sm text-red-600 font-medium">{nameError}</p>
            )}
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
              onChange={handlePhoneChange}
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
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!isFormValid}
          >
            <Icon name="Send" size={20} className="mr-2" />
            Перейти в Telegram
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}