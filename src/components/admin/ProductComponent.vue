<template>
  <div class="product-component">
    <div v-for="product in products" :key="product.id" class="product-item">
      <div class="product-image">
        <img
          :src="getProductImage(product)"
          :alt="product.name"
          @error="handleImageError"
          @load="handleImageLoad"
          class="product-img"
        />
        <!-- Debug info -->
        <div
          v-if="!getProductImage(product) || getProductImage(product).includes('placehold')"
          class="debug-info"
        >
          No image URL
        </div>
      </div>
      <div class="product-details">
        <h4 class="product-name">{{ product.name }}</h4>
        <div class="product-info">
          <span class="product-price">${{ product.price }}</span>
          <span class="product-stock">Stock: {{ product.stock }}</span>
        </div>

        <!-- Display product attributes -->
        <div v-if="product.attributes && product.attributes.length > 0" class="product-attributes">
          <div v-for="attr in product.attributes" :key="attr.id" class="attribute-item">
            <span class="attribute-name">{{ attr.name }}:</span>
            <span class="attribute-value">
              {{ attr.values && attr.values.length > 0 ? attr.values[0].value : 'N/A' }}
            </span>
          </div>
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
import { onMounted } from 'vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete'])

const getProductImage = (product) => {
  // Check for different possible field names
  const imageUrl = product.imageUrl || product.image || product.ImageUrl || product.Image
  if (imageUrl) {
    console.log(`Product ${product.name} has image:`, imageUrl)
    return imageUrl
  }

  // Return a placeholder image
  console.log(`Product ${product.name} has no image, using placeholder`)
  return 'https://placehold.co/300x300?text=No+Image'
}

const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src)
  event.target.src = 'https://placehold.co/300x300?text=Image+Error'
}

const handleImageLoad = (event) => {
  console.log('Image loaded successfully:', event.target.src)
}

onMounted(() => {
  console.log('ProductComponent mounted with products:', props.products)
  if (props.products && Array.isArray(props.products)) {
    props.products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        image: product.image,
        ImageUrl: product.ImageUrl,
        Image: product.Image,
        hasImageUrl: !!product.imageUrl,
        hasImage: !!product.image,
        hasImageUrlAlt: !!product.ImageUrl,
        hasImageAlt: !!product.Image,
        allFields: Object.keys(product),
      })
    })
  }
})
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
  position: relative;
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

.product-attributes {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.attribute-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.attribute-name {
  font-weight: 600;
  color: #5a1818;
  min-width: 80px;
}

.attribute-value {
  color: #666;
  flex: 1;
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

.debug-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
  font-size: 0.7rem;
  text-align: center;
  padding: 4px;
}
</style>
