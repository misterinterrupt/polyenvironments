window.irq = window.irq || {};
window.irq.SiS = window.irq.SiS || {};
window.irq.SiS.relativeZones = [
  {
    name: 'a',
    area: 'concourse 9',
    source: {
      id:"TICKLES",
      file:"TICKLES.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'b',
    area: 'concourse 5',
    source: {
      id:"FLAPPY",
      file:"flappy.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'c',
    area: 'cafe grass 2',
    source: {
      id:"PIGS6",
      file:"PIGS6.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'd',
    area: 'cafe grass 1',
    source: {
      id:"whyyousougly",
      file:"whyyousougly.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 200, // speed factor with which grains are scheduled
      density: 300, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0001",
      file:"R09_0001.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0002",
      file:"R09_0002.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0003",
      file:"R09_0003.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0004",
      file:"R09_0004.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0005",
      file:"R09_0005.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0006",
      file:"R09_0006.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0007",
      file:"R09_0007.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0008",
      file:"R09_0008.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0009",
      file:"R09_0009.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0010",
      file:"R09_0010.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0011",
      file:"R09_0011.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0012",
      file:"R09_0012.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0013",
      file:"R09_0013.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0014",
      file:"R09_0014.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0015",
      file:"R09_0015.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0016",
      file:"R09_0016.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0017",
      file:"R09_0017.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0018",
      file:"R09_0018.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0019",
      file:"R09_0019.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0020",
      file:"R09_0020.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0021",
      file:"R09_0021.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"R09_0022",
      file:"R09_0022.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"psychicreef-knitocean",
      file:"psychicreef-knitocean.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"ysabycepttt",
      file:"ysabycepttt.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"spectralis.3",
      file:"spectralis.3.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"lightgate",
      file:"lightgate.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"letgoofyoureyes",
      file:"letgoofyoureyes.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"frgments05",
      file:"frgments05.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"e",
      file:"e.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"alternighting",
      file:"alternighting.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
      amp: 0.40, // max amplitude of grains, adjust for amount of doubling
      jitter: 0.14, // random position/spacing amount
      spread: 3.0, // random pan amount
      grainLength: 1.0, // length in s of each grain
    },
    grainParams: {
      attack: 0.05,
      release: 0.05
    }
  },
  {
    name: 'e',
    area: 'concourse 9',
    source: {
      id:"alternighting",
      file:"alternighting.mp3",
      channels: 5
    },
    cloudParams: {
      interval: 240, // speed factor with which grains are scheduled
      density: 100, // ms grain spacing, will be placed one after the other + a random amnt of jitter
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
];
