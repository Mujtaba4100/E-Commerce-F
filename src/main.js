import './style.css';
import { renderHomePage } from './pages/home.js';
import {initHeader} from './components/header.js';

document.addEventListener('DOMContentLoaded', () => {
  renderHomePage();
  initHeader()
  new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });

  
});
