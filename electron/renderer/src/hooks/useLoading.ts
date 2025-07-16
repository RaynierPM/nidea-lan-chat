import { useState } from "react";

export function useLoading<T = void, E = Error>(initLoading = false) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(initLoading)
  const [error, setError] = useState<E | null>(null)

  function clear() {
    setData(null)
    setError(null)
  }

  async function execute<Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    ...args: Args
  ):Promise<T> {
    setLoading(true)
    setError(null)
    try {
      const result = await Promise.resolve().then(() => fn(...args))
      setData(result)
      return result
    } catch(error) {
      setError(error as E)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    execute,
    data,
    clear
  }
}