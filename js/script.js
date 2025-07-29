"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // === Swiper ===
  const swiper = new Swiper(".swiper", {
    loop: true,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 40,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        slidesPerView: "auto",
        spaceBetween: 20,
        centeredSlides: true,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 40,
        centeredSlides: false,
      },
    },
  });

  // === Auto resize textarea ===
  const textarea = document.getElementById("contact-message");
  const contactSection = document.querySelector(".contact_section");

  function autoResizeAndExpandSection() {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

    const paddingBottom = 29;
    const fullHeight =
      textarea.offsetTop + textarea.offsetHeight + paddingBottom;
    contactSection.style.height = fullHeight + "px";
  }

  if (textarea && contactSection) {
    textarea.addEventListener("input", autoResizeAndExpandSection);
    window.addEventListener("load", autoResizeAndExpandSection);
  }

  const form = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message-box");
  const formMessage = document.getElementById("form-message");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // зупиняємо відправку форми

      formMessage.textContent = "";
      formMessage.style.color = "";

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const wordsCount = message
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      if (name === "") {
        formMessage.style.color = "red";
        formMessage.textContent = "Please enter your name. For example 'Alex'";
        nameInput.focus();
        return;
      }

      if (!emailRegex.test(email)) {
        formMessage.style.color = "red";
        formMessage.textContent = "Please enter a valid email address.";
        emailInput.focus();
        return;
      }

      if (wordsCount < 10) {
        formMessage.style.color = "red";
        formMessage.textContent = "Message should be at least 10 words.";
        messageInput.focus();
        return;
      }

      if (wordsCount > 100) {
        formMessage.style.color = "red";
        formMessage.textContent = "Message should not exceed 100 words.";
        messageInput.focus();
        return;
      }

      // Перевірка reCAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
      if (recaptchaResponse.length === 0) {
        formMessage.style.color = "red";
        formMessage.textContent = "Please verify that you are not a robot.";
        return;
      }

      // Якщо всі перевірки пройшли
      formMessage.style.color = "green";
      formMessage.textContent = "Sending message...";
      form.submit(); // тепер відправляємо форму
    });
  }

  // === Burger menu ===
  const burger = document.getElementById("menu_burger");
  const navMenu = document.getElementById("navMenu");
  const closeBtn = document.getElementById("closeBtn");

  burger.addEventListener("click", function () {
    this.classList.toggle("open");
    navMenu.classList.toggle("active");
    closeBtn?.classList.add("open"); // завжди додаємо, але НЕ прибираємо
    document.body.classList.toggle("menu-open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      burger?.classList.remove("open");
      navMenu?.classList.remove("active");
      // НЕ прибираємо this.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  }

  // Пункт меню: закриває меню, але НЕ змінює хрестик
  const menuLinks = navMenu.querySelectorAll("a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      burger?.classList.remove("open");
      // НЕ прибираємо closeBtn.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });

  // Scroll smooth content
  const sections = document.querySelectorAll("section");

  sections.forEach((section) => {
    // Додаємо клас .reveal всім прямим дітям секції (автоматично)
    section.querySelectorAll(":scope > *").forEach((child) => {
      child.classList.add("reveal");
    });
  });

  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  const section3 = document.querySelector("#section--3");
  const btnScrollTo = document.querySelector(".btn--scroll-to");
  const navMainMenu = document.querySelector(".main_menu");

  // Плавний скрол
  btnScrollTo.addEventListener("click", function () {
    section3.scrollIntoView({ behavior: "smooth" });
  });

  document.querySelector(".menu_nav").addEventListener("click", function (e) {
    if (e.target.classList.contains("menu_nav_item")) {
      e.preventDefault();
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });

  // Sticky navigation
  const header = document.querySelector(".header");
  const navHeight = navMainMenu.getBoundingClientRect().height;

  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      navMainMenu.classList.add("sticky");
    } else {
      navMainMenu.classList.remove("sticky");
    }
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);

  const allSections = document.querySelectorAll(".services_section");

  // Reveal sections
  const revealSection = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add("section--hidden");
  });

  const selects = document.querySelectorAll(".language_swither_select");

  const translations = {
    ENG: {
      name: "Yevhen Sukhachov",
      services: "Services",
      technologies: "Technologies",
      portfolio: "Portfolio",
      contact: "Contact",

      headerTitle: "Frontend <br> developer",
      headerSubtitle:
        "I am Yevhen - web-developer with a passion for creating beautiful and responsive websites.",
      headerBtn: "view my work",

      myServices: "My services",
      webDev: "Website Development",
      webDevText:
        "I create websites based on your ready-made design. Whether it’s a landing page or a business card website. I will make it look great and work smoothly on any device.",
      webDesign: "Web Design",
      webDesignText:
        "I can design your website from scratch. I create modern, simple, and user-friendly designs that match your brand and goals.",
      reactDev: "React Development",
      reactDevText:
        "I can include React in your project, if it’s hard to load and make your website loading reactive.",

      skills: "My skills",
      skillsTitle: "The skills, tools and technologies I use:",

      portfolioHeader: "Portfolio",

      contactHeader: "Do you have a project to discuss?",
      contactSubtitle: "Get in touch",
      contactSectionHeader: "Contact",
      contactEmail: "jeka200329@gmail.com",
      socialHeader: "Social media",

      contactFormHeader: "Contact form",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      messagePlaceholder:
        "Write your message (from 10 to 100 words and leave your @telegram/instagram/linkedin)...",
      sendBtn: "Send",

      footer:
        "@ 2025 - All rights reserved, web design and development - Yevhen Sukhachov",
    },

    UA: {
      name: "Євген Сухачов",
      services: "Послуги",
      technologies: "Технології",
      portfolio: "Портфоліо",
      contact: "Контакти",

      headerTitle: "Фронтенд <br> розробник",
      headerSubtitle:
        "Я Євген — веб-розробник, який створює красиві й адаптивні сайти.",
      headerBtn: "переглянути роботи",

      myServices: "Мої послуги",
      webDev: "Розробка сайтів",
      webDevText:
        "Я створюю сайти за вашим готовим дизайном. Це може бути лендінг чи сайт-візитка. Сайт буде виглядати чудово й працювати на всіх пристроях.",
      webDesign: "Веб-дизайн",
      webDesignText:
        "Я можу створити дизайн сайту з нуля. Роблю сучасний, простий і зручний інтерфейс, що відповідає вашим цілям.",
      reactDev: "Розробка на React",
      reactDevText:
        "Я можу інтегрувати React, щоб зробити ваш сайт швидким і реактивним.",

      skills: "Мої навички",
      skillsTitle: "Навички, інструменти та технології, які я використовую:",

      portfolioHeader: "Портфоліо",

      contactHeader: "У вас є проєкт для обговорення?",
      contactSubtitle: "Напишіть мені",
      contactSectionHeader: "Контакти",
      contactEmail: "jeka200329@gmail.com",
      socialHeader: "Соціальні мережі",

      contactFormHeader: "Форма зв'язку",
      nameLabel: "Ім’я",
      emailLabel: "Електронна пошта",
      messageLabel: "Повідомлення",
      messagePlaceholder:
        "Напишіть ваше повідомлення (від 10 до 100 слів і лишайте свій @телеграм/інстаграм/лінкедін)...",
      sendBtn: "Надіслати",

      footer:
        "@ 2025 - Всі права захищені. Дизайн і розробка сайту — Євген Сухачов",
    },
  };

  const elements = {
    name: document.querySelector(".name_text"),
    navItemsDesktop: document.querySelectorAll(".menu_nav_item"),
    navItemsMobile: document.querySelectorAll(".menu-list a"),
    headerTitle: document.querySelector(".header_text"),
    headerSubtitle: document.querySelector(".header_subtitle"),
    headerBtn: document.querySelector(".header_btn"),

    servicesHeader: document.querySelector(".services_header"),
    serviceTitles: document.querySelectorAll(".services_blocks_header"),
    serviceTexts: document.querySelectorAll(".services_blocks_subtitle"),

    techHeader: document.querySelector(".technologies_header"),
    techTitle: document.querySelector(".technologies_title"),

    portfolioHeader: document.querySelector(".portfolio_header"),

    contactHeader: document.querySelector(".contact_header"),
    contactSubtitle: document.querySelector(".contact_header_subtitle"),
    contactSectionHeader: document.querySelector(".contact_info_header"),
    contactEmail: document.querySelector(".email_link"),
    socialHeader: document.querySelector(".social_info_header"),

    contactFormHeader: document.querySelector(".contact_form_header"),
    nameLabel: document.querySelector("label[for='name']"),
    emailLabel: document.querySelector("label[for='email']"),
    messageLabel: document.querySelector("label[for='message']"),
    messagePlaceholder: document.querySelector("#message-box"),
    sendBtn: document.querySelector(".submit_btn"),

    footer: document.querySelector(".footer p"),
  };

  function applyTranslation(lang) {
    const t = translations[lang];

    if (!t) {
      console.warn(
        `Переклад для мови "${lang}" не знайдено. Використовується ENG.`
      );
      lang = "ENG";
      localStorage.setItem("language", lang);
      return applyTranslation(lang); // повторний виклик, вже з валідною мовою
    }

    const navKeys = ["services", "technologies", "portfolio", "contact"];

    elements.name.textContent = t.name;

    // Оновлення десктопного меню
    elements.navItemsDesktop.forEach((el, i) => {
      if (t[navKeys[i]]) {
        el.textContent = t[navKeys[i]];
      }
    });

    // Оновлення мобільного меню
    elements.navItemsMobile.forEach((el, i) => {
      if (t[navKeys[i]]) {
        el.textContent = t[navKeys[i]];
      }
    });

    elements.headerTitle.innerHTML = t.headerTitle;
    elements.headerSubtitle.textContent = t.headerSubtitle;
    elements.headerBtn.textContent = t.headerBtn;

    elements.servicesHeader.textContent = t.myServices;
    elements.serviceTitles[0].textContent = t.webDev;
    elements.serviceTitles[1].textContent = t.webDesign;
    elements.serviceTitles[2].textContent = t.reactDev;
    elements.serviceTexts[0].textContent = t.webDevText;
    elements.serviceTexts[1].textContent = t.webDesignText;
    elements.serviceTexts[2].textContent = t.reactDevText;

    elements.techHeader.textContent = t.skills;
    elements.techTitle.textContent = t.skillsTitle;

    elements.portfolioHeader.textContent = t.portfolioHeader;

    elements.contactHeader.textContent = t.contactHeader;
    elements.contactSubtitle.innerHTML = `${t.contactSubtitle} <i class='bx bx-message-dots'></i>`;
    elements.contactSectionHeader.textContent = t.contactSectionHeader;
    elements.contactEmail.textContent = t.contactEmail;
    elements.socialHeader.textContent = t.socialHeader;

    elements.contactFormHeader.textContent = t.contactFormHeader;
    elements.nameLabel.textContent = t.nameLabel;
    elements.emailLabel.textContent = t.emailLabel;
    elements.messageLabel.textContent = t.messageLabel;
    elements.messagePlaceholder.placeholder = t.messagePlaceholder;
    elements.sendBtn.textContent = t.sendBtn;

    elements.footer.textContent = t.footer;

    selects.forEach((s) => (s.value = lang));
    localStorage.setItem("language", lang);
  }

  // Initial translation application based on stored preference or default
  const storedLang = localStorage.getItem("language") || "ENG";
  applyTranslation(storedLang);

  // Event listener for language switcher changes
  selects.forEach((select) => {
    select.addEventListener("change", (event) => {
      applyTranslation(event.target.value);
    });
  });
});