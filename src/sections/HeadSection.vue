<template>
  <base-section class="title-page" height="fit-content">
    <div class="left page-part">
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
      <div class="page-header">
        <div class="title">
          <h1 class="main-title">{{ company.name }}</h1>
          <p class="subtitle">{{ company.slogan }}</p>
        </div>

        <div class="contact-info">
          <p class="contact-header">Contact Us</p>
          <p class="contact-phone"><strong>Phone:</strong> 123-456-7890</p>
          <p class="contact-email"><strong>Email:</strong> info@alexanderextinguisher.com</p>
        </div>
      </div>
    </div>

    <div class="right page-part">
      <div class="type-select-content">
        <div :key="normalizedTypes.join('-')" ref="sliderRef" class="keen-slider">
          <div class="keen-slider__slide" v-for="(type, index) in normalizedTypes" :key="index">
            <img
              class="extinguisher-image"
              :src="getExtinguisherImage(type)"
              :alt="`Extinguisher ${type}`"
            />
          </div>
        </div>

        <div v-if="normalizedTypes.length > 1" class="slider-controls">
          <button class="nav-button" @click="prevSlide">
            <icon-lucide-chevron-left class="arrow-icon" />
          </button>
          <button class="nav-button" @click="nextSlide">
            <icon-lucide-chevron-right class="arrow-icon" />
          </button>
        </div>
      </div>

      <div class="type-selector-container">
        <h2 class="type-selector-title">Select your use case</h2>
        <h4>
          Suggested Extinguisher Class:
          <strong>{{ extinguisherType.join(', ') }}</strong>
        </h4>
        <TypeSelector class="type-selector" v-model:selected="extinguisherType" />
      </div>
    </div>
  </base-section>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import KeenSlider from 'keen-slider'
import BaseSection from './BaseSection.vue'
import TypeSelector from '../components/TypeSelector.vue'

const extinguisherType = ref(['A', 'B', 'C'])
const sliderRef = ref(null)
let sliderInstance = null

const normalizedTypes = computed(() =>
  Array.isArray(extinguisherType.value) ? extinguisherType.value : [extinguisherType.value],
)

import imgA from '@/assets/fire-extinguisher/A.png'
import imgB from '@/assets/fire-extinguisher/B.png'
import imgC from '@/assets/fire-extinguisher/C.png'
import imgD from '@/assets/fire-extinguisher/D.png'
import imgK from '@/assets/fire-extinguisher/K.png'

const company = {
  name: 'Brave Heart',
  slogan: 'Protecting lives, one extinguisher at a time',
}

const imageMap = {
  A: imgA,
  B: imgB,
  C: imgC,
  D: imgD,
  K: imgK,
}

const getExtinguisherImage = (type) => {
  return imageMap[type] || imgA
}

const initSlider = () => {
  if (sliderInstance) {
    sliderInstance.destroy()
  }

  if (sliderRef.value && normalizedTypes.value.length > 0) {
    sliderInstance = new KeenSlider(sliderRef.value, {
      loop: true,
      slides: { perView: 1 },
    })
  }
}

watch(normalizedTypes, async () => {
  await nextTick()
  initSlider()
})

onMounted(() => {
  initSlider()
})

const prevSlide = () => {
  sliderInstance?.prev()
}
const nextSlide = () => {
  sliderInstance?.next()
}
</script>

<style scoped>
@import 'keen-slider/keen-slider.min.css';

.title-page {
  display: flex;
  background-color: #fff;
  padding: 0;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
}
.page-part {
  height: 110vh;
  width: 100%;
  flex: 1;
  position: relative;
  min-width: 550px;
}
.left {
  display: flex;
  justify-content: center;
  background-color: #510f0f;
  color: white;
}
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  min-width: 700px;
}
.page-header {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.nav {
  position: absolute;
  left: 0;
  top: 0;
  padding: 5px;
  color: white;
  font-size: large;
  height: fit-content;
  margin: 0;
}
.title {
  height: 65vh;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.main-title {
  font-size: 5rem;
  font-weight: 600;
  line-height: 1.2;
  max-width: 600px;
}
.subtitle {
  font-size: 1.5rem;
  font-weight: 200;
  font-style: italic;
}
.contact-info {
  padding-left: 6rem;
}
.contact-header {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
}

.type-select-content {
  position: relative;
  width: 100%;
  height: fit-content;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.keen-slider {
  width: 100%;
  height: fit-content;
  overflow: hidden;
}
.keen-slider__slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.extinguisher-image {
  width: 80%;
  height: auto;
  max-width: 100%;
  object-fit: contain;
  box-sizing: border-box;
  margin: 10px;
}
.slider-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 1rem;
}
.nav-button {
  background-color: rgba(255, 255, 255, 0);
  color: #00000036;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  user-select: none;
  transition: background 0.2s ease;
}
.nav-button:hover {
  background-color: rgba(200, 200, 200, 0.9);
}

.type-selector-container {
  width: 50%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.2rem;
}
.type-selector-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
}
.type-selector {
  margin-top: 20px;
}
</style>
