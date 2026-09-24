const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Backend request timed out.')
    }

    throw new Error(error.message || 'Backend is unavailable.')
  } finally {
    clearTimeout(timeout)
  }
}

export async function healthCheck() {
  try {
    return await request('/api/health')
  } catch (_error) {
    return { status: 'unavailable', app: 'SahaySign' }
  }
}

export async function textToSign(payload) {
  try {
    return await request('/api/text-to-sign', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    const fallback = {
      text: payload.text,
      language: payload.language || 'en',
      signLanguage: payload.signLanguage || 'ISL',
      glossSequence: [],
      error: error.message,
    }

    return fallback
  }
}

export async function generateSign(payload) {
  try {
    return await request('/api/generate-sign', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    return {
      glossSequence: [],
      motionSequence: [],
      error: error.message,
    }
  }
}
