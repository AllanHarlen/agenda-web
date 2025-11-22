<template>
  <div class="equipamento-form-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <Button icon="pi pi-arrow-left" class="p-button-text" @click="goBack" />
          <i class="pi pi-desktop"></i>
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
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="nome">Nome *</label>
                <InputText id="nome" v-model="form.nome" :class="{ 'p-invalid': errors.nome }" />
                <small v-if="errors.nome" class="p-error">{{ errors.nome }}</small>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field">
                <label for="tipo">Tipo</label>
                <Dropdown
                  id="tipo"
                  v-model="form.tipo"
                  :options="tipos"
                  placeholder="Selecione o tipo"
                  :showClear="true"
                />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="marca">Marca</label>
                <InputText id="marca" v-model="form.marca" />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="modelo">Modelo</label>
                <InputText id="modelo" v-model="form.modelo" />
              </div>
            </div>

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="numeroSerie">Número de Série</label>
                <InputText id="numeroSerie" v-model="form.numeroSerie" />
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

            <div class="col-12 md:col-4">
              <div class="field">
                <label for="localizacao">Localização</label>
                <InputText id="localizacao" v-model="form.localizacao" placeholder="Ex: Sala 101" />
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
import { useEquipamentoStore } from '@/stores/equipamentoStore'
import { useAuthStore } from '@/stores/authStore'
import { equipamentoService } from '@/services/equipamentoService'

export default {
  name: 'EquipamentoFormView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const equipamentoStore = useEquipamentoStore()
    const authStore = useAuthStore()

    const isEdit = computed(() => !!route.params.id)
    const pageTitle = computed(() => isEdit.value ? 'Editar Equipamento' : 'Novo Equipamento')

    const form = ref({
      nome: '',
      tipo: null,
      marca: '',
      modelo: '',
      numeroSerie: '',
      dataAquisicao: null,
      estado: null,
      localizacao: ''
    })

    const errors = ref({})
    const saving = ref(false)

    const tipos = [
      'Computador',
      'Notebook',
      'Monitor',
      'Impressora',
      'Scanner',
      'Projetor',
      'Servidor',
      'Roteador',
      'Switch',
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
      if (!form.value.nome?.trim()) {
        errors.value.nome = 'Nome é obrigatório'
      }
      return Object.keys(errors.value).length === 0
    }

    const save = async () => {
      if (!validate()) return

      saving.value = true
      try {
        const payload = {
          Nome: form.value.nome,
          Tipo: form.value.tipo,
          Marca: form.value.marca,
          Modelo: form.value.modelo,
          NumeroSerie: form.value.numeroSerie,
          DataAquisicao: form.value.dataAquisicao,
          Estado: form.value.estado,
          Localizacao: form.value.localizacao
        }

        if (isEdit.value) {
          await equipamentoStore.updateEquipamento(route.params.id, payload)
        } else {
          await equipamentoStore.addEquipamento(payload)
        }

        router.push('/equipamentos')
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        } else {
          alert('Erro ao salvar equipamento: ' + (error.response?.data?.message || error.message))
        }
      } finally {
        saving.value = false
      }
    }

    const goBack = () => {
      router.push('/equipamentos')
    }

    const loadEquipamento = async () => {
      if (!isEdit.value) return

      try {
        const data = await equipamentoService.getById(route.params.id)
        form.value = {
          nome: data.nome || data.Nome || '',
          tipo: data.tipo || data.Tipo || null,
          marca: data.marca || data.Marca || '',
          modelo: data.modelo || data.Modelo || '',
          numeroSerie: data.numeroSerie || data.NumeroSerie || '',
          dataAquisicao: data.dataAquisicao || data.DataAquisicao ? new Date(data.dataAquisicao || data.DataAquisicao) : null,
          estado: data.estado || data.Estado || null,
          localizacao: data.localizacao || data.Localizacao || ''
        }
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        } else {
          alert('Erro ao carregar equipamento')
          router.push('/equipamentos')
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
      await loadEquipamento()
    })

    return {
      form,
      errors,
      saving,
      pageTitle,
      tipos,
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
