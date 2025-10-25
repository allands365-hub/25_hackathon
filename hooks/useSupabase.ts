import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

interface UseSupabaseQueryOptions<T> {
  table: string;
  select?: string;
  filter?: (query: any) => any;
  enabled?: boolean;
}

interface UseSupabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
}

// Hook for querying Supabase data
export function useSupabaseQuery<T = any>({
  table,
  select = '*',
  filter,
  enabled = true,
}: UseSupabaseQueryOptions<T>): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      if (filter) {
        query = filter(query);
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;
      setData(result as T);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [table, select, filter, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}

interface UseSupabaseMutationResult {
  mutate: (data: any) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}

// Hook for inserting data
export function useSupabaseInsert(table: string): UseSupabaseMutationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert([data])
        .select();

      if (insertError) throw insertError;
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

// Hook for updating data
export function useSupabaseUpdate(
  table: string
): UseSupabaseMutationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async ({ id, ...data }: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}

// Hook for deleting data
export function useSupabaseDelete(table: string): UseSupabaseMutationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { success: true };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}
