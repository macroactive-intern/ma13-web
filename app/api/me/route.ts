import { proxyAuthenticatedRequest } from '@/lib/proxy-request'

export async function GET() {
  return proxyAuthenticatedRequest('/api/me')
}
