export function generateAccountNumber(): string {
  return `${Math.floor(1000000000 + Math.random() * 9000000000)}`
}

export function generateRoutingNumber(): string {
  return `${Math.floor(100000000 + Math.random() * 900000000)}`
}
