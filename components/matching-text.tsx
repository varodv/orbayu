interface Props {
  text: string;
  match?: string;
}

const DIACRITICS_REGEX = /\p{M}/gu;

function normalize(text: string) {
  return text.normalize('NFD').replace(DIACRITICS_REGEX, '').toLowerCase();
}

export function MatchingText({ text, match = '' }: Props) {
  if (!match.trim()) {
    return text;
  }

  const normalizedText = normalize(text);
  const normalizedMatch = normalize(match);
  const index = normalizedText.indexOf(normalizedMatch);
  if (index === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold">{text.slice(index, index + match.length)}</span>
      {text.slice(index + match.length)}
    </>
  );
}
