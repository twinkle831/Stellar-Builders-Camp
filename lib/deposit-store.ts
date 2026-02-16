export interface DepositEntry {
  id: string
  poolId: string
  poolName: string
  amount: number
  tickets: number
  winProbability: string
  timestamp: Date
  txHash: string
  status: "confirmed" | "pending"
}

// In-memory store (resets on refresh). In production this comes from on-chain.
let deposits: DepositEntry[] = []
let listeners: Array<() => void> = []

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function getDeposits(): DepositEntry[] {
  return [...deposits]
}

export function addDeposit(entry: Omit<DepositEntry, "id" | "txHash" | "status" | "timestamp">) {
  const chars = "abcdef0123456789"
  let hash = "0x"
  for (let i = 0; i < 64; i++) hash += chars[Math.floor(Math.random() * chars.length)]

  deposits = [
    {
      ...entry,
      id: crypto.randomUUID(),
      txHash: hash,
      status: "confirmed",
      timestamp: new Date(),
    },
    ...deposits,
  ]
  notify()
}

export function getTotalDeposited(): number {
  return deposits.reduce((sum, d) => sum + d.amount, 0)
}

export function getTotalTickets(): number {
  return deposits.reduce((sum, d) => sum + d.tickets, 0)
}

export function getDepositsByPool(poolId: string): DepositEntry[] {
  return deposits.filter((d) => d.poolId === poolId)
}
