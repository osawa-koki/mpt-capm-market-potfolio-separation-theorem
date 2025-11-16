'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useSettings, type InvestmentSettings, type IndividualAsset, defaultSettings } from '@/contexts/SettingsContext'
import Modal from '@/components/Modal'

const PERCENTAGE_DIVISOR = 100
const DECIMAL_PLACES = 10
const ZERO = 0
const MIN_CORRELATION = -1
const MAX_CORRELATION = 1
const MIN_ASSETS = 2
const MAX_ASSETS = 20
const ONE = 1
const SHARPE_RATIO_DECIMALS = 3
const CHAR_CODE_A = 65
const DEFAULT_EXPECTED_RETURN = 8.0
const DEFAULT_RISK = 15.0

// 未保存の変更警告コンポーネント
interface UnsavedChangesAlertProps {
  className?: string
}

function UnsavedChangesAlert ({ className = 'mb-4' }: UnsavedChangesAlertProps): React.JSX.Element {
  return (
    <Alert variant="warning" className={className}>
      <Alert.Heading>未保存の変更があります</Alert.Heading>
      <p className="mb-0">
        設定を変更しましたが、まだ保存されていません。変更を保存するには「設定を保存」ボタンをクリックしてください。
      </p>
    </Alert>
  )
}

export default function SettingsPage (): React.JSX.Element {
  const { settings, updateSettings, resetSettings } = useSettings()

  // ローカルフォーム状態
  const [formData, setFormData] = useState<InvestmentSettings>(settings)

  // モーダル状態
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  // 未保存の変更があるかチェック
  const hasUnsavedChanges = useMemo(() => (
    formData.riskFreeRate !== settings.riskFreeRate ||
    formData.correlationCoefficient !== settings.correlationCoefficient ||
    JSON.stringify(formData.assets) !== JSON.stringify(settings.assets)
  ), [formData, settings])

  // settingsが変更されたらformDataを同期
  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleChange = (field: keyof InvestmentSettings) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value

    // 空文字列の場合は0として扱う
    if (inputValue === '') {
      setFormData(prev => ({ ...prev, [field]: ZERO }))
      return
    }

    const value = parseFloat(inputValue)
    if (!isNaN(value)) {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleAddAsset = (): void => {
    const assetIds = formData.assets.map(a => {
      const parsed = parseInt(a.id, 10)
      return isNaN(parsed) ? ZERO : parsed
    })
    const maxId = Math.max(ZERO, ...assetIds)
    const newId = String(maxId + ONE)
    const newAsset: IndividualAsset = {
      id: newId,
      name: `資産${String.fromCharCode(CHAR_CODE_A + formData.assets.length)}`,
      expectedReturn: DEFAULT_EXPECTED_RETURN,
      risk: DEFAULT_RISK
    }
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }))
  }

  const handleRemoveAsset = (id: string): void => {
    if (formData.assets.length <= MIN_ASSETS) {
      toast.error(`最低${MIN_ASSETS}個の資産が必要です。`)
      return
    }
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== id)
    }))
  }

  const handleAssetChange = (id: string, field: keyof IndividualAsset, value: string | number): void => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map(a =>
        a.id === id ? { ...a, [field]: value } : a
      )
    }))
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    // バリデーション
    if (formData.riskFreeRate < ZERO || formData.riskFreeRate > PERCENTAGE_DIVISOR) {
      toast.error('リスクフリーレートは0〜100の範囲で入力してください。')
      return
    }

    if (formData.assets.length < MIN_ASSETS || formData.assets.length > MAX_ASSETS) {
      toast.error(`資産数は${MIN_ASSETS}〜${MAX_ASSETS}の範囲で入力してください。`)
      return
    }

    if (formData.correlationCoefficient < MIN_CORRELATION || formData.correlationCoefficient > MAX_CORRELATION) {
      toast.error('相関係数は-1〜1の範囲で入力してください。')
      return
    }

    // 各資産のバリデーション
    for (const asset of formData.assets) {
      if (asset.name.trim() === '') {
        toast.error('資産名を入力してください。')
        return
      }
      if (asset.risk < ZERO) {
        toast.error(`${asset.name}: リスクは0以上の値を入力してください。`)
        return
      }
    }

    // 保存前に丸め処理を適用した値を作成
    const normalizedData: InvestmentSettings = {
      ...formData,
      riskFreeRate: Math.round(formData.riskFreeRate * DECIMAL_PLACES) / DECIMAL_PLACES,
      correlationCoefficient: Math.round(formData.correlationCoefficient * DECIMAL_PLACES) / DECIMAL_PLACES,
      assets: formData.assets.map(asset => ({
        ...asset,
        expectedReturn: Math.round(asset.expectedReturn * DECIMAL_PLACES) / DECIMAL_PLACES,
        risk: Math.round(asset.risk * DECIMAL_PLACES) / DECIMAL_PLACES
      }))
    }

    // 丸められた値でformDataも更新
    setFormData(normalizedData)

    // 丸められた値で保存
    updateSettings(normalizedData)
    toast.success('設定を保存しました。')
  }

  const handleResetClick = (): void => {
    setIsResetModalOpen(true)
  }

  const handleResetConfirm = (): void => {
    resetSettings()
    // フォームも即座にデフォルト値に戻す
    setFormData(defaultSettings)
    setIsResetModalOpen(false)
    toast.info('設定をリセットしました。')
  }

  const handleResetCancel = (): void => {
    setIsResetModalOpen(false)
  }

  // 各資産のシャープレシオを計算
  const calculateAssetSharpeRatio = (expectedReturn: number, risk: number): number => {
    if (risk === ZERO) return ZERO
    return (expectedReturn - settings.riskFreeRate) / risk
  }

  return (
    <Container className="py-5" id="Settings">
      <h1 className="mb-4">⚙️ パラメータ設定</h1>

      <p className="mb-4 text-muted">
        MPT・CAPMの可視化に使用するパラメータを設定します。
        これらの設定は効率的フロンティア、資本市場線、マーケットポートフォリオの計算に使用されます。
      </p>

      {hasUnsavedChanges && <UnsavedChangesAlert />}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-3">基本パラメータ</h5>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>リスクフリーレート (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.riskFreeRate}
                    onChange={handleChange('riskFreeRate')}
                    min={0}
                    max={100}
                    step={0.1}
                    required
                  />
                  <Form.Text className="text-muted">
                    無リスク資産の年間利回り。通常は国債の利回りを使用します（例: 0.5%）
                  </Form.Text>
                </Form.Group>
              </Col>

            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>資産間の相関係数</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.correlationCoefficient}
                    onChange={handleChange('correlationCoefficient')}
                    min={MIN_CORRELATION}
                    max={MAX_CORRELATION}
                    step={0.1}
                    required
                  />
                  <Form.Text className="text-muted">
                    資産間の価格変動の相関（-1: 完全逆相関、0: 無相関、1: 完全正相関）
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h5 className="mb-3">個別資産の設定</h5>
            <p className="text-muted mb-3">
              各資産の期待リターンとリスクを設定します。最低{MIN_ASSETS}個、最大{MAX_ASSETS}個まで設定できます。
            </p>

            {formData.assets.map(asset => (
              <Card key={asset.id} className="mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>資産名</Form.Label>
                        <Form.Control
                          type="text"
                          value={asset.name}
                          onChange={(e) => { handleAssetChange(asset.id, 'name', e.target.value) }}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>期待リターン (%)</Form.Label>
                        <Form.Control
                          type="number"
                          value={asset.expectedReturn}
                          onChange={(e) => {
                            const parsed = parseFloat(e.target.value)
                            handleAssetChange(asset.id, 'expectedReturn', isNaN(parsed) ? ZERO : parsed)
                          }}
                          step={0.1}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-2">
                        <Form.Label>リスク (%)</Form.Label>
                        <Form.Control
                          type="number"
                          value={asset.risk}
                          onChange={(e) => {
                            const parsed = parseFloat(e.target.value)
                            handleAssetChange(asset.id, 'risk', isNaN(parsed) ? ZERO : parsed)
                          }}
                          min={0}
                          step={0.1}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-2">
                        <Form.Label>シャープレシオ</Form.Label>
                        <div className="fw-bold">{calculateAssetSharpeRatio(asset.expectedReturn, asset.risk).toFixed(SHARPE_RATIO_DECIMALS)}</div>
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => { handleRemoveAsset(asset.id) }}
                        disabled={formData.assets.length <= MIN_ASSETS}
                        title={formData.assets.length <= MIN_ASSETS ? `最低${MIN_ASSETS}個の資産が必要です` : '削除'}
                      >
                        ×
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            <Button
              variant="success"
              onClick={handleAddAsset}
              disabled={formData.assets.length >= MAX_ASSETS}
              className="mb-3"
            >
              + 資産を追加
            </Button>

            <Alert variant="info" className="mt-3">
              <Alert.Heading>参考値</Alert.Heading>
              <ul className="mb-0">
                <li><strong>世界株式</strong>: 期待リターン 7.5%、リスク 18.0%</li>
                <li><strong>先進国株式</strong>: 期待リターン 7.0%、リスク 17.0%</li>
                <li><strong>国内株式</strong>: 期待リターン 5.0%、リスク 15.0%</li>
                <li><strong>リスクフリーレート</strong>: 日本国債 0.5%前後、米国債 4.0%前後（2024年時点）</li>
              </ul>
            </Alert>

            <div className="d-flex gap-2 mt-4">
              <Button variant="primary" type="submit">
                設定を保存
              </Button>
              <Button variant="secondary" type="button" onClick={handleResetClick}>
                デフォルトに戻す
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {hasUnsavedChanges && <UnsavedChangesAlert className="my-4" />}

      <Card className="mt-4">
        <Card.Body>
          <h5 className="mb-3">現在の設定値</h5>
          <Row>
            <Col md={6}>
              <ul>
                <li>リスクフリーレート: <strong>{settings.riskFreeRate}%</strong></li>
                <li>相関係数: <strong>{settings.correlationCoefficient}</strong></li>
              </ul>
            </Col>
            <Col md={6}>
              <h6>登録されている資産:</h6>
              <ul>
                {settings.assets.map(asset => (
                  <li key={asset.id}>
                    <strong>{asset.name}</strong>: リターン {asset.expectedReturn}%, リスク {asset.risk}%
                    (シャープ: {calculateAssetSharpeRatio(asset.expectedReturn, asset.risk).toFixed(SHARPE_RATIO_DECIMALS)})
                  </li>
                ))}
              </ul>
            </Col>
          </Row>

          <Alert variant="secondary" className="mt-3 mb-0">
            <small>
              <strong>シャープレシオ</strong> = (期待リターン - リスクフリーレート) / リスク
              <br />
              リスク1単位あたりの超過リターンを表す指標です。値が大きいほど効率的な投資です。
            </small>
          </Alert>
        </Card.Body>
      </Card>

      <Modal
        modalIsOpen={isResetModalOpen}
        closeModal={handleResetCancel}
        contentLabel="設定リセット確認"
      >
        <div className="p-4">
          <h4 className="mb-3">設定をリセットしますか？</h4>
          <p className="mb-4">
            すべての設定がデフォルト値に戻ります。この操作は取り消せません。
          </p>
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={handleResetCancel}>
              キャンセル
            </Button>
            <Button variant="danger" onClick={handleResetConfirm}>
              リセット
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  )
}
