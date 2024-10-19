import { useTranslation } from 'react-i18next';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t('legal.privacy_policy_details.title')}</DialogTitle>
        <DialogDescription>
          {t('legal.privacy_policy_details.description')}
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default PrivacyPolicy;
