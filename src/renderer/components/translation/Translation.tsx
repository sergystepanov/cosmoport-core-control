import { Button } from '@blueprintjs/core';
import { LocaleDescriptionType } from '../../types/Types';

type Props = {
  locale: LocaleDescriptionType;
  onLocaleSelect: (id: number) => void;
};

export default function Translation({ locale, onLocaleSelect }: Props) {
  const handleSelect = () => {
    onLocaleSelect(locale.id);
  };

  return (
    <Button
      key={locale.id}
      minimal
      text={`${locale.code} (${locale.localeDescription})`}
      onClick={handleSelect}
    />
  );
}
