<template>
  <div class="financeiro-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <i class="pi pi-wallet"></i>
          <span>Área Financeira</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3">
          <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="reload" />
        </div>
      </template>
    </Toolbar>

    <!-- Resumo Financeiro -->
    <div class="grid mt-3">
      <div class="col-12 md:col-4">
        <Card class="elevated-card status-card">
          <template #content>
            <div class="flex align-items-center gap-3">
              <div class="status-icon success">
                <i class="pi pi-check-circle"></i>
              </div>
              <div>
                <div class="text-color-secondary text-sm">Pagos</div>
                <div class="text-2xl font-bold text-green-500">{{ formatCurrency(totalPago) }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-4">
        <Card class="elevated-card status-card">
          <template #content>
            <div class="flex align-items-center gap-3">
              <div class="status-icon warning">
                <i class="pi pi-clock"></i>
              </div>
              <div>
                <div class="text-color-secondary text-sm">Pendentes</div>
                <div class="text-2xl font-bold text-orange-500">{{ formatCurrency(totalPendente) }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="col-12 md:col-4">
        <Card class="elevated-card status-card">
          <template #content>
            <div class="flex align-items-center gap-3">
              <div class="status-icon danger">
                <i class="pi pi-exclamation-circle"></i>
              </div>
              <div>
                <div class="text-color-secondary text-sm">Vencidos</div>
                <div class="text-2xl font-bold text-red-500">{{ formatCurrency(totalVencido) }}</div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Tabela de Boletos/Mensalidades -->
    <Card class="main-card mt-3 elevated-card brand-datatable">
      <template #header>
        <div class="flex align-items-center justify-content-between">
          <h3>Boletos e Mensalidades</h3>
          <div class="flex gap-2">
            <Dropdown
              v-model="filtroStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Filtrar por status"
              @change="applyFilter"
              :showClear="true"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="boletosFiltrados"
          :paginator="true"
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} boletos"
          :loading="loading"
          responsiveLayout="scroll"
          dataKey="id"
        >
          <Column field="descricao" header="Descrição">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-file text-color-secondary"></i>
                <span class="font-semibold">{{ data.descricao }}</span>
              </div>
            </template>
          </Column>
          <Column field="competencia" header="Competência">
            <template #body="{ data }">
              {{ data.competencia }}
            </template>
          </Column>
          <Column field="vencimento" header="Vencimento">
            <template #body="{ data }">
              <div :class="{ 'text-red-500 font-bold': isVencido(data.vencimento) }">
                {{ formatDate(data.vencimento) }}
              </div>
            </template>
          </Column>
          <Column field="valor" header="Valor">
            <template #body="{ data }">
              <span class="font-semibold">{{ formatCurrency(data.valor) }}</span>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          <Column header="Ações" style="width: 180px">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-end">
                <Button
                  v-if="data.status === 'Pendente'"
                  label="Ver Boleto"
                  icon="pi pi-file-pdf"
                  class="p-button-sm p-button-info"
                  @click="verBoleto(data)"
                />
                <Button
                  v-if="data.status === 'Pendente'"
                  label="Pagar"
                  icon="pi pi-credit-card"
                  class="p-button-sm p-button-success"
                  @click="pagarBoleto(data)"
                />
                <Button
                  v-if="data.status === 'Pago'"
                  label="Comprovante"
                  icon="pi pi-download"
                  class="p-button-sm p-button-secondary"
                  @click="downloadComprovante(data)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-4 text-color-secondary">
              <i class="pi pi-inbox text-4xl mb-2"></i>
              <p>Nenhum boleto encontrado</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center py-4">
              <i class="pi pi-spin pi-spinner text-2xl"></i>
              <p class="mt-2">Carregando boletos...</p>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- Dialog de Pagamento -->
    <Dialog v-model:visible="dialogPagamento" :modal="true" :style="{ width: '600px' }" class="dialog-brand">
      <template #header>
        <div class="dialog-title">
          <i class="pi pi-credit-card"></i>
          <span>Realizar Pagamento</span>
        </div>
      </template>
      <div v-if="boletoSelecionado" class="p-fluid">
        <div class="field">
          <label>Descrição</label>
          <InputText :value="boletoSelecionado.descricao" disabled />
        </div>
        <div class="field">
          <label>Valor</label>
          <InputText :value="formatCurrency(boletoSelecionado.valor)" disabled />
        </div>
        <div class="field">
          <label>Forma de Pagamento</label>
          <Dropdown
            v-model="formaPagamento"
            :options="formasPagamento"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione a forma de pagamento"
          />
        </div>
        <div v-if="formaPagamento === 'pix'" class="field text-center">
          <div class="pix-qrcode">
            <i class="pi pi-qrcode text-6xl"></i>
            <p class="mt-2">Escaneie o QR Code para pagar via PIX</p>
            <p class="text-sm text-color-secondary">Código Pix: {{ boletoSelecionado.codigoPix }}</p>
            <Button label="Copiar código PIX" icon="pi pi-copy" class="p-button-sm mt-2" @click="copiarPix" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="dialogPagamento=false" />
        <Button label="Confirmar Pagamento" @click="confirmarPagamento" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'FinanceiroView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const loading = ref(false)
    const boletos = ref([])
    const filtroStatus = ref(null)
    const dialogPagamento = ref(false)
    const boletoSelecionado = ref(null)
    const formaPagamento = ref(null)

    const statusOptions = [
      { label: 'Pendente', value: 'Pendente' },
      { label: 'Pago', value: 'Pago' },
      { label: 'Vencido', value: 'Vencido' }
    ]

    const formasPagamento = [
      { label: 'PIX', value: 'pix' },
      { label: 'Cartão de Crédito', value: 'credito' },
      { label: 'Boleto Bancário', value: 'boleto' }
    ]

    // Mock de dados - substituir por chamada à API
    const loadBoletos = async () => {
      loading.value = true
      try {
        // Simulação de dados
        boletos.value = [
          {
            id: 1,
            descricao: 'Mensalidade Janeiro/2025',
            competencia: 'Janeiro/2025',
            vencimento: new Date('2025-01-10'),
            valor: 150.00,
            status: 'Pago',
            dataPagamento: new Date('2025-01-08'),
            codigoPix: '00020126330014BR.GOV.BCB.PIX0111123456789015204000053039865802BR5925ASSOCIACAO TESTE6014BELO HORIZONTE62070503***6304ABCD'
          },
          {
            id: 2,
            descricao: 'Mensalidade Fevereiro/2025',
            competencia: 'Fevereiro/2025',
            vencimento: new Date('2025-02-10'),
            valor: 150.00,
            status: 'Pendente',
            codigoPix: '00020126330014BR.GOV.BCB.PIX0111123456789015204000053039865802BR5925ASSOCIACAO TESTE6014BELO HORIZONTE62070503***6304WXYZ'
          },
          {
            id: 3,
            descricao: 'Mensalidade Março/2025',
            competencia: 'Março/2025',
            vencimento: new Date('2025-03-10'),
            valor: 150.00,
            status: 'Pendente',
            codigoPix: '00020126330014BR.GOV.BCB.PIX0111123456789015204000053039865802BR5925ASSOCIACAO TESTE6014BELO HORIZONTE62070503***63041234'
          },
          {
            id: 4,
            descricao: 'Taxa de Adesão',
            competencia: 'Dezembro/2024',
            vencimento: new Date('2024-12-31'),
            valor: 250.00,
            status: 'Vencido',
            codigoPix: '00020126330014BR.GOV.BCB.PIX0111123456789015204000053039865802BR5925ASSOCIACAO TESTE6014BELO HORIZONTE62070503***63045678'
          }
        ]
      } catch (error) {
        console.error('Erro ao carregar boletos:', error)
      } finally {
        loading.value = false
      }
    }

    const boletosFiltrados = computed(() => {
      if (!filtroStatus.value) return boletos.value
      return boletos.value.filter(b => b.status === filtroStatus.value)
    })

    const totalPago = computed(() => {
      return boletos.value
        .filter(b => b.status === 'Pago')
        .reduce((sum, b) => sum + b.valor, 0)
    })

    const totalPendente = computed(() => {
      return boletos.value
        .filter(b => b.status === 'Pendente')
        .reduce((sum, b) => sum + b.valor, 0)
    })

    const totalVencido = computed(() => {
      return boletos.value
        .filter(b => b.status === 'Vencido')
        .reduce((sum, b) => sum + b.valor, 0)
    })

    const formatCurrency = (value) => {
      if (!value) return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('pt-BR')
    }

    const isVencido = (date) => {
      return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString()
    }

    const getStatusSeverity = (status) => {
      const severities = {
        'Pago': 'success',
        'Pendente': 'warning',
        'Vencido': 'danger'
      }
      return severities[status] || 'info'
    }

    const applyFilter = () => {
      // Filtro aplicado via computed boletosFiltrados
    }

    const reload = async () => {
      await loadBoletos()
    }

    const verBoleto = (boleto) => {
      alert(`Abrindo boleto: ${boleto.descricao}`)
      // Implementar visualização/download do boleto
    }

    const pagarBoleto = (boleto) => {
      boletoSelecionado.value = boleto
      formaPagamento.value = null
      dialogPagamento.value = true
    }

    const downloadComprovante = (boleto) => {
      alert(`Baixando comprovante: ${boleto.descricao}`)
      // Implementar download do comprovante
    }

    const copiarPix = () => {
      if (boletoSelecionado.value?.codigoPix) {
        navigator.clipboard.writeText(boletoSelecionado.value.codigoPix)
        alert('Código PIX copiado para a área de transferência!')
      }
    }

    const confirmarPagamento = () => {
      if (!formaPagamento.value) {
        alert('Selecione uma forma de pagamento')
        return
      }
      alert(`Pagamento confirmado via ${formaPagamento.value}`)
      dialogPagamento.value = false
      // Implementar confirmação de pagamento
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        authStore.initAuth()
      }
      if (!authStore.isAuthenticated && !localStorage.getItem('authToken')) {
        router.push('/login')
        return
      }
      await loadBoletos()
    })

    return {
      loading,
      boletos,
      boletosFiltrados,
      filtroStatus,
      statusOptions,
      formasPagamento,
      dialogPagamento,
      boletoSelecionado,
      formaPagamento,
      totalPago,
      totalPendente,
      totalVencido,
      formatCurrency,
      formatDate,
      isVencido,
      getStatusSeverity,
      applyFilter,
      reload,
      verBoleto,
      pagarBoleto,
      downloadComprovante,
      copiarPix,
      confirmarPagamento
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

.elevated-card :deep(.p-card) {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
}

.status-card :deep(.p-card-body) {
  padding: 1.5rem;
}

.status-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.status-icon.success {
  background-color: #d4edda;
  color: #155724;
}

.status-icon.warning {
  background-color: #fff3cd;
  color: #856404;
}

.status-icon.danger {
  background-color: #f8d7da;
  color: #721c24;
}

.pix-qrcode {
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.dialog-title i {
  font-size: 1.5rem;
}
</style>
