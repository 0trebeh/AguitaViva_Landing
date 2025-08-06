import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "./firebase-config.js"

let menuItems = []
let productTypes = []
let editingId = null

// Cargar datos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  await loadData()
  setupEventListeners()
})

// Configurar event listeners
function setupEventListeners() {
  document.getElementById("product-form").addEventListener("submit", handleProductSubmit)
  document.getElementById("type-form").addEventListener("submit", handleTypeSubmit)
}

// Cargar datos de Firebase
async function loadData() {
  try {
    // Cargar tipos de productos
    const typesSnapshot = await getDocs(collection(db, "productTypes"))
    productTypes = []
    typesSnapshot.forEach((doc) => {
      productTypes.push({ id: doc.id, ...doc.data() })
    })
    productTypes.sort((a, b) => a.posicion - b.posicion)

    // Cargar elementos del menú
    const menuSnapshot = await getDocs(collection(db, "menuItems"))
    menuItems = []
    menuSnapshot.forEach((doc) => {
      menuItems.push({ id: doc.id, ...doc.data() })
    })
    menuItems.sort((a, b) => a.posicion - b.posicion)

    // Actualizar UI
    updateTypeSelect()
    renderProducts()
  } catch (error) {
    console.error("Error cargando datos:", error)
    alert("Error cargando datos. Por favor, recarga la página.")
  }
}

// Actualizar select de tipos de productos
function updateTypeSelect() {
  const select = document.getElementById("tipoProducto")
  select.innerHTML = '<option value="">Seleccionar tipo</option>'

  productTypes.forEach((type) => {
    const option = document.createElement("option")
    option.value = type.nombre
    option.textContent = type.nombre
    select.appendChild(option)
  })
}

// Manejar envío del formulario de productos
async function handleProductSubmit(e) {
  e.preventDefault()

  const formData = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: Number.parseFloat(document.getElementById("precio").value),
    tipoProducto: document.getElementById("tipoProducto").value,
    posicion: Number.parseInt(document.getElementById("posicion").value),
    favorito: document.getElementById("favorito").checked,
    foto: document.getElementById("foto").value || "/placeholder.svg?height=200&width=300",
  }

  try {
    if (editingId) {
      // Actualizar producto existente
      await updateDoc(doc(db, "menuItems", editingId), formData)
      alert("Producto actualizado exitosamente")
    } else {
      // Agregar nuevo producto
      await addDoc(collection(db, "menuItems"), formData)
      alert("Producto agregado exitosamente")
    }

    window.resetForm()
    await loadData()
  } catch (error) {
    console.error("Error guardando producto:", error)
    alert("Error guardando producto")
  }
}

// Manejar envío del formulario de tipos
async function handleTypeSubmit(e) {
  e.preventDefault()

  const formData = {
    nombre: document.getElementById("type-nombre").value,
    posicion: Number.parseInt(document.getElementById("type-posicion").value),
  }

  try {
    await addDoc(collection(db, "productTypes"), formData)
    alert("Tipo de producto agregado exitosamente")

    document.getElementById("type-form").reset()
    await loadData()
  } catch (error) {
    console.error("Error guardando tipo:", error)
    alert("Error guardando tipo de producto")
  }
}

// Renderizar lista de productos
function renderProducts() {
  const container = document.getElementById("products-container")

  if (menuItems.length === 0) {
    container.innerHTML = '<div class="text-center" style="padding: 2rem;">No hay productos agregados</div>'
    return
  }

  container.innerHTML = ""

  menuItems.forEach((item) => {
    const productDiv = document.createElement("div")
    productDiv.className = "product-item"
    productDiv.innerHTML = `
            <img src="${item.foto}" alt="${item.nombre}" class="product-image">
            <div class="product-details">
                <div class="product-name">${item.nombre} ${item.favorito ? "❤️" : ""}</div>
                <div class="product-meta">
                    ${item.tipoProducto} • $${item.precio} • Posición: ${item.posicion}
                </div>
                <div class="product-meta">${item.descripcion}</div>
            </div>
            <div class="product-actions">
                <button class="btn btn-outline btn-small" onclick="editProduct('${item.id}')">Editar</button>
                <button class="btn btn-danger btn-small" onclick="deleteProduct('${item.id}')">Eliminar</button>
            </div>
        `
    container.appendChild(productDiv)
  })
}

// Editar producto
window.editProduct = (id) => {
  const item = menuItems.find((i) => i.id === id)
  if (!item) return

  editingId = id
  document.getElementById("form-title").textContent = "Editar Producto"
  document.getElementById("product-id").value = id
  document.getElementById("nombre").value = item.nombre
  document.getElementById("descripcion").value = item.descripcion
  document.getElementById("precio").value = item.precio
  document.getElementById("tipoProducto").value = item.tipoProducto
  document.getElementById("posicion").value = item.posicion
  document.getElementById("favorito").checked = item.favorito
  document.getElementById("foto").value = item.foto

  document.getElementById("product-form").scrollIntoView({ behavior: "smooth" })
}

// Eliminar producto
window.deleteProduct = async (id) => {
  if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

  try {
    await deleteDoc(doc(db, "menuItems", id))
    alert("Producto eliminado exitosamente")
    await loadData()
  } catch (error) {
    console.error("Error eliminando producto:", error)
    alert("Error eliminando producto")
  }
}

// Resetear formulario
window.resetForm = () => {
  editingId = null
  document.getElementById("form-title").textContent = "Agregar Nuevo Producto"
  document.getElementById("product-form").reset()
}
