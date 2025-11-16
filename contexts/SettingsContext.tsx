'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface InvestmentSettings {
  riskFreeRate: number // リスクフリーレート (%)
  numberOfAssets: number // シミュレーションに使用する資産数
  correlationCoefficient: number // 資産間の相関係数 (-1 to 1)
  expectedReturn: number // マーケットポートフォリオの期待リターン (%)
  risk: number // マーケットポートフォリオのリスク (標準偏差 %)
}

const DEFAULT_RISK_FREE_RATE = 0.5
const DEFAULT_NUMBER_OF_ASSETS = 2
const DEFAULT_CORRELATION_COEFFICIENT = 0.3
const DEFAULT_EXPECTED_RETURN = 7.5
const DEFAULT_RISK = 18.0

export const defaultSettings: InvestmentSettings = {
  riskFreeRate: DEFAULT_RISK_FREE_RATE,
  numberOfAssets: DEFAULT_NUMBER_OF_ASSETS,
  correlationCoefficient: DEFAULT_CORRELATION_COEFFICIENT,
  expectedReturn: DEFAULT_EXPECTED_RETURN,
  risk: DEFAULT_RISK
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
