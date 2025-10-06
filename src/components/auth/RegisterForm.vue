<template>
  <div>
    <Card class="register-card">
      <template #content>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="field">
            <label for="name">Login</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon bg-cyan-50 border-cyan-200">
                <i class="pi pi-user text-cyan-600"></i>
              </span>
              <InputText 
                id="name"
                v-model="userData.login"
                placeholder="Seu login"
                class="w-full input-lg"
                :class="{ 'p-invalid': errors.name }"
              />
            </div>
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          

          <div class="field">
            <label for="password">Senha</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon bg-cyan-50 border-cyan-200">
                <i class="pi pi-lock text-cyan-600"></i>
              </span>
              <Password 
                id="password"
                v-model="userData.senha"
                placeholder="Sua senha"
                class="w-full input-lg"
                :class="{ 'p-invalid': errors.password }"
                toggleMask
                :feedback="true"
              >
                <template #header>
                  <h6 class="text-slate-700 font-semibold mb-2">Escolha uma senha</h6>
                </template>
                <template #footer>
                  <Divider />
                  <p class="text-xs text-slate-600">Sugestões:</p>
                  <ul class="pl-4 ml-0 mt-2 text-xs text-slate-600 list-disc">
                    <li>Mínimo 8 caracteres</li>
                    <li>Letras maiúsculas e minúsculas</li>
                    <li>Números e símbolos</li>
                  </ul>
                </template>
              </Password>
            </div>
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <div class="field">
            <label for="confirmPassword">Confirmar Senha</label>
            <div class="p-inputgroup">
              <span class="p-inputgroup-addon bg-cyan-50 border-cyan-200">
                <i class="pi pi-lock text-cyan-600"></i>
              </span>
              <Password 
                id="confirmPassword"
                v-model="userData.confirmPassword"
                placeholder="Confirme sua senha"
                class="w-full input-lg"
                :class="{ 'p-invalid': errors.confirmPassword }"
                toggleMask
                :feedback="false"
              />
            </div>
            <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
          </div>

          <Button 
            type="submit" 
            label="Criar Conta" 
            class="w-full btn-lg" 
            :loading="loading"
            :disabled="loading"
          />

          <Divider />

          <div class="text-center">
            <p>Já tem conta? <router-link to="/login" class="text-primary">Fazer login</router-link></p>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'RegisterForm',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const userData = reactive({
      login: '',
      senha: '',
      confirmPassword: ''
    })

    const errors = reactive({})
    const loading = ref(false)

    const validateForm = () => {
      errors.name = ''
      errors.email = ''
      errors.password = !userData.senha ? 'Senha é obrigatória' : userData.senha.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : ''
      errors.confirmPassword = userData.senha !== userData.confirmPassword ? 'Senhas não coincidem' : ''
      
      return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await authStore.register({
          login: userData.login,
          senha: userData.senha
        })

        // Login automático após registro
        await authStore.login({
          login: userData.login,
          senha: userData.senha
        })

        toast.add({
          severity: 'success',
          summary: 'Conta criada!',
          detail: 'Sua conta foi criada e você foi autenticado.',
          life: 3000
        })

        router.push({ name: 'dashboard' })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Erro no registro',
          detail: error.response?.data?.message || 'Erro ao criar conta',
          life: 5000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      userData,
      errors,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 600px;
}

.register-form {
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

/* Correções do Password dentro do InputGroup */
.register-form :deep(.p-password) {
  width: 100%;
}
.register-form :deep(.p-inputgroup .p-password) {
  flex: 1;
}
.register-form :deep(.p-inputgroup .p-password-input) {
  height: 48px;
  font-size: 16px;
}
.register-form :deep(.p-password .p-password-input) {
  padding-right: 2.5rem; /* espaço para o botão olho */
}
.register-form :deep(.p-password .p-password-toggle-mask) {
  right: 0.5rem;
  width: 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>