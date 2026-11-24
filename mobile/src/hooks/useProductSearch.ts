import { useEffect, useState } from 'react';
import { productRepository } from '../services';
import type { Product } from '../types/product';

export const MIN_QUERY_LENGTH = 2;

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Lance la recherche quand `query` change, c'est-à-dire quand l'utilisateur valide
 * (bouton ou touche Entrée). On ne cherche plus à chaque frappe : l'API Open Food Facts
 * limite le nombre de recherches par minute.
 */
export function useProductSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
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
      .search(query)
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
  }, [query, retryKey]);

  return {
    results,
    status,
    error,
    retry: () => setRetryKey((k) => k + 1),
  };
}
