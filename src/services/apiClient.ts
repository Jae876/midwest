import axios, { AxiosInstance } from 'axios'
import type { User, Account, Position, Trade, Order, MarketData } from '@/types'

class APIClient {
  private client: AxiosInstance

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.client.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  }

  async signup(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    accountType?: string
  }): Promise<{ token: string; user: User }> {
    const response = await this.client.post('/auth/signup', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  }

  async verifyToken(): Promise<{ valid: boolean; user: User }> {
    const token = localStorage.getItem('token')
    if (!token) {
      return { valid: false, user: null as any }
    }
    try {
      const response = await this.client.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch {
      localStorage.removeItem('token')
      return { valid: false, user: null as any }
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    accountType: string
  }): Promise<{ token: string; user: User }> {
    return this.signup({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      accountType: data.accountType
    })
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    const response = await this.client.get('/accounts')
    return response.data
  }

  async getAccount(accountId: string): Promise<Account> {
    const response = await this.client.get(`/accounts/${accountId}`)
    return response.data
  }

  // Position endpoints
  async getPositions(accountId: string): Promise<Position[]> {
    const response = await this.client.get(`/accounts/${accountId}/positions`)
    return response.data
  }

  async closePosition(accountId: string, positionId: string): Promise<void> {
    await this.client.delete(`/accounts/${accountId}/positions/${positionId}`)
  }

  // Trade endpoints
  async getTrades(accountId: string): Promise<Trade[]> {
    const response = await this.client.get(`/accounts/${accountId}/trades`)
    return response.data
  }

  async placeTrade(accountId: string, trade: Omit<Trade, 'id' | 'status' | 'timestamp'>): Promise<Trade> {
    const response = await this.client.post(`/accounts/${accountId}/trades`, trade)
    return response.data
  }

  // Order endpoints
  async getOrders(accountId: string): Promise<Order[]> {
    const response = await this.client.get(`/accounts/${accountId}/orders`)
    return response.data
  }

  async placeOrder(accountId: string, order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
    const response = await this.client.post(`/accounts/${accountId}/orders`, order)
    return response.data
  }

  async cancelOrder(accountId: string, orderId: string): Promise<void> {
    await this.client.delete(`/accounts/${accountId}/orders/${orderId}`)
  }

  // Market data endpoints
  async getMarketData(symbol: string): Promise<MarketData> {
    const response = await this.client.get(`/market/quote/${symbol}`)
    return response.data
  }

  async searchSymbols(query: string): Promise<{ symbol: string; name: string }[]> {
    const response = await this.client.get('/market/search', { params: { q: query } })
    return response.data
  }

  async getHistoricalData(symbol: string, period: string = '1mo'): Promise<any[]> {
    const response = await this.client.get(`/market/history/${symbol}`, { params: { period } })
    return response.data
  }
}

export const apiClient = new APIClient(import.meta.env.VITE_API_URL || '/api')
export default APIClient
