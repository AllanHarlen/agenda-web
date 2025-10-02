<template>
  <Dialog 
    v-model:visible="internalVisible" 
    :modal="true" 
    :style="{ width: '520px' }" 
    :breakpoints="{ '960px': '95vw', '640px': '95vw' }"
  >
    <template #header>
      <div class="text-xl font-semibold">{{ formTitle }}</div>
    </template>

    <form class="p-fluid" @submit.prevent="onSubmit">
      <div class="field">
        <label for="nome">Nome</label>
        <InputText id="nome" v-model="localContato.nome" :class="{ 'p-invalid': submitted && !localContato.nome }" />
        <small v-if="submitted && !localContato.nome" class="p-error">Nome é obrigatório</small>
      </div>

      <div class="field">
        <label for="email">Email</label>
        <InputText id="email" v-model="localContato.email" :class="{ 'p-invalid': submitted && !isValidEmail(localContato.email) }" />
        <small v-if="submitted && !isValidEmail(localContato.email)" class="p-error">Email deve ser válido</small>
      </div>

      <div class="field">
        <label for="telefone">Telefone</label>
        <InputText id="telefone" v-model="localContato.telefone" :class="{ 'p-invalid': submitted && !localContato.telefone }" />
        <small v-if="submitted && !localContato.telefone" class="p-error">Telefone é obrigatório</small>
      </div>
    </form>

    <template #footer>
      <Button label="Cancelar" class="p-button-text" @click="close" />
      <Button :label="saveLabel" :loading="loading" class="p-button-primary" @click="save" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, type PropType } from 'vue'
import type { Contato } from '@/types/Contato.ts'

export default defineComponent({
  name: 'ContatoForm',
  props: {
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, default: false },
    contato: {
      type: Object as PropType<Contato>,
      default: () => ({ id: 0, nome: '', email: '', telefone: '' })
    }
  },
  emits: ['update:visible', 'save', 'close'],
  setup(props, { emit }) {
    const internalVisible = ref<boolean>(props.visible)
    const localContato = ref<Contato>({ ...props.contato })
    const submitted = ref<boolean>(false)

    watch(() => props.visible, (val) => { internalVisible.value = val })
    watch(internalVisible, (val) => emit('update:visible', val))

    watch(() => props.contato, (newContato) => {
      localContato.value = { ...newContato }
    })

    const isValidEmail = (v: string) => /.+@.+\..+/.test(v)

    const formTitle = computed(() => (localContato.value.id ? 'Editar Contato' : 'Novo Contato'))
    const saveLabel = computed(() => (localContato.value.id ? 'Salvar' : 'Criar'))

    const validate = () => {
      submitted.value = true
      return !!localContato.value.nome && isValidEmail(localContato.value.email) && !!localContato.value.telefone
    }

    const close = () => {
      emit('close')
      internalVisible.value = false
      submitted.value = false
    }

    const save = () => {
      if (validate()) {
        emit('save', { ...localContato.value })
      }
    }

    const onSubmit = () => save()

    return { internalVisible, localContato, submitted, formTitle, saveLabel, isValidEmail, close, save, onSubmit }
  }
})
</script>

<style scoped>
.field { margin-bottom: 1rem; }
.p-error { margin-top: 0.25rem; display: inline-block; }
</style>