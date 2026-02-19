"use client"

/**
 * context/wallet-context.tsx
 *
 * Drop-in replacement for your existing wallet-context.
 *
 * Preserves EVERY field your existing code uses:
 *   address, isConnected, isConnecting, balance, network
 *   connect(), disconnect()
 *
 * Added (used by ConnectWalletModal):
 *   walletType         — "freighter" | "xbull" | null
 *   setConnection()    — called after real wallet connects
 *   networkPassphrase  — full Stellar passphrase string
 *
 * The existing `connect()` now calls the modal-based flow if invoked directly,
 * but the primary path is: modal → setConnection().
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { WalletType, WalletConnection } from "@/lib/wallet-connectors"

// ─── State shape ──────────────────────────────────────────────────────────────

export interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  balance: string
  /** Human-readable network label shown in UI, e.g. "Stellar Testnet" */
  network: string
  /** Full Stellar network passphrase (used when signing transactions) */
  networkPassphrase: string
  /** Which wallet extension is connected */
  walletType: WalletType | null
}

interface WalletContextType extends WalletState {
  /** Legacy: opens the connect modal (set via openConnectModal prop or no-op) */
  connect: () => Promise<void>
  disconnect: () => void
  /**
   * Called by ConnectWalletModal after real wallet extension approves.
   * Updates all state and persists to sessionStorage.
   */
  setConnection: (conn: WalletConnection & { balance?: string }) => void
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_STATE: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  balance: "0",
  network: "Stellar Testnet",
  networkPassphrase: "Test SDF Network ; September 2015",
  walletType: null,
}

// ─── Context ──────────────────────────────────────────────────────────────────

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function networkLabel(passphrase: string): string {
  if (passphrase.includes("Public Global")) return "Stellar Mainnet"
  if (passphrase.includes("Test SDF"))      return "Stellar Testnet"
  return "Stellar Network"
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const SS_KEY = "luckystake_wallet"

function loadSession(): Partial<WalletState> | null {
  try {
    const raw = globalThis?.sessionStorage?.getItem(SS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveSession(state: Partial<WalletState>) {
  try {
    globalThis?.sessionStorage?.setItem(SS_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

function clearSession() {
  try {
    globalThis?.sessionStorage?.removeItem(SS_KEY)
  } catch { /* ignore */ }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_STATE)

  // Restore session on mount
  useEffect(() => {
    const saved = loadSession()
    if (saved?.address) {
      setWallet({
        ...DEFAULT_STATE,
        address: saved.address,
        isConnected: true,
        balance: saved.balance ?? "0",
        network: saved.network ?? DEFAULT_STATE.network,
        networkPassphrase: saved.networkPassphrase ?? DEFAULT_STATE.networkPassphrase,
        walletType: (saved.walletType as WalletType) ?? null,
      })
    }
  }, [])

  /**
   * setConnection — called by ConnectWalletModal after real wallet approves.
   * `conn` comes from wallet-connectors.ts connectWallet().
   */
  const setConnection = useCallback(
    (conn: WalletConnection & { balance?: string }) => {
      const label = networkLabel(conn.network)
      const newState: WalletState = {
        address: conn.address,
        isConnected: true,
        isConnecting: false,
        balance: conn.balance ?? "0",      // balance fetched separately via Horizon
        network: label,
        networkPassphrase: conn.network,
        walletType: conn.walletType,
      }
      setWallet(newState)
      saveSession(newState)
    },
    []
  )

  /**
   * connect — legacy function kept for backward compatibility.
   * If your existing buttons call `connect()` directly, this now does nothing
   * (the modal handles the real flow). You can wire this to open the modal
   * by passing an `onOpenModal` callback, or just leave buttons calling the
   * modal's open state directly.
   *
   * During development you can keep the old simulated flow uncommented below.
   */
  const connect = useCallback(async () => {
    // ── Option A: No-op (modal handles everything) ────────────────────────
    // Just open the modal from wherever connect() is called.
    // Do nothing here — the ConnectWalletModal calls setConnection() itself.
    console.warn(
      "[WalletContext] connect() called directly. " +
      "Open <ConnectWalletModal> instead to let the user pick Freighter or xBull."
    )
  }, [])

  const disconnect = useCallback(() => {
    setWallet(DEFAULT_STATE)
    clearSession()
  }, [])

  return (
    <WalletContext.Provider value={{ ...wallet, connect, disconnect, setConnection }}>
      {children}
    </WalletContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>")
  return ctx
}

export { truncateAddress }