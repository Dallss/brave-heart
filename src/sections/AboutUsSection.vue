<template>
  <BaseSection class="about-us-section" height="auto">
    <div class="about-us-content">
      <h2 class="about-us-title">About Us</h2>
      <p class="about-us-paragraph">
        We are a team of safety advocates dedicated to spreading awareness and knowledge about fire
        prevention and emergency preparedness. Our mission is to empower individuals, families, and
        communities with the tools and education needed to act confidently during fire emergencies.
      </p>
      <p class="about-us-paragraph">
        Our platform provides accurate, easy-to-understand guidance on fire extinguisher usage, fire
        safety protocols, and preventive practices for homes, schools, and workplaces. We believe
        that with proper training and accessible resources, everyone can help minimize fire risks
        and respond effectively when it matters most.
      </p>
      <p class="about-us-paragraph">
        Whether you’re looking to equip your space with the right extinguisher or educate others on
        how to use one, we’re here to support your journey toward a safer environment.
      </p>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
</script>

<style scoped>
.about-us-section {
  color: #000000;
  display: flex;
  justify-content: center;
  background-color: white;
}

.about-us-content {
  width: 100%;
  max-width: 900px;
  padding: 2rem 0;
}

.about-us-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 2rem;
}

.about-us-paragraph {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #333;
}
</style>
