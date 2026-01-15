// script.js
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

burger.addEventListener('click', () => {
  menu.classList.toggle('open');
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
});

document.querySelectorAll('.card, .split-img').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});
