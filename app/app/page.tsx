"use client"

import { useState } from "react"
import { useWallet } from "@/context/wallet-context"
import { AppPoolCards } from "@/components/app-pool-cards"
import { DepositModal } from "@/components/deposit-modal"
import { UserDashboard } from "@/components/user-dashboard"
import { ConnectWalletModal } from "@/components/connect-wallet-modal"
import { AppNavbar } from "@/components/app-navbar"
import { pools, type Pool } from "@/lib/pool-data"
import { Wallet, ArrowRight } from "lucide-react"

type Tab = "pools" | "dashboard"

export default function AppPage() {
  const { isConnected } = useWallet()
  const [tab, setTab] = useState<Tab>("pools")
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [depositPool, setDepositPool] = useState<Pool | null>(null)
  const [depositModalOpen, setDepositModalOpen] = useState(false)

  function handleDeposit(pool: Pool) {
    if (!isConnected) {
      setWalletModalOpen(true)
      return
    }
    setDepositPool(pool)
    setDepositModalOpen(true)
  }

  function handleDepositSuccess() {
    setTab("dashboard")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNavbar
        onConnectWallet={() => setWalletModalOpen(true)}
        activeTab={tab}
        onTabChange={setTab}
      />

      {/* Background accent */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 30% at 50% 0%, rgba(52, 211, 153, 0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <main className="relative mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tab === "pools" ? "Prize Pools" : "Your Dashboard"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {tab === "pools"
              ? "Select a pool, deposit USDC, and start earning tickets for the next draw."
              : "Track your deposits, tickets, and upcoming draws."}
          </p>
        </div>

        {/* Not connected prompt */}
        {!isConnected && tab === "dashboard" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
              <Wallet className="h-10 w-10 text-accent" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Connect Your Wallet
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Connect your Stellar wallet to view your dashboard, track deposits,
              and monitor upcoming prize draws.
            </p>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="mt-8 flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
            >
              Connect Wallet
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Pools tab */}
        {tab === "pools" && (
          <AppPoolCards pools={pools} onDeposit={handleDeposit} />
        )}

        {/* Dashboard tab */}
        {tab === "dashboard" && isConnected && <UserDashboard />}
      </main>

      {/* Modals */}
      <ConnectWalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
      <DepositModal
        pool={depositPool}
        open={depositModalOpen}
        onClose={() => {
          setDepositModalOpen(false)
          setDepositPool(null)
        }}
        onSuccess={handleDepositSuccess}
      />
    </div>
  )
}
