function showModal(id) {
  var overlay = document.getElementById("modal-" + id);
  if (overlay) {
    overlay.classList.add("open");
    document.body.classList.add("menu-open");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".licensesSwiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    loop: true,
    centeredSlides: false,

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },

    speed: 600,

    navigation: {
      nextEl: ".slider-btn-next",
      prevEl: ".slider-btn-prev",
    },

    breakpoints: {
      320: {
        slidesPerView: 1.15,
        spaceBetween: 10,
        centeredSlides: false,
      },
      // Планшеты
      640: {
        slidesPerView: 1.2,
        spaceBetween: 12,
      },
      // Десктоп - 3 слайда
      1024: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },

    autoHeight: false,
    effect: "slide",
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const accordionItems = document.querySelectorAll(".accardion__item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accardion__header");
    const content = item.querySelector(".accardion__content");
    const button = item.querySelector(".btn.secondary");

    content.classList.remove("open");
    content.style.display = "none";

    header.addEventListener("click", function (e) {
      if (e.target.closest(".btn.secondary")) {
        return;
      }
      toggleAccordion(content, button);
    });

    button.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleAccordion(content, button);
    });
  });

  function toggleAccordion(content, button) {
    const isOpen = content.classList.contains("open");

    document.querySelectorAll(".accardion__content").forEach((c) => {
      c.classList.remove("open");
      c.style.display = "none";
    });
    document
      .querySelectorAll(".accardion__item .btn.secondary")
      .forEach((b) => {
        b.textContent = "+";
      });

    if (!isOpen) {
      content.style.display = "block";
      requestAnimationFrame(() => {
        content.classList.add("open");
      });
      button.textContent = "−";
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".burger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("active");
      mobileMenu.classList.toggle("open");
      document.body.classList.toggle("menu-open");
    });

    mobileMenu.addEventListener("click", function (e) {
      if (e.target === mobileMenu) {
        burger.classList.remove("active");
        mobileMenu.classList.remove("open");
        document.body.classList.remove("menu-open");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const modalOverlay = document.querySelector(".modal-overlay");

  if (modalOverlay) {
    document.querySelectorAll("[data-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        modalOverlay.classList.add("open");
        document.body.classList.add("menu-open");
      });
    });

    modalOverlay.addEventListener("click", function (e) {
      if (e.target.closest(".modal__close") || e.target === modalOverlay) {
        modalOverlay.classList.remove("open");
        document.body.classList.remove("menu-open");
      }
    });
  }

  document.querySelectorAll("#modal-success, #modal-error").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target.closest(".modal__status-btn") || e.target === overlay) {
        overlay.classList.remove("open");
        document.body.classList.remove("menu-open");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  function applyPhoneMask(input) {
    input.addEventListener("input", function () {
      let digits = this.value.replace(/\D/g, "");
      if (!digits.startsWith("7") && !digits.startsWith("8")) {
        digits = "7" + digits;
      }
      digits = digits.slice(0, 11);
      let formatted = "+7";
      if (digits.length > 1) formatted += " " + digits.slice(1, 4);
      if (digits.length > 4) formatted += " " + digits.slice(4, 7);
      if (digits.length > 7) formatted += " " + digits.slice(7, 9);
      if (digits.length > 9) formatted += " " + digits.slice(9, 11);
      this.value = formatted;
    });
  }

  document.querySelectorAll('input[name="phone"]').forEach(applyPhoneMask);

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(phone);
  }

  function handleFormSubmit(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector('input[name="name"]').value.trim();
      const phone = form.querySelector('input[name="phone"]').value.trim();
      const emailInput = form.querySelector('input[name="email"]');
      const checkbox = form.querySelector('input[type="checkbox"]');

      let error = "";

      if (!name || name.length < 2) {
        error = "Введите корректное имя";
      } else if (!validatePhone(phone)) {
        error = "Введите корректный номер телефона";
      } else if (emailInput && !validateEmail(emailInput.value.trim())) {
        error = "Введите корректный email";
      } else if (!checkbox.checked) {
        error = "Примите соглашение на обработку данных";
      }

      if (error) {
        alert(error);
        return;
      }

      var payload = { name: name, phone: phone };
      if (emailInput) {
        payload.email = emailInput.value.trim();
      }

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.text().then(function (text) {
            var data;
            try { data = JSON.parse(text); } catch (e) { data = {}; }

            if (res.ok) {
              form.reset();
              showModal("success");
            } else if (res.status === 409) {
              alert("Форма уже отправлена");
            } else {
              showModal("error");
            }
          });
        })
        .catch(function () {
          showModal("error");
        });
    });
  }

  document.querySelectorAll(".modal__form, .callback__form").forEach(handleFormSubmit);

  document.querySelectorAll(".mobile-menu__accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const isOpen = content.classList.contains("open");

      document.querySelectorAll(".mobile-menu__accordion-content.open").forEach(function (c) {
        c.classList.remove("open");
        c.previousElementSibling.classList.remove("open");
      });

      if (!isOpen) {
        content.classList.add("open");
        this.classList.add("open");
      }
    });
  });

  document.querySelectorAll(".mobile-menu__nested-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var content = this.nextElementSibling;
      if (content && content.classList.contains("mobile-menu__nested-content")) {
        var isOpen = content.classList.contains("open");
        if (isOpen) {
          content.classList.remove("open");
          this.classList.remove("open");
        } else {
          content.classList.add("open");
          this.classList.add("open");
        }
      }
    });
  });
});
