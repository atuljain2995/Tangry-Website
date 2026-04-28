'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface KeywordChipsInputProps {
  id?: string;
  value: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function normalizeKeyword(keyword: string): string {
  return keyword.trim().replace(/\s+/g, ' ');
}

function dedupeKeywords(keywords: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of keywords) {
    const normalized = normalizeKeyword(item);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export function KeywordChipsInput({
  id,
  value,
  onChange,
  placeholder = 'Type a keyword and press comma',
  disabled,
}: KeywordChipsInputProps) {
  const [draft, setDraft] = useState('');

  const commitDraft = () => {
    if (!draft.trim()) return;
    const additions = draft
      .split(',')
      .map(normalizeKeyword)
      .filter(Boolean);
    if (additions.length === 0) {
      setDraft('');
      return;
    }
    onChange(dedupeKeywords([...value, ...additions]));
    setDraft('');
  };

  const removeKeyword = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full rounded border border-gray-300 bg-white px-2 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((keyword, index) => (
          <span
            key={`${keyword}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-800"
          >
            {keyword}
            <button
              type="button"
              onClick={() => removeKeyword(index)}
              disabled={disabled}
              className="rounded p-0.5 text-orange-700 transition-colors hover:bg-orange-200 hover:text-orange-900 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Remove keyword ${keyword}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => {
            const next = e.target.value;
            if (next.includes(',')) {
              const parts = next.split(',');
              const complete = parts.slice(0, -1).map(normalizeKeyword).filter(Boolean);
              if (complete.length > 0) {
                onChange(dedupeKeywords([...value, ...complete]));
              }
              setDraft(parts[parts.length - 1] ?? '');
              return;
            }
            setDraft(next);
          }}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commitDraft();
              return;
            }
            if (e.key === 'Backspace' && draft.length === 0 && value.length > 0) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
