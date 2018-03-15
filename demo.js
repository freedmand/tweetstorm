function createElem(entity, attributes) {
  const elem = document.createElement(entity);
  Object.getOwnPropertyNames(attributes).forEach((attr) => {
    elem.setAttribute(attr, attributes[attr]);
  });
  return elem;
}

function createRepeatAnimation(attribute, duration, to) {
  return createElem('a-animation', {
    attribute: attribute,
    dur: duration * 1000,
    to: to,
    repeat: 'indefinite',
    easing: 'linear',
  });
}

function createBird({outerRotation = 0, y = 0, z = -50, innerRotation = 0, innerRotationDuration = 2, outerRotationDuration = 10, scale = 1, hasSound = false}) {
  const entity = createElem('a-entity', {
    rotation: `0 ${outerRotation} 0`,
  });
  const animation = createRepeatAnimation('rotation', outerRotationDuration, `0 ${outerRotation + 360} 0`);
  entity.appendChild(animation);

  const tweet = createElem('a-entity', {
    'obj-model': 'obj: #bird-obj; mtl: #bird-mtl',
    position: `0 ${y} ${z}`,
    rotation: `0 ${innerRotation} 0`,
    scale: `${scale} ${scale} ${scale}`,
    sound: hasSound ? 'src: url(/tweet.mp3); autoplay: true; refDistance: 1; distanceModel: exponential; volume: 3;' : '',
  });
  tweet.appendChild(createRepeatAnimation('rotation', innerRotationDuration, `0 ${innerRotation + 360} 0`));
  entity.appendChild(tweet);
  return entity;
}

function random(from = 0, to = 1) {
  return Math.random() * (to - from) + from;
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const scene = document.getElementById('scene');
const numTweets = document.getElementById('num-tweets');
async function main() {
  let next = random(20, 50);
  for (let i = 0; i < 2545; i++) {
    next--;
    const y = random(-20, 500);
    scene.appendChild(createBird({
      outerRotation: random(0, 360),
      y,
      z: random(-30, -50 - y),
      innerRotationDuration: random(1, 4),
      outerRotationDuration: random(6, 15),
      scale: random(0.5, 1.5),
      innerRotation: random(0, 360),
      hasSound: next < 0,
    }));
    numTweets.setAttribute('value', `${i + 1} Tweet${i + 1 != 1 ? 's' : ''} since Donald Trump assumed office`);
    if (next < 0) next = random(6, 20);
    await timeout(20);
  }
}

if (scene.hasLoaded) {
  main();
} else {
  scene.addEventListener('loaded', main);
}