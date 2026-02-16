"use client"

import { useInView } from "@/hooks/use-in-view"
import { Bot, Sliders, BarChart3, RefreshCw, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Sliders,
    title: "Configure Strategy",
    description:
      "Set investment amount, duration, pool eligibility, and optimization mode in one click.",
  },
  {
    icon: BarChart3,
    title: "Smart Allocation",
    description:
      "AI calculates optimal daily allocation across pools based on real-time odds and APY data.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Reinvest",
    description:
      "Winnings automatically route back to your strategy for compounding returns.",
  },
]

const modes = [
  {
    icon: Zap,
    name: "Max Win Chances",
    desc: "Spread across smaller pools",
  },
  {
    icon: BarChart3,
    name: "Max Prize Amount",
    desc: "Concentrate in monthly pool",
  },
  {
    icon: Shield,
    name: "Balanced Mode",
    desc: "AI-optimized expected value",
  },
]

export function AIAgentSection() {
  const { ref, isInView } = useInView()

  return (
    <section id="ai-agent" className="relative overflow-hidden bg-background py-24 lg:py-32" ref={ref}>
      {/* Subtle bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(52, 211, 153, 0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent transition-all duration-700 ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Bot className="h-4 w-4" />
              AI-Powered Automation
            </div>

            <h2
              className={`font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl transition-all duration-700 delay-100 ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <span className="text-balance">
                Set It.
                <br />
                Forget It.
                <br />
                <span className="text-accent">Win It.</span>
              </span>
            </h2>

            <p
              className={`mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground transition-all duration-700 delay-200 ${
                isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Let our AI agent manage your lottery strategy. It monitors pool stats,
              calculates optimal allocation, and executes entries daily - all from
              a secure escrow contract.
            </p>

            {/* Feature list */}
            <div className="mt-10 flex flex-col gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex gap-4 transition-all duration-700 ${
                    isInView ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: isInView ? `${400 + index * 100}ms` : "0ms" }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Strategy Card Mock */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Bot className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">AI Strategy</h3>
                    <p className="text-xs text-muted-foreground">Active &middot; Day 12 of 30</p>
                  </div>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Running
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>40%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-1000"
                    style={{ width: isInView ? "40%" : "0%" }}
                  />
                </div>
              </div>

              {/* Mock stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Invested</p>
                  <p className="font-display text-lg font-bold text-foreground">$2,000</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Tickets Earned</p>
                  <p className="font-display text-lg font-bold text-foreground">24,000</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Entries Made</p>
                  <p className="font-display text-lg font-bold text-foreground">12</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">Wins</p>
                  <p className="font-display text-lg font-bold text-accent">1</p>
                </div>
              </div>

              {/* Optimization modes */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Optimization Mode</p>
                <div className="flex flex-col gap-2">
                  {modes.map((mode, i) => (
                    <div
                      key={mode.name}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                        i === 2
                          ? "border-accent/30 bg-accent/5"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      <mode.icon className={`h-4 w-4 ${i === 2 ? "text-accent" : "text-muted-foreground"}`} />
                      <div>
                        <p className={`text-sm font-medium ${i === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                          {mode.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{mode.desc}</p>
                      </div>
                      {i === 2 && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-accent" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
