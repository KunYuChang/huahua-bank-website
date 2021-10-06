'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
///////////////////////////////////////

// ⚡選擇元素
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections); // NodeList

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //HTMLCollection

// NodeList vs HTMLCollection 如何選擇?
// NodeList 是現代JS開發所使用，大多數情況下會選擇。
// HTMLCollection 有自動更新的特性，某些情況下好用。(例如刪除DOM之後馬上看結果)

///////////////////////////////////////
///////////////////////////////////////

// ⚡平滑滾動
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
///////////////////////////////////////

// ⚡頁面導航

//使用forEach將所有元素監聽
document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

// 👍使用事件委派 (從共同祖父元素來監聽子元素內容)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target); // 可以確認點擊是觸發了哪一個事件
  e.preventDefault();

  // 匹配策略 (只要在nav__link有作用)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
///////////////////////////////////////

// ⚡Tabbed component

// 使用事件委派
tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // 現代寫法 : 防衛語句(Guard clause)
  if (!clicked) return;

  // 先清除所有的active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
///////////////////////////////////////

// ⚡Menu fade animation
const handleHover = (e, opacity) => {
  // 確認滑鼠滑到的是nav__link類別
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // 先用closest找到老爸老媽，之後再用querySelectorAll尋找目標
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', e => {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', e => {
  handleHover(e, 1);
});

///////////////////////////////////////
///////////////////////////////////////

// ⚡Sticky navigation
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', () => {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
