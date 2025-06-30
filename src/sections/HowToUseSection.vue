<template>
  <base-section class="how-to-use-section" height="fit-content">
    <h2 class="how-to-use-title">How to Use a Fire Extinguisher</h2>
    <div class="how-to-use-content">
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

      <div class="how-to-use-text">
        <p class="how-to-use-note">
          Tip: Remember the <strong class="red">PASS</strong> technique!
        </p>
        <ol class="how-to-use-steps">
          <li><strong class="red">P</strong> - Pull the pin to break the tamper seal.</li>
          <li><strong class="red">A</strong> - Aim the nozzle at the base of the fire.</li>
          <li>
            <strong class="red">S</strong> - Squeeze the handle to release the extinguishing agent.
          </li>
          <li><strong class="red">S</strong> - Sweep from side to side until the fire is out.</li>
        </ol>
      </div>
    </div>
  </base-section>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
</script>

<style scoped>
.how-to-use-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: left;
  padding-top: 200px;
  padding-bottom: 200px;
  width: 100%;
  max-width: 1000px;
}

.how-to-use-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: black;
  margin-bottom: 1.5rem;
  align-self: flex-start;
}
/* .rememeber-head {
  color: black;
  font-size: 1.2rem;
  font-weight: 550;
} */
.video {
  margin-bottom: 2rem;
}

.how-to-use-steps {
  list-style: none;
  padding: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.how-to-use-steps li {
  margin-bottom: 0.5rem;
  /* padding-left: 1.5rem; */
  position: relative;
}

.how-to-use-note {
  font-style: italic;
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

.how-to-use-content {
  display: flex;
  gap: 2rem;
}

.how-to-use-text {
  width: 250px;
  background-color: rgb(253, 255, 188);
  padding: 1.1rem;
}

.red {
  color: rgb(122, 0, 0);
  font-weight: 700;
}
</style>
