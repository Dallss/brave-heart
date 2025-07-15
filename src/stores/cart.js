import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Each item: { id, name, price, quantity, ... }
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addItem(product) {
      console.log('Added in item')
      const existing = this.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += product.quantity || 1
      } else {
        this.items.push({ ...product, quantity: product.quantity || 1 })
      }
    },
    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId)
      if (item && quantity > 0) {
        item.quantity = quantity
      } else if (item && quantity <= 0) {
        this.removeItem(productId)
      }
    },
    clearCart() {
      this.items = []
    },
  },
  persist: true,
})
