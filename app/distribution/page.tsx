'use client'

import React, { useMemo } from 'react'
import { Container, Card, Row, Col, Alert } from 'react-bootstrap'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Scatter } from 'react-chartjs-2'

import { useSettings } from '@/contexts/SettingsContext'
import {
  calculateMultiAssetEfficientFrontier,
  calculateCapitalMarketLine,
  findMarketPortfolio,
  calculateSharpeRatio,
  type Asset,
  type PortfolioPoint
} from '@/utils/portfolioCalculations'

// Chart.jsの登録
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// 定数定義
const EFFICIENT_FRONTIER_POINTS = 200
const CML_POINTS = 100
const ZERO = 0
const DECIMAL_PLACES = 3
const POINT_RADIUS_SMALL = 3
const POINT_RADIUS_LARGE = 8
const BORDER_WIDTH = 2
const LINE_WIDTH = 3
const CML_MULTIPLIER = 1.5
const DASH_PATTERN_LENGTH = 5
const PERCENTAGE = 100
const ONE_DECIMAL = 1

export default function DistributionPage (): React.JSX.Element {
  const { settings } = useSettings()

  // 設定から資産を取得
  const assets: Asset[] = useMemo(() =>
    settings.assets.map(asset => ({
      expectedReturn: asset.expectedReturn,
      risk: asset.risk
    })),
  [settings.assets])

  // 効率的フロンティアを計算
  const efficientFrontier: PortfolioPoint[] = useMemo(() =>
    calculateMultiAssetEfficientFrontier(
      assets,
      settings.correlationCoefficient,
      EFFICIENT_FRONTIER_POINTS
    ),
  [assets, settings.correlationCoefficient])

  // マーケットポートフォリオを見つける
  const marketPortfolio = useMemo(() =>
    findMarketPortfolio(settings.riskFreeRate, efficientFrontier),
  [settings.riskFreeRate, efficientFrontier])

  // 資本市場線を計算
  const cmlPoints: PortfolioPoint[] = useMemo(() => {
    if (marketPortfolio === null) return []

    const maxRisk = Math.max(
      ...efficientFrontier.map(p => p.risk),
      marketPortfolio.risk * CML_MULTIPLIER
    )

    return calculateCapitalMarketLine({
      riskFreeRate: settings.riskFreeRate,
      marketReturn: marketPortfolio.return,
      marketRisk: marketPortfolio.risk,
      maxRisk,
      points: CML_POINTS
    })
  }, [settings.riskFreeRate, marketPortfolio, efficientFrontier])

  // シャープレシオを計算
  const sharpeRatio = useMemo(() =>
    marketPortfolio !== null
      ? calculateSharpeRatio(
        marketPortfolio.return,
        settings.riskFreeRate,
        marketPortfolio.risk
      )
      : ZERO,
  [marketPortfolio, settings.riskFreeRate])

  // Chart.js用のデータ
  const chartData = {
    datasets: [
      // 個別資産
      {
        label: '個別資産',
        data: assets.map(asset => ({
          x: asset.risk,
          y: asset.expectedReturn
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: BORDER_WIDTH,
        pointRadius: POINT_RADIUS_SMALL
      },
      // 効率的フロンティア
      {
        label: '効率的フロンティア',
        data: efficientFrontier.map(point => ({
          x: point.risk,
          y: point.return
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: LINE_WIDTH,
        pointRadius: ZERO,
        showLine: true,
        fill: false
      },
      // 資本市場線（CML）
      {
        label: '資本市場線（CML）',
        data: cmlPoints.map(point => ({
          x: point.risk,
          y: point.return
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: LINE_WIDTH,
        borderDash: [DASH_PATTERN_LENGTH, DASH_PATTERN_LENGTH],
        pointRadius: ZERO,
        showLine: true,
        fill: false
      },
      // リスクフリー資産
      {
        label: 'リスクフリー資産',
        data: [{
          x: ZERO,
          y: settings.riskFreeRate
        }],
        backgroundColor: 'rgba(153, 102, 255, 1)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: BORDER_WIDTH,
        pointRadius: POINT_RADIUS_LARGE,
        pointStyle: 'triangle'
      },
      // マーケットポートフォリオ
      ...(marketPortfolio !== null
        ? [{
            label: 'マーケットポートフォリオ',
            data: [{
              x: marketPortfolio.risk,
              y: marketPortfolio.return
            }],
            backgroundColor: 'rgba(255, 206, 86, 1)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: BORDER_WIDTH,
            pointRadius: POINT_RADIUS_LARGE,
            pointStyle: 'star'
          }]
        : [])
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: '効率的フロンティアと資本市場線'
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }, parsed: { x: number | null, y: number | null } }) => {
            const { label } = context.dataset
            const { x, y } = context.parsed
            if (x === null || y === null) return ''

            const baseLabel = `${label ?? ''}: リスク ${x.toFixed(DECIMAL_PLACES)}%, リターン ${y.toFixed(DECIMAL_PLACES)}%`

            // CMLの場合は投資比率を追加
            if (label === '資本市場線（CML）' && marketPortfolio !== null && marketPortfolio.risk > ZERO) {
              const marketWeight = (x / marketPortfolio.risk) * PERCENTAGE
              const riskFreeWeight = PERCENTAGE - marketWeight
              return [
                baseLabel,
                `投資比率: マーケット${marketWeight.toFixed(ONE_DECIMAL)}% / リスクフリー${riskFreeWeight.toFixed(ONE_DECIMAL)}%`
              ]
            }

            return baseLabel
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'リスク（標準偏差 %）'
        },
        min: ZERO
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: '期待リターン（%）'
        }
      }
    }
  }

  return (
    <Container className="py-5" id="DistributionChart">
      <h1 className="mb-4">📊 効率的フロンティアと資本市場線</h1>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">現在のパラメータ</h5>
          <Row>
            <Col md={6}>
              <ul>
                <li><strong>リスクフリーレート:</strong> {settings.riskFreeRate}%</li>
                <li><strong>相関係数:</strong> {settings.correlationCoefficient}</li>
                {marketPortfolio !== null && (
                  <li><strong>マーケットポートフォリオのシャープレシオ:</strong> {sharpeRatio.toFixed(DECIMAL_PLACES)}</li>
                )}
              </ul>
            </Col>
            <Col md={6}>
              <h6>個別資産:</h6>
              <ul>
                {settings.assets.map(asset => (
                  <li key={asset.id}>
                    <strong>{asset.name}</strong>: リターン {asset.expectedReturn}%, リスク {asset.risk}%
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <div style={{ height: '500px' }}>
            <Scatter data={chartData} options={chartOptions} />
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">グラフの解説</h5>
          <Row>
            <Col md={12}>
              <h6>🔴 個別資産（赤い点）</h6>
              <p>
                市場に存在する個別の資産です。それぞれ異なるリスクとリターンの特性を持っています。
              </p>

              <h6 className="mt-3">🔵 効率的フロンティア（青い曲線）</h6>
              <p>
                複数の資産を組み合わせることで実現可能なポートフォリオの集合です。
                同じリスクレベルで最大のリターンを提供するポートフォリオが並んでいます。
                この曲線より左上のポートフォリオは理論上実現不可能です。
              </p>

              <h6 className="mt-3">🟢 資本市場線 - CML（緑の破線）</h6>
              <p>
                リスクフリー資産とマーケットポートフォリオを組み合わせることで実現可能な
                リスク・リターンの組み合わせを示しています。
                CAPMの理論では、すべての投資家はこの線上のどこかのポートフォリオを選択すべきとされます。
              </p>

              <h6 className="mt-3">🟣 リスクフリー資産（紫の三角）</h6>
              <p>
                リスクゼロでリスクフリーレートのリターンが得られる資産です（通常は国債）。
              </p>

              <h6 className="mt-3">⭐ マーケットポートフォリオ（黄色い星）</h6>
              <p>
                効率的フロンティア上で、シャープレシオ（リスク1単位あたりの超過リターン）が
                最大となるポートフォリオです。CAPMでは、すべての投資家がこのポートフォリオと
                リスクフリー資産の組み合わせを保有すべきとされます。
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {marketPortfolio !== null && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">マーケットポートフォリオの詳細</h5>
            <Row>
              <Col md={6}>
                <p><strong>期待リターン:</strong> {marketPortfolio.return.toFixed(DECIMAL_PLACES)}%</p>
                <p><strong>リスク（標準偏差）:</strong> {marketPortfolio.risk.toFixed(DECIMAL_PLACES)}%</p>
              </Col>
              <Col md={6}>
                <p><strong>シャープレシオ:</strong> {sharpeRatio.toFixed(DECIMAL_PLACES)}</p>
                <p className="mb-0">
                  <strong>超過リターン:</strong> {(marketPortfolio.return - settings.riskFreeRate).toFixed(DECIMAL_PLACES)}%
                </p>
              </Col>
            </Row>
            <Alert variant="info" className="mt-3 mb-0">
              <strong>シャープレシオ</strong> = (期待リターン - リスクフリーレート) / リスク
              <br />
              = ({marketPortfolio.return.toFixed(DECIMAL_PLACES)}% - {settings.riskFreeRate}%) / {marketPortfolio.risk.toFixed(DECIMAL_PLACES)}%
              <br />
              = {sharpeRatio.toFixed(DECIMAL_PLACES)}
            </Alert>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Body>
          <h5 className="mb-3">トービンの分離定理</h5>
          <p>
            トービンの分離定理によれば、投資決定は以下の2ステップに分離できます：
          </p>
          <ol>
            <li className="mb-2">
              <strong>ステップ1：</strong>
              最適なリスク資産ポートフォリオ（マーケットポートフォリオ）を決定する
            </li>
            <li className="mb-2">
              <strong>ステップ2：</strong>
              個人のリスク許容度に応じて、リスクフリー資産とマーケットポートフォリオの配分比率を決定する
            </li>
          </ol>
          <p className="mb-0">
            つまり、リスク許容度が高い投資家も低い投資家も、
            <strong>同じマーケットポートフォリオを保有し、リスクフリー資産との配分比率だけを変える</strong>
            ことで最適な投資を実現できます。
            資本市場線（CML）上の任意のポイントは、リスクフリー資産とマーケットポートフォリオの
            異なる組み合わせを表しています。
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
