"use client"

import { useState, useEffect } from "react"
import { Clock, Users, Ticket, TrendingUp, ArrowRight } from "lucide-react"
import { type Pool, formatCountdown } from "@/lib/pool-data"

interface Props {
  pools: Pool[]
  onDeposit: (pool: Pool) => void
}

export function AppPoolCards({ pools, onDeposit }: Props) {
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
  }, [pools])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {pools.map((pool) => (
        <div
          key={pool.id}
          className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ${pool.borderColor} ${
            pool.featured ? "ring-1 ring-accent/20 lg:-mt-2 lg:mb-2" : ""
          }`}
        >
          {/* Hover gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${pool.color} opacity-0 transition-opacity group-hover:opacity-100`}
            aria-hidden="true"
          />

          {pool.featured && (
            <div className="relative bg-accent/10 py-1.5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Most Popular
              </span>
            </div>
          )}

          <div className="relative p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {pool.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{pool.frequency}</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-mono text-accent">
                <Clock className="h-3 w-3" />
                {countdowns[pool.id] ?? "--"}
              </div>
            </div>

            {/* Prize */}
            <div className="mt-6 mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Current Prize
              </p>
              <p className="font-display text-4xl font-bold text-foreground">
                {pool.prizeFormatted}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 rounded-xl bg-secondary/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">TVL</p>
                <p className="font-display text-sm font-bold text-foreground">
                  {pool.tvl}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Players</p>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <p className="font-display text-sm font-bold text-foreground">
                    {pool.participantsFormatted}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">APY</p>
                <p className="font-display text-sm font-bold text-accent">
                  {pool.apy}
                </p>
              </div>
            </div>

            {/* Extra info */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Ticket className="h-3 w-3" />
                {pool.ticketRatio}
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Min ${pool.minDeposit}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onDeposit(pool)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Deposit Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
