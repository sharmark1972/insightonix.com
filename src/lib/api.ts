import { useAuthStore } from '../store/useAuthStore'

const API_BASE = '/api'

interface RequestOptions extends RequestInit {
  token?: string
}

export const api = {
  async get(endpoint: string, token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${endpoint}`, { headers })
    return handleResponse(res)
  },

  async post(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {}
    
    // Don't set Content-Type for FormData, browser sets it with boundary
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    const body = data instanceof FormData ? data : JSON.stringify(data)

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body,
    })
    return handleResponse(res)
  },

  async put(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {}

    // Don't set Content-Type for FormData, browser sets it with boundary
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) headers['Authorization'] = `Bearer ${token}`

    const body = data instanceof FormData ? data : JSON.stringify(data)

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body,
    })
    return handleResponse(res)
  },

  async delete(endpoint: string, token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers,
    })
    return handleResponse(res)
  },
}

async function handleResponse(res: Response) {
  let data
  const contentType = res.headers.get('content-type')
  
  try {
    if (contentType && contentType.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      try {
        data = JSON.parse(text)
      } catch {
        data = { error: text || res.statusText }
      }
    }
  } catch (error) {
    data = { error: 'Failed to parse response' }
  }

  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout()
    }
    const error = new Error(data.error || data.message || 'Something went wrong') as any
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}
