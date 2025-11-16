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

  // シャープレシオを計算
  const sharpeRatio = useMemo(() => {
    if (settings.risk === ZERO) return ZERO
    return (settings.expectedReturn - settings.riskFreeRate) / settings.risk
  }, [settings.expectedReturn, settings.riskFreeRate, settings.risk])

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
                <p className='mb-2'>
                  <strong>資産数:</strong> {settings.numberOfAssets}
                </p>
              </Col>
              <Col md={6}>
                <p className='mb-2'>
                  <strong>相関係数:</strong> {settings.correlationCoefficient}
                </p>
              </Col>
            </Row>

            <h6 className='mb-3'>マーケットポートフォリオ</h6>
            <Row className='mb-4'>
              <Col md={6}>
                <p className='mb-2'>
                  <strong>期待リターン:</strong> {settings.expectedReturn}% / 年
                </p>
                <p className='mb-2'>
                  <strong>リスク:</strong> {settings.risk}% / 年
                </p>
              </Col>
              <Col md={6}>
                <p className='mb-0'>
                  <strong>シャープレシオ:</strong> {sharpeRatio.toFixed(DECIMAL_PLACES)}
                </p>
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
