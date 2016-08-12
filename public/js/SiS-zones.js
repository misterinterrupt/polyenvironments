window.irq = window.irq || {};
window.irq.SiS = window.irq.SiS || {};
window.irq.SiS.relativeZones = [
  {
    name: 'a',
    locationFromCenter: {
      distance: 0,
      heading: 0,
      radius: 10
    },
    source: {
      id:"TICKLES",
      file:"TICKLES.mp3",
      channels: 10
    },
    cloudParams: {
      interval: 400, // speed factor with which grains are scheduled
      density: 250, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  }
  // {
  //   name: 'b',
  //   locationFromCenter: {
  //     distance: 20,
  //     heading: 36,
  //     radius: 50
  //   },
  //   source: {
  //     id:"FLAPPY",
  //     file:"flappy.ogg",
  //     channels: 10
  //   },
  //   cloudParams: {
  //
  //   }
  // },
  // {
  //   name: 'c',
  //   locationFromCenter: {
  //     distance: 20,
  //     heading: 36,
  //     radius: 50
  //   },
  //   source: {
  //     id:"PIGS6",
  //     file:"PIGS6.ogg",
  //     channels: 10
  //   },
  //   cloudParams: {
  //
  //   }
  // },
  // {
  //   name: 'd',
  //   locationFromCenter: {
  //     distance: 20,
  //     heading: 36,
  //     radius: 50
  //   },
  //   source: {
  //     id:"whyyousougly",
  //     file:"whyyousougly.mp3",
  //     channels: 10
  //   },
  //   cloudParams: {
  //
  //   }
  // }
];
