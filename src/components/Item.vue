<template>
  <div class="item" @click="handleClick">
    <div class="image-container">
      <img :src="item.image" :alt="item.name" />
    </div>
    <div class="details">
      <p class="class">{{ item.class }}</p>
      <p class="name">{{ item.name }}</p>
      <p class="stock">In-stock: {{ item.stock }}</p>
      <p class="price">₱ {{ item.range }}</p>
    </div>
  </div>
</template>
<script setup>
import { toRefs, defineOptions, defineEmits } from 'vue'

defineOptions({ name: 'ShopItem' })

const emit = defineEmits(['show-details'])

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const { item } = toRefs(props)

function handleClick() {
  emit('show-details', item.value)
}
</script>
<style scoped>
.item {
  width: 100%;
  height: 380px;
  background-color: rgba(184, 184, 184, 0.06);
  color: black;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.item:hover {
  transform: scale(1.01); /* 10% bigger */
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.image-container {
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(0, 0, 0, 0.296);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}
.addToCart {
  /* Remove button styles, not needed anymore */
  display: none;
}
.shop-icon {
  color: white; /* This affects the SVG fill */
  width: 24px;
  height: 24px;
}
.details {
  align-self: flex-start;
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}
.class,
.stock {
  font-family: Montserrat;
  margin: 0;
  padding: 0;
}
.class {
  font-size: 16px;
  font-weight: 400;
}
.price,
.stock {
  font-size: 15px;
  font-weight: 600;
}
.name {
  font-size: 20px;
  font-weight: 500;
}
.price {
  margin-top: auto;
  color: rgb(145, 72, 0);
}
</style>
