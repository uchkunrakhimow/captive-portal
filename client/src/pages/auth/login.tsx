import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/languageSwitcher';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import PrivacyPolicy from '@/pages/auth/modals/privacy-policy';

// Constants for initial values and validation
const INITIAL_PHONE = '+998';
const MIN_PHONE_LENGTH = 4;

export default function Login() {
  const navigate = useNavigate();
  const { setPhoneNum } = useAuth();
  const { t } = useTranslation();
  const [phone, setPhone] = useState<string>(INITIAL_PHONE);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);

  const { ap, id, ssid } = useUrlParams();

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    setIsPhoneValid(phoneValue.length > MIN_PHONE_LENGTH);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phoneNumber = phone.startsWith('+') ? phone.slice(1) : phone;

    if (phoneNumber !== '998') {
      try {
        await axios.post('/auth/login', {
          phoneNum: phoneNumber.replace(/ /g, ''),
          ap: ap || 'N/A',
          macAddress: id || 'N/A',
          ssid: ssid || 'N/A',
        });
        toast({ title: t('auth.sms.success') });
        setPhoneNum(phoneNumber);
        navigate('/otp');
      } catch (error) {
        console.error('Login Error:', error);
        toast({
          variant: 'destructive',
          title: t('auth.sms.error.title'),
          description: t('auth.sms.error.description'),
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: t('phone_invalid_title'),
        description: t('phone_invalid_description'),
      });
    }
  };

  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-lg'>
        <Header t={t} />
        <Card className='border-none p-6 shadow-none'>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <PhoneNumberInput
              phone={phone}
              onPhoneChange={handlePhoneChange}
              t={t}
            />
            <Button className='w-full' type='submit' disabled={!isPhoneValid}>
              {t('auth.send_sms')}
            </Button>
          </form>
        </Card>
        <Footer t={t} />
      </div>
    </div>
  );
}

// Custom hook to handle URL parameters and localStorage
function useUrlParams() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ap = urlParams.get('ap');
    const id = urlParams.get('id');
    const ssid = urlParams.get('ssid');

    if (ap) {
      localStorage.setItem('AP', ap);
    } else {
      console.warn('AP parameter is missing or null');
    }

    if (id) {
      localStorage.setItem('MACADDR', id);
    } else {
      console.warn('ID parameter is missing or null');
    }

    if (ssid) {
      localStorage.setItem('SSID', ssid);
    } else {
      console.warn('SSID parameter is missing or null');
    }
  }, []);

  return {
    ap: localStorage.getItem('AP'),
    id: localStorage.getItem('MACADDR'),
    ssid: localStorage.getItem('SSID'),
  };
}

interface TranslationProps {
  t: (key: string) => string;
}

const Header: React.FC<TranslationProps> = ({ t }) => (
  <div className='text-center'>
    <img className='mx-auto h-16 rounded-lg' src='/@avatar.jpg' alt='logo' />
    <h1 className='mt-4 text-2xl font-semibold'>{t('auth.login.title')}</h1>
    <p className='mt-2 text-gray-600'>{t('auth.login.description')}</p>
  </div>
);

interface PhoneNumberInputProps extends TranslationProps {
  phone: string;
  onPhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phone,
  onPhoneChange,
  t,
}) => (
  <div>
    <Label htmlFor='phone'>{t('auth.phone_number')}</Label>
    <Input
      id='phone'
      placeholder='+998'
      required
      type='tel'
      value={phone}
      onChange={onPhoneChange}
    />
  </div>
);

const Footer: React.FC<TranslationProps> = ({ t }) => (
  <div className='mt-6 text-center text-sm text-gray-600'>
    <p>
      {t('legal.using_site_agreement')}{' '}
      <Dialog>
        <DialogTrigger>{t('legal.terms_of_use')}</DialogTrigger>
        {/* <TermsOfUse /> */}
      </Dialog>{' '}
      {t('legal.and')}{' '}
      <Dialog>
        <DialogTrigger className='text-blue-500'>
          {t('legal.privacy_policy')}
        </DialogTrigger>
        <PrivacyPolicy />
      </Dialog>
      .
    </p>
    <p className='mt-2'>
      © {new Date().getFullYear()} Fetg.uz {t('footer.copyright')}
    </p>
    <div className='mt-[1rem] flex justify-center items-baseline'>
      <div className='me-3'>{t('change_language')}:</div> <LanguageSwitcher />
    </div>
  </div>
);
