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

// ⚡Sticky navigation: Intersection Observer API

const headerSection = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

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

// (1) entries ：IntersectionObserverEntry 的 array
// (2) observer：observer 本身。
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // 如果獵物不可見即離開這個函式
  if (!entry.isIntersecting) return;

  // 獵物(entry.target)的class移除'section--hidden'
  entry.target.classList.remove('section--hidden');

  // 獵人(observer).不觀察(unobserve)獵物了(entry.target)
  observer.unobserve(entry.target);
};

// 實例出一個交叉觀察者，有兩個參數 (1) Callback (2) 呼叫的條件
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// 1. 所有的部分(section)都要被觀察者(sectionObserver)觀察(observe)
// 2. 所有的部分(section)加上'section--hidden'類別
allTheSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
///////////////////////////////////////

// ⚡圖片懶載入 (Lazy loading images)
// 圖片懶載入的要點是從一開始就加快頁面的載入速度，這一方面具有 SEO 的好處，另一方面，使訪問者保持較慢的 Internet 連接（對於他們來說，頁面載入速度會比在您自己的 PC 上慢）。--Sebastian

// 找到所有的被觀察者
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries; // 只有一個界線,提取
  // console.log(entry)

  if (!entry.isIntersecting) return;

  // data-src 取代 src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

// 創建一個圖片的觀察者
const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // viewport
  threshold: 0, // 觸發界線
  rootMargin: '-200px', // 為了看到效果延後圖片載入 (正常設定要設為200px提早載入)
});

// 遍歷圖片 -> 觀察者觀察圖片
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
///////////////////////////////////////

// ⚡輪播
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // 開發觀察用的程式碼
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // 🎾Functions

  // 創建點
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // 當前點
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) //屬性選擇器
      .classList.add('dots__dot--active');
  };

  // 圖片轉移
  const goToSlide = function (slide) {
    slides.forEach(
      // 這段程式碼是整個輪播思維的精華 (通常來自開發經驗)
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // 下一頁
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // 上一頁
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();

  // 🎾事件處理程式

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e); // 先看看key的value是什麼

    if (e.key === 'ArrowLeft') prevSlide(); // 用if
    e.key === 'ArrowRight' && nextSlide(); // 用短路
  });

  // dotContainer 進行事件委派，監聽下面的dot。
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

