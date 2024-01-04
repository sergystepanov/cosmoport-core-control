import { Callout, HTMLTable, Tag, Intent } from '@blueprintjs/core';

import TextEditor from './TextEditor';
import { TranslationType } from '../../types/Types';

type Props = {
  translations: TranslationType[];
  onTextChange: (
    id: number,
    value: string,
    ok: () => void,
    fail: () => void,
  ) => void;
};

export default function TranslationTable({
  translations,
  onTextChange,
}: Props) {
  const onSaveOk = () => {
    console.log('ok');
  };

  const onSaveFail = () => {
    console.log('not ok');
  };

  const handleTextChange = (id: number, value: string, oldValue: string) => {
    if (value === oldValue) {
      return;
    }

    onTextChange(id, value, onSaveOk, onSaveFail);
  };

  const records = translations.map((record) => (
    <tr key={record.id}>
      <td>{record.id}</td>
      <td>
        <TextEditor
          id={record.id}
          text={record.text}
          onConfirm={handleTextChange}
        />
      </td>
      <td>{record.i18n?.description}</td>
      <td>
        {record.i18n?.tag ? <Tag minimal>{record.i18n.tag}</Tag> : null}
        {record.i18n?.params ? (
          <Tag intent={Intent.WARNING} minimal>
            {record.i18n.params}
          </Tag>
        ) : null}
        {record.i18n?.external && <Tag minimal>external</Tag>}
      </td>
    </tr>
  ));

  if (translations.length < 1) {
    return (
      <div>
        <p>&nbsp;</p>
        <Callout>Select any locale up above or create new.</Callout>
      </div>
    );
  }

  return (
    <div>
      <HTMLTable compact>
        <thead>
          <tr>
            <th>#</th>
            <th>Text</th>
            <th>Description</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>{records}</tbody>
      </HTMLTable>
    </div>
  );
}
