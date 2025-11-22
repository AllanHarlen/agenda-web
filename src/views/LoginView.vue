<template>
  <div class="login-container">
    <Button
      icon="pi pi-arrow-left"
      class="back-button"
      rounded
      text
      @click="$router.push('/')"
      v-tooltip.bottom="'Voltar para página inicial'"
    />

    <div class="left-side">
      <div class="left-content">
        <div class="logo">
          <img src="/logo.svg" alt="ASPJ-PE Logo" class="logo-img" />
        </div>
        <h1 class="left-title">
          Bem-vindo ao<br/>
          ASPJ-PE
        </h1>
        <h2 class="left-subtitle">
          Associação dos Servidores do Poder Judiciário de Pernambuco
        </h2>
        <h2 class="left-subtitle">Desde 1957 unindo servidores e fortalecendo direitos</h2>
      </div>
    </div>
    <div class="right-side">
      <div class="form-container">
        <h1 class="form-title">LOGIN</h1>
        <LoginForm />
        <div class="register-section">
          <Divider />
          <p class="register-text">Não é associado?</p>
          <Button
            label="Associe-se"
            class="btn-associe-full"
            outlined
            @click="$router.push('/pre-cadastro')"
          />
        </div>
      </div>
    </div>
    <NotificationToast />
  </div>

</template>

<script>
import LoginForm from '../components/auth/LoginForm.vue'
import NotificationToast from '../components/shared/NotificationToast.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm,
    NotificationToast
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  background-color: #73a9a7;
  position: relative;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9) !important;
  color: #225c5a !important;
  width: 3rem;
  height: 3rem;
}

.back-button:hover {
  background: white !important;
}

.left-side {
  flex: 1;
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.logo {
  margin-bottom: 2rem;
}

.logo-img {
  width: 200px;
  height: auto;
}

.left-title {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  color: #ffffff;
  margin-bottom: 1rem;
  text-align: center;
  line-height: 1.2;
}

.left-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  margin: 0.5rem 0;
  text-align: center;
  max-width: 600px;
}

.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
}

.form-container {
  max-width: 460px;
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-title {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  margin-bottom: 2rem;
  color: #73a9a7;
  font-size: 2rem;
}

.register-section {
  width: 100%;
  margin-top: 1.5rem;
  text-align: center;
}

.register-text {
  margin: 1rem 0;
  color: #666;
  font-size: 0.95rem;
}

.btn-associe-full {
  width: 100%;
  border-color: #73a9a7 !important;
  color: #73a9a7 !important;
}

.btn-associe-full:hover {
  background: #73a9a71a !important;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .left-side {
    height: 40vh;
  }

  .left-title {
    font-size: 2rem;
  }

  .left-subtitle {
    font-size: 1rem;
  }

  .right-side {
    height: 60vh;
    box-shadow: none;
  }
}
</style>