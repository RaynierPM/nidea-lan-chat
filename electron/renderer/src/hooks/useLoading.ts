import { useState } from "react";

export function useLoading<T = void, E = Error>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<E | null>(null)

  async function executer(
    fn: () => Promise<T>
  ):Promise<void> {
    setLoading(true)
    setError(null)
    try {
      const data = await fn()
      setData(data)
    } catch(error) {
      setError(error as E)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    executer,
    data
  }
}