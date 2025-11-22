<template>
  <div class="afiliado-form-view">
    <Toolbar v-if="!isPublic" class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <Button icon="pi pi-arrow-left" class="p-button-text" @click="goBack" />
          <i class="pi pi-id-card"></i>
          <span>{{ pageTitle }}</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3">
          <Button label="Cancelar" class="p-button-text" @click="goBack" :disabled="saving" />
          <Button label="Salvar" icon="pi pi-save" :loading="saving" @click="save" />
        </div>
      </template>
    </Toolbar>

    <div v-if="isPublic" class="public-header text-center mb-4">
      <h1 class="text-4xl font-bold mb-2">Associe-se</h1>
      <p class="text-xl text-color-secondary">Faça parte da nossa comunidade</p>
    </div>

    <Card class="main-card elevated-card" :class="{ 'mt-3': !isPublic }">
      <template #content>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12">
              <h3 class="mb-3">Dados Pessoais</h3>
            </div>

            <div class="col-12 md:col-8">
              <div class="field">
                <label for="nome">Nome Completo *</label>
                <InputText id="nome" v-model="form.nome" :class="{ 'p-invalid': errors.nome }" />
                <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="cpf">CPF *</label>
                <InputMask id="cpf" v-model="form.cpf" mask="999.999.999-99" :class="{ 'p-invalid': errors.cpf }" />
                <small v-if="errors.cpf" class="p-error">{{ errors.cpf }}</small>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="email">Email *</label>
                <InputText id="email" v-model="form.email" type="email" :class="{ 'p-invalid': errors.email }" />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>
            </div>

            <div class="col-12 md:col-3">
              <div class="field">
                <label for="telefone">Telefone *</label>
                <InputMask id="telefone" v-model="form.telefone" mask="(99) 99999-9999" :class="{ 'p-invalid': errors.telefone }" />
                <small v-if="errors.telefone" class="p-error">{{ errors.telefone }}</small>
              </div>
            </div>

            <div class="col-12 md:col-3">
              <div class="field">
                <label for="dataNascimento">Data de Nascimento</label>
                <Calendar
                  id="dataNascimento"
                  v-model="form.dataNascimento"
                  dateFormat="dd/mm/yy"
                  :showIcon="true"
                />
              </div>
            </div>

            <div class="col-12 mt-3">
              <h3 class="mb-3">Endereço</h3>
            </div>

            <div class="col-12 md:col-3">
              <div class="field">
                <label for="cep">CEP</label>
                <InputMask id="cep" v-model="form.cep" mask="99999-999" @blur="buscarCep" />
              </div>
            </div>

            <div class="col-12 md:col-9">
              <div class="field">
                <label for="endereco">Endereço</label>
                <InputText id="endereco" v-model="form.endereco" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="cidade">Cidade</label>
                <InputText id="cidade" v-model="form.cidade" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="estado">Estado</label>
                <Dropdown
                  id="estado"
                  v-model="form.estado"
                  :options="estados"
                  placeholder="Selecione o estado"
                  :showClear="true"
                />
              </div>
            </div>

            <div v-if="!isPublic && !isEdit" class="col-12 md:col-6">
              <div class="field">
                <label for="dataAfiliacao">Data de Afiliação</label>
                <Calendar
                  id="dataAfiliacao"
                  v-model="form.dataAfiliacao"
                  dateFormat="dd/mm/yy"
                  :showIcon="true"
                />
              </div>
            </div>

            <div v-if="!isPublic" class="col-12 md:col-6">
              <div class="field">
                <label for="status">Status</label>
                <Dropdown
                  id="status"
                  v-model="form.status"
                  :options="statusOptions"
                  placeholder="Selecione o status"
                />
              </div>
            </div>

            <div v-if="isPublic" class="col-12 mt-4 text-center">
              <Button label="Enviar Solicitação" icon="pi pi-send" :loading="saving" @click="save" class="p-button-lg" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAfiliadoStore } from '@/stores/afiliadoStore'
import { useAuthStore } from '@/stores/authStore'
import { afiliadoService } from '@/services/afiliadoService'

export default {
  name: 'AfiliadoFormView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const afiliadoStore = useAfiliadoStore()
    const authStore = useAuthStore()

    const isEdit = computed(() => !!route.params.id)
    const isPublic = computed(() => route.path.includes('/associe-se'))
    const pageTitle = computed(() => {
      if (isPublic.value) return 'Associe-se'
      return isEdit.value ? 'Editar Afiliado' : 'Novo Afiliado'
    })

    const form = ref({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      dataNascimento: null,
      endereco: '',
      cidade: '',
      estado: null,
      cep: '',
      dataAfiliacao: new Date(),
      status: 'Ativo'
    })

    const errors = ref({})
    const saving = ref(false)

    const estados = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
      'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    const statusOptions = ['Ativo', 'Inativo', 'Pendente']

    const validate = () => {
      errors.value = {}
      if (!form.value.nome?.trim()) {
        errors.value.nome = 'Nome é obrigatório'
      }
      if (!form.value.cpf?.trim()) {
        errors.value.cpf = 'CPF é obrigatório'
      }
      if (!form.value.email?.trim()) {
        errors.value.email = 'Email é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Email inválido'
      }
      if (!form.value.telefone?.trim()) {
        errors.value.telefone = 'Telefone é obrigatório'
      }
      return Object.keys(errors.value).length === 0
    }

    const buscarCep = async () => {
      const cep = form.value.cep?.replace(/\D/g, '')
      if (!cep || cep.length !== 8) return

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          form.value.endereco = data.logradouro
          form.value.cidade = data.localidade
          form.value.estado = data.uf
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }

    const save = async () => {
      if (!validate()) return

      saving.value = true
      try {
        const payload = {
          Nome: form.value.nome,
          CPF: form.value.cpf?.replace(/\D/g, ''),
          Email: form.value.email,
          Telefone: form.value.telefone?.replace(/\D/g, ''),
          DataNascimento: form.value.dataNascimento,
          Endereco: form.value.endereco,
          Cidade: form.value.cidade,
          Estado: form.value.estado,
          CEP: form.value.cep?.replace(/\D/g, ''),
          DataAfiliacao: form.value.dataAfiliacao,
          Status: form.value.status
        }

        if (isEdit.value) {
          await afiliadoStore.updateAfiliado(route.params.id, payload)
        } else {
          await afiliadoStore.addAfiliado(payload)
        }

        if (isPublic.value) {
          alert('Solicitação enviada com sucesso! Entraremos em contato em breve.')
          router.push('/login')
        } else {
          router.push('/afiliados')
        }
      } catch (error) {
        if (error.response?.status === 401 && !isPublic.value) {
          authStore.logout()
          router.push('/login')
        } else {
          alert('Erro ao salvar afiliado: ' + (error.response?.data?.message || error.message))
        }
      } finally {
        saving.value = false
      }
    }

    const goBack = () => {
      router.push('/afiliados')
    }

    const loadAfiliado = async () => {
      if (!isEdit.value || isPublic.value) return

      try {
        const data = await afiliadoService.getById(route.params.id)
        form.value = {
          nome: data.nome || data.Nome || '',
          cpf: data.cpf || data.CPF || '',
          email: data.email || data.Email || '',
          telefone: data.telefone || data.Telefone || '',
          dataNascimento: data.dataNascimento || data.DataNascimento ? new Date(data.dataNascimento || data.DataNascimento) : null,
          endereco: data.endereco || data.Endereco || '',
          cidade: data.cidade || data.Cidade || '',
          estado: data.estado || data.Estado || null,
          cep: data.cep || data.CEP || '',
          dataAfiliacao: data.dataAfiliacao || data.DataAfiliacao ? new Date(data.dataAfiliacao || data.DataAfiliacao) : new Date(),
          status: data.status || data.Status || 'Ativo'
        }
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        } else {
          alert('Erro ao carregar afiliado')
          router.push('/afiliados')
        }
      }
    }

    onMounted(async () => {
      if (!isPublic.value) {
        if (!authStore.isAuthenticated) {
          authStore.initAuth()
        }
        if (!authStore.isAuthenticated && !localStorage.getItem('authToken')) {
          router.push('/login')
          return
        }
      }
      await loadAfiliado()
    })

    return {
      form,
      errors,
      saving,
      pageTitle,
      estados,
      statusOptions,
      isEdit,
      isPublic,
      save,
      goBack,
      buscarCep
    }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }

.brand-toolbar :deep(.p-toolbar) {
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.toolbar-title {
  color: #000;
}

.toolbar-title i {
  font-size: 1.5rem;
}

.toolbar-title :deep(.p-button-text) {
  color: #000;
}

.elevated-card :deep(.p-card) {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
}

.p-invalid {
  border-color: #e24c4c;
}

.p-error {
  color: #e24c4c;
  font-size: 0.875rem;
}

.public-header {
  margin-top: 3rem;
}
</style>
