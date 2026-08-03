import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '@services/apiClient'
import type { Account, Position, Trade, Order } from '@/types'

/**
 * Custom hook to fetch accounts
 */
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getAccounts()
        setAccounts(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  return { accounts, loading, error }
}

/**
 * Custom hook to fetch positions
 */
export const usePositions = (accountId: string) => {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountId) return

    const fetchPositions = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getPositions(accountId)
        setPositions(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchPositions()
    const interval = setInterval(fetchPositions, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [accountId])

  return { positions, loading, error }
}

/**
 * Custom hook to fetch trades
 */
export const useTrades = (accountId: string) => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountId) return

    const fetchTrades = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getTrades(accountId)
        setTrades(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [accountId])

  return { trades, loading, error }
}

/**
 * Custom hook to manage orders
 */
export const useOrders = (accountId: string) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!accountId) return

    try {
      setLoading(true)
      const data = await apiClient.getOrders(accountId)
      setOrders(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [accountId])

  const placeOrder = useCallback(
    async (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
      try {
        const newOrder = await apiClient.placeOrder(accountId, orderData)
        setOrders([...orders, newOrder])
        return newOrder
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [accountId, orders]
  )

  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        await apiClient.cancelOrder(accountId, orderId)
        setOrders(orders.filter((o) => o.id !== orderId))
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [accountId, orders]
  )

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, placeOrder, cancelOrder, refetch: fetchOrders }
}

/**
 * Custom hook for debounced state
 */
export const useDebouncedState = <T,>(initialValue: T, delay: number = 500): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(initialValue)
  const [debouncedState, setDebouncedState] = useState<T>(initialValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(state)
    }, delay)

    return () => clearTimeout(timer)
  }, [state, delay])

  return [debouncedState, setState]
}

/**
 * Custom hook for local storage
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Custom hook for previous value
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
