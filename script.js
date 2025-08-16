// Mobile Navigation Toggle
const beverage = document.getElementById("beverage")
const navMenu = document.getElementById("nav-menu")

beverage.addEventListener("click", () => {
  beverage.classList.toggle("active")
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
  n.addEventListener("click", () => {
    beverage.classList.remove("active")
    navMenu.classList.remove("active")
  }),
)

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})


// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0
      setTimeout(() => {
        entry.target.classList.add("animate")
      }, delay)
    }
  })
}, observerOptions)

// Observe all animated elements
document.querySelectorAll(".fade-in-up, .slide-in-left, .slide-in-right").forEach((el) => {
  observer.observe(el)
})

// Photo Carousel
let currentSlide = 0
const slides = document.querySelectorAll(".carousel-slide")
const totalSlides = slides.length

function updateCarousel() {
  const track = document.getElementById("carousel-track")
  track.style.transform = `translateX(-${currentSlide * 100}%)`

  // Update dots
  document.querySelectorAll(".carousel-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide)
  })
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
}

// Create carousel dots
function createCarouselDots() {
  const dotsContainer = document.getElementById("carousel-dots")
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div")
    dot.classList.add("carousel-dot")
    if (i === 0) dot.classList.add("active")
    dot.addEventListener("click", () => {
      currentSlide = i
      updateCarousel()
    })
    dotsContainer.appendChild(dot)
  }
}

// Initialize carousel
if (slides.length > 0) {
  createCarouselDots()
  document.getElementById("next-btn").addEventListener("click", nextSlide)
  document.getElementById("prev-btn").addEventListener("click", prevSlide)

  // Auto-play carousel
  setInterval(nextSlide, 5000)
}

// Video Player
const videoOverlay = document.getElementById("video-overlay")
const playButton = document.getElementById("play-button")

if (videoOverlay && playButton) {
  playButton.addEventListener("click", () => {
    videoOverlay.style.display = "none"
    // In a real implementation, you would start the video here
  })
}

// FAQ Toggle
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement
    const isActive = faqItem.classList.contains("active")

    // Close all FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active")
    })

    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add("active")
    }
  })
})

// Statistics Counter Animation
function animateCounter(element, target) {
  let count = 0
  const interval = setInterval(() => {
    if (count >= target) {
      clearInterval(interval)
      element.textContent = target
    } else {
      element.textContent = count++
    }
  }, 10)
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = Number.parseInt(entry.target.dataset.target)
      if (!entry.target.classList.contains("animated")) {
        entry.target.classList.add("animated")
        animateCounter(entry.target, target)
      }
    }
  })
})

document.querySelectorAll(".stat-number").forEach((stat) => {
  statsObserver.observe(stat)
})

// Contact Form
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(this)
  const data = Object.fromEntries(formData)

  // Simulate form submission
  const submitBtn = this.querySelector(".submit-btn")
  const originalText = submitBtn.textContent

  submitBtn.textContent = "Enviando..."
  submitBtn.disabled = true

  setTimeout(() => {
    alert("¡Mensaje enviado exitosamente! Te contactaremos pronto.")
    this.reset()
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }, 2000)
})

// Button click effects
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", function (e) {
    // Create ripple effect
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})


// Route day interactions
document.querySelectorAll(".route-day").forEach((day) => {
  day.addEventListener("click", () => {
    // Remove active class from all days
    document.querySelectorAll(".day-marker").forEach((marker) => {
      marker.classList.remove("active")
    })

    // Add active class to clicked day
    day.querySelector(".day-marker").classList.add("active")

    // Show location info (in a real app, this would update the map)
    const dayName = day.dataset.day
    console.log(`Selected day: ${dayName}`)
  })
})

// Instagram post interactions
document.querySelectorAll(".instagram-post").forEach((post) => {
  post.addEventListener("click", () => {
    // In a real app, this would open the Instagram post
    window.open("https://instagram.com/pattywagon_official", "_blank")
  })
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded")

  // Trigger initial animations
  setTimeout(() => {
    document.querySelectorAll(".hero .fade-in-up, .hero .slide-in-right").forEach((el) => {
      el.classList.add("animate")
    })
  }, 300)
})

// Promo cards hover effects
document.querySelectorAll(".promo-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-15px) scale(1.02)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(-10px) scale(1)"
  })
})

// Award items hover effect with random delays
document.querySelectorAll(".cert-item").forEach((item, index) => {
  item.addEventListener("mouseenter", () => {
    item.style.animationDelay = `${index * 0.1}s`
    item.style.animation = "bounce 0.6s ease"
  })

  item.addEventListener("animationend", () => {
    item.style.animation = ""
  })
})

// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle")
const themeIcon = document.getElementById("theme-icon")
const body = document.body

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light"
body.setAttribute("data-theme", currentTheme)

// Update icon based on current theme
function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeIcon.className = "fas fa-moon"
  } else {
    themeIcon.className = "fas fa-sun"
  }
}

// Initialize icon
updateThemeIcon(currentTheme)

// Theme toggle event listener
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  // Update theme
  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)

  // Update icon with animation
  themeIcon.style.transform = "rotate(180deg)"
  setTimeout(() => {
    updateThemeIcon(newTheme)
    themeIcon.style.transform = "rotate(0deg)"
  }, 150)

  // Add a subtle animation to the page
  body.style.transition = "background-color 0.3s ease, color 0.3s ease"
  setTimeout(() => {
    body.style.transition = ""
  }, 300)
})

// System theme preference detection
if (window.matchMedia && !localStorage.getItem("theme")) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

  if (mediaQuery.matches) {
    body.setAttribute("data-theme", "dark")
    updateThemeIcon("dark")
  }

  // Listen for system theme changes
  mediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light"
      body.setAttribute("data-theme", newTheme)
      updateThemeIcon(newTheme)
    }
  })
}
