import { ref, computed } from 'vue'
import type { Album } from '../types/album'
import type { CartItem } from '../types/cart'

const cartItems = ref<CartItem[]>([])

export function useCart() {
  const addToCart = (album: Album): void => {
    const existingItem = cartItems.value.find(item => item.album.id === album.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      cartItems.value.push({
        album,
        quantity: 1
      })
    }
  }

  const removeFromCart = (albumId: number): void => {
    const index = cartItems.value.findIndex(item => item.album.id === albumId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const updateQuantity = (albumId: number, quantity: number): void => {
    const item = cartItems.value.find(item => item.album.id === albumId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(albumId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = (): void => {
    cartItems.value = []
  }

  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    const total = cartItems.value.reduce((sum, item) => {
      return sum + (item.album.price * item.quantity)
    }, 0)
    return Math.round(total * 100) / 100
  })

  const isInCart = (albumId: number): boolean => {
    return cartItems.value.some(item => item.album.id === albumId)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
    isInCart
  }
}
