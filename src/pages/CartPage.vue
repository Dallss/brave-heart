<template>
  <div v-if="upcoming">upconing</div>
  <div v-else class="cart-view-bg">
    <div class="cart-container">
      <button class="back-btn" @click="goBack">← Back</button>
      <h1 class="cart-title">Your Cart</h1>
      <div v-if="cart.items.length === 0" class="empty-cart">Your cart is empty.</div>
      <div v-else>
        <div v-for="item in cart.items" :key="item.id" class="cart-item-row">
          <img :src="item.image" alt="item.name" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-details">{{ item.details || '' }}</div>
          </div>
          <div class="cart-item-qty">
            <button @click="changeQty(item, item.quantity - 1)" :disabled="item.quantity <= 1">
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button @click="changeQty(item, item.quantity + 1)">+</button>
          </div>
          <div class="cart-item-price">₱ {{ item.price.toLocaleString() }}</div>
          <button class="cart-item-remove" @click="cart.removeItem(item.id)">×</button>
        </div>
        <div class="cart-total-row">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">₱ {{ cart.totalPrice.toLocaleString() }}</span>
        </div>
        <button class="checkout-btn">Check Out</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart.js'
import { useRouter } from 'vue-router'
const cart = useCartStore()
const router = useRouter()

const upcoming = true
function changeQty(item, newQty) {
  cart.updateQuantity(item.id, newQty)
}
function goBack() {
  router.back()
}
</script>

<style scoped>
.cart-view-bg {
  min-height: 100vh;
  width: 100vw;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.cart-container {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 700px;
  width: 70vw;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
}
.cart-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #111;
}
.cart-item-row {
  display: flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 6px;
  margin-bottom: 1.2rem;
  padding: 0.7rem 1.2rem;
  gap: 1.2rem;
  position: relative;
}
.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #ccc;
}
.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.cart-item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
}
.cart-item-details {
  font-size: 0.95rem;
  color: #000000;
}
.cart-item-qty {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #000000;
}
.cart-item-qty button {
  width: 28px;
  height: 28px;
  border: none;
  background: #ccc;
  color: #222;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.cart-item-qty button:disabled {
  background: #eee;
  color: #aaa;
  cursor: not-allowed;
}
.cart-item-qty span {
  min-width: 24px;
  text-align: center;
  font-size: 1.1rem;
}
.cart-item-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #7a2a2a;
  margin-left: 1.2rem;
}
.cart-item-remove {
  background: none;
  border: none;
  color: #7a2a2a;
  font-size: 1.5rem;
  margin-left: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}
.cart-item-remove:hover {
  color: #b71c1c;
}
.cart-total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  gap: 1.2rem;
}
.cart-total-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
}
.cart-total-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #7a2a2a;
}
.checkout-btn {
  display: block;
  margin-left: auto;
  background: #6b2c23;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7rem 2.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.checkout-btn:hover {
  background: #4e1d16;
}
.empty-cart {
  text-align: center;
  color: #000000;
  font-size: 1.1rem;
  margin: 2rem 0;
}
.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.7rem 0.2rem 0;
  transition: color 0.2s;
}
.back-btn:hover {
  transform: scale(1.06);
}
</style>
