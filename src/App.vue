<script setup>
import HeadSection from './sections/HeadSection.vue'
import TypesSection from './sections/TypesSection.vue'
import HowToUseSection from './sections/HowToUseSection.vue'
import FaqSection from './sections/FaqSection.vue'
import AboutUsSection from './sections/AboutUsSection.vue'
import ShopSection from './sections/ShopSection.vue'
</script>

<template>
  <div class="app-wrapper">
    <div class="header">
      <button class="cart-button"></button>
    </div>
    <!-- <div class="nav-hover-zone">
      <div class="nav">
        <div class="link">
          <a href="#types">Types</a>
          <span>|</span>
          <a href="#how-to-use">How to use</a>
          <span>|</span>
          <a href="#faq">FAQ</a>
          <span>|</span>
          <a href="#">About Us</a>
        </div>
      </div>
    </div> -->
    <HeadSection />

    <ShopSection id="shop" />
    <TypesSection id="types" />

    <HowToUseSection id="how-to-use" />
    <FaqSection id="faq" />
    <AboutUsSection id="about-us" />
  </div>
</template>

<style>
html,
body,
#app,
.app-wrapper {
  height: fit-content;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: black;
}

.app-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  color: black;
}

.cart-button {
  height: 40%;
  aspect-ratio: 1 / 1;
  background-image: url('/shopping-cart.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: auto;
  border: none;
  background-color: transparent;
}

.header {
  height: 60px;
  width: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  padding-right: 20px;
}

.nav-hover-zone {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 150px;
  z-index: 10;
}
/* TODO: Remove */
/* .nav {
  height: 0px;
  margin-top: 70px;
  width: 100%;
  background-color: #00000089;
  transition: height 0.3s ease;
  overflow: hidden;
  display: flex;
  padding-left: 20px;
} */

.nav-hover-zone:hover .nav {
  height: 30px;
}

.link {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.link span {
  color: white;
  font-weight: 300;
}
</style>
