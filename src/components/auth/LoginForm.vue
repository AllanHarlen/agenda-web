<template>
  <div>
    <Card class="login-card">
      <template #content>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <label for="email">Email</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon bg-cyan-50 border-cyan-200">
                <i class="pi pi-envelope text-cyan-600"></i>
              </span>
              <InputText 
                id="email"
                v-model="credentials.email"
                type="text"
                placeholder="Email"
                class="w-full input-lg"
                :class="{ 'p-invalid': errors.email }"
              />
            </div>
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon bg-cyan-50 border-cyan-200">
                <i class="pi pi-lock text-cyan-600"></i>
              </span>
              <Password 
                id="password"
                v-model="credentials.senha"
                placeholder="Senha"
                class="w-full input-lg"
                :class="{ 'p-invalid': errors.senha }"
                toggleMask
                :feedback="false"
              />
            </div>
            <small v-if="errors.senha" class="p-error">{{ errors.senha }}</small>
          </div>

          <div class="remember-row">
            <div class="remember-left">
              <Checkbox v-model="rememberMe" binary />
              <span class="remember-text">Lembrar de mim</span>
            </div>
          </div>

          <Button 
            type="submit" 
            label="Entrar" 
            class="w-full btn-lg" 
            :loading="loading"
            :disabled="loading"
          />

          <Divider />

          <div class="text-center register-link">
            <p>Não tem conta? <router-link to="/register" class="text-primary">Criar conta</router-link></p>
          </div>
        </form>
      </template>
    </Card>
  </div>
 </template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const credentials = reactive({
      email: '',
      senha: ''  // ← ALTERADO de 'password' para 'senha'
    })

    const errors = reactive({})
    const loading = ref(false)
    const rememberMe = ref(false)

    const validateForm = () => {
      errors.email = !credentials.email ? 'Email é obrigatório' : ''
      errors.senha = !credentials.senha ? 'Senha é obrigatória' : ''  // ← ALTERADO
      return !errors.email && !errors.senha  // ← ALTERADO
    }

    onMounted(() => {
      const savedLogin = localStorage.getItem('login')
      const savedPassword = localStorage.getItem('password')
      if (savedLogin && savedPassword) {
        credentials.email = savedLogin
        credentials.senha = savedPassword
        rememberMe.value = true
      }
    })

    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await authStore.login(credentials)
        if (rememberMe.value) {
          localStorage.setItem('login', credentials.email)
          localStorage.setItem('password', credentials.senha)
        } else {
          localStorage.removeItem('login')
          localStorage.removeItem('password')
        }
        
        toast.add({
          severity: 'success',
          summary: 'Login realizado!',
          detail: 'Bem-vindo de volta!',
          life: 3000
        })

        router.push('/contatos')
      } catch (error) {
        // MELHORIA: Log detalhado do erro
        console.error('Erro completo no login:', error)
        
        let errorMessage = 'Credenciais inválidas'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Servidor indisponível. Verifique se o backend está rodando.'
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro no login',
          detail: errorMessage,
          life: 5000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      credentials,
      errors,
      loading,
      rememberMe,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 600px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-lg :deep(.p-inputtext),
.input-lg :deep(.p-password-input) {
  height: 48px;
  font-size: 16px;
}

:deep(.p-button.btn-lg) {
  height: 50px;
  font-size: 16px;
  background: #73a9a7;
  border-color: #73a9a7;
}

:deep(.p-button.btn-lg:enabled:hover),
:deep(.p-button.btn-lg:enabled:focus) {
  background: #5f9593;
  border-color: #5f9593;
  box-shadow: 0 0 0 0.2rem rgba(115, 169, 167, 0.15);
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-text {
  font-size: 0.95rem;
}

.register-link :deep(a) {
  color: #73a9a7;
}
.register-link :deep(a:hover) {
  color: #5f9593;
}
</style>