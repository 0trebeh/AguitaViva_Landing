// Cargar carrito al iniciar
document.addEventListener("DOMContentLoaded", () => {
  loadCart()
})

// Cargar y mostrar carrito
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")

  if (cart.length === 0) {
    showEmptyCart()
    return
  }

  renderCartItems(cart)
  updateCartTotal(cart)
}

// Mostrar carrito vacío
function showEmptyCart() {
  document.getElementById("empty-cart").classList.remove("hidden")
  document.getElementById("cart-items").classList.add("hidden")
  document.getElementById("cart-summary").classList.add("hidden")
}

// Renderizar items del carrito
function renderCartItems(cart) {
  const container = document.getElementById("cart-items")
  container.innerHTML = ""

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div")
    itemDiv.className = "cart-item"
    itemDiv.innerHTML = `
            <img src="${item.foto}" alt="${item.nombre}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${item.precio}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span style="padding: 0 1rem; font-weight: bold;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
                <div style="font-weight: bold; color: #ff6b35;">
                    Subtotal: $${(item.precio * item.quantity).toFixed(2)}
                </div>
            </div>
            <button class="btn btn-danger btn-small" onclick="removeFromCart(${index})">
                🗑️ Eliminar
            </button>
        `
    container.appendChild(itemDiv)
  })

  document.getElementById("empty-cart").classList.add("hidden")
  document.getElementById("cart-items").classList.remove("hidden")
  document.getElementById("cart-summary").classList.remove("hidden")
}

// Actualizar cantidad
window.updateQuantity = (index, newQuantity) => {
  if (newQuantity <= 0) {
    window.removeFromCart(index)
    return
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  cart[index].quantity = newQuantity
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCart()
}

// Eliminar del carrito
window.removeFromCart = (index) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  cart.splice(index, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  loadCart()
}

// Actualizar total
function updateCartTotal(cart) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0)
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`
}

// Pedir en caja
window.orderAtCounter = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  if (cart.length === 0) return

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0)
  const itemsList = cart.map((item) => `${item.quantity}x ${item.nombre}`).join("\n")

  alert(
    `¡Perfecto! Ve a la caja con tu pedido:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}\n\n¡Gracias por tu preferencia!`,
  )

  // Limpiar carrito después de "pedir"
  localStorage.removeItem("cart")
  loadCart()
}

// Vaciar carrito
window.clearCart = () => {
  if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
    localStorage.removeItem("cart")
    loadCart()
  }
}
