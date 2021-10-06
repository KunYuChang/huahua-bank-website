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
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', () => {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// ⚡Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// /*
// root：預設（未指定，或值設定為 null 時）是以瀏覽器的 viewport 為範圍來判定目標元素的進出與否，然而也能在此設定要改以哪個其他元素作為觀察範圍 — 需要注意的是「root 必須要是所有目標元素的父元素（或祖父層的元素）」

// threshold：設定目標元素的可見度達到多少比例時，觸發 callback 函式。可以帶入單一一個值：「只想在可見度達一個比例時觸發」；也可帶入一個陣列：「想在可見度達多個比例時觸發」
// 👉 觀察範圍就是前面設定的 root 搭配 rootMargin 所劃定
// 👉 預設值為 0：一但目標進入或目標的最後一個 px 離開觀察範圍時就觸發
// 👉 設定為 0.5 ：一但可見度為 50% 時就觸發
// 👉 設定為 [0, 0.25, 0.5, 0.75, 1]：可見度每跳 25% 時就觸發
// 👉 設定為 1：可見度達 100% 或一但往下掉低於 100% 時就觸發
// */

// // 建立一個觀察者
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// // 觀察者.觀察(被觀察者)
// observer.observe(section1);

const headerSection = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(headerSection);

///////////////////////////////////////
///////////////////////////////////////

// ⚡滾動顯示元素
const allTheSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allTheSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
