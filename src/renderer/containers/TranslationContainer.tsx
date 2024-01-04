import { MutableRefObject as Ref, useEffect, useRef, useState } from 'react';
import { Button } from '@blueprintjs/core';

import Message from '../components/messages/Message';
import Translation from '../components/translation/Translation';
import TranslationTable from '../components/translation/TranslationTable';
import LocaleAddDialog from '../components/dialog/LocaleAddDialog';
import { Api } from 'cosmoport-core-api-client';

import { LocaleDescriptionType, TranslationType } from '../types/Types';

import styles from './App.module.css';

type Props = {
  api: Api;
};

type State = {
  locales: LocaleDescriptionType[];
  translations: TranslationType[];
};

export default function TranslationContainer({ api }: Props) {
  const [translation, setTranslation] = useState<State>({
    locales: [],
    translations: [],
  });

  const localeAddDialogRef: Ref<null | LocaleAddDialog> = useRef(null);

  useEffect(() => {
    fetchLocales();
  }, []);

  const fetchLocales = () => {
    api
      .fetchLocales()
      .then((data) => {
        setTranslation({ ...translation, locales: data });
      })
      .catch(console.error);
  };

  const handleLocaleSelect = (locale: number) => {
    api
      .fetchTranslationsForLocale(locale)
      .then((data) => {
        setTranslation({
          ...translation,
          translations: data,
        });
      })
      .catch(console.error);
  };

  const handleTextChange = (
    id: number,
    value: string,
    okCallback: () => void,
    notOkCallback: () => void,
  ) => {
    api
      .updateTranslationTextForId(id, { text: value })
      .then(() =>
        Message.show('Translation value has been saved successfully.'),
      )
      .then(() => updateTranslationStateById(id, value))
      .then(() => okCallback)
      .catch((error) => {
        console.error(error);
        notOkCallback();
      });
  };

  const handleAddClick = () => localeAddDialogRef.current?.toggleDialog();

  const handleLocaleCreate = (data: { code: string; description: string }) => {
    api
      .createLocale({ code: data.code, locale_description: data.description })
      .then(() => {
        Message.show('Locale has been created.');
        localeAddDialogRef.current?.toggleDialog();
        fetchLocales();
      })
      .catch(console.error);
  };

  const updateTranslationStateById = (id: number, value: string) => {
    const ts = translation.translations;
    const i = ts.findIndex((el) => el.id === id);

    if (i > -1) {
      ts[i].text = value;
      setTranslation({ ...translation, translations: ts });
    }
  };

  return (
    <>
      <LocaleAddDialog ref={localeAddDialogRef} callback={handleLocaleCreate} />
      <div className={styles.inlineContainer}>
        {translation.locales.map((locale) => (
          <Translation
            key={locale.id}
            locale={locale}
            onLocaleSelect={handleLocaleSelect}
          />
        ))}
        <Button minimal icon="add" onClick={handleAddClick} />
      </div>
      <TranslationTable
        translations={translation.translations}
        onTextChange={handleTextChange}
      />
    </>
  );
}
