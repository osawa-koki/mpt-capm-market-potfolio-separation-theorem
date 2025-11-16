'use client'

import React, { useEffect, useRef } from 'react'
import { Container, Card } from 'react-bootstrap'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const SCROLL_OFFSET = 100
const HIGHLIGHT_BACKGROUND = '#fffbcc'
const DEFAULT_BACKGROUND = 'white'
const TRANSITION_DURATION = '0.3s'

interface Term {
  id: string
  title: string
  description: React.ReactNode
}

const terms: Term[] = [
  {
    id: 'mpt',
    title: 'MPT（現代ポートフォリオ理論）',
    description: (
      <>
        MPT（Modern Portfolio Theory、現代ポートフォリオ理論）は、ハリー・マーコウィッツが1952年に提唱した投資理論です。リスクとリターンのトレードオフを数学的に分析し、効率的なポートフォリオ（資産の組み合わせ）を構築する方法を示します。主要な概念として、分散投資によってリスクを低減できることや、リスク許容度に応じた最適な資産配分が存在することが挙げられます。<Link href="/words?q=efficient-frontier" style={{ textDecoration: 'none' }}>効率的フロンティア</Link>と<Link href="/words?q=tobin-separation" style={{ textDecoration: 'none' }}>トービンの分離定理</Link>は、このMPTの重要な概念です。
      </>
    )
  },
  {
    id: 'capm',
    title: 'CAPM（資本資産価格モデル）',
    description: (
      <>
        CAPM（Capital Asset Pricing Model、資本資産価格モデル）は、ウィリアム・シャープらが1960年代に開発した資産価格決定理論です。<Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>MPT</Link>を拡張したもので、リスク資産の期待リターンを理論的に算出します。CAPMでは、すべての投資家が<Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケット・ポートフォリオ</Link>と<Link href="/words?q=risk-free-rate" style={{ textDecoration: 'none' }}>リスクフリー資産</Link>を組み合わせて保有し、<Link href="/words?q=cml" style={{ textDecoration: 'none' }}>資本市場線（CML）</Link>上でポートフォリオを選択すると仮定します。
      </>
    )
  },
  {
    id: 'efficient-frontier',
    title: '効率的フロンティア',
    description: (
      <>
        効率的フロンティア（Efficient Frontier）は、同じリスクレベルで最大のリターンを提供する、または同じリターンレベルで最小のリスクを提供するポートフォリオの集合を表す曲線です。<Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>現代ポートフォリオ理論（MPT）</Link>の中心的な概念で、この曲線より左上のポートフォリオは理論上実現不可能です。複数の資産を組み合わせることで、個別資産よりも効率的な（リスク対リターンの比率が良い）ポートフォリオを構築できることを示しています。
      </>
    )
  },
  {
    id: 'market-portfolio',
    title: 'マーケット・ポートフォリオ',
    description: (
      <>
        マーケット・ポートフォリオ（Market Portfolio）は、<Link href="/words?q=efficient-frontier" style={{ textDecoration: 'none' }}>効率的フロンティア</Link>上で<Link href="/words?q=sharpe-ratio" style={{ textDecoration: 'none' }}>シャープレシオ</Link>が最大となるポートフォリオです。<Link href="/words?q=capm" style={{ textDecoration: 'none' }}>CAPM</Link>理論では、すべての投資家は個人のリスク許容度に関わらず、同じマーケット・ポートフォリオを保有すべきだとされています。実務上は、世界株式インデックスファンドなどの幅広く分散されたポートフォリオがマーケット・ポートフォリオの近似として用いられます。
      </>
    )
  },
  {
    id: 'cml',
    title: '資本市場線（CML）',
    description: (
      <>
        資本市場線（Capital Market Line、CML）は、<Link href="/words?q=risk-free-rate" style={{ textDecoration: 'none' }}>リスクフリー資産</Link>と<Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケット・ポートフォリオ</Link>を組み合わせることで実現可能なリスク・リターンの組み合わせを示す直線です。<Link href="/words?q=capm" style={{ textDecoration: 'none' }}>CAPM</Link>では、すべての合理的な投資家はこの線上のどこかのポートフォリオを選択すべきだとされます。CML上の任意の点は、リスクフリー資産とマーケット・ポートフォリオの異なる配分比率を表しています。
      </>
    )
  },
  {
    id: 'tobin-separation',
    title: 'トービンの分離定理',
    description: (
      <>
        トービンの分離定理（Tobin&apos;s Separation Theorem）は、ジェームズ・トービンが提唱したポートフォリオ理論の重要な定理です。投資決定は2つのステップに分離できると述べています：（1）最適なリスク資産ポートフォリオ（<Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケット・ポートフォリオ</Link>）を決定する、（2）個人のリスク許容度に応じて、<Link href="/words?q=risk-free-rate" style={{ textDecoration: 'none' }}>リスクフリー資産</Link>とマーケット・ポートフォリオの配分比率を決定する。つまり、リスク選好度が異なる投資家でも、同じマーケット・ポートフォリオを保有し、配分比率だけを変えれば良いということです。
      </>
    )
  },
  {
    id: 'risk-free-rate',
    title: 'リスクフリーレート（無リスク利子率）',
    description: (
      <>
        リスクフリーレート（Risk-Free Rate）は、理論上リスクがゼロの資産から得られる利回りのことです。実務上は、自国通貨建ての短期国債の利回りが使用されます（日本の場合は日本国債、米国の場合は米国債）。<Link href="/words?q=capm" style={{ textDecoration: 'none' }}>CAPM</Link>や<Link href="/words?q=sharpe-ratio" style={{ textDecoration: 'none' }}>シャープレシオ</Link>の計算において、超過リターン（リスクプレミアム）を算出するための基準値として使用されます。
      </>
    )
  },
  {
    id: 'expected-return',
    title: '期待リターン',
    description: '期待リターン（Expected Return）は、資産やポートフォリオから将来得られると予想される平均的な収益率です。過去のデータや経済予測に基づいて推定されます。リスクが高い資産ほど、一般的に期待リターンも高くなる傾向があります（リスク・リターンのトレードオフ）。このアプリケーションでは、各資産の期待リターンを年率（%）で設定します。'
  },
  {
    id: 'risk',
    title: 'リスク（標準偏差）',
    description: (
      <>
        投資におけるリスク（Risk）は、リターンの不確実性や変動性を指し、通常は標準偏差で測定されます。標準偏差が大きいほど、リターンのばらつきが大きく、投資結果の予測が困難になります。正規分布を仮定すると、約68%の確率で期待リターン±1標準偏差の範囲に実際のリターンが収まります。<Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>MPT</Link>では、複数資産の組み合わせによってポートフォリオ全体のリスクを低減できることが示されています。
      </>
    )
  },
  {
    id: 'sharpe-ratio',
    title: 'シャープレシオ',
    description: (
      <>
        シャープレシオ（Sharpe Ratio）は、リスク1単位あたりの超過リターン（<Link href="/words?q=risk-free-rate" style={{ textDecoration: 'none' }}>リスクフリーレート</Link>を上回るリターン）を示す指標です。計算式は「（期待リターン - リスクフリーレート）/ リスク（標準偏差）」です。シャープレシオが高いほど、リスクに対するリターンが効率的であることを意味します。<Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケット・ポートフォリオ</Link>は、<Link href="/words?q=efficient-frontier" style={{ textDecoration: 'none' }}>効率的フロンティア</Link>上でシャープレシオが最大となる点として定義されます。
      </>
    )
  },
  {
    id: 'correlation',
    title: '相関係数',
    description: (
      <>
        相関係数（Correlation Coefficient）は、2つの資産の価格変動がどの程度連動するかを示す指標で、-1から1の範囲の値を取ります。1に近いほど正の相関（同じ方向に動く）、-1に近いほど負の相関（逆方向に動く）、0に近いほど無相関（関係がない）を意味します。<Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>MPT</Link>では、相関係数が1未満の資産を組み合わせることで、ポートフォリオ全体のリスクを個別資産よりも低減できることが示されています。このアプリケーションでは、簡略化のため、すべての資産ペアに同じ相関係数を使用しています。
      </>
    )
  },
  {
    id: 'diversification',
    title: '分散投資',
    description: (
      <>
        分散投資（Diversification）は、複数の異なる資産に投資することでリスクを低減する投資戦略です。<Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>現代ポートフォリオ理論（MPT）</Link>の核心的な考え方で、相関が完全ではない（<Link href="/words?q=correlation" style={{ textDecoration: 'none' }}>相関係数</Link>が1未満の）資産を組み合わせることで、ポートフォリオ全体のリスクを個別資産の単純平均よりも低く抑えることができます。「すべての卵を一つのかごに盛るな」という格言で表現されます。
      </>
    )
  }
]

export default function WordsPage (): React.JSX.Element {
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  const termRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (q === null || q === '') {
      return
    }

    const element = termRefs.current[q]
    if (element === null || element === undefined) {
      return
    }

    // スクロール位置を調整（ヘッダー分のオフセットを考慮）
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: elementPosition - SCROLL_OFFSET,
      behavior: 'smooth'
    })
  }, [q])

  return (
    <Container className="py-5">
      <h1 className="mb-4">📚 用語集</h1>
      <p className="mb-4">
        MPT（現代ポートフォリオ理論）とCAPM（資本資産価格モデル）に関連する主要な用語を解説します。
        用語は相互にリンクされており、クリックすることで関連する用語にジャンプできます。
      </p>

      {terms.map((term) => (
        <Card
          key={term.id}
          className="mb-3"
          ref={(el) => { termRefs.current[term.id] = el }}
          style={{
            backgroundColor: q === term.id ? HIGHLIGHT_BACKGROUND : DEFAULT_BACKGROUND,
            transition: `background-color ${TRANSITION_DURATION} ease`
          }}
        >
          <Card.Body>
            <Card.Title>{term.title}</Card.Title>
            <Card.Text>{term.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  )
}
