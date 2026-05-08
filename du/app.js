const state = {
  hair: 0,
  skirt: 0,
  shoes: 0,
};

const hair = [
  {
    src: 'assets/hair-1.svg',
    x: 70,
    y: 10,
    w: 360
  },

  {
    src: 'assets/hair-2.svg',
    x: 65,
    y: 5,
    w: 370
  },

  {
    src: 'assets/hair-3.svg',
    x: 60,
    y: 0,
    w: 380
  },

  {
    src: 'assets/hair-4.svg',
    x: 55,
    y: 0,
    w: 390
  },

  {
    src: 'assets/hair-5.svg',
    x: 60,
    y: 0,
    w: 380
  }
];

const skirts = [
  {
    src: 'assets/skirt-1.svg',
    x: 95,
    y: 110,
    w: 300
  },

  {
    src: 'assets/skirt-2.svg',
    x: 90,
    y: 100,
    w: 320
  },

  {
    src: 'assets/skirt-3.svg',
    x: 85,
    y: 105,
    w: 330
  }
];

const shoes = [
  {
    src: 'assets/shoes-1.svg',
    x: 120,
    y: 365,
    w: 230
  },

  {
    src: 'assets/shoes-2.svg',
    x: 115,
    y: 360,
    w: 240
  }
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

function setLayer(img, data) {

  img.src = data.src;

  img.style.left = data.x + 'px';
  img.style.top = data.y + 'px';
  img.style.width = data.w + 'px';
}

function render() {

  setLayer(layers.base, {
    src: 'assets/base.svg',
    x: 70,
    y: 40,
    w: 360
  });

  setLayer(layers.body, {
    src: 'assets/body.svg',
    x: 85,
    y: 45,
    w: 330
  });

  setLayer(layers.skin2, {
    src: 'assets/skin-2.svg',
    x: 80,
    y: 55,
    w: 340
  });

  setLayer(layers.skin3, {
    src: 'assets/skin-3.png',
    x: 75,
    y: 45,
    w: 350
  });

  setLayer(layers.hair, hair[state.hair]);

  setLayer(layers.skirt, skirts[state.skirt]);

  setLayer(layers.shoes, shoes[state.shoes]);
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