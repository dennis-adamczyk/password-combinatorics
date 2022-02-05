<script setup></script>

<template>
  <nav class="header">
    <router-link to="/" active-class="active">Passwortgenerator</router-link>
    <router-link to="/checker" active-class="active"
      >Passwortprüfer</router-link
    >
    <router-link to="/video" active-class="active">Lernvideo</router-link>
    <router-link to="/about" active-class="active">Über uns</router-link>
  </nav>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 48px 64px 0;
  padding-bottom: 32px;
  position: relative;
  z-index: 2;

  &::after {
    display: block;
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 2px;
    background: radial-gradient(
      50% 50% at 50% 50%,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  a {
    color: rgba(#ffffff, 0.8);
    text-decoration: none;
    font-size: 24px;
    margin: 0 96px 0 0;
    transition: all 130ms ease;

    &:last-child {
      margin: 0;
    }

    &:hover,
    &.active {
      color: #ffffff;
    }

    &.active {
      font-weight: 600;
    }
  }
}
</style>
