/* ==========================================
   STATE MANAGEMENT
   ========================================== */

let state = {
  userName: '',
  currentStep: 0, // 0 is welcome, 1-5 is quiz questions, 6 is sorting ceremony, 7 is results, 8 is payment, 9 is success
  currentBranch: null, // 'light', 'shadow', 'wisdom'
  selectedOptionIndex: null,
  answers: [], // history of choices { questionText, selectedOptionIndex, points }
  sortedHouse: null,
  selectedTier: 'monthly', // default tier
  scores: {
    gryffindor: 0,
    slytherin: 0,
    ravenclaw: 0,
    hufflepuff: 0
  }
};

/* ==========================================
   AUDIO SYNTHESIZER (WEB AUDIO API)
   ========================================== */

let audioCtx = null;
let ambientOsc = null;
let ambientOsc2 = null;
let ambientGain = null;
let isMuted = true;

function initAudio() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    audioCtx = new AudioContextClass();
    
    // Wind sound generator (Low triangle + resonant lowpass filter)
    ambientOsc = audioCtx.createOscillator();
    ambientOsc.type = 'triangle';
    ambientOsc.frequency.setValueAtTime(80, audioCtx.currentTime); // low hum
    
    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(120, audioCtx.currentTime); // high fifth hum
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioCtx.currentTime);
    filter.Q.setValueAtTime(3, audioCtx.currentTime);
    
    // Modulator for slow magic sweeping frequency filter
    const modulator = audioCtx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(0.1, audioCtx.currentTime); // 10s cycles
    
    const modGain = audioCtx.createGain();
    modGain.gain.setValueAtTime(80, audioCtx.currentTime);
    
    modulator.connect(modGain);
    modGain.connect(filter.frequency);
    
    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0, audioCtx.currentTime); // Start muted
    
    ambientOsc.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    
    ambientOsc.start();
    ambientOsc2.start();
    modulator.start();
  } catch (e) {
    console.warn("AudioContext init failed", e);
  }
}

function toggleSound() {
  if (!audioCtx) {
    initAudio();
  }
  
  if (!audioCtx) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundOffIcon = soundToggleBtn.querySelector('.icon-sound-off');
  const soundOnIcon = soundToggleBtn.querySelector('.icon-sound-on');
  
  if (isMuted) {
    // Unmute
    ambientGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 1.5);
    soundOffIcon.style.display = 'none';
    soundOnIcon.style.display = 'block';
    isMuted = false;
    playMagicChime();
  } else {
    // Mute
    ambientGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    soundOffIcon.style.display = 'block';
    soundOnIcon.style.display = 'none';
    isMuted = true;
  }
}

function playMagicChime() {
  if (isMuted || !audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const now = audioCtx.currentTime;
  
  // High sweet bell chime
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(659.25, now); // E5
  osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // Arpeggiate to E6
  gain1.gain.setValueAtTime(0.08, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start(now);
  osc1.stop(now + 0.8);
  
  // Harmonics (perfect fifth)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(987.77, now); // B5
  gain2.gain.setValueAtTime(0.04, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start(now);
  osc2.stop(now + 1.2);
}

function playSortingHatMumble() {
  if (isMuted || !audioCtx) return;
  const now = audioCtx.currentTime;
  
  // Generate a low resonant synth vocal-like murmur
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(90, now);
  osc.frequency.linearRampToValueAtTime(120, now + 0.1);
  osc.frequency.linearRampToValueAtTime(95, now + 0.2);
  
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
  filter.frequency.exponentialRampToValueAtTime(500, now + 0.2);
  filter.Q.setValueAtTime(4, now);
  
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(now);
  osc.stop(now + 0.3);
}

/* ==========================================
   QUIZ DATA
   ========================================== */

const Q1 = {
  text: "Вы подходите к развилке в Запретном лесу. Какая тропа манит вас сильнее всего?",
  options: [
    { text: "Яркая, прогретая солнцем лесная просека", branch: "light", points: { gryffindor: 2, hufflepuff: 1 } },
    { text: "Узкая тропа, скрытая под покровом таинственного тумана", branch: "shadow", points: { slytherin: 2, ravenclaw: 1 } },
    { text: "Возвышающаяся тропа, ведущая к звездной обсерватории", branch: "wisdom", points: { ravenclaw: 2, hufflepuff: 1 } }
  ]
};

const branchQuestions = {
  light: [
    // Q2
    {
      text: "Вы видите, как слизеринец заколдовал беззащитного первокурсника. Ваши действия?",
      options: [
        { text: "Вступлюсь напрямую, достав палочку и бросив вызов", points: { gryffindor: 3 } },
        { text: "Быстро вспомню контрзаклинание, освобожу беднягу и отчитаю обидчика", points: { gryffindor: 1, hufflepuff: 3 } }
      ]
    },
    // Q3
    {
      text: "Каков ваш самый большой страх перед лицом опасности?",
      options: [
        { text: "Оказаться трусом и подвести доверившихся мне людей", points: { gryffindor: 3, hufflepuff: 1 } },
        { text: "Показать свою несостоятельность и провалить важное испытание", points: { ravenclaw: 2, hufflepuff: 2 } }
      ]
    },
    // Q4
    {
      text: "На дуэли ваш противник использует запрещенный прием. Как вы поступите?",
      options: [
        { text: "Отвечу тем же заклинанием, чтобы победить во что бы то ни стало", points: { slytherin: 2, gryffindor: 2 } },
        { text: "Продолжу защищаться строго по правилам, а судье сообщу после боя", points: { hufflepuff: 3, ravenclaw: 1 } }
      ]
    },
    // Q5
    {
      text: "Выберите благородный артефакт в подарок от директора:",
      options: [
        { text: "Меч Годрика Гриффиндора (сияющая сталь и рубины)", points: { gryffindor: 4 } },
        { text: "Чаша Пенелопы Пуффендуй (золотой кубок с изображением барсука)", points: { hufflepuff: 4 } }
      ]
    }
  ],
  shadow: [
    // Q2
    {
      text: "Вы нашли древний свиток с могущественным темным заклинанием. Как вы поступите?",
      options: [
        { text: "Изучу его в тайне, чтобы обрести превосходство над возможными врагами", points: { slytherin: 3, ravenclaw: 1 } },
        { text: "Передам его профессорам, но сначала тайно сделаю для себя копию", points: { slytherin: 2, ravenclaw: 2 } }
      ]
    },
    // Q3
    {
      text: "Какова ваша главная цель при обучении в Хогвартсе?",
      options: [
        { text: "Получить силу, авторитет и занять ключевые посты в волшебном мире", points: { slytherin: 3, gryffindor: 1 } },
        { text: "Стать выдающимся стратегом, влияющим на события и заводящим нужные связи", points: { slytherin: 3, ravenclaw: 1 } }
      ]
    },
    // Q4
    {
      text: "Вы узнали тайный пароль от Запретной секции библиотеки Хогвартса. Ваши действия?",
      options: [
        { text: "Буду проникать туда по ночам для изучения скрытых знаний", points: { slytherin: 2, ravenclaw: 2 } },
        { text: "Выгодно продам этот пароль другим студентам, любящим риск", points: { slytherin: 4 } }
      ]
    },
    // Q5
    {
      text: "Выберите древнюю реликвию из тайного хранилища:",
      options: [
        { text: "Кольцо Марволо Мракса (скрывает непостижимую вековую мощь)", points: { slytherin: 4 } },
        { text: "Медальон Салазара Слизерина (зеленый изумруд и золотая змея)", points: { slytherin: 4 } }
      ]
    }
  ],
  wisdom: [
    // Q2
    {
      text: "Вы столкнулись со сфинксом, охраняющим сундук. Он предлагает разгадать загадку. Ваши действия?",
      options: [
        { text: "С радостью приму интеллектуальный вызов и разгадаю шараду", points: { ravenclaw: 3, hufflepuff: 1 } },
        { text: "Попробую перехитрить сфинкса, изучив выступы пещеры для обхода", points: { ravenclaw: 1, slytherin: 3 } }
      ]
    },
    // Q3
    {
      text: "Где вы предпочитаете проводить свободные часы в Хогвартсе?",
      options: [
        { text: "В тишине библиотеки, изучая редкие фолианты и забытые свитки", points: { ravenclaw: 3, hufflepuff: 1 } },
        { text: "В башне Астрономии, созерцая небеса и размышляя о тайнах вселенной", points: { ravenclaw: 3, gryffindor: 1 } }
      ]
    },
    // Q4
    {
      text: "Профессор допустил ошибку в сложной формуле заклинания на уроке. Ваши действия?",
      options: [
        { text: "Громко исправлю его перед всей аудиторией, продемонстрировав точность", points: { ravenclaw: 2, slytherin: 2 } },
        { text: "Тихо и вежливо сообщу ему об этом после занятия, чтобы не подрывать авторитет", points: { hufflepuff: 3, ravenclaw: 1 } }
      ]
    },
    // Q5
    {
      text: "Выберите мистический инструмент для работы с тонкими материями:",
      options: [
        { text: "Диадема Кандиды Когтевран (дарует ясность мыслей своему носителю)", points: { ravenclaw: 4 } },
        { text: "Древний Хроноворот (позволяет совершать короткие прыжки во времени)", points: { ravenclaw: 3, gryffindor: 1 } }
      ]
    }
  ]
};

const housesData = {
  gryffindor: {
    name: "Гриффиндор",
    desc: "Факультет храбрых сердцем, готовых пойти на риск ради защиты справедливости и друзей. Ваша сила — в благородстве, чести и смелости двигаться вперед вопреки страху.",
    crest: "🦁",
    watermark: "GRYFFINDOR",
    class: "theme-gryffindor",
    patronus: "Серебряный Олень",
    stats: { defense: 95, potions: 60, creatures: 55 },
    wand: "Остролист и перо Феникса, 11 дюймов"
  },
  slytherin: {
    name: "Слизерин",
    desc: "Факультет амбициозных, хитрых и находчивых магов. Вы цените лидерство, самосохранение, силу воли и умение добиваться поставленных целей самым эффективным путем.",
    crest: "🐍",
    watermark: "SLYTHERIN",
    class: "theme-slytherin",
    patronus: "Призрачный Василиск",
    stats: { defense: 75, potions: 95, creatures: 45 },
    wand: "Черное дерево и жила Дракона, 12¾ дюймов"
  },
  ravenclaw: {
    name: "Когтевран",
    desc: "Факультет мудрых, любознательных и творческих волшебников. Вы стремитесь к неизведанной истине, знаниям и цените индивидуальность и оригинальность мыслей.",
    crest: "🦅",
    watermark: "RAVENCLAW",
    class: "theme-ravenclaw",
    patronus: "Серебристый Орёл",
    stats: { defense: 80, potions: 75, creatures: 80 },
    wand: "Орешник и волос Единорога, 10¾ дюймов"
  },
  hufflepuff: {
    name: "Пуффендуй",
    desc: "Факультет трудолюбивых, верных и честных магов. Ваши главные ценности — доброта, справедливость, преданность своим друзьям и готовность трудиться на благо всех.",
    crest: "🦡",
    watermark: "HUFFLEPUFF",
    class: "theme-hufflepuff",
    patronus: "Мягко светящийся Барсук",
    stats: { defense: 65, potions: 65, creatures: 90 },
    wand: "Клен и волос Единорога, 11½ дюймов"
  }
};

const initialSortingQuotes = [
  "Хмм... Сложно. Очень сложно...",
  "Вижу много качеств. И неглупый разум, к тому же...",
  "Но чтобы вынести вердикт, мне нужен ваш лик для свитков Хогвартса!"
];

const finalSortingQuotes = [
  "Прекрасный снимок! Теперь я вижу вас целиком...",
  "Да... Я вижу твою истинную суть...",
  "Я готов принять решение..."
];

/* ==========================================
   NAVIGATION ENGINE
   ========================================== */

function navigate(targetViewId, direction = 'forward') {
  const views = document.querySelectorAll('.view');
  const targetView = document.getElementById(targetViewId);
  
  if (!targetView) return;

  const updateDOM = () => {
    views.forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });
    targetView.style.display = 'block';
    // Force reflow for transitions to kick in
    targetView.offsetHeight; 
    targetView.classList.add('active');
    
    // Apply body theme based on state step
    updateBodyTheme();
  };

  // Check if browser supports View Transitions API
  if (document.startViewTransition) {
    document.startViewTransition({
      update: updateDOM,
      types: [direction]
    });
  } else {
    updateDOM();
  }
}

function updateBodyTheme() {
  const body = document.body;
  body.className = ''; // Reset class
  
  if (state.currentStep === 0) {
    body.classList.add('theme-default');
  } else if (state.currentStep >= 1 && state.currentStep <= 5) {
    // During quiz, change theme based on chosen branch (after Q1)
    if (state.currentBranch === 'light') {
      body.classList.add('theme-gryffindor');
    } else if (state.currentBranch === 'shadow') {
      body.classList.add('theme-slytherin');
    } else if (state.currentBranch === 'wisdom') {
      body.classList.add('theme-ravenclaw');
    } else {
      body.classList.add('theme-default');
    }
  } else if (state.currentStep >= 6) {
    // When sorted, apply the sorted house theme!
    if (state.sortedHouse) {
      body.classList.add(housesData[state.sortedHouse].class);
    } else {
      body.classList.add('theme-default');
    }
  }
}

/* ==========================================
   APP INITIALIZATION & ROUTING EVENTS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateBodyTheme();
});

let cameraStream = null;

function setupEventListeners() {
  // Sound toggle
  document.getElementById('sound-toggle').addEventListener('click', toggleSound);

  // Welcome page submission
  document.getElementById('start-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.userName = document.getElementById('user-name').value.trim();
    state.currentStep = 1;
    
    if (audioCtx) playMagicChime();
    
    navigate('quiz-screen');
    renderQuestion();
  });

  // Quiz navigation buttons
  document.getElementById('prev-btn').addEventListener('click', goPrevQuestion);
  document.getElementById('next-btn').addEventListener('click', goNextQuestion);

  // Inline photo upload trigger
  document.getElementById('inline-upload-btn').addEventListener('click', () => {
    document.getElementById('inline-file-input').click();
  });

  // Inline file input change
  document.getElementById('inline-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInlinePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  // Inline camera open trigger
  document.getElementById('inline-camera-btn').addEventListener('click', async () => {
    const video = document.getElementById('video-inline');
    const placeholder = document.getElementById('inline-placeholder');
    const previewImg = document.getElementById('img-inline');
    const controls = document.querySelector('.photo-capture-controls');
    
    // Hide placeholder/previous image and show video stream
    placeholder.style.display = 'none';
    previewImg.style.display = 'none';
    video.style.display = 'block';

    // Update buttons visibility
    document.getElementById('inline-upload-btn').style.display = 'none';
    document.getElementById('inline-camera-btn').style.display = 'none';
    document.getElementById('inline-snap-btn').style.display = 'inline-block';
    document.getElementById('inline-cancel-btn').style.display = 'inline-block';
    controls.classList.add('snapping');

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      video.srcObject = cameraStream;
      document.getElementById('inline-photo-preview').classList.add('active');
    } catch (err) {
      console.error("Camera access failed", err);
      alert("Не удалось получить доступ к камере. Пожалуйста, загрузите файл.");
      resetInlineControls();
    }
  });

  // Inline cancel camera trigger
  document.getElementById('inline-cancel-btn').addEventListener('click', () => {
    stopCamera();
    resetInlineControls();
  });

  // Inline camera snapshot capture
  document.getElementById('inline-snap-btn').addEventListener('click', () => {
    const video = document.getElementById('video-inline');
    const canvas = document.getElementById('canvas-inline');
    const context = canvas.getContext('2d');

    if (cameraStream) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw mirrored video frame to canvas
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg');
      setInlinePhoto(dataUrl);

      stopCamera();
      resetInlineControls();
    }
  });

  // Photo submit continue button
  document.getElementById('photo-submit-btn').addEventListener('click', () => {
    // Navigate to sorting loading screen for final decision quotes
    state.currentStep = 6.5;
    navigate('sorting-screen', 'forward');
    runSortingCeremony(true); // Run final sorting hat decision
  });

  // Results page interactions: pricing tiers
  const tierCards = document.querySelectorAll('.tier-card');
  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedTier = card.dataset.tier;
      
      // Update activate button label
      const price = card.dataset.price;
      const actBtnText = document.getElementById('activate-profile-btn').querySelector('.btn-text');
      actBtnText.textContent = `Активировать профиль за ${price}`;
      
      if (audioCtx) playMagicChime();
    });
  });

  // Activate button click
  document.getElementById('activate-profile-btn').addEventListener('click', () => {
    state.currentStep = 8;
    openPaymentCheckout();
  });

  // Result page back button (return to quiz Q5)
  document.getElementById('result-back-btn').addEventListener('click', () => {
    state.currentStep = 5;
    navigate('quiz-screen', 'backward');
    renderQuestion();
  });

  // Payment back button
  document.getElementById('payment-back-btn').addEventListener('click', () => {
    state.currentStep = 7;
    navigate('result-screen', 'backward');
  });

  // Payment inputs formatting and validation
  setupPaymentInputFormatting();

  // Payment submit
  document.getElementById('checkout-form').addEventListener('submit', handlePaymentSubmit);

  // Success envelope click to open/read
  const envelope = document.getElementById('letter-envelope');
  envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
      envelope.classList.add('open');
      if (audioCtx) playMagicChime();
      
      // Reveal the actions block after letter is out
      setTimeout(() => {
        const actions = document.getElementById('success-actions');
        actions.style.opacity = '1';
        actions.style.pointerEvents = 'all';
      }, 1500);
    } else if (!envelope.classList.contains('read')) {
      envelope.classList.add('read');
    } else {
      envelope.classList.remove('read');
    }
  });

  // Cabinet button
  document.getElementById('go-to-cabinet-btn').addEventListener('click', () => {
    alert(`Поздравляем, ${state.userName}! Вы вошли в ваш магический профиль. Данные подписки активированы.`);
  });
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}

function resetInlineControls() {
  const video = document.getElementById('video-inline');
  const placeholder = document.getElementById('inline-placeholder');
  const previewImg = document.getElementById('img-inline');
  const controls = document.querySelector('.photo-capture-controls');
  
  video.style.display = 'none';
  if (previewImg.src && previewImg.src !== window.location.href) {
    previewImg.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    placeholder.style.display = 'block';
    previewImg.style.display = 'none';
  }

  document.getElementById('inline-upload-btn').style.display = 'inline-block';
  document.getElementById('inline-camera-btn').style.display = 'inline-block';
  document.getElementById('inline-snap-btn').style.display = 'none';
  document.getElementById('inline-cancel-btn').style.display = 'none';
  controls.classList.remove('snapping');
  document.getElementById('inline-photo-preview').classList.remove('active');
}

function setInlinePhoto(dataUrl) {
  const previewImg = document.getElementById('img-inline');
  const placeholder = document.getElementById('inline-placeholder');
  const submitBtn = document.getElementById('photo-submit-btn');

  previewImg.src = dataUrl;
  previewImg.style.display = 'block';
  placeholder.style.display = 'none';

  // Enable submit button
  submitBtn.removeAttribute('disabled');

  // Pre-fill result screen wizard card photo
  const cardPhoto = document.getElementById('card-photo-img');
  const cardPlaceholder = document.getElementById('card-avatar-placeholder');
  cardPhoto.src = dataUrl;
  cardPhoto.style.display = 'block';
  cardPlaceholder.style.display = 'none';

  if (audioCtx) playMagicChime();
}

/* ==========================================
   QUIZ ENGINE
   ========================================== */

function getQuestionData(step) {
  if (step === 1) return Q1;
  
  const branch = state.currentBranch || 'light';
  return branchQuestions[branch][step - 2];
}

function renderQuestion() {
  const question = getQuestionData(state.currentStep);
  const questionTextEl = document.getElementById('question-text');
  const optionsContainerEl = document.getElementById('options-container');
  
  questionTextEl.textContent = question.text;
  optionsContainerEl.innerHTML = '';
  state.selectedOptionIndex = null;
  
  // Disable next button until selection
  document.getElementById('next-btn').disabled = true;
  
  // Render options
  question.options.forEach((opt, idx) => {
    const card = document.createElement('div');
    card.className = 'option-card';
    card.dataset.index = idx;
    
    // Check if we previously answered this question
    const prevAnswer = state.answers[state.currentStep - 1];
    if (prevAnswer && prevAnswer.selectedOptionIndex === idx) {
      card.classList.add('selected');
      state.selectedOptionIndex = idx;
      document.getElementById('next-btn').disabled = false;
    }
    
    card.innerHTML = `
      <div class="option-radio"></div>
      <span class="option-text">${opt.text}</span>
    `;
    
    card.addEventListener('click', () => {
      document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.selectedOptionIndex = idx;
      document.getElementById('next-btn').disabled = false;
      
      if (audioCtx) playMagicChime();
    });
    
    optionsContainerEl.appendChild(card);
  });

  // Handle Progress Bar
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = (state.currentStep / 5) * 100;
  progressFill.style.width = `${progressPercent}%`;
  
  const progressStats = document.getElementById('quiz-steps-display');
  progressStats.textContent = `Вопрос ${state.currentStep} из 5`;

  // Show/Hide back button
  const prevBtn = document.getElementById('prev-btn');
  prevBtn.style.visibility = state.currentStep > 1 ? 'visible' : 'hidden';
}

function goPrevQuestion() {
  if (state.currentStep > 1) {
    state.currentStep--;
    navigate('quiz-screen', 'backward');
    renderQuestion();
  }
}

function goNextQuestion() {
  if (state.selectedOptionIndex === null) return;
  
  const question = getQuestionData(state.currentStep);
  const selectedOption = question.options[state.selectedOptionIndex];

  // Save/Overwrite answer in history
  state.answers[state.currentStep - 1] = {
    questionText: question.text,
    selectedOptionIndex: state.selectedOptionIndex,
    branch: selectedOption.branch || null,
    points: selectedOption.points || null
  };

  // Branching transition on Question 1
  if (state.currentStep === 1) {
    state.currentBranch = selectedOption.branch;
  }

  // Advance
  if (state.currentStep < 5) {
    state.currentStep++;
    navigate('quiz-screen', 'forward');
    renderQuestion();
  } else {
    // Finished all 5 questions! Start sorting hat ceremony loading screen
    state.currentStep = 6;
    navigate('sorting-screen', 'forward');
    runSortingCeremony(false); // Call initial sorting loader (before photo)
  }
}

/* ==========================================
   SORTING CEREMONY ENGINE
   ========================================== */

function runSortingCeremony(isFinal = false) {
  const quoteEl = document.getElementById('hat-quote');
  const mouth = document.getElementById('hat-mouth');
  const quotesList = isFinal ? finalSortingQuotes : initialSortingQuotes;
  let quoteIdx = 0;
  
  // Set initial quote immediately
  quoteEl.textContent = quotesList[0];
  if (audioCtx) playSortingHatMumble();
  quoteIdx++;

  // Text animation loop
  const interval = setInterval(() => {
    if (quoteIdx < quotesList.length) {
      const quote = quotesList[quoteIdx];
      quoteEl.textContent = quote;
      
      // Animate Sorting Hat mouth (simulate speech wiggle)
      let talkCount = 0;
      if (audioCtx) playSortingHatMumble();
      
      const mouthTalk = setInterval(() => {
        if (talkCount % 2 === 0) {
          mouth.setAttribute('d', 'M40,64 C43,58 57,58 60,64'); // Open mouth
        } else {
          mouth.setAttribute('d', 'M42,64 C45,64 55,64 58,64'); // Close mouth
        }
        talkCount++;
        if (talkCount > 6) clearInterval(mouthTalk);
      }, 100);

      quoteIdx++;
    } else {
      clearInterval(interval);
      
      if (!isFinal) {
        // Redirection to photo capture screen after first sorting loading
        setTimeout(() => {
          state.currentStep = 6;
          navigate('photo-capture-screen', 'forward');
          stopCamera();
        }, 1200);
      } else {
        // Calculate scores and go to result screen
        calculateScores();
        setTimeout(() => {
          state.currentStep = 7;
          showResultScreen();
        }, 1200);
      }
    }
  }, 2200);
}

function calculateScores() {
  // Reset scores
  state.scores = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
  
  // Accumulate points from answer history
  state.answers.forEach(ans => {
    if (ans.points) {
      for (let h in ans.points) {
        state.scores[h] += ans.points[h];
      }
    }
  });

  // Find house with maximum score
  let maxScore = -1;
  let winningHouse = 'gryffindor'; // default fallback
  
  for (let house in state.scores) {
    if (state.scores[house] > maxScore) {
      maxScore = state.scores[house];
      winningHouse = house;
    }
  }

  state.sortedHouse = winningHouse;
}

/* ==========================================
   RESULT SCREEN (PERSONALIZATION & 3D TILT)
   ========================================== */

function showResultScreen() {
  const house = housesData[state.sortedHouse];
  
  // Fill result page content
  document.getElementById('sorted-house-name').textContent = house.name;
  document.getElementById('sorted-house-desc').textContent = house.desc;
  
  // Fill Wizard Card details
  document.getElementById('card-crest').textContent = house.crest;
  document.getElementById('card-user-name').textContent = state.userName;
  document.getElementById('card-house-val').textContent = house.name;
  document.getElementById('card-watermark-text').textContent = house.watermark;
  
  // Get Q1 selected wand core
  const q1Ans = state.answers[0];
  const q1OptIdx = q1Ans.selectedOptionIndex;
  const wandMap = ["Перо Феникса", "Жила Дракона", "Волос Единорога"];
  document.getElementById('card-wand-val').textContent = wandMap[q1OptIdx] || "Неизвестно";
  
  // Set profile skills and animate bars
  document.getElementById('stat-defense-val').textContent = `${house.stats.defense}%`;
  document.getElementById('stat-potions-val').textContent = `${house.stats.potions}%`;
  document.getElementById('stat-creatures-val').textContent = `${house.stats.creatures}%`;
  
  // Fill Patronus info
  document.getElementById('patronus-val').textContent = house.patronus;

  // Fill Roadmap items
  document.getElementById('roadmap-house-name').textContent = house.name;

  // Render visual theme classes to the 3D card front
  const cardFront = document.querySelector('.card-front');
  cardFront.style.borderColor = `var(--secondary-color)`;
  
  navigate('result-screen', 'forward');

  // Trigger stat bar expansion animation
  setTimeout(() => {
    document.getElementById('stat-defense-fill').style.width = `${house.stats.defense}%`;
    document.getElementById('stat-potions-fill').style.width = `${house.stats.potions}%`;
    document.getElementById('stat-creatures-fill').style.width = `${house.stats.creatures}%`;
  }, 300);

  // Setup 3D Hover tilt effect
  setup3dCardTilt();
}

function setup3dCardTilt() {
  const cardContainer = document.querySelector('.card-container-3d');
  const card = document.getElementById('wizard-card');
  
  cardContainer.addEventListener('mousemove', (e) => {
    const rect = cardContainer.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    
    // Calculate rotation angles (range -20 to 20 degrees)
    const rotateY = ((x / cardWidth) - 0.5) * 30;
    const rotateX = (((y / cardHeight) - 0.5) * -30);
    
    card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    // Move glow glare highlight
    const glare = document.querySelector('.card-photo-glare');
    const glareX = (x / cardWidth) * 100;
    const glareY = (y / cardHeight) * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
  });

  cardContainer.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    const glare = document.querySelector('.card-photo-glare');
    glare.style.background = '';
  });
}

/* ==========================================
   PAYMENT / CHECKOUT ENGINE
   ========================================== */

function openPaymentCheckout() {
  const house = housesData[state.sortedHouse];
  const tierInfo = {
    weekly: { name: "Недельный триал (Подписка)", price: "990 ₸" },
    monthly: { name: "1 Месяц (Подписка)", price: "2 990 ₸" },
    lifetime: { name: "Навсегда (Разовый платеж)", price: "9 990 ₸" }
  };
  
  const selectedTierData = tierInfo[state.selectedTier];
  
  document.getElementById('summary-tier-name').textContent = selectedTierData.name;
  document.getElementById('summary-house-name').textContent = house.name;
  document.getElementById('summary-price-val').textContent = selectedTierData.price;
  
  const submitBtn = document.getElementById('pay-submit-btn').querySelector('.btn-text');
  submitBtn.textContent = `Оплатить ${selectedTierData.price}`;
  
  navigate('payment-screen', 'forward');
}

function setupPaymentInputFormatting() {
  const cardInput = document.getElementById('card-number');
  const expiryInput = document.getElementById('card-expiry');
  const cvcInput = document.getElementById('card-cvc');
  const brandIcon = document.getElementById('card-brand-icon');

  // Card Number space formatting & brand detection
  cardInput.addEventListener('input', (e) => {
    let value = cardInput.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    // Auto-detect brand emoji
    if (value.startsWith('4')) {
      brandIcon.textContent = '🟦 Visa';
    } else if (value.startsWith('5') || value.startsWith('22') || value.startsWith('23') || value.startsWith('24') || value.startsWith('25') || value.startsWith('26') || value.startsWith('27')) {
      brandIcon.textContent = '🟨 MC';
    } else if (value.startsWith('2200') || value.startsWith('2201') || value.startsWith('2202') || value.startsWith('2203') || value.startsWith('2204')) {
      brandIcon.textContent = '🟩 Мир';
    } else {
      brandIcon.textContent = '💳';
    }

    // Limit value to 16 digits
    value = value.substring(0, 16);

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value.charAt(i);
    }
    
    cardInput.value = formattedValue;
    validateInput(cardInput);
  });

  // Expiry date format MM/YY
  expiryInput.addEventListener('input', () => {
    let value = expiryInput.value.replace(/\D/g, '');
    if (value.length > 2) {
      expiryInput.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      expiryInput.value = value;
    }
    validateInput(expiryInput);
  });

  // CVV limit to numbers
  cvcInput.addEventListener('input', () => {
    cvcInput.value = cvcInput.value.replace(/\D/g, '').substring(0, 3);
    validateInput(cvcInput);
  });

  // Common inputs validation styling helper
  const inputs = [
    document.getElementById('card-holder'),
    cardInput,
    expiryInput,
    cvcInput
  ];

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
  });
}

function validateInput(input) {
  const group = input.closest('.input-group');
  let isValid = true;

  if (input.id === 'card-holder') {
    // Only letters and spaces, at least 4 chars
    const reg = /^[a-zA-Z\s]{4,30}$/;
    isValid = reg.test(input.value);
  } else if (input.id === 'card-number') {
    const rawNum = input.value.replace(/\s+/g, '');
    isValid = rawNum.length === 16 && luhnCheck(rawNum);
  } else if (input.id === 'card-expiry') {
    const match = input.value.match(/^(0[1-9]|1[0-2])\/([2-9][0-9])$/);
    if (!match) {
      isValid = false;
    } else {
      // Check expiry is in future
      const currentYear = parseInt(new Date().getFullYear().toString().slice(-2), 10);
      const currentMonth = new Date().getMonth() + 1;
      const expMonth = parseInt(match[1], 10);
      const expYear = parseInt(match[2], 10);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        isValid = false;
      }
    }
  } else if (input.id === 'card-cvc') {
    isValid = /^\d{3}$/.test(input.value);
  }

  if (isValid || input.value === '') {
    group.classList.remove('invalid');
  } else {
    group.classList.add('invalid');
  }

  return isValid;
}

function luhnCheck(val) {
  let sum = 0;
  for (let i = 0; i < val.length; i++) {
    let intVal = parseInt(val.substr(i, 1), 10);
    if (i % 2 === 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return (sum % 10 === 0);
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const inputs = form.querySelectorAll('input');
  let formValid = true;

  inputs.forEach(input => {
    if (!validateInput(input) || input.value === '') {
      input.closest('.input-group').classList.add('invalid');
      formValid = false;
    }
  });

  if (!formValid) return;

  // Show loading spinner
  const submitBtn = document.getElementById('pay-submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';

  // Simulate payment processing (2.5 seconds)
  setTimeout(() => {
    state.currentStep = 9;
    
    // Fill letter details
    document.getElementById('letter-recipient-name').textContent = state.userName;
    document.getElementById('letter-house-name').textContent = housesData[state.sortedHouse].name;
    
    if (audioCtx) playMagicChime();
    
    navigate('success-screen', 'forward');
  }, 2500);
}
