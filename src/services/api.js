import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001'
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Token adicionado ao request:', token.substring(0, 20) + '...')
    }
    
    console.log('📤 Request para:', config.url)
    return config
  },
  (error) => {
    console.error('❌ Erro no request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor principal para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response recebido:', response.status, response.config.url)
    return response
  },
  async (error) => {
    console.error('❌ Erro na response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })

    const originalRequest = error.config

    if (error.response?.status === 401) {
      console.log('🔒 Não autorizado - limpando sessão e redirecionando')
      try {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      } catch (_) {}
      window.location.href = '/login?error=unauthorized'
    }

    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout na conexão com a API')
      throw new Error('Timeout: Servidor não respondeu a tempo')
    }

    if (error.message === 'Network Error') {
      console.error('🌐 Erro de rede: Backend pode estar offline')
      throw new Error('Erro de conexão. Verifique se o backend está rodando.')
    }

    return Promise.reject(error)
  }
)

export const checkConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { 
      timeout: 3000 
    })
    console.log('🌐 Conexão com backend: OK')
    return true
  } catch (error) {
    console.error('❌ Backend offline:', error.message)
    return false
  }
}

// Função para debug da API
export const debugAPI = () => {
  return {
    baseURL: API_BASE_URL,
    env: import.meta.env.VITE_API_BASE_URL,
    hasToken: !!localStorage.getItem('authToken')
  }
}

export default api