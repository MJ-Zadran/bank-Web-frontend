'use strict';

const btnScrolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
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

// for Scrolling to certin place smoothly

btnScrolTo.addEventListener('click', function (e) {
  // for getting the section coordinats
  const s1Coords = section1.getBoundingClientRect();
  console.log(s1Coords);

  // for getting the btn coordinats
  console.log(e.target.getBoundingClientRect());

  // for gettting th coodinats of a current veiw page
  console.log(
    'Currnet Scroll of X/Y: ' + window.pageXOffset,
    window.pageYOffset
  );

  // for getting current width height
  console.log(
    'Current height/ width: ' + document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // for smooth scrolling of window
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Navigation Scrolling smothly

// 1 way
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     let id = this.getAttribute('href');
//     console.log(id);

//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 2 Way
//1. Selecting the hole contianer
//2. adding an Event listener to the hole container

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching up strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabContainer.addEventListener('click', function (el) {
  const clicked = el.target.closest('.operations__tab');

  console.log(clicked);

  //Guard Clouse
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  // Active Content Area
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Manu Fade Animations
const handler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing argument into handler
nav.addEventListener('mouseover', handler.bind(0.5));

nav.addEventListener('mouseout', handler.bind(1));
////////////////////////////////////////////////////////////
// sticky navigation
// const intialCoord = section1.getBoundingClientRect();
// // console.log(intialCoord);

// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);

//   if (window.scrollY > intialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation: Intersection Observer API

// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);

////////////////////////////////////////////////////////////
// observer.observe(section1);

const header = document.querySelector('.header');
const height = nav.getBoundingClientRect().height;
// console.log(height);

const stickyCallBack = function (entries) {
  const [entry] = entries; // entries[0] both are same
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyCallBack, {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
});

headerObserver.observe(header);

////////////////////////////////////////////////////////////
// Reveal sections
const allSEction = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSEction.forEach(sec => {
  sectionObserver.observe(sec);
  // sec.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////
//Pictur Blurel effect
const allImg = document.querySelectorAll('img[data-src]');

const blurCall = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const picBlure = new IntersectionObserver(blurCall, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allImg.forEach(img => {
  picBlure.observe(img);
});

//////////////////////////////////////////////////////////////
// Sliders Animation

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide = "${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const movSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translate(${100 * (i - slide)}%) `)
    );
  };

  const movRight = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    movSlide(curSlide);
    activeDots(curSlide);
  };

  const movLeft = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    movSlide(curSlide);
    activeDots(curSlide);
  };

  const init = function () {
    createDots();
    activeDots(curSlide);
    movSlide(curSlide);
  };

  init();
  // Event Handlers
  btnRight.addEventListener('click', movRight);
  btnLeft.addEventListener('click', movLeft);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') movLeft();
    e.key === 'ArrowRight' && movRight();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      movSlide(slide);
      activeDots(slide);
    }
  });
};

slider();
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/*
// Selecting the Element
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

document.querySelector('#section--1');
document.getElementById('section--1');
document.getElementsByClassName('btn');
document.getElementsByTagName('button');

//Creating & Inserting Elements
const message = document.createElement('div');  
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied to improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

const header = document.querySelector('.header');
// for the start
header.prepend(message);

//for the end of
// header.append(message);

// for before start and after end
// header.before(message);
// header.after(message);

//Delete Element

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// that is used for those who has basic property in CSS
document.documentElement.style.setProperty('--color-primary', 'orangered');

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

console.log(logo.src);
console.log(logo.getAttribute('src'));

console.log(logo.setAttribute('company', 'Bankist'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);

// Data attribute
console.log(logo.dataset.versionNumber);

// classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // NOt includes

//Never do it
// logo.className = 'Jamil';



// Adding Eventlistenner to objects
const h1 = document.querySelector('.header__title');

const alertH1 = function () {
  alert('Hi, How are You?');
};

h1.addEventListener('click', alertH1);

setTimeout(() => h1.removeEventListener('click', alertH1), 3000);



// Bubbling and Capturing Phase

const randNum = (max, min) => Math.floor(Math.random() * (max - min + 1) + min);

const randColor = () =>
  `rgb(${randNum(0, 255)},${randNum(0, 255)},${randNum(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor();
  console.log('Link: ' + e.target, e.currentTarget);

  // Stoping the propogation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor();
  console.log('Container: ' + e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor();
  console.log('Nav: ' + e.target, e.currentTarget);
});



//DOM Triversing
const h1 = document.querySelector('h1');

// Going down
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going up
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--color-primary)';

// Going to sideway -> sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// If we want to select all the sebling then we have this trik
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});



document.addEventListener('DOMContentloaded', function (e) {
  console.log('HTML DOM is built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

*/
