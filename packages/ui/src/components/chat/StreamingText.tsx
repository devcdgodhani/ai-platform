import { useEffect, useState } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number; // ms per character — used for replay animations
}

/** Renders text character-by-character for a typewriter effect. */
export function StreamingText({ text, speed = 0 }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState(speed > 0 ? '' : text);

  useEffect(() => {
    if (speed === 0) { setDisplayed(text); return; }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <span>{displayed}</span>;
}
