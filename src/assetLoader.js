async function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function loadSound(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
    audio.src = src;
  });
}

export async function loadAssets() {
  const assetDefinitions = {
    // Screens
    splashScreen: { type: 'image', src: '/assets/splash_screen.png' },
    instructionsScreen: { type: 'image', src: '/assets/instructions_screen.png' },
    gameOverScreen: { type: 'image', src: '/assets/game_over_screen.png' },

    // Buttons
    startButton: { type: 'image', src: '/assets/start_button.png' },
    playButton: { type: 'image', src: '/assets/play_button.png' },
    restartButton: { type: 'image', src: '/assets/restart_button.png' },

    // Player sprites
    playerSprites: [
      { type: 'image', src: '/assets/player/player_0.png' },
      { type: 'image', src: '/assets/player/player_1.png' },
      { type: 'image', src: '/assets/player/player_2.png' },
      { type: 'image', src: '/assets/player/player_3.png' },
      { type: 'image', src: '/assets/player/player_4.png' },
      { type: 'image', src: '/assets/player/player_5.png' },
    ],

    // Obstacles and collectibles
    signSprite: { type: 'image', src: '/assets/obstacle-sign.png' },
    barrelSprite: { type: 'image', src: '/assets/obstacle-barrel.png' },
    judgeSprite: { type: 'image', src: '/assets/obstacle-judge.png' },
    rabbiSprite: { type: 'image', src: '/assets/rabbi.png' },
    channel14Sprite: { type: 'image', src: '/assets/channel14.png' },
    coinSprite: { type: 'image', src: '/assets/coin.png' },

    // Background and ground
    backgroundImage: { type: 'image', src: '/assets/background.png' },
    groundImage: { type: 'image', src: '/assets/ground.png' },

    // Sounds
    jumpSound: { type: 'sound', src: '/assets/jump.mp3' },
    rabbiSound: { type: 'sound', src: '/assets/rabbi-collect.mp3' },
    coinSound: { type: 'sound', src: '/assets/coin-collect.mp3' },
    backgroundMusic: { type: 'sound', src: '/assets/background-music.mp3' },
  };

  const assets = {};
  const errors = [];

  for (const [key, value] of Object.entries(assetDefinitions)) {
    try {
      if (Array.isArray(value)) {
        assets[key] = await Promise.all(value.map(item => 
          item.type === 'image' ? loadImage(item.src) : loadSound(item.src)
        ));
      } else {
        assets[key] = await (value.type === 'image' ? loadImage(value.src) : loadSound(value.src));
      }
    } catch (error) {
      console.error(`Failed to load asset: ${key}`, error);
      errors.push({ key, error });
    }
  }

  if (errors.length > 0) {
    console.warn('Some assets failed to load:', errors);
  }

  return assets;
}