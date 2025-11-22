<template>
  <div class="confirmacao">
    <PublicHeader />

    <main class="confirmacao-main">
      <div class="confirmacao-container">
        <Card class="confirmacao-card">
          <template #content>
            <div class="success-icon">
              <i class="pi pi-check-circle"></i>
            </div>

            <h1>Proposta Enviada com Sucesso!</h1>

            <p class="confirmacao-message">
              Sua proposta de adesão foi registrada com sucesso. Você pode fazer o download do documento em PDF abaixo.
            </p>

            <div class="info-box">
              <i class="pi pi-info-circle"></i>
              <div class="info-content">
                <h3>Próximos Passos</h3>
                <ol>
                  <li>Baixe e imprima o documento PDF</li>
                  <li>Assine o documento</li>
                  <li>Entregue na sede da ASPJ-PE ou envie digitalizado para aspj@aspj-pe.org.br</li>
                </ol>
              </div>
            </div>

            <div class="dados-resumo" v-if="formData">
              <h3>Resumo dos Dados</h3>
              <div class="resumo-grid">
                <div class="resumo-item">
                  <strong>Nome:</strong>
                  <span>{{ formData.nome }}</span>
                </div>
                <div class="resumo-item">
                  <strong>CPF:</strong>
                  <span>{{ formData.cpf }}</span>
                </div>
                <div class="resumo-item">
                  <strong>E-mail:</strong>
                  <span>{{ formData.email }}</span>
                </div>
                <div class="resumo-item">
                  <strong>Cargo:</strong>
                  <span>{{ formData.cargo }}</span>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <Button
                icon="pi pi-download"
                label="Baixar PDF"
                class="btn-download"
                @click="downloadPDF"
                severity="success"
                size="large"
              />

              <Button
                icon="pi pi-home"
                label="Voltar para Início"
                outlined
                @click="$router.push('/')"
              />
            </div>
          </template>
        </Card>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PublicHeader from '../components/shared/PublicHeader.vue'
import { downloadAdesaoPDF } from '../services/pdfService'

export default {
  name: 'PreCadastroConfirmacaoView',
  components: {
    PublicHeader
  },
  setup() {
    const router = useRouter()
    const formData = ref(null)

    onMounted(() => {
      const savedData = localStorage.getItem('pre-cadastro-data')
      if (savedData) {
        formData.value = JSON.parse(savedData)
      } else {
        // If no data, redirect to form
        router.push('/pre-cadastro')
      }
    })

    const downloadPDF = () => {
      if (formData.value) {
        downloadAdesaoPDF(formData.value)
      }
    }

    return {
      formData,
      downloadPDF
    }
  }
}
</script>

<style scoped>
.confirmacao {
  min-height: 100vh;
  background: #f5f5f5;
}

.confirmacao-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.confirmacao-card {
  text-align: center;
}

.success-icon {
  margin: 2rem 0;
}

.success-icon i {
  font-size: 5rem;
  color: #22c55e;
}

.confirmacao-card h1 {
  color: #225c5a;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.confirmacao-message {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-box {
  background: #e0f2fe;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  text-align: left;
}

.info-box i {
  font-size: 1.5rem;
  color: #0ea5e9;
  flex-shrink: 0;
}

.info-content h3 {
  color: #0369a1;
  margin-bottom: 0.75rem;
}

.info-content ol {
  margin: 0;
  padding-left: 1.5rem;
  color: #0c4a6e;
}

.info-content ol li {
  margin: 0.5rem 0;
}

.dados-resumo {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.dados-resumo h3 {
  color: #225c5a;
  margin-bottom: 1rem;
  text-align: center;
}

.resumo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.resumo-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.resumo-item strong {
  color: #666;
  font-size: 0.9rem;
}

.resumo-item span {
  color: #333;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-download {
  background: #22c55e !important;
  border-color: #22c55e !important;
}

.btn-download:hover {
  background: #16a34a !important;
  border-color: #16a34a !important;
}

@media (max-width: 768px) {
  .confirmacao-card h1 {
    font-size: 1.5rem;
  }

  .success-icon i {
    font-size: 3.5rem;
  }

  .info-box {
    flex-direction: column;
    text-align: center;
  }

  .info-content {
    text-align: left;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>
