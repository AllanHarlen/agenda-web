<template>
  <div class="pre-cadastro">
    <PublicHeader />

    <main class="form-main">
      <div class="form-container">
        <div class="form-header">
          <img src="/logo.svg" alt="ASPJ-PE Logo" class="form-logo" />
          <h1>PROPOSTA DE ADESÃO DO SERVIDOR</h1>
        </div>

        <Card>
          <template #content>
            <form @submit.prevent="handleSubmit" class="cadastro-form">
              <!-- Tipo de Cadastro -->
              <div class="section-header">Tipo de Cadastro</div>
              <div class="form-row">
                <div class="field">
                  <label>Tipo</label>
                  <div class="radio-group">
                    <div class="radio-item">
                      <RadioButton v-model="formData.tipoCadastro" inputId="cadastro" value="01" />
                      <label for="cadastro">01 - CADASTRAMENTO</label>
                    </div>
                    <div class="radio-item">
                      <RadioButton v-model="formData.tipoCadastro" inputId="recadastro" value="02" />
                      <label for="recadastro">02 - RECADASTRAMENTO</label>
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label>Situação</label>
                  <div class="radio-group">
                    <div class="radio-item">
                      <RadioButton v-model="formData.situacao" inputId="ativo" value="A" />
                      <label for="ativo">A - ATIVO</label>
                    </div>
                    <div class="radio-item">
                      <RadioButton v-model="formData.situacao" inputId="inativo" value="B" />
                      <label for="inativo">B - INATIVO</label>
                    </div>
                  </div>
                </div>

                <div class="field">
                  <label for="matricula">Matrícula Nº</label>
                  <InputText id="matricula" v-model="formData.matricula" />
                </div>
              </div>

              <!-- Dados Pessoais -->
              <div class="section-header">Dados Pessoais - Preencha em Letra de Forma</div>

              <div class="field">
                <label for="nome">Nome Completo *</label>
                <InputText id="nome" v-model="formData.nome" required />
              </div>

              <div class="form-row">
                <div class="field">
                  <label for="rg">RG Nº *</label>
                  <InputText id="rg" v-model="formData.rg" required />
                </div>
                <div class="field">
                  <label for="cpf">CPF *</label>
                  <InputMask id="cpf" v-model="formData.cpf" mask="999.999.999-99" required />
                </div>
                <div class="field">
                  <label for="dataNascimento">Data de Nascimento *</label>
                  <Calendar id="dataNascimento" v-model="formData.dataNascimento" dateFormat="dd/mm/yy" required />
                </div>
                <div class="field">
                  <label for="estadoCivil">Estado Civil *</label>
                  <Dropdown
                    id="estadoCivil"
                    v-model="formData.estadoCivil"
                    :options="estadosCivis"
                    placeholder="Selecione"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label for="nacionalidade">Nacionalidade</label>
                  <InputText id="nacionalidade" v-model="formData.nacionalidade" />
                </div>
                <div class="field">
                  <label for="naturalidadeCidade">Naturalidade - Cidade</label>
                  <InputText id="naturalidadeCidade" v-model="formData.naturalidadeCidade" />
                </div>
                <div class="field">
                  <label for="naturalidadeUf">UF</label>
                  <Dropdown
                    id="naturalidadeUf"
                    v-model="formData.naturalidadeUf"
                    :options="ufs"
                    placeholder="UF"
                  />
                </div>
              </div>

              <!-- Endereço -->
              <div class="section-header">Endereço</div>

              <div class="field">
                <label for="endereco">Endereço Completo *</label>
                <InputText id="endereco" v-model="formData.endereco" required />
              </div>

              <div class="form-row">
                <div class="field flex-2">
                  <label for="bairro">Bairro *</label>
                  <InputText id="bairro" v-model="formData.bairro" required />
                </div>
                <div class="field">
                  <label for="complemento">BL / APTº / ANDAR</label>
                  <InputText id="complemento" v-model="formData.complemento" />
                </div>
              </div>

              <div class="form-row">
                <div class="field flex-2">
                  <label for="cidade">Cidade / UF *</label>
                  <InputText id="cidade" v-model="formData.cidade" required />
                </div>
                <div class="field">
                  <label for="cep">CEP *</label>
                  <InputMask id="cep" v-model="formData.cep" mask="99999-999" required />
                </div>
              </div>

              <!-- Filiação -->
              <div class="section-header">Filiação</div>

              <div class="field">
                <label for="filiacaoPai">Nome do Pai</label>
                <InputText id="filiacaoPai" v-model="formData.filiacaoPai" />
              </div>

              <div class="field">
                <label for="filiacaoMae">Nome da Mãe</label>
                <InputText id="filiacaoMae" v-model="formData.filiacaoMae" />
              </div>

              <!-- Contato e Dados Profissionais -->
              <div class="section-header">Contato e Dados Profissionais</div>

              <div class="form-row">
                <div class="field">
                  <label for="telefoneResidencial">Fone Residencial / Celular</label>
                  <InputMask id="telefoneResidencial" v-model="formData.telefoneResidencial" mask="(99) 99999-9999" />
                </div>
                <div class="field flex-2">
                  <label for="cargo">Cargo *</label>
                  <InputText id="cargo" v-model="formData.cargo" required />
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label for="comarca">Comarca</label>
                  <InputText id="comarca" v-model="formData.comarca" />
                </div>
                <div class="field">
                  <label for="setor">Setor</label>
                  <InputText id="setor" v-model="formData.setor" />
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label for="dataAdmissao">Data de Admissão</label>
                  <Calendar id="dataAdmissao" v-model="formData.dataAdmissao" dateFormat="dd/mm/yy" />
                </div>
                <div class="field flex-2">
                  <label for="email">E-mail *</label>
                  <InputText id="email" v-model="formData.email" type="email" required />
                </div>
              </div>

              <!-- Autorização -->
              <div class="section-header">Autorização</div>
              <div class="autorizacao-text">
                <p>
                  Autorizo o desconto nos meus vencimentos referente à contribuição social em favor da <strong>ASPJ-PE</strong> (Associação dos Servidores do Poder Judiciário do Estado de PE).
                </p>
                <p>
                  Ciente de que da desvinculação com esta entidade perderei todas as vantagens inerentes à condição de sócio.
                </p>
              </div>

              <!-- Dependentes -->
              <div class="section-header">Relação de Dependentes</div>

              <div v-for="(dep, index) in formData.dependentes" :key="index" class="dependente-row">
                <div class="form-row">
                  <div class="field flex-2">
                    <label :for="`dep-nome-${index}`">{{ String(index + 1).padStart(2, '0') }} - Nome</label>
                    <InputText :id="`dep-nome-${index}`" v-model="dep.nome" />
                  </div>
                  <div class="field">
                    <label :for="`dep-grau-${index}`">Grau de Parentesco</label>
                    <Dropdown
                      :id="`dep-grau-${index}`"
                      v-model="dep.grauParentesco"
                      :options="grausParentesco"
                      placeholder="Selecione"
                    />
                  </div>
                  <div class="field">
                    <label :for="`dep-data-${index}`">Data de Nascimento</label>
                    <Calendar :id="`dep-data-${index}`" v-model="dep.dataNascimento" dateFormat="dd/mm/yy" />
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <Button
                  type="button"
                  label="Voltar"
                  severity="secondary"
                  outlined
                  @click="$router.push('/')"
                />
                <Button
                  type="submit"
                  label="Submeter Proposta"
                  :loading="loading"
                />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </main>

    <Toast position="top-right" />
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import PublicHeader from '../components/shared/PublicHeader.vue'

export default {
  name: 'PreCadastroView',
  components: {
    PublicHeader
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const loading = ref(false)

    const formData = reactive({
      tipoCadastro: '01',
      situacao: 'A',
      matricula: '',
      nome: '',
      rg: '',
      cpf: '',
      dataNascimento: null,
      estadoCivil: '',
      nacionalidade: 'Brasileira',
      naturalidadeCidade: '',
      naturalidadeUf: '',
      endereco: '',
      bairro: '',
      complemento: '',
      cidade: '',
      cep: '',
      filiacaoPai: '',
      filiacaoMae: '',
      telefoneResidencial: '',
      cargo: '',
      comarca: '',
      setor: '',
      dataAdmissao: null,
      email: '',
      dependentes: [
        { nome: '', grauParentesco: '', dataNascimento: null },
        { nome: '', grauParentesco: '', dataNascimento: null },
        { nome: '', grauParentesco: '', dataNascimento: null },
        { nome: '', grauParentesco: '', dataNascimento: null },
        { nome: '', grauParentesco: '', dataNascimento: null }
      ]
    })

    const estadosCivis = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']

    const ufs = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    const grausParentesco = ['Filho(a)', 'Cônjuge', 'Pai/Mãe', 'Irmão/Irmã', 'Outro']

    const handleSubmit = async () => {
      loading.value = true

      try {
        // Here we would normally send the data to the backend
        // For now, we'll just save it to localStorage for PDF generation
        localStorage.setItem('pre-cadastro-data', JSON.stringify(formData))

        toast.add({
          severity: 'success',
          summary: 'Proposta Enviada!',
          detail: 'Sua proposta de adesão foi registrada com sucesso.',
          life: 5000
        })

        // Redirect to a confirmation page or show PDF
        setTimeout(() => {
          router.push('/pre-cadastro/confirmacao')
        }, 2000)
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Ocorreu um erro ao enviar sua proposta. Tente novamente.',
          life: 5000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      estadosCivis,
      ufs,
      grausParentesco,
      loading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.pre-cadastro {
  min-height: 100vh;
  background: #f5f5f5;
}

.form-main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-logo {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
}

.form-header h1 {
  color: #225c5a;
  font-size: 1.8rem;
  margin: 0;
}

.cadastro-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  color: white;
  padding: 0.75rem 1rem;
  margin: 1rem -1.25rem 1rem -1.25rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field.flex-2 {
  grid-column: span 2;
}

.field label {
  font-weight: 500;
  color: #333;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.autorizacao-text {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  line-height: 1.6;
}

.autorizacao-text p {
  margin: 0.5rem 0;
  color: #555;
}

.dependente-row {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .field.flex-2 {
    grid-column: span 1;
  }

  .section-header {
    margin-left: -1rem;
    margin-right: -1rem;
  }
}
</style>
