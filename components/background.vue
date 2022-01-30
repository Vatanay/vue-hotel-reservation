<template>
  <video autoplay muted loop class="opacity-50">
    <source src="src/assets/background.mp4" type="video/mp4" />
    Your browser does not support HTML5 video.
  </video>
</template>

<style lang="scss" scoped>
video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  z-index: 1;
}
</style>
