<template>
  <BaseModal
    :show="show"
    :title="product?.name || ''"
    @click.self="emitClose"
    class="modal-container"
  >
    <div v-if="product" class="modal-content">
      <div class="modal-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="modal-details">
        <p><strong>Class:</strong> {{ product.class }}</p>
        <p><strong>Price:</strong> {{ product.range }}</p>
        <p><strong>In-stock:</strong> {{ product.stock }}</p>
        <div class="quantity-row">
          <label for="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            v-model.number="quantity"
            min="1"
            :max="product.stock"
            style="width: 60px; margin-left: 8px"
          />
        </div>
        <button class="addToCartModal" @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'
import BaseModal from './admin/modals/BaseModal.vue'
import { useCartStore } from '../stores/cart.js'

const props = defineProps({
  show: Boolean,
  product: Object,
})
const emit = defineEmits(['close'])
const { product } = toRefs(props)
const quantity = ref(1)
const cart = useCartStore()

watch(product, (newVal) => {
  if (newVal) quantity.value = 1
})

function emitClose() {
  emit('close')
}

function addToCart() {
  if (!product.value) return
  cart.addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    quantity: quantity.value,
  })
  emitClose()
}
</script>

<style scoped>
.modal-container {
  padding: 3rem !important;
}
.addToCartModal {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #328e2f;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.addToCartModal:hover {
  background-color: #287226;
}
.modal-content {
  display: flex;
  flex-direction: row;
  gap: 4rem;
  align-items: flex-start;
}
.modal-image {
  flex: 1;
  min-width: 250px;
  max-width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.1px solid rgba(0, 0, 0, 0.25);
}
.modal-image img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  background: #f5f5f5;
}
.modal-details {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.quantity-row {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}
</style>
