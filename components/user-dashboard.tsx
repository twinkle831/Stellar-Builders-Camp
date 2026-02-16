"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import {
  Wallet,
  Ticket,
  Clock,
  TrendingUp,
  History,
  ExternalLink,
  Copy,
  CheckCircle2,
  LogOut,
} from "lucide-react"
import { useWallet, truncateAddress } from "@/context/wallet-context"
import {
  getDeposits,
  subscribe,
  getTotalDeposited,
  getTotalTickets,
  type DepositEntry,
} from "@/lib/deposit-store"
import { pools, formatCountdown } from "@/lib/pool-data"

function useDeposits() {
  return useSyncExternalStore(subscribe, getDeposits, getDeposits)
}

export function UserDashboard() {
  const { address, balance, network, disconnect } = useWallet()
  const deposits = useDeposits()
  const [copied, setCopied] = useState(false)
  const [countdowns, setCountdowns] = useState<Record<string, string>>({})

  useEffect(() => {
    function tick() {
      const next: Record<string, string> = {}
      pools.forEach((p) => {
        next[p.id] = formatCountdown(p.drawTime)
      })
      setCountdowns(next)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  function copyAddress() {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalDeposited = getTotalDeposited()
  const totalTickets = getTotalTickets()

  // Find the next upcoming draw
  const nextDraw = pools.reduce((closest, p) =>
    p.drawTime < closest.drawTime ? p : closest
  )

  return (
    <div className="space-y-6">
      {/* Wallet card */}
      <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-semibold text-foreground">
                  {address ? truncateAddress(address) : ""}
                </p>
                <button
                  onClick={copyAddress}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{network}</p>
            </div>
          </div>
          <button
            onClick={disconnect}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Disconnect
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Wallet className="h-3.5 w-3.5" />
            Balance
          </div>
          <p className="font-display text-xl font-bold text-foreground">{balance} USDC</p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Total Deposited
          </div>
          <p className="font-display text-xl font-bold text-foreground">
            ${totalDeposited.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Ticket className="h-3.5 w-3.5" />
            Total Tickets
          </div>
          <p className="font-display text-xl font-bold text-accent">
            {totalTickets.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="h-3.5 w-3.5" />
            Next Draw
          </div>
          <p className="font-display text-lg font-bold text-foreground">
            {countdowns[nextDraw.id] ?? "--"}
          </p>
          <p className="text-xs text-muted-foreground">{nextDraw.name}</p>
        </div>
      </div>

      {/* Entry history */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-accent" />
            <h3 className="font-display text-sm font-bold text-foreground">Entry History</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {deposits.length} {deposits.length === 1 ? "entry" : "entries"}
          </span>
        </div>

        {deposits.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Ticket className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No deposits yet. Choose a pool above to make your first entry.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {deposits.map((entry) => (
              <DepositRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DepositRow({ entry }: { entry: DepositEntry }) {
  const timeAgo = getTimeAgo(entry.timestamp)
  return (
    <div className="group flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/20">
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <Ticket className="h-4 w-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            ${entry.amount.toLocaleString()} USDC
          </p>
          <p className="text-xs text-muted-foreground">{entry.poolName}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">
            {entry.tickets.toLocaleString()} tickets
          </p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
            <CheckCircle2 className="h-3 w-3" />
            {entry.status}
          </span>
          <a
            href="#"
            className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
            aria-label="View on explorer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
