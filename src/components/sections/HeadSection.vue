<template>
  <base-section class="title-page" height="82vh">
    <div class="main-content">
      <div class="title">
        <div class="title-content">
          <h1 class="main-title">Alexander Extinguisher</h1>
          <p class="subtitle">"Your Trusted Fire Safety Partner"</p>

          <div class="contact-info">
            <p class="contact-header">Contact Us</p>
            <p class="contact-phone"><strong>Phone:</strong> 123-456-7890</p>
            <p class="contact-email"><strong>Email:</strong> info@alexanderextinguisher.com</p>
          </div>
        </div>
      </div>

      <div class="type-select">
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
            <button class="nav-button" @click="prevSlide">&lt;</button>
            <button class="nav-button" @click="nextSlide">&gt;</button>
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
    </div>
  </base-section>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import KeenSlider from 'keen-slider'
import BaseSection from './BaseSection.vue'
import TypeSelector from '../TypeSelector.vue'

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
  flex-direction: column;
  background-color: #fff;
  padding: 0;
}
.main-content {
  height: 92%;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
}
.title {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 15%;
}
.main-title {
  font-size: 5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}
.subtitle {
  font-size: 1.5rem;
  font-weight: 200;
  font-style: italic;
  margin: 0 0 1rem 0;
}
.contact-info {
  padding-left: 3rem;
  margin-top: 5rem;
  color: #00000083;
}
.contact-header {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  color: #000;
}
.type-select {
  height: 100%;
  min-width: 500px;
  flex: 1.3;
  display: flex;
  align-items: center;
  justify-content: left;
}
.type-select-content {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.keen-slider {
  width: 100%;
  height: 100%;
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
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: contain;
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
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  user-select: none;
  transition: background 0.2s ease;
}
.nav-button:hover {
  background-color: rgba(200, 200, 200, 0.9);
}

.type-selector-container {
  width: 50%;
  height: 90%;
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
