import api from './api'

export const authService = {
  async login(credentials) {
    const payload = {
      login: credentials.login || credentials.email,
      senha: credentials.senha || credentials.password
    }

    const response = await api.post('/api/Usuario/AutorizarUsuario', payload)

    const { auth, usuario } = response.data
    return { token: auth, usuario }
  },

  async register(userData) {
    const payload = {
      login: userData.login || userData.email || userData.nome,
      senha: userData.senha || userData.password
    }
    const response = await api.post('/api/Usuario/RegistrarUsuario', payload)
    return response.data
  },

  async getUserInfo() {
    const response = await api.get('/api/Auth/usuario')
    return response.data
  },

  async logout(token) {
    try {
      if (token) {
        await api.post('/api/Auth/logout', { token })
      }
    } catch (_) {
      // ignore
    }
  }
}

export default authService

