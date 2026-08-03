export interface User {
  id: string
  email: string
  name: string
  accountType: 'individual' | 'joint' | 'ira' | 'corporate'
  status: 'active' | 'pending' | 'suspended'
}

export interface Account {
  id: string
  userId: string
  accountNumber: string
  type: string
  balance: number
  buyingPower: number
  cashBalance: number
  marginLevel: number
}

export interface Position {
  id: string
  accountId: string
  symbol: string
  quantity: number
  avgCost: number
  currentPrice: number
  unrealizedPL: number
  unrealizedPLPercent: number
  marketValue: number
}

export interface Trade {
  id: string
  accountId: string
  symbol: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  commission: number
  timestamp: string
  status: 'filled' | 'pending' | 'cancelled'
}

export interface Order {
  id: string
  accountId: string
  symbol: string
  type: 'market' | 'limit' | 'stop' | 'bracket'
  action: 'buy' | 'sell'
  quantity: number
  price?: number
  stopPrice?: number
  timeInForce: 'day' | 'gtc' | 'opg'
  status: 'pending' | 'active' | 'filled' | 'cancelled'
  createdAt: string
}

export interface MarketData {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  change: number
  changePercent: number
  timestamp: string
}
