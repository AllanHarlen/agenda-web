<template>
  <header class="public-header">
    <div class="header-container">
      <div class="logo-section">
        <img src="/logo.svg" alt="ASPJ-PE Logo" class="header-logo" />
        <span class="brand-name">ASPJ-PE</span>
      </div>

      <nav class="nav-menu">
        <router-link to="/" class="nav-link">Início</router-link>
        <router-link to="/pre-cadastro" class="nav-link">Associe-se</router-link>

        <div class="social-links">
          <a href="https://www.facebook.com/ASPJ.PE" target="_blank" rel="noopener noreferrer" class="social-icon">
            <i class="pi pi-facebook"></i>
          </a>
          <a href="https://x.com/aspj_pe" target="_blank" rel="noopener noreferrer" class="social-icon">
            <i class="pi pi-twitter"></i>
          </a>
          <a href="https://www.youtube.com/channel/UC5SlyMrhuZVbUhIgSPrGPFQ" target="_blank" rel="noopener noreferrer" class="social-icon">
            <i class="pi pi-youtube"></i>
          </a>
          <a href="https://www.instagram.com/aspj.pe/" target="_blank" rel="noopener noreferrer" class="social-icon">
            <i class="pi pi-instagram"></i>
          </a>
        </div>

        <div class="auth-buttons">
          <Button
            label="Associe-se"
            class="btn-associe"
            @click="$router.push('/pre-cadastro')"
            outlined
          />
          <Button
            label="Login"
            class="btn-login"
            @click="$router.push('/login')"
          />
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'PublicHeader'
}
</script>

<style scoped>
.public-header {
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-logo {
  height: 50px;
  width: auto;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.social-links {
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

.social-icon {
  color: white;
  font-size: 1.2rem;
  transition: transform 0.3s, opacity 0.3s;
}

.social-icon:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn-associe {
  background: transparent !important;
  border-color: white !important;
  color: white !important;
}

.btn-associe:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.btn-login {
  background: white !important;
  border-color: white !important;
  color: #225c5a !important;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.9) !important;
}

@media (max-width: 992px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }

  .social-links {
    border: none;
    padding: 0;
  }
}
</style>
