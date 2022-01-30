<template>
  <header class="mb-auto bg-light">
    <div class="d-flex flex-column flex-md-row align-items-center p-3 mb-0">
      <a href="/" class="d-flex align-items-center text-dark text-decoration-none logo"> <img src="src/assets/logo.svg" height="32" class="me-2" /> <span class="fs-5 fw-light">Summer Vibes</span> </a>
      <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto dropdown">
        <a class="me-4 py-2 text-dark text-decoration-none" v-for="(menu, index) in menu_items" :key="index" :href="menu.url" v-html="menu.name" />
        <a class="ms-4 py-2 text-dark text-decoration-none" href="#">
          <img :src="user.avatar" class="rounded-circle align-bottom" style="height: 25px" />
          {{ user.name }} <i class="bi bi-chevron-down small"></i>
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      menu_items: [
        {
          name: "Hotels",
          url: "#",
        },
        {
          name: "Entertainment",
          url: "#",
        },
        {
          name: "Support",
          url: "#",
        },
        {
          name: "Pricing",
          url: "#",
        },
      ],
      user: {
        name: "John Doe",
        avatar: "https://thispersondoesnotexist.com/image",
      },
    };
  },
};
</script>

<style lang="scss">
header {
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);

  a.logo {
    img {
      opacity: 0;
      animation: fadeInOpacity 1s ease-in-out 1s forwards;
    }

    span {
      opacity: 0;
      position: relative;
      left: 50%;
      animation: fadeInSlide 1s ease-in-out 2s forwards;
    }
  }
}

@keyframes fadeInOpacity {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInSlide {
  from {
    left: 50%;
    opacity: 0;
  }

  to {
    left: 0;
    opacity: 1;
  }
}
</style>
