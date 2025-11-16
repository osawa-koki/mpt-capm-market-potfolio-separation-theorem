'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface IndividualAsset {
  id: string // 一意のID
  name: string // 資産名
  expectedReturn: number // 期待リターン (%)
  risk: number // リスク - 標準偏差 (%)
}

export interface InvestmentSettings {
  riskFreeRate: number // リスクフリーレート (%)
  correlationCoefficient: number // 資産間の相関係数 (-1 to 1)
  assets: IndividualAsset[] // 個別資産の配列
}

const DEFAULT_RISK_FREE_RATE = 0.5
const DEFAULT_CORRELATION_COEFFICIENT = 0.3

// デフォルト資産の定数
const ASSET_A_RETURN = 8.0
const ASSET_A_RISK = 15.0
const ASSET_B_RETURN = 10.0
const ASSET_B_RISK = 20.0
const ASSET_C_RETURN = 6.0
const ASSET_C_RISK = 12.0
const ASSET_D_RETURN = 12.0
const ASSET_D_RISK = 25.0
const ASSET_E_RETURN = 7.0
const ASSET_E_RISK = 16.0

// デフォルトの個別資産（5つ）
const createDefaultAssets = (): IndividualAsset[] => [
  { id: '1', name: '資産A', expectedReturn: ASSET_A_RETURN, risk: ASSET_A_RISK },
  { id: '2', name: '資産B', expectedReturn: ASSET_B_RETURN, risk: ASSET_B_RISK },
  { id: '3', name: '資産C', expectedReturn: ASSET_C_RETURN, risk: ASSET_C_RISK },
  { id: '4', name: '資産D', expectedReturn: ASSET_D_RETURN, risk: ASSET_D_RISK },
  { id: '5', name: '資産E', expectedReturn: ASSET_E_RETURN, risk: ASSET_E_RISK }
]

export const defaultSettings: InvestmentSettings = {
  riskFreeRate: DEFAULT_RISK_FREE_RATE,
  correlationCoefficient: DEFAULT_CORRELATION_COEFFICIENT,
  assets: createDefaultAssets()
}

interface SettingsContextType {
  settings: InvestmentSettings
  updateSettings: (newSettings: Partial<InvestmentSettings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'mpt-capm-settings'

export function SettingsProvider ({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [settings, setSettings] = useState<InvestmentSettings>(defaultSettings)

  // 初回マウント時にlocalStorageから設定を読み込む
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      return
    }

    try {
      const parsed: unknown = JSON.parse(stored)
      setSettings(parsed as InvestmentSettings)
    } catch {
      // 設定のパースに失敗した場合はデフォルトを使用
    }
  }, [])

  const updateSettings = useCallback((newSettings: Partial<InvestmentSettings>): void => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      // localStorageに保存（丸め処理は呼び出し側で実施済み）
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }, [])

  const resetSettings = useCallback((): void => {
    setSettings(defaultSettings)
    // localStorageから削除
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const contextValue = { settings, updateSettings, resetSettings }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings (): SettingsContextType {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
