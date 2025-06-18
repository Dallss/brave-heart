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
    price: '2,000',
    stock: 100,
    image: 'https://placehold.co/300x300?text=Item+Image',
  },
  {
    id: 2,
    class: 'B',
    price: '2,550',
    stock: 29,
    image: 'https://placehold.co/300x300?text=Item+Image',
  },
  {
    id: 3,
    class: 'C',
    price: '2,550',
    stock: 80,
    image: 'https://placehold.co/300x300?text=Item+Image',
  },
  {
    id: 4,
    class: 'K',
    price: '1,750',
    stock: 40,
    image: 'https://placehold.co/300x300?text=Item+Image',
  },
]
</script>

<style scoped>
.shop-section {
  padding: 6rem;
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
}
.item {
  flex: 1 1 280px; /* Flex-grow: 1, shrink: 1, base width: 280px */
  min-width: 180px; /* Won’t shrink smaller than this */
  max-width: 320px;
}
</style>
