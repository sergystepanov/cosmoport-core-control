import { EditableText } from '@blueprintjs/core';

type Props = {
  id: number;
  text: string;
  className?: string;
  onConfirm: (id: number, o: string, n: string) => void;
};

export default function TextValueEditor({
  id,
  text,
  className,
  onConfirm,
}: Props) {
  const onConfirm_ = (val: string) => {
    onConfirm(id, val, text);
  };

  return (
    <EditableText
      className={className}
      placeholder=""
      selectAllOnFocus
      defaultValue={text}
      onConfirm={onConfirm_}
    />
  );
}
