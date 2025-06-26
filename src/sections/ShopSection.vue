<template>
  <BaseSection class="shop-section" height="auto">
    <div class="shop-header">Shop</div>
    <div class="items-container">
      <div class="item" v-for="item in items" :key="item.id">
        <Item :item="item" />
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from './BaseSection.vue'
import Item from '../components/Item.vue'

const items = [
  {
    id: 1,
    class: 'A',
    range: '2,000 - 3,000',
    stock: 100,
    image: 'https://placehold.co/300x500?text=Item+Image',
  },
  {
    id: 2,
    class: 'B',
    range: '2,550 - 3,550',
    stock: 29,
    image: 'https://placehold.co/300x500?text=Item+Image',
  },
  {
    id: 3,
    class: 'C',
    range: '2,550 - 3,550',
    stock: 80,
    image: 'https://placehold.co/300x500?text=Item+Image',
  },
  {
    id: 4,
    class: 'K',
    range: '1,750 - 2,750',
    stock: 40,
    image: 'https://placehold.co/300x500?text=Item+Image',
  },
]
</script>

<!-- TODO: Switch from flex to grid -->
<style scoped>
.shop-section {
  padding: 10vw;
  display: flex;
  flex-direction: column;
  color: black;
  background-color: #f5f5f5;
}
.shop-header {
  font-size: 2.5rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 2rem;
  font-family: fjalla-one;
  text-align: center;
}
.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 10rem;
}
.item {
  flex: 1 1 230px; /* Flex-grow: 1, shrink: 1, base width: 280px */
  min-width: 120px; /* Won’t shrink smaller than this */
  max-width: 280px;
}
</style>
