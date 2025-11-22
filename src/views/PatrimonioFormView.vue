<template>
  <div class="patrimonio-form-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <Button icon="pi pi-arrow-left" class="p-button-text" @click="goBack" />
          <i class="pi pi-building"></i>
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

    <Card class="main-card mt-3 elevated-card">
      <template #content>
        <div class="p-fluid">
          <div class="grid">
            <div class="col-12 md:col-8">
              <div class="field">
                <label for="descricao">Descrição *</label>
                <InputText id="descricao" v-model="form.descricao" :class="{ 'p-invalid': errors.descricao }" />
                <small v-if="errors.descricao" class="p-error">{{ errors.descricao }}</small>
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="categoria">Categoria</label>
                <Dropdown
                  id="categoria"
                  v-model="form.categoria"
                  :options="categorias"
                  placeholder="Selecione uma categoria"
                  :showClear="true"
                />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="valor">Valor</label>
                <InputNumber
                  id="valor"
                  v-model="form.valor"
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="dataAquisicao">Data de Aquisição</label>
                <Calendar
                  id="dataAquisicao"
                  v-model="form.dataAquisicao"
                  dateFormat="dd/mm/yy"
                  :showIcon="true"
                />
              </div>
            </div>

            <div class="col-12 md:col-4">
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

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="localizacao">Localização</label>
                <InputText id="localizacao" v-model="form.localizacao" placeholder="Ex: Sala 101, Prédio A" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="observacoes">Observações</label>
                <Textarea id="observacoes" v-model="form.observacoes" rows="3" />
              </div>
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
import { usePatrimonioStore } from '@/stores/patrimonioStore'
import { useAuthStore } from '@/stores/authStore'
import { patrimonioService } from '@/services/patrimonioService'

export default {
  name: 'PatrimonioFormView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const patrimonioStore = usePatrimonioStore()
    const authStore = useAuthStore()

    const isEdit = computed(() => !!route.params.id)
    const pageTitle = computed(() => isEdit.value ? 'Editar Patrimônio' : 'Novo Patrimônio')

    const form = ref({
      descricao: '',
      categoria: null,
      valor: 0,
      dataAquisicao: null,
      estado: null,
      localizacao: '',
      observacoes: ''
    })

    const errors = ref({})
    const saving = ref(false)

    const categorias = [
      'Imóvel',
      'Veículo',
      'Equipamento',
      'Mobiliário',
      'Tecnologia',
      'Outros'
    ]

    const estados = [
      'Novo',
      'Bom',
      'Regular',
      'Ruim'
    ]

    const validate = () => {
      errors.value = {}
      if (!form.value.descricao?.trim()) {
        errors.value.descricao = 'Descrição é obrigatória'
      }
      return Object.keys(errors.value).length === 0
    }

    const save = async () => {
      if (!validate()) return

      saving.value = true
      try {
        const payload = {
          Descricao: form.value.descricao,
          Categoria: form.value.categoria,
          Valor: form.value.valor,
          DataAquisicao: form.value.dataAquisicao,
          Estado: form.value.estado,
          Localizacao: form.value.localizacao,
          Observacoes: form.value.observacoes
        }

        if (isEdit.value) {
          await patrimonioStore.updatePatrimonio(route.params.id, payload)
        } else {
          await patrimonioStore.addPatrimonio(payload)
        }

        router.push('/patrimonios')
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        } else {
          alert('Erro ao salvar patrimônio: ' + (error.response?.data?.message || error.message))
        }
      } finally {
        saving.value = false
      }
    }

    const goBack = () => {
      router.push('/patrimonios')
    }

    const loadPatrimonio = async () => {
      if (!isEdit.value) return

      try {
        const data = await patrimonioService.getById(route.params.id)
        form.value = {
          descricao: data.descricao || data.Descricao || '',
          categoria: data.categoria || data.Categoria || null,
          valor: data.valor || data.Valor || 0,
          dataAquisicao: data.dataAquisicao || data.DataAquisicao ? new Date(data.dataAquisicao || data.DataAquisicao) : null,
          estado: data.estado || data.Estado || null,
          localizacao: data.localizacao || data.Localizacao || '',
          observacoes: data.observacoes || data.Observacoes || ''
        }
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        } else {
          alert('Erro ao carregar patrimônio')
          router.push('/patrimonios')
        }
      }
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        authStore.initAuth()
      }
      if (!authStore.isAuthenticated && !localStorage.getItem('authToken')) {
        router.push('/login')
        return
      }
      await loadPatrimonio()
    })

    return {
      form,
      errors,
      saving,
      pageTitle,
      categorias,
      estados,
      save,
      goBack
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
</style>
