<template>
  <div class="layout-shell has-sidebar">
    <Sidebar />
    <section class="layout-content inside-menu">
      <router-view />
    </section>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'

export default {
  name: 'MainLayout',
  components: { Sidebar }
}
</script>

<style scoped>
.layout-shell {
  display: flex;
  gap: 0;
}

.layout-content {
  flex: 1;
  min-width: 0;
}

/* efeito de o conteúdo estar "dentro" do menu */
.inside-menu {
  border-radius: 0 12px 12px 0;
  background: var(--surface-0);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  height: calc(100vh - 40px);
  margin-top: 20px;
  padding: 0.75rem 1rem;
}

@media (max-width: 992px) {
  .inside-menu {
    border-radius: 12px;
    height: auto;
    margin: 0.5rem;
  }
}
</style>


