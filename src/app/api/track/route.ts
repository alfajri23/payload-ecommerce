import { getPayload } from 'payload'
import config from '@payload-config'

function getDeviceType(userAgent: string | null): 'mobile' | 'tablet' | 'desktop' {
  if (!userAgent) return 'desktop'
  const ua = userAgent.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet'
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua,
    )
  ) {
    return 'mobile'
  }
  return 'desktop'
}

export async function POST(req: Request) {
  try {
    let body: any
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      body = await req.json()
    } else {
      const text = await req.text()
      body = JSON.parse(text)
    }

    const { path, referrer, sessionId } = body || {}

    if (!path || !sessionId) {
      return Response.json(
        { success: false, error: 'Path and sessionId are required' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    const userAgent = req.headers.get('user-agent')
    const device = getDeviceType(userAgent)

    await payload.create({
      collection: 'page-views',
      data: {
        path,
        referrer: typeof referrer === 'string' && referrer.trim() ? referrer.trim() : 'Direct',
        device,
        sessionId,
      },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
