import { useEffect, useState } from 'react';
import { productRepository } from '../services';
import type { Product } from '../types/product';
import { useDebounce } from './useDebounce';

export const MIN_QUERY_LENGTH = 2;

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useProductSearch(query: string) {
  const debouncedQuery = useDebounce(query.trim(), 300);
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    // Ignore les réponses d'une ancienne recherche arrivées après une plus récente.
    let cancelled = false;
    setStatus('loading');
    setError(null);

    productRepository
      .search(debouncedQuery)
      .then((products) => {
        if (cancelled) return;
        setResults(products);
        setStatus('success');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Erreur inconnue');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, retryKey]);

  return {
    results,
    status,
    error,
    debouncedQuery,
    retry: () => setRetryKey((k) => k + 1),
  };
}
