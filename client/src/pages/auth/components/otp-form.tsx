import { HTMLAttributes, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

interface OtpFormProps extends HTMLAttributes<HTMLDivElement> {}

export function OtpForm({ className, ...props }: OtpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [showResend, setShowResend] = useState(false);
  const { t } = useTranslation();

  const formSchema = z.object({
    otp: z.string().min(1, { message: t('auth.otp.error.enter_code') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: { otp: '' },
  });

  const { phoneNum } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResend(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const resendCode = async () => {
    try {
      await axios.post('/auth/login', {
        phoneNum,
      });
      toast({ title: t('auth.sms.resent_success') });
      setShowResend(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('auth.sms.error.title'),
        description: t('auth.sms.error.description'),
      });
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!data.otp || data.otp.length !== 6) {
      form.setError('otp', { type: 'manual', message: 'Invalid OTP' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/auth/otp', {
        phoneNum,
        otp: data.otp,
      });

      if (response.status === 200) {
        toast({
          title: t('auth.otp.success'),
        });
        window.location.href = 'https://yaponamama.uz/';
      } else {
        toast({
          title: t('auth.otp.invalid'),
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        toast({
          title: t('auth.otp.error.400.title'),
          description: t('auth.otp.error.400.description'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('auth.otp.error.title'),
          description: t('auth.otp.error.description'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={cn('grid gap-6', className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='otp'
                render={({ field }) => (
                  <FormItem className='space-y-1 mx-auto'>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        className='flex h-10 justify-between'
                        onChange={value => {
                          field.onChange(value);
                        }}
                        onComplete={() => {
                          setDisabledBtn(false);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className='mt-2'
                disabled={disabledBtn || isLoading}
                loading={isLoading}
              >
                {t('auth.otp.verify')}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {showResend && (
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          {t('auth.otp.resend_prompt')}{' '}
          <a
            onClick={resendCode}
            className='cursor-pointer underline underline-offset-4 hover:text-primary'
          >
            {t('auth.otp.resend_link')}
          </a>
        </p>
      )}
    </>
  );
}
