'use client'

import React from 'react'

export default function AboutPage (): React.JSX.Element {
  return (
    <>
      <div id='About'>
        <h1>MPT・CAPM・トービンの分離定理について</h1>

        <section className='mt-4'>
          <h2>このアプリケーションについて</h2>
          <p className='mt-3'>
            このアプリケーションは、現代ポートフォリオ理論（MPT）と資本資産価格モデル（CAPM）に基づく
            マーケットポートフォリオとトービンの分離定理を視覚的に理解するためのツールです。
            <br />
            <br />
            投資における最適なリスク・リターンの関係を、インタラクティブなグラフを通じて学ぶことができます。
          </p>
        </section>

        <section className='mt-5'>
          <h2>現代ポートフォリオ理論（MPT）とは</h2>
          <p className='mt-3'>
            現代ポートフォリオ理論（Modern Portfolio Theory: MPT）は、1952年にハリー・マーコウィッツによって提唱された投資理論です。
            <br />
            <br />
            MPTの核心的な考え方は、<strong>「卵を一つのカゴに盛るな」</strong>という分散投資の原則を数学的に定式化したものです。
            <br />
            <br />
            異なる資産を組み合わせることで、個別資産のリスクを相殺し、
            同じリターンでもより低いリスクを実現できることを示しています。
            <br />
            <br />
            効率的フロンティアと呼ばれる曲線上のポートフォリオが、
            与えられたリスクレベルで最大のリターンを提供します。
          </p>
        </section>

        <section className='mt-5'>
          <h2>資本資産価格モデル（CAPM）とは</h2>
          <p className='mt-3'>
            資本資産価格モデル（Capital Asset Pricing Model: CAPM）は、
            1960年代にウィリアム・シャープ、ジョン・リントナー、ヤン・モッシンらによって開発されました。
            <br />
            <br />
            CAPMは、リスク資産の期待収益率を決定するモデルで、
            <strong>マーケットポートフォリオ</strong>という概念を導入しています。
            <br />
            <br />
            マーケットポートフォリオは、市場に存在するすべてのリスク資産を
            その時価総額に比例して保有するポートフォリオです。
            <br />
            <br />
            CAPMによれば、効率的市場では、すべての投資家は
            リスクフリー資産とマーケットポートフォリオの組み合わせを保有することになります。
          </p>
        </section>

        <section className='mt-5'>
          <h2>トービンの分離定理とは</h2>
          <p className='mt-3'>
            トービンの分離定理（Tobin&apos;s Separation Theorem）は、
            1958年にジェームズ・トービンによって提唱されました。
            <br />
            <br />
            この定理の重要なポイントは、<strong>投資決定が2つのステップに分離できる</strong>ということです：
          </p>
          <ol className='mt-3'>
            <li>
              <strong>ステップ1：</strong>
              最適なリスク資産ポートフォリオ（マーケットポートフォリオ）を決定する
            </li>
            <li className='mt-2'>
              <strong>ステップ2：</strong>
              個人のリスク許容度に応じて、リスクフリー資産とマーケットポートフォリオの配分比率を決定する
            </li>
          </ol>
          <p className='mt-3'>
            つまり、リスク許容度が異なる投資家であっても、
            <strong>同じマーケットポートフォリオを保有し、リスクフリー資産との配分比率だけを変える</strong>
            ことで最適な投資を実現できます。
            <br />
            <br />
            保守的な投資家はリスクフリー資産の比率を高め、
            積極的な投資家はマーケットポートフォリオの比率を高める（または借入を行う）ことになります。
          </p>
        </section>

        <section className='mt-5'>
          <h2>このツールの使い方</h2>
          <p className='mt-3'>
            このアプリケーションでは、以下の機能を通じて理論を視覚的に理解できます：
          </p>
          <ul className='mt-3'>
            <li>効率的フロンティアの可視化</li>
            <li>資本市場線（Capital Market Line）の表示</li>
            <li>マーケットポートフォリオの位置</li>
            <li>リスク許容度に応じた最適ポートフォリオの計算</li>
            <li>リスクフリーレートやその他のパラメータの調整</li>
          </ul>
          <p className='mt-3'>
            ぜひ様々なパラメータを試して、
            現代ポートフォリオ理論の理解を深めてください。
          </p>
        </section>
      </div>
    </>
  )
}
