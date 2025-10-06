import api from './api'

export const authService = {
  async login(credentials) {
    const payload = {
      login: credentials.login || credentials.email,
      senha: credentials.senha || credentials.password
    }

    const response = await api.post('Usuario/AutorizarUsuario', payload)

    const data = response.data || {}
    const rawToken = data.auth ?? data.Auth
    const rawUser = data.usuario ?? data.Usuario ?? {}

    const usuario = {
      id: rawUser.id ?? rawUser.Id ?? null,
      nome: rawUser.nome ?? rawUser.Nome ?? rawUser.login ?? rawUser.Login ?? rawUser.userName ?? rawUser.UserName ?? 'Usuário',
      email: rawUser.email ?? rawUser.Email ?? '',
      perfil: Array.isArray(rawUser.roles ?? rawUser.Roles) ? (rawUser.roles ?? rawUser.Roles)?.[0] ?? '' : (rawUser.perfil ?? '')
    }

    return { token: rawToken, usuario }
  },

  async register(userData) {
    const payload = {
      login: userData.login || userData.email || userData.nome,
      senha: userData.senha || userData.password
    }
    const response = await api.post('Usuario/RegistrarUsuario', payload)
    return response.data
  },

  async getUserInfo() {
    const response = await api.get('Auth/usuario')
    return response.data
  },

  async logout(token) {
    try {
      if (token) {
        await api.post('Auth/logout', { token })
      }
    } catch (_) {
    }
  }
}

export default authService

