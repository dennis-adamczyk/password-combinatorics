<script setup>
import { onMounted } from '@vue/runtime-core';
import Background from './assets/background.svg';
import Header from '@/components/Header.vue';

onMounted(() => {
  const blobs = document.querySelectorAll('.background .blob');

  blobs.forEach((blob) => {
    const interval = 3000 + Math.random() * 3000;
    const intervalHandler = () => {
      blob.style.setProperty('--interval', `${interval}ms`);

      const translateX = -100 + Math.random() * 200,
        translateY = -100 + Math.random() * 200;

      blob.style.transform = `translate(${translateX}px, ${translateY}px)`;
    };
    intervalHandler();
    setInterval(intervalHandler, interval);
  });
});
</script>

<template>
  <Background class="background" />
  <Header />
  <a href="https://dennis-adamczyk.de/imprint" target="_blank" class="imprint"
    >Impressum</a
  >
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <main :key="route.path">
        <component :is="Component" />
      </main>
    </transition>
  </router-view>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgb(0, 0, 0, 0);
}

html,
body {
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  font-size: 16px;
}

#app {
  display: flex;
  justify-content: stretch;
  flex-direction: column;
  min-height: 100%;
  position: relative;
  font-family: Poppins, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #07071c;
  color: #ffffff;
  overflow: hidden;
  z-index: 0;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    filter: blur(100px);

    .blob {
      transition: transform var(--interval) linear;
    }
  }

  .imprint {
    position: absolute;
    bottom: 32px;
    left: calc(100% - 4px);
    color: rgba(#ffffff, 0.3);
    text-decoration: none;
    text-transform: uppercase;
    transform: rotate(-90deg);
    transform-origin: 0% 100%;
    z-index: 3;
    transition: color 130ms ease;

    &:hover {
      color: rgba(#ffffff, 0.6);
    }
  }

  & > main {
    width: 100%;
    flex-grow: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;

  .headline h1 {
    span {
      transition: transform 180ms ease !important;
    }
  }
}

.fade-enter-from,
.fade-leave-active {
  opacity: 0;

  .headline h1 {
    span {
      transform: translateX(-20%) !important;

      &:last-child {
        transform: translateX(20%) !important;
      }
    }
  }
}
</style>
