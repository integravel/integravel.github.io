const state = {
  hair: 0,
  skirt: 0,
  shoes: 0,
};

const hair = [
  'assets/hair-1.svg',
  'assets/hair-2.svg',
  'assets/hair-3.svg',
  'assets/hair-4.svg',
  'assets/hair-5.svg'
];

const skirts = [
  'assets/skirt-1.svg',
  'assets/skirt-2.svg',
  'assets/skirt-3.svg'
];

const shoes = [
  'assets/shoes-1.svg',
  'assets/shoes-2.svg'
];

const layers = {
  base: document.getElementById('baseLayer'),
  body: document.getElementById('bodyLayer'),
  skin2: document.getElementById('skin2Layer'),
  skirt: document.getElementById('skirtLayer'),
  shoes: document.getElementById('shoesLayer'),
  hair: document.getElementById('hairLayer'),
  skin3: document.getElementById('skin3Layer')
};

function render() {

  layers.base.src = 'assets/base.svg';
  layers.body.src = 'assets/body.svg';
  layers.skin2.src = 'assets/skin-2.svg';
  layers.skin3.src = 'assets/skin-3.png';

  layers.hair.src = hair[state.hair];
  layers.skirt.src = skirts[state.skirt];
  layers.shoes.src = shoes[state.shoes];
}

function nextHair() {
  state.hair++;

  if (state.hair >= hair.length) {
    state.hair = 0;
  }

  render();
}

function prevHair() {
  state.hair--;

  if (state.hair < 0) {
    state.hair = hair.length - 1;
  }

  render();
}

function nextSkirt() {
  state.skirt++;

  if (state.skirt >= skirts.length) {
    state.skirt = 0;
  }

  render();
}

function prevSkirt() {
  state.skirt--;

  if (state.skirt < 0) {
    state.skirt = skirts.length - 1;
  }

  render();
}

function nextShoes() {
  state.shoes++;

  if (state.shoes >= shoes.length) {
    state.shoes = 0;
  }

  render();
}

function prevShoes() {
  state.shoes--;

  if (state.shoes < 0) {
    state.shoes = shoes.length - 1;
  }

  render();
}

render();