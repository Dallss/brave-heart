<template>
  <BaseSection class="faq-section" height="auto">
    <div class="faq-content">
      <h2 class="faq-title">Frequently Asked Questions (FAQ)</h2>
      <ul class="faq-list">
        <li class="faq-item">
          <div class="faq-question">How long does a fire extinguisher last?</div>
          <div class="faq-answer">
            Fire extinguishers typically last 10–12 years. Rechargeable ones require maintenance
            every 6 years, and disposable ones should be replaced after use or when expired.
          </div>
        </li>
        <li class="faq-item">
          <div class="faq-question">Where should I store a fire extinguisher at home?</div>
          <div class="faq-answer">
            Store extinguishers in accessible locations like the kitchen, garage, or near exits.
            Keep them visible, upright, and away from extreme temperatures or moisture.
          </div>
        </li>
        <li class="faq-item">
          <div class="faq-question">How often should I inspect my fire extinguisher?</div>
          <div class="faq-answer">
            You should perform a quick visual check monthly and have a professional inspection
            annually. Check for damage, pressure level, and an intact safety pin.
          </div>
        </li>
        <li class="faq-item">
          <div class="faq-question">What should I do after using a fire extinguisher?</div>
          <div class="faq-answer">
            Even if only partially used, a fire extinguisher should be recharged or replaced
            immediately to ensure it's ready for future use.
          </div>
        </li>
        <li class="faq-item">
          <div class="faq-question">Can I use a fire extinguisher more than once?</div>
          <div class="faq-answer">
            Rechargeable extinguishers can be used multiple times if properly serviced. Disposable
            ones must be replaced after a single use.
          </div>
        </li>
        <li class="faq-item">
          <div class="faq-question">
            What is the proper way to dispose of an old fire extinguisher?
          </div>
          <div class="faq-answer">
            Contact your local fire department or hazardous waste disposal center. Never throw
            extinguishers in regular trash or recycling bins.
          </div>
        </li>
      </ul>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
</script>

<style scoped>
.faq-section {
  width: 100vw;
  background-color: #e8e8e8;
  color: #000000;
  display: flex;
  justify-content: center;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.faq-content {
  width: 100%;
  max-width: 900px;
  padding: 2rem 0;
}

.faq-title {
  font-size: 2.25rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 2rem;
  line-height: 1.3;
}

.faq-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.faq-item {
  padding: 1.25rem 0;
}

.faq-question {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.4rem;
  line-height: 1.5;
}

.faq-answer {
  font-size: 1rem;
  line-height: 1.75;
  padding-left: 0.25rem;
  color: #333333;
}
</style>
