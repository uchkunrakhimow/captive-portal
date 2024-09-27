import { Card } from '@/components/ui/card';
import { OtpForm } from './components/otp-form';
import { useTranslation } from 'react-i18next';

export default function otp() {
  const { t } = useTranslation();

  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <Card className='p-6'>
          <div className='mb-[1rem] flex flex-col space-y-2 text-left'>
            <h1 className='text-md font-semibold tracking-tight'>
              {t('auth.otp.title')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('auth.otp.description')}
            </p>
          </div>
          <OtpForm />
        </Card>
      </div>
    </div>
  );
}
