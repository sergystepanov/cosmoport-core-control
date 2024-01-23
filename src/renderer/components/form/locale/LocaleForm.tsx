import React from 'react';

import { Classes } from '@blueprintjs/core';

type Props = {
  code?: string;
  description?: string;
  onChange?: (code: string | null, description: string | null) => void;
};

export default function LocaleForm({
  code = '',
  description = '',
  onChange = () => {},
}: Props) {
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    onChange(input.value, null);
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target;
    onChange(null, input.value);
  };

  return (
    <div>
      <label htmlFor="code" className={`${Classes.LABEL} ${Classes.INLINE}`}>
        <span>Code</span>
        <input
          id="code"
          name="code"
          className={Classes.INPUT}
          type="text"
          placeholder="The locale code (two letters)"
          dir="auto"
          value={code}
          onChange={handleCodeChange}
        />
      </label>
      <label htmlFor="desc" className={`${Classes.LABEL} ${Classes.INLINE}`}>
        <span>Description</span>
        <input
          id="desc"
          name="description"
          className={`${Classes.INPUT} ${Classes.INLINE}`}
          type="text"
          placeholder="Locale description"
          dir="auto"
          value={description}
          onChange={handleDescriptionChange}
        />
      </label>
    </div>
  );
}
