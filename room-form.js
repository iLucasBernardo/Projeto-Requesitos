document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("roomForm")
  const requiredFields = ["street", "number", "neighborhood", "state", "capacity", "tables", "chairs", "bathrooms"]
  const numericFields = ["number", "capacity", "tables", "chairs", "bathrooms"]

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    let isValid = true

    // Clear previous errors
    clearErrors()

    // Validate required fields
    requiredFields.forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      if (!field.value.trim()) {
        showError(fieldName, "O campo é de preenchimento obrigatório")
        isValid = false
      }
    })

    // Validate numeric fields
    numericFields.forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      const value = Number.parseInt(field.value)
      if (field.value && (isNaN(value) || value <= 0)) {
        showError(fieldName, "O campo precisa ser um valor numérico positivo")
        isValid = false
      }
    })

    // Validate file uploads
    const roomPhotos = document.getElementById("roomPhotos")
    const addressProof = document.getElementById("addressProof")

    if (!roomPhotos.files.length) {
      showError("roomPhotos", "O campo é de preenchimento obrigatório")
      isValid = false
    } else {
      if (!validateFiles(roomPhotos.files, "roomPhotos")) {
        isValid = false
      }
    }

    if (!addressProof.files.length) {
      showError("addressProof", "O campo é de preenchimento obrigatório")
      isValid = false
    } else {
      if (!validateFiles(addressProof.files, "addressProof")) {
        isValid = false
      }
    }

    // Validate address consistency (simulated)
    if (isValid && !validateAddressConsistency()) {
      showError("addressProof", "O endereço informado deve ser igual ao apresentado na foto de comprovante de endereço")
      isValid = false
    }

    if (isValid) {
      alert("Sala cadastrada com sucesso!")
      window.location.href = "dashboard.html"
    }
  })

  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    errorElements.forEach((element) => {
      element.textContent = ""
    })
  }

  function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + "-error")
    if (errorElement) {
      errorElement.textContent = message
    }
  }

  function validateFiles(files, fieldName) {
    let isValid = true

    for (const file of files) {
      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        showError(
          fieldName,
          "Por favor, anexe fotos em formato JPG ou PNG, com dimensões mínimas de 1920 pixels no lado maior e tamanho máximo de 5 MB por arquivo.",
        )
        isValid = false
        break
      }

      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        showError(
          fieldName,
          "Por favor, anexe fotos em formato JPG ou PNG, com dimensões mínimas de 1920 pixels no lado maior e tamanho máximo de 5 MB por arquivo.",
        )
        isValid = false
        break
      }

      // Validate image dimensions (simplified - in real implementation, you'd load the image)
      validateImageDimensions(file, fieldName).then((valid) => {
        if (!valid) {
          showError(
            fieldName,
            "Por favor, anexe fotos em formato JPG ou PNG, com dimensões mínimas de 1920 pixels no lado maior e tamanho máximo de 5 MB por arquivo.",
          )
        }
      })
    }

    return isValid
  }

  function validateImageDimensions(file, fieldName) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = function () {
        const maxDimension = Math.max(this.width, this.height)
        resolve(maxDimension >= 1920)
      }
      img.onerror = () => {
        resolve(false)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  function validateAddressConsistency() {
    // Simulated address validation
    // In a real implementation, this would use OCR or manual verification
    return Math.random() > 0.3 // 70% chance of validation success for demo
  }

  // Real-time validation for numeric fields
  numericFields.forEach((fieldName) => {
    const field = document.getElementById(fieldName)
    field.addEventListener("input", function () {
      const value = Number.parseInt(this.value)
      const errorElement = document.getElementById(fieldName + "-error")

      if (this.value && (isNaN(value) || value <= 0)) {
        errorElement.textContent = "O campo precisa ser um valor numérico positivo"
      } else {
        errorElement.textContent = ""
      }
    })
  })
})
