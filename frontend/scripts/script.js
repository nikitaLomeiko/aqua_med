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
