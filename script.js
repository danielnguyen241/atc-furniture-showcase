// ATC Furniture - Main Interactive Logic & RFQ Engine

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const body = document.body;
  const toggle = document.querySelector(".mobile-toggle") || document.querySelector(".atc-hamburger-btn");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      body.classList.toggle("nav-open", !expanded);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        body.classList.remove("nav-open");
      }
    });
  }

  // 2. Proposal Modal Toggle
  const proposalBtn = document.getElementById("openProposalBtn");
  const proposalModal = document.getElementById("proposalModal");
  const closeProposalBtn = document.getElementById("closeProposalBtn");

  if (proposalBtn && proposalModal) {
    proposalBtn.addEventListener("click", () => {
      proposalModal.classList.add("active");
    });
  }
  if (closeProposalBtn && proposalModal) {
    closeProposalBtn.addEventListener("click", () => {
      proposalModal.classList.remove("active");
    });
  }
  if (proposalModal) {
    proposalModal.addEventListener("click", (e) => {
      if (e.target === proposalModal) {
        proposalModal.classList.remove("active");
      }
    });
  }

  // 3. RFQ Cart State
  let rfqCart = JSON.parse(localStorage.getItem("atc_rfq_cart") || "[]");

  const rfqDrawer = document.getElementById("rfqDrawer");
  const rfqDrawerOverlay = document.getElementById("rfqDrawerOverlay");
  const openRfqBtn = document.getElementById("openRfqBtn");
  const openRfqBtnHeader = document.getElementById("openRfqBtnHeader");
  const floatingRfqBtn = document.getElementById("floatingRfqBtn");
  const closeRfqBtn = document.getElementById("closeRfqBtn");
  const rfqItemsContainer = document.getElementById("rfqItemsContainer");
  const rfqCountHeader = document.getElementById("rfqCountHeader");
  const rfqCountHeaderTop = document.getElementById("rfqCountHeaderTop");
  const rfqCountBadge = document.getElementById("rfqCountBadge");
  const rfqTotalQtyEl = document.getElementById("rfqTotalQty");
  const rfqTotalEstEl = document.getElementById("rfqTotalEst");

  function saveCart() {
    localStorage.setItem("atc_rfq_cart", JSON.stringify(rfqCart));
    renderCart();
  }

  function showToast(msg) {
    let toast = document.getElementById("toastMsg");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toastMsg";
      toast.className = "toast-msg";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function openDrawer() {
    if (rfqDrawer && rfqDrawerOverlay) {
      rfqDrawer.classList.add("active");
      rfqDrawerOverlay.classList.add("active");
    }
  }

  function closeDrawer() {
    if (rfqDrawer && rfqDrawerOverlay) {
      rfqDrawer.classList.remove("active");
      rfqDrawerOverlay.classList.remove("active");
    }
  }

  if (openRfqBtn) openRfqBtn.addEventListener("click", openDrawer);
  if (openRfqBtnHeader) openRfqBtnHeader.addEventListener("click", openDrawer);
  if (floatingRfqBtn) floatingRfqBtn.addEventListener("click", openDrawer);
  if (closeRfqBtn) closeRfqBtn.addEventListener("click", closeDrawer);
  if (rfqDrawerOverlay) rfqDrawerOverlay.addEventListener("click", closeDrawer);

  window.addToRfq = function (id) {
    const product = (window.ATC_PRODUCTS || []).find((p) => p.id === id);
    if (!product) return;

    const existing = rfqCart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 5;
    } else {
      rfqCart.push({
        id: product.id,
        model: product.model,
        name: product.official_title || product.name,
        price: product.price,
        image: product.image,
        qty: 5, // Default MOQ
      });
    }
    saveCart();
    showToast(`Added ${product.model} (${product.official_title || product.name}) to RFQ list!`);
  };

  window.changeQty = function (id, delta) {
    const item = rfqCart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      rfqCart = rfqCart.filter((i) => i.id !== id);
    }
    saveCart();
  };

  window.removeItem = function (id) {
    rfqCart = rfqCart.filter((i) => i.id !== id);
    saveCart();
  };

  function renderCart() {
    const totalItems = rfqCart.reduce((sum, i) => sum + i.qty, 0);
    const totalEst = rfqCart.reduce((sum, i) => sum + i.qty * i.price, 0);

    if (rfqCountHeader) rfqCountHeader.textContent = rfqCart.length;
    if (rfqCountHeaderTop) rfqCountHeaderTop.textContent = rfqCart.length;
    if (rfqCountBadge) rfqCountBadge.textContent = totalItems;
    if (rfqTotalQtyEl) rfqTotalQtyEl.textContent = `${totalItems} sets`;
    if (rfqTotalEstEl)
      rfqTotalEstEl.textContent = `$${totalEst.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    if (!rfqItemsContainer) return;

    if (rfqCart.length === 0) {
      rfqItemsContainer.innerHTML = `
        <div class="rfq-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p>Your RFQ quotation basket is currently empty.</p>
          <p style="font-size:13px; margin-top:8px;">Browse our 145 models below and click "Add to RFQ" to build a wholesale inquiry.</p>
        </div>
      `;
      return;
    }

    rfqItemsContainer.innerHTML = rfqCart
      .map(
        (item) => `
        <div class="rfq-item">
          <div class="rfq-item__thumb">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="rfq-item__info">
            <div class="rfq-item__model">${item.model}</div>
            <div class="rfq-item__name">${item.name}</div>
            <div class="rfq-item__price">$${item.price.toFixed(2)} / set</div>
            <div class="rfq-item__qty" style="margin-top:6px;">
              <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
              <span style="font-size:12px; color:#888; margin-left:6px;">sets</span>
            </div>
          </div>
          <button class="rfq-item__del" title="Remove item" onclick="removeItem(${item.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      `
      )
      .join("");
  }

  // Initial render
  renderCart();

  // Export RFQ Actions
  const btnWhatsapp = document.getElementById("sendWhatsappRfq");
  const btnEmail = document.getElementById("sendEmailRfq");

  if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", () => {
      if (rfqCart.length === 0) {
        showToast("Please add at least 1 product to RFQ first!");
        return;
      }
      let text = "Hello ATC Furniture! I would like to request an official FOB B2B Quotation for the following models:\n\n";
      rfqCart.forEach((item, idx) => {
        text += `${idx + 1}. [${item.model}] ${item.name} - Qty: ${item.qty} sets (Est. $${(item.qty * item.price).toLocaleString()})\n`;
      });
      const totalSets = rfqCart.reduce((sum, i) => sum + i.qty, 0);
      const totalEst = rfqCart.reduce((sum, i) => sum + i.qty * i.price, 0);
      text += `\nTotal Estimated Volume: ${totalSets} sets (~$${totalEst.toLocaleString()} FOB Cat Lai Port).\nPlease send lead time, container loading plan, and formal proforma quote.`;

      const encoded = encodeURIComponent(text);
      window.open(`https://wa.me/84945670880?text=${encoded}`, "_blank");
    });
  }

  if (btnEmail) {
    btnEmail.addEventListener("click", () => {
      if (rfqCart.length === 0) {
        showToast("Please add at least 1 product to RFQ first!");
        return;
      }
      let subject = "B2B Wholesale Quotation Request - ATC Furniture Export";
      let bodyText = "Dear ATC Furniture Sales Team,\n\nI would like to inquire about an official FOB wholesale quotation for the following items:\n\n";
      rfqCart.forEach((item, idx) => {
        bodyText += `${idx + 1}. Model: ${item.model} | Name: ${item.name} | Quantity: ${item.qty} sets\n`;
      });
      const totalSets = rfqCart.reduce((sum, i) => sum + i.qty, 0);
      const totalEst = rfqCart.reduce((sum, i) => sum + i.qty * i.price, 0);
      bodyText += `\nEstimated Total Quantity: ${totalSets} sets\nEstimated FOB Value: $${totalEst.toLocaleString()} (Cat Lai Port, Vietnam)\n\nPlease provide full packaging dimensions, CBM per set, and estimated shipping lead time.\n\nBest regards,\n[Your Company Name]\n[Contact Person]`;

      const mailtoUrl = `mailto:info@wickerfurniture.com.vn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailtoUrl;
    });
  }

  // 4. Specs Quickview Modal
  const specsModal = document.getElementById("specsModal");
  const closeSpecsBtn = document.getElementById("closeSpecsBtn");
  const specsBody = document.getElementById("specsModalBody");
  const specsTitle = document.getElementById("specsModalTitle");

  window.openQuickSpecs = function (id) {
    const p = (window.ATC_PRODUCTS || []).find((item) => item.id === id);
    if (!p || !specsModal) return;

    specsTitle.textContent = `${p.model} - ${p.official_title || p.name}`;
    specsBody.innerHTML = `
      <div style="height:240px; overflow:hidden; border-radius:6px; margin-bottom:16px; background:#f5f0e8;">
        <img src="${p.image}" alt="${p.official_title || p.name}" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="spec-row">
        <span class="spec-label">Model Code:</span>
        <span class="spec-val" style="font-weight:700; color:var(--gold-dark);">${p.model}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Product Name:</span>
        <span class="spec-val" style="font-weight:600;">${p.official_title || p.name}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Category:</span>
        <span class="spec-val">${p.category} (${p.official_subtitle || p.group})</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Materials:</span>
        <span class="spec-val">${p.material}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">FOB Price:</span>
        <span class="spec-val" style="font-size:16px; font-weight:700; color:var(--gold-dark);">$${p.price.toFixed(2)} / Set</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Minimum Order (MOQ):</span>
        <span class="spec-val">${p.moq}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Export Port:</span>
        <span class="spec-val">${p.port || "Cat Lai Port, Ho Chi Minh City"}</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Production Capacity:</span>
        <span class="spec-val">40x 40ft Shipping Containers / Month</span>
      </div>
      <div class="spec-row">
        <span class="spec-label">Packaging Detail:</span>
        <span class="spec-val">Export standard carton box + PE protective bag (KD flat-pack available)</span>
      </div>
      ${p.atc_url ? `
      <div class="spec-row">
        <span class="spec-label">Live Product Page:</span>
        <span class="spec-val"><a href="${p.atc_url}" target="_blank" rel="noopener noreferrer" style="color:var(--gold-dark); text-decoration:underline;">View on Official atc-craft.com &rarr;</a></span>
      </div>` : ''}
      <div style="margin-top:16px; display:flex; gap:12px;">
        <button class="btn-primary" style="flex:1; padding:12px;" onclick="addToRfq(${p.id}); document.getElementById('specsModal').classList.remove('active');">
          Add to RFQ Basket
        </button>
        <button class="btn-secondary" style="color:#181611; border-color:#d0c9bc;" onclick="document.getElementById('specsModal').classList.remove('active');">
          Close
        </button>
      </div>
    `;
    specsModal.classList.add("active");
  };

  if (closeSpecsBtn && specsModal) {
    closeSpecsBtn.addEventListener("click", () => {
      specsModal.classList.remove("active");
    });
  }
  if (specsModal) {
    specsModal.addEventListener("click", (e) => {
      if (e.target === specsModal) {
        specsModal.classList.remove("active");
      }
    });
  }

  // 5. Product Catalog Filtering & Rendering
  const catalogGrid = document.getElementById("catalogGrid");
  const searchInput = document.getElementById("catalogSearch");
  const sortSelect = document.getElementById("catalogSort");
  const catPills = document.querySelectorAll(".cat-pill");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const catalogCountEl = document.getElementById("catalogCount");

  let currentCategory = "All";
  let currentSearch = "";
  let currentSort = "default";
  let visibleCount = 12;

  function filterProducts() {
    let list = window.ATC_PRODUCTS || [];

    // Filter by Category
    if (currentCategory !== "All") {
      list = list.filter((p) => p.category === currentCategory);
    }

    // Filter by Search Query
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.official_title && p.official_title.toLowerCase().includes(q)) ||
          p.name.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    // Sort
    if (currentSort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }

  function renderCatalog() {
    if (!catalogGrid) return;

    const filtered = filterProducts();
    const visible = filtered.slice(0, visibleCount);

    if (catalogCountEl) {
      catalogCountEl.textContent = `Showing ${visible.length} of ${filtered.length} products`;
    }

    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 60px 20px; color:#888;">
          <p style="font-size:18px; font-weight:600; color:#181611;">No furniture models match your search.</p>
          <p style="font-size:14px; margin-top:8px;">Try clearing your filters or searching for terms like "CALISTA", "BAHAMA", "Teak", or "Sunbed".</p>
        </div>
      `;
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
      return;
    }

    catalogGrid.innerHTML = visible
      .map(
        (p) => `
        <div class="prod-card">
          <div class="prod-card__thumb">
            <img src="${p.image}" alt="${p.official_title || p.name}" loading="lazy">
            <span class="prod-card__badge">${p.model}</span>
            <span class="prod-card__cat">${p.category}</span>
          </div>
          <div class="prod-card__body">
            <h4 class="prod-card__title">${p.official_title || p.name}</h4>
            <div class="prod-card__subtitle">${p.official_subtitle || p.group}</div>
            <div class="prod-card__material">${p.material}</div>
            <div class="prod-card__pricing">
              <div class="prod-price">$${p.price.toFixed(2)} <small>/ Set</small></div>
              <div class="prod-moq">MOQ: ${p.moq}</div>
            </div>
            <div class="prod-card__actions">
              <button class="btn-add-rfq" onclick="addToRfq(${p.id})">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Add to RFQ
              </button>
              <button class="btn-quick-view" onclick="openQuickSpecs(${p.id})" title="View Technical Specifications">
                Specs
              </button>
              ${p.atc_url ? `
              <a href="${p.atc_url}" target="_blank" rel="noopener noreferrer" class="btn-external-link" title="Open on atc-craft.com">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              </a>` : ''}
            </div>
          </div>
        </div>
      `
      )
      .join("");

    if (loadMoreBtn) {
      loadMoreBtn.style.display = visible.length < filtered.length ? "inline-flex" : "none";
    }
  }

  // Filter By Category Expose Globally (For Category Cards from Screenshot)
  window.filterByCategory = function (catName) {
    currentCategory = catName;
    catPills.forEach((p) => {
      if (p.getAttribute("data-cat") === catName) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
    visibleCount = 12;
    renderCatalog();
    const catSection = document.getElementById("catalog");
    if (catSection) {
      catSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Category Pills
  catPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      catPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.getAttribute("data-cat");
      visibleCount = 12;
      renderCatalog();
    });
  });

  // Search input with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentSearch = e.target.value;
        visibleCount = 12;
        renderCatalog();
      }, 250);
    });
  }

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  // Load more
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 12;
      renderCatalog();
    });
  }

  // Initial catalog render
  renderCatalog();

  // Contact form submission handling
  const contactForm = document.getElementById("b2bContactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thank you! Your B2B export inquiry has been submitted. Our export manager will respond within 24 hours.");
      contactForm.reset();
    });
  }
});
