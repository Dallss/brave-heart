<template>
  <base-section class="title-page" height="82vh">
    <div class="main-content">
      <div class="title">
        <div class="title-content">
          <h1 class="main-title">Alexander Extinguisher</h1>
          <p class="subtitle">"Your Trusted Fire Safety Partner"</p>

          <div class="contact-info">
            <p class="contact-header">Contact Us</p>
            <p class="contact-phone"><span style="font-weight: 700">Phone:</span> 123-456-7890</p>
            <p class="contact-email">
              <span style="font-weight: 700">Email:</span> info@alexanderextinguisher.com
            </p>
          </div>
        </div>
      </div>
      <div class="type-select">
        <div class="type-select-content">
          <img :src="`/fire-extinguisher/${extinguisherType}.png`" alt="Fire Extinguisher" />
        </div>
        <div class="type-selector-container">
          <h2 class="type-selector-title">Select your use case</h2>
          <h4>
            Suggested Extinguisher Class:
            <span style="font-weight: 600">{{ extinguisherType.join(', ') }}</span>
          </h4>
          <TypeSelector class="type-selector" v-model:selected="extinguisherType" />
        </div>
      </div>
    </div>
  </base-section>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
import TypeSelector from '../TypeSelector.vue'
import { ref, watch } from 'vue'

const extinguisherType = ref('ABC')

// You can watch for changes if needed
watch(extinguisherType, (newValue) => {
  console.log('Selected case changed:', newValue)
})
</script>

<style scoped>
.title-page {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0;
}

.title-page > * {
  width: 100%;
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
  margin-bottom: 1rem;
  margin-top: 0;
  justify-self: flex-end;
  line-height: 1.2;
  overflow: hidden;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 200;
  font-style: italic;
  width: 100%;
  margin-bottom: 1rem;
  align-self: flex-end;
  margin-top: 0;
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
  color: #000000;
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
  width: 20rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.type-selector {
  margin-top: 20px;
}
.type-selector-container {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 90%;
  gap: 0.2rem;
}

img {
  width: 100%;
  object-fit: contain;
}

.type-selector-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
}
</style>
