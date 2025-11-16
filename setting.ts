import Env from './next.config.js'
const isProd = process.env.NODE_ENV === 'production'

export default {
  isProd,
  basePath: Env.basePath,
  apiPath: isProd ? '' : 'http://localhost:8000',
  title: '🫜 マーケット・ポートフォリオとトービンの分離定理を理解する！ 🫜',
  description: 'マーケット・ポートフォリオとトービンの分離定理を理解する！ 🫜🫜🫜',
  keywords: []
}
