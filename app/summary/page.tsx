'use client'

import React from 'react'
import { Container, Card, Alert, Row, Col } from 'react-bootstrap'
import Link from 'next/link'

export default function SummaryPage (): React.JSX.Element {
  return (
    <Container className="py-5" id="Summary">
      <h1 className="mb-4">📝 まとめ：実践的な投資戦略</h1>

      <p className="mb-4">
        MPT・CAPMの理論を理解した上で、実際の投資にどう活かすべきか、重要なポイントをまとめます。
      </p>

      <Alert variant="success" className="mb-4">
        <Alert.Heading>🎯 結論：シンプルな戦略が最適</Alert.Heading>
        <p className="mb-0">
          理論と実践の両面から、<strong>オルカン（全世界株式）への投資が最も合理的</strong>です。
          リスク調整は、個別の商品を変えるのではなく、<strong>投資比率（リスク資産（株式<small>・債券・金・暗号資産</small>）とリスクフリー資産（現金・預金）の配分）で行う</strong>のが効率的です。
        </p>
      </Alert>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">1. オルカン（全世界株式）がおすすめの理由</h5>

          <h6 className="mt-3">マーケットポートフォリオに最も近い投資商品</h6>
          <p>
            <Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケットポートフォリオ</Link>は、
            理論上、すべてのリスク資産を時価総額に比例して保有するポートフォリオです。
            オルカン（全世界株式）は、世界中の株式を時価総額加重で保有するため、
            実務上、<strong>マーケットポートフォリオに最も近い投資商品</strong>と言えます。
          </p>

          <h6 className="mt-3">最大限の分散効果</h6>
          <ul>
            <li><strong>地域分散</strong>: 先進国・新興国を含む全世界約50カ国に投資</li>
            <li><strong>銘柄分散</strong>: 約3,000銘柄以上に分散投資</li>
            <li><strong>セクター分散</strong>: テクノロジー、金融、ヘルスケアなど幅広いセクターに投資</li>
          </ul>

          <h6 className="mt-3">低コスト・メンテナンスフリー</h6>
          <p>
            インデックスファンドは運用コストが低く（信託報酬0.1%程度）、
            自動的にリバランスされるため、手間がかかりません。
            市場の成長に連動するシンプルな投資戦略です。
          </p>

          <Alert variant="info" className="mt-3 mb-0">
            <strong>具体的な商品例</strong>
            <ul className="mb-0 mt-2">
              <li>
                <a href="https://www.rakuten-sec.co.jp/web/fund/detail/?ID=JP90C000Q2W2" target="_blank" rel="noopener noreferrer">
                  楽天オルカン（楽天・オールカントリー株式インデックス・ファンド）
                </a>
              </li>
              <li>
                <a href="https://www.rakuten-sec.co.jp/web/fund/detail/?ID=JP90C000H1T1" target="_blank" rel="noopener noreferrer">
                  オルカン（eMAXIS Slim 全世界株式）
                </a>
              </li>
            </ul>
          </Alert>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">2. オルカンとS&P500の分散は効果がない</h5>

          <h6 className="mt-3">高い相関係数による分散効果の低下</h6>
          <p>
            オルカン（全世界株式）とS&P500（米国株式）の<Link href="/words?q=correlation" style={{ textDecoration: 'none' }}>相関係数</Link>は
            約0.95〜0.98と非常に高く、ほぼ同じ値動きをします。
            <Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>MPT</Link>の理論によれば、
            <strong>相関係数が1に近い資産を組み合わせても、リスク低減効果はほとんどありません</strong>。
          </p>

          <h6 className="mt-3">なぜ相関が高いのか</h6>
          <ul>
            <li><strong>米国株の高い構成比</strong>: オルカンの約60%は米国株式で構成されている</li>
            <li><strong>グローバル企業の影響</strong>: GoogleやMicrosoftなどの米国大手企業は世界中で事業を展開</li>
            <li><strong>市場の連動性</strong>: グローバル化により、世界の株式市場は強く連動している</li>
          </ul>

          <Alert variant="warning" className="mt-3 mb-0">
            <Alert.Heading>よくある誤解</Alert.Heading>
            <p className="mb-0">
              「オルカン50% + S&P500 50%で分散投資」という戦略は、
              実質的に米国株の比率を高めているだけで、真の分散効果は得られません。
              リスク・リターンを調整したい場合は、次の方法をおすすめします。
            </p>
          </Alert>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">3. リスク・リターンの調整方法</h5>

          <p>
            <Link href="/words?q=tobin-separation" style={{ textDecoration: 'none' }}>トービンの分離定理</Link>によれば、
            投資決定は「<strong>マーケットポートフォリオの選択</strong>」と
            「<strong>リスク資産とリスクフリー資産の配分</strong>」の2ステップに分離できます。
          </p>

          <Row className="mt-4">
            <Col md={6}>
              <Card className="h-100 border-success">
                <Card.Body>
                  <h6 className="text-success">✅ 推奨される方法：投資比率の調整</h6>

                  <p className="mt-3"><strong>より高いリターンを狙いたい場合</strong></p>
                  <ul>
                    <li>オルカンへの投資比率を上げる（例: 80% → 100%）</li>
                    <li>リスクフリー資産（現金・国債）の比率を下げる</li>
                  </ul>

                  <Alert variant="warning" className="mt-2 mb-0">
                    <small>
                      <strong>レバレッジ（借入）について</strong><br />
                      理論上は、さらに積極的なリターンを求める場合、借入（レバレッジ）も有効です。
                      しかし、借入利子率はリスクフリーレートより高くなるため、一般的には非推奨です。
                      また、レバレッジはリスクを大幅に増加させ、損失が元本を超える可能性もあります。
                    </small>
                  </Alert>

                  <p className="mt-3"><strong>リスクを抑えたい場合</strong></p>
                  <ul>
                    <li>オルカンへの投資比率を下げる（例: 80% → 50%）</li>
                    <li>リスクフリー資産（現金・国債）の比率を上げる</li>
                    <li>年齢やライフステージに応じて徐々に調整</li>
                  </ul>

                  <Alert variant="success" className="mt-3 mb-0">
                    <small>
                      <strong>この方法のメリット</strong><br />
                      • シンプルで管理しやすい<br />
                      • 低コスト（余計な手数料がかからない）<br />
                      • <Link href="/words?q=cml" style={{ textDecoration: 'none' }}>資本市場線（CML）</Link>上の効率的な投資
                    </small>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100 border-danger">
                <Card.Body>
                  <h6 className="text-danger">❌ 非効率的な方法</h6>

                  <p className="mt-3"><strong>より高いリターンを狙いたい場合</strong></p>
                  <ul className="text-danger">
                    <li>個別株や暗号資産など高リスク商品を追加</li>
                    <li>テーマ型ファンド（AI、メタバースなど）を追加</li>
                    <li>レバレッジ型ETFを追加</li>
                  </ul>

                  <p className="mt-3"><strong>リスクを抑えたい場合</strong></p>
                  <ul className="text-danger">
                    <li>低リスク商品（債券、金など）を追加</li>
                    <li>国内株式のみに変更</li>
                    <li>複数のファンドを組み合わせて調整</li>
                  </ul>

                  <Alert variant="danger" className="mt-3 mb-0">
                    <small>
                      <strong>この方法の問題点</strong><br />
                      • 複雑で管理が大変<br />
                      • 手数料が高くなる可能性<br />
                      • 真の分散効果が得られない場合が多い<br />
                      • 感情的な判断によるリスク
                    </small>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">4. 具体的な投資比率の例</h5>

          <p>
            年齢やリスク許容度に応じた、オルカンとリスクフリー資産の配分例です。
          </p>

          <Row className="mt-3">
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="text-center">積極的（若年層）</h6>
                  <div className="text-center my-3">
                    <div className="display-6">100%</div>
                    <small className="text-muted">オルカン</small>
                  </div>
                  <ul className="small">
                    <li>年齢: 20〜30代</li>
                    <li>投資期間: 20年以上</li>
                    <li>リスク許容度: 高い</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="text-center">バランス型（中年層）</h6>
                  <div className="text-center my-3">
                    <div className="display-6">70%</div>
                    <small className="text-muted">オルカン / 30% 現金・国債</small>
                  </div>
                  <ul className="small">
                    <li>年齢: 40〜50代</li>
                    <li>投資期間: 10〜20年</li>
                    <li>リスク許容度: 中程度</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h6 className="text-center">保守的（高齢層）</h6>
                  <div className="text-center my-3">
                    <div className="display-6">30%</div>
                    <small className="text-muted">オルカン / 70% 現金・国債</small>
                  </div>
                  <ul className="small">
                    <li>年齢: 60代以上</li>
                    <li>投資期間: 10年未満</li>
                    <li>リスク許容度: 低い</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Alert variant="info" className="mt-3 mb-0">
            <small>
              <strong>注意</strong>: これらはあくまで一例です。
              個人の状況（収入、資産、負債、家族構成など）によって最適な配分は異なります。
              必要に応じてファイナンシャルプランナーなどの専門家にご相談ください。
            </small>
          </Alert>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">5. よくある質問</h5>

          <h6 className="mt-3">Q1: なぜ個別株ではなくインデックスファンドなのか？</h6>
          <p>
            <strong>A:</strong> 個別株選択で市場平均を上回り続けることは、プロの投資家でも困難です。
            インデックスファンドは市場全体の成長を捉え、低コストで運用できます。
            また、個別株は企業固有のリスク（倒産リスクなど）がありますが、
            インデックスファンドは数千社に分散されているため、このリスクが大幅に低減されます。
          </p>

          <h6 className="mt-3">Q2: 債券、金、暗号資産に投資すべきではないのか？</h6>
          <p>
            <strong>A:</strong> 理論上は、債券、金、暗号資産も<Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケットポートフォリオ</Link>の一部として、
            時価総額に応じて投資するべきです。ただし、各資産クラスには以下の点に注意が必要です：
          </p>
          <ul>
            <li><strong>債券投資</strong>: 債券を時価総額比率で投資すると、
            多くの債券を発行している（債務額が高い）発行体の比率が高くなってしまいます。
            つまり、財務が健全でない企業や国の債券に多く投資することになるリスクがあります。</li>
            <li><strong>金投資</strong>: 金は全てのリスク資産の中で約1%と時価総額が非常に低いため、
            理論通りに投資すると極めて少ない配分になります。
            ただし、金は株式間の<Link href="/words?q=correlation" style={{ textDecoration: 'none' }}>相関係数</Link>よりも
            低い相関が観測されているため、時価総額比率よりもう少し高い比率で投資することで、
            ポートフォリオ全体のリスク低減効果が得られる可能性があります。</li>
            <li><strong>暗号資産投資</strong>: 暗号資産もリスク資産全体における時価総額比率は非常に小さく、
            また歴史が浅いため株式との相関係数も明確ではありません。投資する場合は慎重に判断する必要があります。</li>
          </ul>
          <p>
            実践的には、まずオルカン（全世界株式）でマーケットポートフォリオの大部分を構築し、
            必要に応じて債券や金や暗号資産を追加することで、追加的な分散効果を得ることができます。
          </p>

          <h6 className="mt-3">Q3: テーマ型投資信託はどうか？</h6>
          <p>
            <strong>A:</strong> テーマ型投資信託（AI、メタバース、ESGなど特定のテーマに集中投資するファンド）は、
            <Link href="/words?q=market-portfolio" style={{ textDecoration: 'none' }}>マーケットポートフォリオ</Link>から大きく外れるため、
            理論的には効率的ではありません。
          </p>
          <p>
            高リスク・高リターンを狙いたい場合は、テーマ型ファンドを追加するのではなく、
            オルカン（全世界株式）への投資比率を上げることで実現できます。
            テーマ型投資は、特定のセクターや技術への過度な集中により、
            <Link href="/words?q=diversification" style={{ textDecoration: 'none' }}>分散投資</Link>の効果が薄れ、
            リスクが高まる可能性があります。
          </p>

          <h6 className="mt-3">Q4: リバランスは必要ないのか？</h6>
          <p>
            <strong>A:</strong> インデックスファンドは自動的にリバランスされます。
            ただし、リスク資産とリスクフリー資産の比率は、定期的（年1回など）に見直すことをおすすめします。
            年齢やライフステージの変化に応じて、徐々にリスクフリー資産の比率を上げていくのが一般的です。
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5 className="mb-3">最後に</h5>
          <p>
            投資の世界では、複雑な戦略が優れているとは限りません。
            <Link href="/words?q=mpt" style={{ textDecoration: 'none' }}>現代ポートフォリオ理論</Link>と
            <Link href="/words?q=capm" style={{ textDecoration: 'none' }}>CAPM</Link>が示すように、
            <strong>シンプルな戦略こそが最も効率的</strong>であることが多いのです。
          </p>
          <p>
            オルカン（全世界株式）への投資比率を、
            自分のリスク許容度に合わせて調整する。
            この基本原則を守ることが、長期的な資産形成の成功につながります。
          </p>
          <p className="mb-0">
            このアプリケーションの<Link href="/distribution">効率的フロンティアと資本市場線</Link>のグラフで、
            理論を視覚的に確認し、投資戦略への理解を深めてください。
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
