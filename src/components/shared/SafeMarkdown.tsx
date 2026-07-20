import type { ReactNode } from 'react';

const renderInline = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${index}-${part}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${index}-${part}`}>{part}</span>
    ),
  );
};

export function SafeMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-2 break-words leading-7">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return <div key={`${index}-${line}`} className="flex gap-2 pl-2"><span aria-hidden="true">•</span><p>{renderInline(trimmed.slice(2))}</p></div>;
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\.\s(.*)$/);
          return <div key={`${index}-${line}`} className="flex gap-2 pl-2"><span className="font-bold">{match?.[1]}.</span><p>{renderInline(match?.[2] ?? '')}</p></div>;
        }
        if (trimmed.startsWith('### ')) return <h4 key={`${index}-${line}`} className="pt-2 text-base font-bold">{renderInline(trimmed.slice(4))}</h4>;
        if (trimmed.startsWith('## ')) return <h3 key={`${index}-${line}`} className="pt-2 text-lg font-bold">{renderInline(trimmed.slice(3))}</h3>;
        if (trimmed === '') return <div key={`space-${index}`} className="h-1" />;
        return <p key={`${index}-${line}`}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}
