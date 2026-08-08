'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

type RatingRow = {
  id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type ApiResponse = { average: number; count: number; ratings: RatingRow[] };

/** The endpoint can return an error object, so never trust its shape. */
function normalise(raw: unknown): ApiResponse {
  const obj = (raw ?? {}) as Partial<ApiResponse>;
  return {
    average: Number(obj.average) || 0,
    count: Number(obj.count) || 0,
    ratings: Array.isArray(obj.ratings) ? obj.ratings : [],
  };
}

function Stars({
  value,
  size = 'sm',
  onSelect,
  hovered,
  onHover,
}: {
  value: number;
  size?: 'sm' | 'lg';
  onSelect?: (value: number) => void;
  hovered?: number;
  onHover?: (value: number) => void;
}) {
  const cls = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  const active = hovered ?? value;

  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        const star = (
          <Star
            className={`${cls} ${filled ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
            aria-hidden="true"
          />
        );
        return onSelect ? (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            onMouseEnter={() => onHover?.(n)}
            onMouseLeave={() => onHover?.(0)}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            className="p-0.5 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </span>
  );
}

export function RecipeRating({ slug }: { slug: string }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [myRating, setMyRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/recipe-ratings?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => !cancelled && setData(normalise(json)))
      .catch(() => !cancelled && setData(normalise(null)));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function submit() {
    if (!myRating) return;
    setStatus('saving');
    setMessage('');

    const res = await fetch('/api/recipe-ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, rating: myRating, comment }),
    });

    if (res.ok) {
      setStatus('done');
      setMessage('Thanks for rating this recipe.');
      const refreshed = await fetch(`/api/recipe-ratings?slug=${encodeURIComponent(slug)}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
      setData(normalise(refreshed));
    } else {
      const json = await res.json().catch(() => ({}));
      setStatus('error');
      setMessage(json.error ?? 'Could not save your rating.');
    }
  }

  return (
    <section id="ratings" className="scroll-mt-24 mb-10 print:hidden">
      <h2 className="text-xl font-semibold text-neutral-900 mb-3">Ratings</h2>

      {data && data.count > 0 ? (
        <div className="flex items-center gap-2 mb-4">
          <Stars value={Math.round(data.average)} />
          <span className="text-sm text-neutral-700 font-medium">{data.average.toFixed(1)}</span>
          <span className="text-sm text-neutral-500">
            ({data.count} rating{data.count === 1 ? '' : 's'})
          </span>
        </div>
      ) : (
        <p className="text-sm text-neutral-500 mb-4">
          No ratings yet — be the first to rate this recipe.
        </p>
      )}

      {status === 'done' ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          {message}
        </p>
      ) : (
        <div className="border border-neutral-200 bg-white rounded-xl p-4">
          <p className="text-sm font-medium text-neutral-800 mb-2">Tried this recipe?</p>
          <Stars
            value={myRating}
            size="lg"
            onSelect={setMyRating}
            hovered={hovered || undefined}
            onHover={setHovered}
          />
          {myRating > 0 && (
            <>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1500}
                placeholder="How did it turn out? (optional)"
                className="mt-3 w-full text-sm border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={submit}
                disabled={status === 'saving'}
                className="mt-2 bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-800 disabled:opacity-60 transition-colors"
              >
                {status === 'saving' ? 'Saving…' : 'Submit rating'}
              </button>
            </>
          )}
          {status === 'error' && <p className="mt-2 text-sm text-red-700">{message}</p>}
        </div>
      )}

      {data && data.ratings.length > 0 && data.ratings.some((r) => r.comment) && (
        <ul className="mt-5 space-y-4">
          {data.ratings
            .filter((r) => r.comment)
            .map((r) => (
              <li key={r.id} className="border-b border-neutral-200 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <Stars value={r.rating} />
                  <span className="text-sm font-medium text-neutral-800">{r.user_name}</span>
                </div>
                <p className="text-sm text-neutral-600 leading-6">{r.comment}</p>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
