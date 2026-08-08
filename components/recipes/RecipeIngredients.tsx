'use client';

import { useMemo, useState } from 'react';
import { Printer, Check } from 'lucide-react';
import { scaleIngredient } from '@/lib/utils/recipe-scale';
import type { RecipeIngredientGroup } from '@/lib/data/recipes';

const MULTIPLIERS = [
  { label: '½×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '3×', value: 3 },
];

type Props = {
  ingredients: string[];
  groups?: RecipeIngredientGroup[];
  baseServings: number;
};

export function RecipeIngredients({ ingredients, groups, baseServings }: Props) {
  const [multiplier, setMultiplier] = useState(1);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const resolvedGroups = useMemo<RecipeIngredientGroup[]>(
    () => groups?.length ? groups : [{ items: ingredients }],
    [groups, ingredients],
  );

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Ingredients</h2>

        <div className="flex items-center gap-2 print:hidden">
          <span className="text-xs text-neutral-500">Servings</span>
          <div className="inline-flex rounded-lg border border-neutral-300 overflow-hidden">
            {MULTIPLIERS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMultiplier(m.value)}
                aria-pressed={multiplier === m.value}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  multiplier === m.value
                    ? 'bg-red-700 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-neutral-500">
            = {Math.round(baseServings * multiplier)} serving
            {Math.round(baseServings * multiplier) === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <p className="text-xs text-neutral-400 mb-3 print:hidden">
        Tap an ingredient to tick it off as you cook.
      </p>

      {resolvedGroups.map((group, gi) => (
        <div key={group.title ?? gi} className={gi > 0 ? 'mt-5' : undefined}>
          {group.title && (
            <h3 className="text-sm font-semibold text-neutral-800 mb-2">{group.title}</h3>
          )}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const key = `${gi}-${item}`;
              const isChecked = checked.has(key);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    aria-pressed={isChecked}
                    className="w-full flex items-start gap-2.5 text-left py-1.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 rounded"
                  >
                    <span
                      className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-red-700 border-red-700'
                          : 'border-neutral-300 group-hover:border-red-400'
                      }`}
                      aria-hidden="true"
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-neutral-700 leading-6 transition-colors ${
                        isChecked ? 'line-through text-neutral-400' : ''
                      }`}
                    >
                      {scaleIngredient(item, multiplier)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function PrintRecipeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-red-700 border border-neutral-300 hover:border-red-300 rounded-lg px-3 py-1.5 transition-colors print:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      <Printer className="w-4 h-4" aria-hidden="true" />
      Print
    </button>
  );
}
