<script setup></script>

<template>
  <article class="video">
    <iframe
      src="https://www.youtube.com/embed/jwbgI-81P98"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </article>
</template>

<style lang="scss" scoped>
.video {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;

  iframe {
    margin-top: 32px;
    width: 70%;
    aspect-ratio: 16/9;
  }
}
</style>
