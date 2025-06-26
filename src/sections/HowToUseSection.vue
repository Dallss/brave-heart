<template>
  <base-section class="how-to-use-section" height="fit-content">
    <div class="how-to-use-content">
      <h2 class="how-to-use-title">How to Use a Fire Extinguisher</h2>
      <iframe
        class="video"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/cv7yPN2KjOs"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      >
      </iframe>

      <h2 class="rememeber-head">Just Remember PASS...</h2>
      <ol class="how-to-use-steps">
        <li><strong>P</strong> - Pull the pin to break the tamper seal.</li>
        <li><strong>A</strong> - Aim the nozzle at the base of the fire.</li>
        <li><strong>S</strong> - Squeeze the handle to release the extinguishing agent.</li>
        <li><strong>S</strong> - Sweep from side to side until the fire is out.</li>
      </ol>
      <p class="how-to-use-note">Tip: Remember the <strong>PASS</strong> technique!</p>
    </div>
  </base-section>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
</script>

<style scoped>
.how-to-use-section {
  width: 100vw;
  background: linear-gradient(135deg, #fff1f0, #ffeaea);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 5%;
}

.how-to-use-content {
  width: 100%;
  max-width: 900px;
  text-align: left;
  padding: 2rem 0;
}

.how-to-use-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: black;
  margin-bottom: 1.5rem;
}
.rememeber-head {
  color: black;
  font-size: 2rem;
  font-weight: 550;
}
.video {
  margin-bottom: 2rem;
}

.how-to-use-steps {
  list-style: none;
  padding: 0;
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.how-to-use-steps li {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.how-to-use-steps li::before {
  content: '🧯';
  position: absolute;
  left: 0;
  top: 2px;
}

.how-to-use-note {
  font-style: italic;
  font-size: 1.1rem;
  color: #555;
}
</style>
