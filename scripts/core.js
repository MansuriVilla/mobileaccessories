function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main_navigation");
  const closeBtn = document.querySelector(".nav_close");
  const overlay = document.querySelector(".nav_overlay");

  if (!hamburger || !nav) return;

  function toggleMenu(show) {
    nav.classList.toggle("active", show);
    hamburger.classList.toggle("active", show);
    hamburger.setAttribute("aria-expanded", show);
    if (overlay) overlay.classList.toggle("active", show);
  }

  hamburger.addEventListener("click", () =>
    toggleMenu(!nav.classList.contains("active")),
  );
  if (closeBtn) closeBtn.addEventListener("click", () => toggleMenu(false));
  if (overlay) overlay.addEventListener("click", () => toggleMenu(false));
}

function initProductGallery() {
  const thumbnails = document.querySelectorAll(".pdp_thumbnails img");
  const mainImage = document.querySelector(".pdp_main_image img");

  if (!thumbnails.length || !mainImage) return;

  function handleThumbnailClick(event) {
    const clickedThumb = event.currentTarget;

    thumbnails.forEach((t) => t.classList.remove("active"));
    clickedThumb.classList.add("active");

    const newSrc =
      clickedThumb.dataset.main || clickedThumb.getAttribute("src");
    if (newSrc) {
      mainImage.setAttribute("src", newSrc);
    }
  }

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", handleThumbnailClick);
  });
}

function initCollectionFilters() {
  const grid = document.querySelector(".collection_grid");
  const sortSelect = document.getElementById("sort-by");
  const priceRange = document.querySelector(".price_range");
  const priceValue = document.querySelector(".price_value");

  if (!grid || !sortSelect) return;

  const products = Array.from(grid.querySelectorAll(".product_card")).map(
    (card) => {
      const priceNode = card.querySelector(".product_price");
      const titleNode = card.querySelector(".product_title");

      const priceText = priceNode ? priceNode.textContent : "0";
      const title = titleNode ? titleNode.textContent.trim() : "";

      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

      return { element: card, price, title };
    },
  );

  function renderProducts(filteredProducts) {
    grid.innerHTML = "";

    if (filteredProducts.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: 1 / -1; color: #666; font-size: 14px;display: flex;justify-content: center;align-items: center;aspect-ratio: 2/1;">No products match your filters.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    filteredProducts.forEach((p) => fragment.appendChild(p.element));
    grid.appendChild(fragment);
  }

  function updateGrid() {
    const maxPrice = priceRange ? parseFloat(priceRange.value) : 1000;
    const sortValue = sortSelect.value;

    const filtered = products.filter((p) => p.price <= maxPrice);
    filtered.sort((a, b) => {
      switch (sortValue) {
        case "title-ascending":
          return a.title.localeCompare(b.title);
        case "title-descending":
          return b.title.localeCompare(a.title);
        case "price-ascending":
          return a.price - b.price;
        case "price-descending":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    renderProducts(filtered);
  }

  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      if (priceValue) priceValue.textContent = e.target.value;
    });
    priceRange.addEventListener("change", updateGrid);
  }

  sortSelect.addEventListener("change", updateGrid);
  updateGrid();
}

function initQuantitySelectors() {
  const quantitySelectors = document.querySelectorAll(".quantity_selector");

  quantitySelectors.forEach((selector) => {
    const input = selector.querySelector(".qty_input");
    const buttons = selector.querySelectorAll(".qty_btn");

    if (!input || buttons.length < 2) return;

    const btnDecrease = Array.from(buttons).find(
      (b) => b.getAttribute("aria-label") === "Decrease quantity",
    );
    const btnIncrease = Array.from(buttons).find(
      (b) => b.getAttribute("aria-label") === "Increase quantity",
    );

    if (btnDecrease) {
      btnDecrease.addEventListener("click", () => {
        const currentValue = parseInt(input.value, 10) || 1;
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });
    }

    if (btnIncrease) {
      btnIncrease.addEventListener("click", () => {
        const currentValue = parseInt(input.value, 10) || 1;
        input.value = currentValue + 1;
      });
    }

    input.addEventListener("change", () => {
      const val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) {
        input.value = 1;
      }
    });

    input.addEventListener("focus", () => {
      input.select();
    });
  });
}

function initSearchModal() {
  const searchBtns = document.querySelectorAll(".icon_search");
  const searchModal = document.querySelector(".search_modal");
  const searchClose = document.querySelector(".search_close");
  const searchBackdrop = document.querySelector(".search_backdrop");
  const searchInput = document.querySelector(".search_input");

  if (!searchModal || !searchBtns.length) return;

  function openSearch() {
    searchModal.classList.add("active");
    searchBtns.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    searchModal.classList.remove("active");
    searchBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  }

  searchBtns.forEach((btn) => btn.addEventListener("click", openSearch));
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearch);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal.classList.contains("active")) {
      closeSearch();
    }
  });
}

function initCartDrawer() {
  const cartBtn = document.querySelector(".icon_cart");
  const cartDrawer = document.querySelector(".cart_drawer");
  const cartClose = document.querySelector(".cart_close");
  const cartBackdrop = document.querySelector(".cart_backdrop");

  if (!cartDrawer || !cartBtn) return;

  function openCart() {
    cartDrawer.classList.add("active");
    cartBtn.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    cartDrawer.classList.remove("active");
    cartBtn.setAttribute("aria-expanded", "false");
  }

  cartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("active")) {
      closeCart();
    }
  });

  // Initial UI update
  updateCartUI();
}

// Cart Logic
function getCart() {
  const cart = localStorage.getItem("almeria_cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("almeria_cart", JSON.stringify(cart));
  updateCartUI();
}

let emptyCartTemplate = null;

function updateCartUI() {
  const cart = getCart();
  const cartContent = document.querySelector(".cart_content");
  const cartFooter = document.querySelector(".cart_footer");
  const cartEmpty = document.querySelector(".cart_empty");
  const cartCounts = document.querySelectorAll(".cart_count");

  // Update count bubbles (unique products count)
  const uniqueItemsCount = cart.length;
  cartCounts.forEach((el) => {
    el.textContent = uniqueItemsCount;
    el.style.display = uniqueItemsCount > 0 ? "flex" : "none";
  });

  if (!cartContent) return;

  // Capture empty state template if not already captured
  if (cartEmpty && !emptyCartTemplate) {
    emptyCartTemplate = cartEmpty.outerHTML;
  }

  if (cart.length === 0) {
    if (cartFooter) cartFooter.style.display = "none";
    cartContent.innerHTML =
      emptyCartTemplate ||
      '<div class="cart_empty" style="display:flex"><p>Your cart is empty</p></div>';

    // Ensure the restored empty state is visible
    const newEmpty = cartContent.querySelector(".cart_empty");
    if (newEmpty) newEmpty.style.display = "flex";
    return;
  }

  if (cartEmpty) cartEmpty.style.display = "none";
  if (cartFooter) cartFooter.style.display = "flex";

  let html = '<div class="cart_items_list site_flex site_flex--column gap_sm">';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const modelOptions =
      item.models && item.models.length > 0
        ? `<select class="cart_item_select" onchange="updateCartItem(${index}, {selectedModel: this.value})">
          ${item.models.map((m) => `<option value="${m.value}" ${m.value === (item.selectedModel || "") ? "selected" : ""}>${m.text}</option>`).join("")}
        </select>`
        : `<span>${item.selectedModel || ""}</span>`;

    const colorOptions =
      item.colors && item.colors.length > 0
        ? `<select class="cart_item_select" onchange="updateCartItem(${index}, {selectedColor: this.value})">
          ${item.colors.map((c) => `<option value="${c.value}" ${c.value === (item.selectedColor || "") ? "selected" : ""}>${c.text}</option>`).join("")}
        </select>`
        : `<span>${item.selectedColor || ""}</span>`;

    const variantDisplay =
      item.models || item.colors
        ? `<div class="cart_item_variants site_flex gap_xs">
          ${modelOptions}
          ${colorOptions}
        </div>`
        : `<p class="cart_item_variant">${item.variant || ""}</p>`;

    html += `
      <div class="cart_item site_flex gap_sm" data-index="${index}">
        <div class="cart_item_image_wrap">
          <img src="${item.image}" alt="${item.title}" width="80" height="80">
        </div>
        <div class="cart_item_info site_flex site_flex--column gap_xs">
          <div class="site_flex justify_between align_start">
            <h4 class="cart_item_title">${item.title}</h4>
            <button class="cart_item_remove" onclick="removeFromCart(${index})">&times;</button>
          </div>
          ${variantDisplay}
          <div class="site_flex justify_between align_center">
            <p class="cart_item_price">Rs. ${item.price.toFixed(2)}</p>
            <div class="cart_item_qty_controls site_flex align_center gap_xs">
              <button class="cart_qty_btn" onclick="updateCartItem(${index}, {quantity: ${Math.max(1, item.quantity - 1)}})">-</button>
              <input type="number" class="cart_qty_input" value="${item.quantity}" onchange="updateCartItem(${index}, {quantity: parseInt(this.value, 10)})">
              <button class="cart_qty_btn" onclick="updateCartItem(${index}, {quantity: ${item.quantity + 1}})">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += "</div>";
  cartContent.innerHTML = html;

  if (cartFooter) {
    cartFooter.innerHTML = `
      <div class="cart_total site_flex justify_between align_center">
        <span>Total</span>
        <span class="total_amount">Rs. ${total.toFixed(2)}</span>
      </div>
      <a href="#" class="btn btn_primary">Checkout</a>
    `;
  }
}

function addToCart(e) {
  const addBtn = e.currentTarget;
  const pdp = addBtn.closest(".pdp_details");
  if (!pdp || !addBtn) return;

  // Visual feedback
  const originalText = addBtn.textContent;
  addBtn.textContent = "Adding...";
  addBtn.disabled = true;

  const titleNode = pdp.querySelector(".pdp_title");
  const priceNode = pdp.querySelector(".pdp_price");
  const imgNode = document.querySelector(".pdp_main_image img");
  const qtyNode =
    pdp.querySelector(".qty_input") || document.querySelector(".qty_input");

  if (!titleNode || !priceNode) {
    addBtn.textContent = originalText;
    addBtn.disabled = false;
    return;
  }

  const title = titleNode.textContent.trim();
  const priceText = priceNode.textContent.trim();

  // More robust price extraction: find the first sequence of numbers/dots
  const priceMatch = priceText.match(/\d+(\.\d+)?/);
  const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

  const image = imgNode ? imgNode.src : "";
  const quantity = qtyNode ? parseInt(qtyNode.value, 10) : 1;

  const modelSelect =
    pdp.querySelector("#model, #model-home") ||
    document.querySelector("#model, #model-home");
  const colorSelect =
    pdp.querySelector("#color, #color-home") ||
    document.querySelector("#color, #color-home");

  const selectedModel = modelSelect ? modelSelect.value : "";
  const selectedColor = colorSelect ? colorSelect.value : "";
  const variant = `${selectedModel} / ${selectedColor}`;

  // Capture available options for editing in cart
  const models = modelSelect
    ? Array.from(modelSelect.options).map((o) => ({
        value: o.value,
        text: o.text,
      }))
    : [];
  const colors = colorSelect
    ? Array.from(colorSelect.options).map((o) => ({
        value: o.value,
        text: o.text,
      }))
    : [];

  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.title === title &&
      item.selectedModel === selectedModel &&
      item.selectedColor === selectedColor,
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      title,
      price,
      image,
      variant,
      selectedModel,
      selectedColor,
      models,
      colors,
      quantity,
    });
  }

  setTimeout(() => {
    saveCart(cart);
    addBtn.textContent = "Added!";

    setTimeout(() => {
      addBtn.textContent = originalText;
      addBtn.disabled = false;

      // Open cart drawer
      const cartDrawer = document.querySelector(".cart_drawer");
      if (cartDrawer) cartDrawer.classList.add("active");
    }, 500);
  }, 600);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateCartItem(index, updates) {
  const cart = getCart();
  if (!cart[index]) return;

  // Apply updates
  if (updates.quantity !== undefined) {
    cart[index].quantity = Math.max(1, updates.quantity);
  }
  if (updates.selectedModel !== undefined) {
    cart[index].selectedModel = updates.selectedModel;
  }
  if (updates.selectedColor !== undefined) {
    cart[index].selectedColor = updates.selectedColor;
  }

  // Update combined variant string for display/tracking
  cart[index].variant =
    `${cart[index].selectedModel} / ${cart[index].selectedColor}`;

  saveCart(cart);
}

function initAnnounceMarquee() {
  const track = document.querySelector(".announce_track");
  if (!track) return;

  const items = Array.from(track.children);
  if (items.length === 0) return;

  // Clone items to ensure seamless loop
  // We clone enough times to fill at least twice the width of the screen
  const containerWidth = track.parentElement.offsetWidth;
  let trackWidth = 0;
  
  items.forEach(item => {
    trackWidth += item.offsetWidth + 28; // 28 is the gap in CSS
  });

  // Keep cloning until track is at least 3x the container width or we have enough clones
  const cloneCount = Math.ceil(containerWidth / trackWidth) + 1;
  
  for (let i = 0; i < cloneCount; i++) {
    items.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

  // Animate
  gsap.to(track, {
    x: -trackWidth,
    duration: 20,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % trackWidth)
    }
  });
}

function initVariantSelectors() {
  const selects = document.querySelectorAll(".pdp_select");

  selects.forEach((select) => {
    select.addEventListener("change", (e) => {
      const selectedOptionText = e.target.options[e.target.selectedIndex].text;
      const label = document.querySelector(`label[for="${e.target.id}"]`);
      if (label) {
        const b = label.querySelector("b");
        if (b) {
          b.textContent = selectedOptionText;
        }
      }
    });
  });
}

function initAddToCart() {
  const addBtns = document.querySelectorAll(".pdp_actions .btn_secondary");
  addBtns.forEach((btn) => {
    btn.addEventListener("click", addToCart);
  });
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll(".navigation_dropdown");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector("a");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      // Only toggle if on mobile or if the user explicitly clicks (as requested)
      // For desktop, hover still works via CSS, but this handles the click behavior
      e.preventDefault();
      e.stopPropagation();

      const isActive = dropdown.classList.contains("active");

      // Close all other dropdowns
      dropdowns.forEach((d) => d.classList.remove("active"));

      if (!isActive) {
        dropdown.classList.add("active");
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    dropdowns.forEach((d) => d.classList.remove("active"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initSearchModal();
  initCartDrawer();
  initProductGallery();
  initCollectionFilters();
  initQuantitySelectors();
  initDropdowns();
  initAddToCart();
  initVariantSelectors();
  initAnnounceMarquee();
});
