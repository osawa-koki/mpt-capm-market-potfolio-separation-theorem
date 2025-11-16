'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

import setting from '@/setting'
import { useSettings } from '@/contexts/SettingsContext'

const IMAGE_SIZE = 100
const ZERO = 0
const DECIMAL_PLACES = 3

export default function Home (): React.JSX.Element {
  const { settings } = useSettings()

  const basePath = setting.basePath ?? ''
  const logoSrc = `${basePath}/tako.png`

  // 各資産の平均シャープレシオを計算
  const averageSharpeRatio = useMemo(() => {
    if (settings.assets.length === ZERO) return ZERO
    const sum = settings.assets.reduce((acc, asset) => {
      if (asset.risk === ZERO) return acc
      return acc + (asset.expectedReturn - settings.riskFreeRate) / asset.risk
    }, ZERO)
    return sum / settings.assets.length
  }, [settings.assets, settings.riskFreeRate])

  return (
    <Container className='py-4'>
      <div id='Index' className='d-flex flex-column align-items-center'>
        <h1>{setting.title}</h1>
        <Image
          id='Logo'
          className='mt-3 mw-100 border rounded-circle'
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          src={logoSrc}
          alt='Logo'
        />

        <Card className='mt-4' style={{ maxWidth: '700px', width: '100%' }}>
          <Card.Body>
            <Card.Title className='mb-4'>現在のパラメータ設定</Card.Title>

            <h6 className='mb-3'>基本パラメータ</h6>
            <Row className='mb-4'>
              <Col md={6}>
                <p className='mb-2'>
                  <strong>リスクフリーレート:</strong> {settings.riskFreeRate}%
                </p>
                <p className='mb-0'>
                  <strong>相関係数:</strong> {settings.correlationCoefficient}
                </p>
              </Col>
              <Col md={6}>
                <p className='mb-0'>
                  <strong>平均シャープレシオ:</strong> {averageSharpeRatio.toFixed(DECIMAL_PLACES)}
                </p>
              </Col>
            </Row>

            <h6 className='mb-3'>個別資産</h6>
            <Row className='mb-4'>
              <Col md={12}>
                <ul className='mb-0'>
                  {settings.assets.map(asset => (
                    <li key={asset.id}>
                      <strong>{asset.name}</strong>: 期待リターン {asset.expectedReturn}% / 年、リスク {asset.risk}% / 年
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>

            <div className='d-flex gap-2 flex-wrap'>
              <Link href='/distribution'>
                <Button variant='success'>効率的フロンティアを見る</Button>
              </Link>
              <Link href='/settings'>
                <Button variant='primary'>パラメータを変更</Button>
              </Link>
              <Link href='/about'>
                <Button variant='info'>理論について学ぶ</Button>
              </Link>
              <Link href='/summary'>
                <Button variant='warning'>実践的な投資戦略</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        <Card className='mt-4' style={{ maxWidth: '700px', width: '100%' }}>
          <Card.Body>
            <Card.Title className='mb-3'>このアプリケーションについて</Card.Title>
            <p className='mb-3'>
              現代ポートフォリオ理論（MPT）と資本資産価格モデル（CAPM）に基づく、
              マーケットポートフォリオとトービンの分離定理を視覚的に理解するためのツールです。
            </p>
            <ul className='mb-0'>
              <li>効率的フロンティアの可視化</li>
              <li>資本市場線（CML）の表示</li>
              <li>マーケットポートフォリオの位置確認</li>
              <li>リスクとリターンの関係の理解</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </Container>
  )
}
