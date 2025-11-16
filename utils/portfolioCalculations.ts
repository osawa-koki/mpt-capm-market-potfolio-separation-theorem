// MPT/CAPM用のポートフォリオ計算ユーティリティ

export interface PortfolioPoint {
  risk: number // 標準偏差 (%)
  return: number // 期待リターン (%)
}

export interface Asset {
  expectedReturn: number // 期待リターン (%)
  risk: number // リスク - 標準偏差 (%)
}


/**
 * 2資産の効率的フロンティアを計算
 * @param asset1 - 資産1
 * @param asset2 - 資産2
 * @param correlation - 相関係数
 * @param points - 生成するポイント数
 * @returns 効率的フロンティアのポイント配列
 */
const DEFAULT_POINTS = 100
const ZERO = 0
const ONE = 1
const TWO = 2
const TEN = 10

export function calculateEfficientFrontier (
  asset1: Asset,
  asset2: Asset,
  correlation: number,
  points = DEFAULT_POINTS
): PortfolioPoint[] {
  const portfolios: PortfolioPoint[] = []

  for (let i = ZERO; i <= points; i += ONE) {
    // 資産1の重み (0から1まで)
    const w1 = i / points
    const w2 = ONE - w1

    // ポートフォリオの期待リターン
    const portfolioReturn = w1 * asset1.expectedReturn + w2 * asset2.expectedReturn

    // ポートフォリオのリスク（分散）
    const variance =
      w1 * w1 * asset1.risk * asset1.risk +
      w2 * w2 * asset2.risk * asset2.risk +
      TWO * w1 * w2 * asset1.risk * asset2.risk * correlation

    // リスク（標準偏差）
    const portfolioRisk = Math.sqrt(variance)

    portfolios.push({
      risk: portfolioRisk,
      return: portfolioReturn
    })
  }

  return portfolios
}

/**
 * 複数資産の効率的フロンティアを計算（簡略版）
 * @param assets - 資産配列
 * @param correlation - 資産間の平均相関係数
 * @param points - 生成するポイント数
 * @returns 効率的フロンティアのポイント配列
 */
// eslint-disable-next-line complexity -- Monte Carlo simulation requires iterative random generation
export function calculateMultiAssetEfficientFrontier (
  assets: Asset[],
  correlation: number,
  points = DEFAULT_POINTS
): PortfolioPoint[] {
  if (assets.length === ZERO) {
    return []
  }

  if (assets.length === ONE) {
    const [firstAsset] = assets
    return [{
      risk: firstAsset.risk,
      return: firstAsset.expectedReturn
    }]
  }

  if (assets.length === TWO) {
    const [asset1, asset2] = assets
    return calculateEfficientFrontier(asset1, asset2, correlation, points)
  }

  // 3資産以上の場合は簡略化したアプローチを使用
  const portfolios: PortfolioPoint[] = []
  const { length: numAssets } = assets

  // ランダムなポートフォリオを生成
  for (let i = ZERO; i < points * TEN; i += ONE) {
    // ランダムな重みを生成（合計が1になるように）
    const weights: number[] = []
    let sum = ZERO

    for (let j = ZERO; j < numAssets - ONE; j += ONE) {
      const weight = Math.random()
      weights.push(weight)
      sum += weight
    }

    // 最後の重みを調整して合計を1にする
    const normalizedWeights = weights.map(w => w / (sum + ONE))
    normalizedWeights.push(ONE / (sum + ONE))

    // ポートフォリオの期待リターンを計算
    const portfolioReturn = assets.reduce((acc, asset, idx) =>
      acc + normalizedWeights[idx] * asset.expectedReturn, ZERO)

    // ポートフォリオのリスクを計算
    let variance = ZERO

    for (let j = ZERO; j < numAssets; j += ONE) {
      // 自己分散項
      variance += normalizedWeights[j] * normalizedWeights[j] * assets[j].risk * assets[j].risk

      // 共分散項
      for (let k = j + ONE; k < numAssets; k += ONE) {
        variance += TWO * normalizedWeights[j] * normalizedWeights[k] *
                    assets[j].risk * assets[k].risk * correlation
      }
    }

    const portfolioRisk = Math.sqrt(variance)

    portfolios.push({
      risk: portfolioRisk,
      return: portfolioReturn
    })
  }

  // 効率的フロンティアのみを抽出
  // 各リスクレベルで最大のリターンを持つポートフォリオを選択
  const sortedPortfolios = [...portfolios].sort((a, b) => a.risk - b.risk)

  const efficientFrontier: PortfolioPoint[] = []
  let maxReturn = -Infinity

  for (const portfolio of sortedPortfolios) {
    const { return: portfolioReturn } = portfolio
    if (portfolioReturn > maxReturn) {
      efficientFrontier.push(portfolio)
      maxReturn = portfolioReturn
    }
  }

  return efficientFrontier
}

/**
 * 資本市場線（CML）上のポイントを計算
 * @param params - CML計算パラメータ
 * @returns CML上のポイント配列
 */
export function calculateCapitalMarketLine (params: {
  riskFreeRate: number
  marketReturn: number
  marketRisk: number
  maxRisk: number
  points?: number
}): PortfolioPoint[] {
  const { riskFreeRate, marketReturn, marketRisk, maxRisk, points = DEFAULT_POINTS } = params
  const cmlPoints: PortfolioPoint[] = []

  for (let i = ZERO; i <= points; i += ONE) {
    const risk = (i / points) * maxRisk
    const expectedReturn = riskFreeRate + (marketReturn - riskFreeRate) * (risk / marketRisk)

    cmlPoints.push({
      risk,
      return: expectedReturn
    })
  }

  return cmlPoints
}

/**
 * マーケットポートフォリオを計算
 * @param riskFreeRate - リスクフリーレート (%)
 * @param efficientFrontier - 効率的フロンティア
 * @returns マーケットポートフォリオのポイント（シャープレシオが最大の点）
 */
export function findMarketPortfolio (
  riskFreeRate: number,
  efficientFrontier: PortfolioPoint[]
): PortfolioPoint | null {
  if (efficientFrontier.length === ZERO) {
    return null
  }

  let maxSharpeRatio = -Infinity
  let marketPortfolio: PortfolioPoint | null = null

  for (const point of efficientFrontier) {
    if (point.risk === ZERO) continue

    // シャープレシオを計算
    const sharpeRatio = (point.return - riskFreeRate) / point.risk

    if (sharpeRatio > maxSharpeRatio) {
      maxSharpeRatio = sharpeRatio
      marketPortfolio = point
    }
  }

  return marketPortfolio
}

/**
 * シャープレシオを計算
 * @param expectedReturn - 期待リターン (%)
 * @param riskFreeRate - リスクフリーレート (%)
 * @param risk - リスク - 標準偏差 (%)
 * @returns シャープレシオ
 */
export function calculateSharpeRatio (
  expectedReturn: number,
  riskFreeRate: number,
  risk: number
): number {
  if (risk === ZERO) return ZERO
  return (expectedReturn - riskFreeRate) / risk
}
