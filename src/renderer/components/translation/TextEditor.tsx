import { EditableText } from '@blueprintjs/core';

type Props = {
  id: number;
  text: string;
  onConfirm: (id: number, value: string, old: string) => void;
};

export default function TextEditor({
  id = 0,
  text = '',
  onConfirm = () => {},
}: Props) {
  const handleConfirm = (value: string) => {
    onConfirm(id, value, text);
  };

  return (
    <EditableText
      multiline
      minLines={3}
      maxLines={12}
      defaultValue={text}
      onConfirm={handleConfirm}
    />
  );
}
