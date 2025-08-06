import { db, collection, getDocs } from "./firebase-config.js"

// Variables globales
let menuItems = []
let productTypes = []
let currentCategory = ""
let showingFavorites = false

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  await loadData()
  updateCartCount()
})

// Cargar datos de Firebase
async function loadData() {
  try {
    // Cargar elementos del menú
    const menuSnapshot = await getDocs(collection(db, "menuItems"))
    menuItems = []
    menuSnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() })
    })

    // Cargar tipos de productos
    const typesSnapshot = await getDocs(collection(db, "productTypes"))
    productTypes = []
    typesSnapshot.forEach((doc) => {
      productTypes.push({ id: doc.id, ...doc.data() })
    })

    // Ordenar por posición
    menuItems.sort((a, b) => a.posicion - b.posicion)
    productTypes.sort((a, b) => a.posicion - b.posicion)

    // Mostrar contenido
    hideLoading()
    renderCategories()
    renderFavorites()
    renderMenu()
  } catch (error) {
    console.error("Error cargando datos:", error)
    document.getElementById("loading").innerHTML = "Error cargando el menú. Por favor, recarga la página."
  }
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden")
  document.getElementById("categories-section").classList.remove("hidden")
  document.getElementById("favorites-section").classList.remove("hidden")
  document.getElementById("menu-section").classList.remove("hidden")
}

// Renderizar categorías
function renderCategories() {
  const grid = document.getElementById("categories-grid")
  grid.innerHTML = ""

  productTypes.forEach((type) => {
    const categoryItems = menuItems.filter((item) => item.tipoProducto === type.nombre)
    const sampleImage = categoryItems[0]?.foto || "/placeholder.svg?height=200&width=200"

    const categoryCard = `
            <div class="card" onclick="showCategory('${type.nombre}')">
                <img src="${sampleImage}" alt="${type.nombre}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${type.nombre}</h3>
                    <p class="card-description">${categoryItems.length} productos</p>
                </div>
            </div>
        `
    grid.innerHTML += categoryCard
  })
}

// Renderizar favoritos
function renderFavorites() {
  const grid = document.getElementById("favorites-grid")
  const favorites = menuItems.filter((item) => item.favorito).slice(0, 6)

  grid.innerHTML = ""
  favorites.forEach((item) => {
    const card = createMenuItemCard(item, true)
    grid.innerHTML += card
  })
}

// Renderizar menú
function renderMenu() {
  const grid = document.getElementById("menu-grid")
  const noProducts = document.getElementById("no-products")

  let filteredItems = menuItems

  if (showingFavorites) {
    filteredItems = menuItems.filter((item) => item.favorito)
    document.getElementById("menu-title").textContent = "Todos los Favoritos"
  } else if (currentCategory) {
    filteredItems = menuItems.filter((item) => item.tipoProducto === currentCategory)
    document.getElementById("menu-title").textContent = currentCategory
  } else {
    document.getElementById("menu-title").textContent = "Todos los Productos"
  }

  // Mostrar/ocultar botón "Ver todo"
  const showAllBtn = document.getElementById("show-all-btn")
  if (currentCategory || showingFavorites) {
    showAllBtn.classList.remove("hidden")
  } else {
    showAllBtn.classList.add("hidden")
  }

  grid.innerHTML = ""

  if (filteredItems.length === 0) {
    noProducts.classList.remove("hidden")
    grid.classList.add("hidden")
  } else {
    noProducts.classList.add("hidden")
    grid.classList.remove("hidden")

    filteredItems.forEach((item) => {
      const card = createMenuItemCard(item)
      grid.innerHTML += card
    })
  }
}

// Crear card de elemento del menú
function createMenuItemCard(item, isFavoriteSection = false) {
  const favoriteIcon = item.favorito ? '<span class="favorite-icon">❤️</span>' : ""

  return `
        <div class="card">
            <div class="card-image-container">
                <img src="${item.foto || "/placeholder.svg?height=200&width=300"}" alt="${item.nombre}" class="card-image">
                ${favoriteIcon}
            </div>
            <div class="card-content">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="card-title">${item.nombre}</h3>
                    <span style="background: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.8rem;">${item.tipoProducto}</span>
                </div>
                <p class="card-description">${item.descripcion}</p>
                <div class="card-footer">
                    <span class="price">$${item.precio}</span>
                    <button class="btn btn-primary" onclick="addToCart('${item.id}')">Agregar</button>
                </div>
            </div>
        </div>
    `
}

// Funciones de navegación
window.showCategory = (categoryName) => {
  currentCategory = categoryName
  showingFavorites = false
  renderMenu()
  document.getElementById("menu-section").scrollIntoView({ behavior: "smooth" })
}

window.showAllFavorites = () => {
  showingFavorites = true
  currentCategory = ""
  renderMenu()
  document.getElementById("menu-section").scrollIntoView({ behavior: "smooth" })
}

window.showAllProducts = () => {
  currentCategory = ""
  showingFavorites = false
  renderMenu()
}

// Funciones del carrito
window.addToCart = (itemId) => {
  const item = menuItems.find((i) => i.id === itemId)
  if (!item) return

  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const existingItem = cart.find((cartItem) => cartItem.id === itemId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()

  // Mostrar notificación simple
  showNotification(`${item.nombre} agregado al carrito`)
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  document.getElementById("cart-count").textContent = totalItems
}

function showNotification(message) {
  // Crear notificación simple
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Agregar animación CSS
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`
document.head.appendChild(style)
