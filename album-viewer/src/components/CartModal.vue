<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>🛒 Shopping Cart</h2>
            <button class="close-btn" @click="$emit('close')">✕</button>
          </div>

          <div v-if="items.length === 0" class="empty-cart">
            <p>Your cart is empty</p>
            <p class="empty-cart-subtitle">Add some albums to get started!</p>
          </div>

          <div v-else class="cart-items">
            <div v-for="item in items" :key="item.album.id" class="cart-item">
              <img 
                :src="item.album.image_url" 
                :alt="item.album.title"
                class="item-image"
                @error="handleImageError"
              />
              <div class="item-details">
                <h4 class="item-title">{{ item.album.title }}</h4>
                <p class="item-artist">{{ item.album.artist }}</p>
                <div class="item-quantity">
                  <button 
                    class="quantity-btn" 
                    @click="$emit('update-quantity', item.album.id, item.quantity - 1)"
                  >-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    class="quantity-btn" 
                    @click="$emit('update-quantity', item.album.id, item.quantity + 1)"
                  >+</button>
                </div>
              </div>
              <div class="item-price">
                <p class="price">${{ (item.album.price * item.quantity).toFixed(2) }}</p>
                <button 
                  class="remove-btn" 
                  @click="$emit('remove', item.album.id)"
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div class="cart-footer">
              <div class="total">
                <span class="total-label">Total:</span>
                <span class="total-price">${{ total.toFixed(2) }}</span>
              </div>
              <button class="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CartItem } from '../types/cart'

interface Props {
  isOpen: boolean
  items: CartItem[]
  total: number
}

defineProps<Props>()

defineEmits<{
  close: []
  remove: [albumId: number]
  'update-quantity': [albumId: number, quantity: number]
}>()

const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/80x80/667eea/white?text=Album'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.empty-cart {
  padding: 4rem 2rem;
  text-align: center;
  color: #666;
}

.empty-cart p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.empty-cart-subtitle {
  font-size: 1rem;
  opacity: 0.7;
}

.cart-items {
  overflow-y: auto;
  flex: 1;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}

.cart-item:hover {
  background: #f9f9f9;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-artist {
  margin: 0 0 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background: #667eea;
  color: white;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.cart-footer {
  padding: 1.5rem;
  border-top: 2px solid #f0f0f0;
  background: #f9f9f9;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.total-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-content {
    max-height: 90vh;
    margin: 0;
  }

  .cart-item {
    gap: 0.75rem;
    padding: 1rem;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-title {
    font-size: 0.9rem;
  }

  .item-artist {
    font-size: 0.8rem;
  }
}
</style>
