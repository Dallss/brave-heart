<template>
  <div class="product-component">
    <div v-for="product in products" :key="product.id" class="product-item">
      <div class="product-image">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          @error="handleImageError"
          class="product-img"
        />
      </div>
      <div class="product-details">
        <h4 class="product-name">{{ product.name }}</h4>
        <div class="product-info">
          <span class="product-price">${{ product.price }}</span>
          <span class="product-stock">Stock: {{ product.stock }}</span>
        </div>
        <div class="product-actions">
          <button class="edit-btn" @click="$emit('edit', product)">Edit</button>
          <button class="delete-btn" @click="$emit('delete', product)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const handleImageError = (event) => {
  event.target.src = '/src/assets/logo.svg' // Fallback image
}
</script>

<style scoped>
.product-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  gap: 1rem;
  transition: box-shadow 0.2s;
}

.product-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.product-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.product-price {
  font-weight: 600;
  color: #5a1818;
  font-size: 1rem;
}

.product-stock {
  color: #666;
  font-size: 0.9rem;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.edit-btn {
  background: #5a1818;
  color: white;
}

.edit-btn:hover {
  background: #7a2020;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}
</style>
