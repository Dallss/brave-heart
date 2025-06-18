<template>
  <div class="item">
    <img :src="item.image" :alt="item.name" />

    <div class="details">
      <p class="class">Class {{ item.class }}</p>
      <p class="price">₱ {{ item.price }}</p>
      <p class="stock">In-stock: {{ item.stock }}</p>
    </div>
    <button class="addToCart">
      <icon-lucide-shopping-cart class="shop-icon" />
    </button>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>
<style scoped>
.item {
  width: 100%;
  height: 470px;
  background-color: rgba(217, 217, 217, 0.06);
  color: black;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

img {
  width: 100%;
  height: 65%;
  object-fit: contain;
}
.addToCart {
  width: 100%;
  height: 45px;
  box-sizing: border-box;
  background-color: #1f671d;
  margin-top: auto;
  border: none;
  cursor: pointer;
}
.addToCart:hover {
  background-color: #287226;
}
.shop-icon {
  color: white; /* This affects the SVG fill */
  width: 24px;
  height: 24px;
}
.details {
  align-self: flex-start;
  padding: 1rem;
}
.class,
.price,
.stock {
  font-family: Montserrat;
  margin: 0;
  padding: 0;
}
.class {
  font-size: 21px;
  font-weight: 900;
}
.price,
.stock {
  font-size: 18px;
  font-weight: 400;
}
</style>
