'use client';

import { useState } from 'react';

export default function CopyButton({ value }: { value: string }) {
  const [label, setLabel] = useState('Copy');

  const done = (text: string) => {
    setLabel(text);
    setTimeout(() => setLabel('Copy'), 1700);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      done('Copied');
    } catch {
      done('Select it');
    }
  };

  return (
    <button className="copy" type="button" data-hover onClick={copy}>
      {label}
    </button>
  );
}
