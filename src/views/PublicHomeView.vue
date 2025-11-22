<template>
  <div class="public-home">
    <PublicHeader />

    <main class="main-content">
      <!-- News Carousel -->
      <section class="carousel-section">
        <Carousel
          :value="newsItems"
          :numVisible="1"
          :numScroll="1"
          :circular="true"
          :autoplayInterval="5000"
        >
          <template #item="slotProps">
            <div class="news-item">
              <div class="news-content">
                <div class="news-date">{{ formatDate(slotProps.data.date) }}</div>
                <h2 class="news-title">{{ slotProps.data.title }}</h2>
                <p class="news-description">{{ slotProps.data.description }}</p>
              </div>
            </div>
          </template>
        </Carousel>
      </section>

      <!-- About Section -->
      <section class="about-section">
        <div class="about-container">
          <div class="about-logo">
            <img src="/logo.svg" alt="ASPJ-PE Logo" class="logo-img" />
          </div>
          <div class="about-content">
            <h2>ASPJ-PE</h2>
            <h3>Associação dos Servidores do Poder Judiciário de Pernambuco</h3>
            <p class="about-description">
              Desde 1957 unindo servidores e fortalecendo direitos
            </p>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section">
        <div class="contact-container">
          <h2>Entre em Contato</h2>
          <div class="contact-grid">
            <div class="contact-item">
              <i class="pi pi-phone"></i>
              <div class="contact-info">
                <h4>Telefones</h4>
                <p>(81) 9908-2500</p>
                <p>(81) 98712-0360</p>
              </div>
            </div>

            <div class="contact-item">
              <i class="pi pi-envelope"></i>
              <div class="contact-info">
                <h4>E-mail</h4>
                <p>aspj@aspj-pe.org.br</p>
              </div>
            </div>
          </div>

          <div class="social-section">
            <h3>Siga-nos nas redes sociais</h3>
            <div class="social-buttons">
              <a href="https://www.facebook.com/ASPJ.PE" target="_blank" rel="noopener noreferrer" class="social-btn facebook">
                <i class="pi pi-facebook"></i>
                <span>Facebook</span>
              </a>
              <a href="https://x.com/aspj_pe" target="_blank" rel="noopener noreferrer" class="social-btn twitter">
                <i class="pi pi-twitter"></i>
                <span>Twitter</span>
              </a>
              <a href="https://www.youtube.com/channel/UC5SlyMrhuZVbUhIgSPrGPFQ" target="_blank" rel="noopener noreferrer" class="social-btn youtube">
                <i class="pi pi-youtube"></i>
                <span>YouTube</span>
              </a>
              <a href="https://www.instagram.com/aspj.pe/" target="_blank" rel="noopener noreferrer" class="social-btn instagram">
                <i class="pi pi-instagram"></i>
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="public-footer">
      <div class="footer-container">
        <p>&copy; 2025 ASPJ-PE - Associação dos Servidores do Poder Judiciário de Pernambuco</p>
        <p>Desde 1957 unindo servidores e fortalecendo direitos</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue'
import PublicHeader from '../components/shared/PublicHeader.vue'

export default {
  name: 'PublicHomeView',
  components: {
    PublicHeader
  },
  setup() {
    // Mock news data
    const newsItems = ref([
      {
        id: 1,
        title: 'ASPJ-PE anuncia nova parceria para benefícios aos associados',
        description: 'A ASPJ-PE firmou parceria com instituições de saúde e educação para oferecer descontos exclusivos aos associados.',
        date: new Date('2025-11-20')
      },
      {
        id: 2,
        title: 'Assembleia Geral Extraordinária - Convocação',
        description: 'Fica convocada a Assembleia Geral Extraordinária para o dia 15 de dezembro de 2025, às 14h, na sede da ASPJ-PE.',
        date: new Date('2025-11-18')
      },
      {
        id: 3,
        title: 'ASPJ-PE completa 68 anos de história',
        description: 'Desde 1957, a ASPJ-PE vem defendendo os direitos dos servidores do Poder Judiciário de Pernambuco.',
        date: new Date('2025-11-15')
      },
      {
        id: 4,
        title: 'Novos convênios disponíveis para associados',
        description: 'Confira os novos convênios firmados pela ASPJ-PE em diversas áreas: saúde, educação, lazer e cultura.',
        date: new Date('2025-11-10')
      }
    ])

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }

    return {
      newsItems,
      formatDate
    }
  }
}
</script>

<style scoped>
.public-home {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Carousel Section */
.carousel-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-item {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  color: white;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.news-content {
  max-width: 800px;
  text-align: center;
}

.news-date {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.news-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.news-description {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.95;
}

/* About Section */
.about-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.about-logo .logo-img {
  width: 200px;
  height: auto;
}

.about-content h2 {
  color: #225c5a;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.about-content h3 {
  color: #73a9a7;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.about-description {
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
}

/* Contact Section */
.contact-section {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-container h2 {
  color: #225c5a;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact-item i {
  font-size: 2rem;
  color: #73a9a7;
}

.contact-info h4 {
  color: #225c5a;
  margin-bottom: 0.5rem;
}

.contact-info p {
  color: #666;
  margin: 0.25rem 0;
}

.social-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.social-section h3 {
  color: #225c5a;
  margin-bottom: 1.5rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: transform 0.3s, box-shadow 0.3s;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.social-btn.facebook {
  background: #1877f2;
}

.social-btn.twitter {
  background: #000000;
}

.social-btn.youtube {
  background: #ff0000;
}

.social-btn.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}

/* Footer */
.public-footer {
  background: #225c5a;
  color: white;
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
}

.footer-container p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .news-title {
    font-size: 1.8rem;
  }

  .news-description {
    font-size: 1rem;
  }

  .about-container {
    flex-direction: column;
    text-align: center;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .social-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
