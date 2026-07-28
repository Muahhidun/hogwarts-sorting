/* ==========================================
   MONETIZATION MATRIX 22 - CORE JAVASCRIPT
   ========================================== */

// Web Audio API Synthesizer
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playChime(freq = 587.33, duration = 0.25) { // D5 note default
  if (!soundEnabled) return;
  initAudio();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playClick() {
  if (!soundEnabled) return;
  initAudio();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

// Global State
let currentCategory = 'all';
let currentModelId = 'subscription';

// 22 Monetization Models Dataset
const modelsData = [
  // CATEGORY 1: SUB & ACCESS
  {
    id: 'subscription',
    num: '01',
    category: 'sub',
    title: 'Подписка (Subscription)',
    icon: '🔁',
    subtitle: 'Регулярные автосписания (месяц/год) за непрерывный доступ к сервису',
    desc: 'Пользователь платит фиксированную сумму с равной периодичностью. Обеспечивает предсказуемый MRR/ARR.',
    formula: 'MRR = Количество подписчиков × Средняя цена подписки (ARPU)',
    cases: ['Netflix', 'Spotify', 'ChatGPT Plus', 'WeDrink POS'],
    pros: 'Предсказуемый регулярный доход (MRR), высокий LTV при низком Churn Rate.',
    risks: 'Высокая стоимость привлечения (CAC), требует постоянной поставки ценности.',
    aiValidation: [
      'Оценить уровень оттока (Churn Rate) по аналогичным сервисам в нише',
      'Проверить готовность платить рекуррентно, а не единоразово',
      'Рассчитать точку окупаемости CAC за 3-6 месяцев'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Выберите период оплаты:</span>
            <span class="control-value" id="sub-discount-tag">Скидка -20% при годовой!</span>
          </div>
          <div class="tiers-interactive-grid">
            <div class="interactive-tier-card" onclick="selectSubTier('monthly')">
              <div class="tier-name">Ежемесячно</div>
              <div class="tier-price">9 990 ₸ <span>/ мес</span></div>
              <ul class="tier-features">
                <li>✓ Полный доступ к модулям</li>
                <li>✓ Отмена в любой момент</li>
              </ul>
            </div>
            <div class="interactive-tier-card active" onclick="selectSubTier('annual')">
              <div class="tier-badge">Выгодно 🔥</div>
              <div class="tier-name">Ежегодно</div>
              <div class="tier-price">7 990 ₸ <span>/ мес</span></div>
              <ul class="tier-features">
                <li>✓ Скидка 20% (95 880 ₸/год)</li>
                <li>✓ VIP поддержка 24/7</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-title">Имитация автосписания</div>
          <div class="receipt-row"><span>Выбранный план:</span> <strong id="sub-plan-name">Годовая подписка</strong></div>
          <div class="receipt-row"><span>Периодичность:</span> <span>Раз в 12 месяцев</span></div>
          <div class="receipt-row total"><span>Итого к оплате:</span> <span id="sub-total-price">95 880 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Подписка успешно оформлена!')">
          ⚡ Активировать рекуррентную подписку
        </button>
      </div>
    `
  },
  {
    id: 'freemium',
    num: '02',
    category: 'sub',
    title: 'Freemium',
    icon: '🔓',
    subtitle: 'Базовый функционал бесплатно, расширенный PRO — по платной подписке',
    desc: 'Позволяет быстро набрать миллионы пользователей без барьера входа, конвертируя 2-5% в платящих.',
    formula: 'Доход = Общая база пользователей × Конверсия в PRO (%) × Цена PRO',
    cases: ['Figma', 'Zoom', 'Duolingo', 'Slack', 'Notion'],
    pros: 'Нулевой барьер входа, виральный рост, сарафанное радио.',
    risks: 'Бесплатные пользователи нагружают серверы; сложный баланс ценности Free/PRO.',
    aiValidation: [
      'Проверить, достаточно ли ценности в бесплатной версии для лидогенерации',
      'Валидировать "триггер апгрейда" (какая именно фича заставит платить)',
      'Убедиться, что конверсия 2-3% перекрывает затраты на 97% бесплатников'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Статус вашего аккаунта:</span>
            <span class="control-value" id="freemium-status-tag" style="color: #94a3b8;">FREE PLAN</span>
          </div>
          <div style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1); padding: 1.25rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>Базовый экспорт отчётов:</span> <span style="color: #00f5d4;">✓ Доступен</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.5;" id="pro-feature-row">
              <span>🔒 AI-Прогноз остатков на складе:</span> <span style="color: #ffd166;">Только в PRO</span>
            </div>
          </div>
        </div>

        <button class="sim-action-btn" id="freemium-btn" onclick="toggleFreemiumPro()">
          ⚡ Разблокировать PRO-фичи (14 990 ₸/мес)
        </button>
      </div>
    `
  },
  {
    id: 'per-seat',
    num: '03',
    category: 'sub',
    title: 'За рабочее место (Per Seat)',
    icon: '👥',
    subtitle: 'Оплата рассчитывается за каждого активного сотрудника или пользователя',
    desc: 'Стандарт монетизации B2B-софта. По мере роста команды клиента растёт и чек вашей компании.',
    formula: 'Выручка = Количество мест (Seats) × Ставка за место',
    cases: ['Google Workspace', 'Jira', 'Asana', 'Salesforce'],
    pros: 'Естественное увеличение чека (Land & Expand) вместе с ростом бизнеса клиента.',
    risks: 'Клиенты шеpointсят логины или ограничивают число пользователей ради экономии.',
    aiValidation: [
      'Оценить среднее число сотрудников у целевых B2B-клиентов',
      'Проверить систему защиты от использования одного аккаунта несколькими людьми'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Количество пользователей (мест):</span>
            <span class="control-value" id="seat-count-display">5 мест</span>
          </div>
          <input type="range" class="custom-slider" min="1" max="50" value="5" id="seat-slider" oninput="updateSeatCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Ставка за 1 место:</span> <span>3 500 ₸ / мес</span></div>
          <div class="receipt-row"><span>Скидка за объём (>10 мест):</span> <span id="seat-discount">0%</span></div>
          <div class="receipt-row total"><span>Итоговый ежемесячный чек:</span> <span id="seat-total">17 500 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Пакет рабочих мест обновлен!')">
          ⚡ Оформить подписку на команду
        </button>
      </div>
    `
  },
  {
    id: 'lifetime',
    num: '04',
    category: 'sub',
    title: 'Пожизненный доступ (Lifetime Deal)',
    icon: '♾️',
    subtitle: 'Одноразовый крупный платёж за навсегда зафиксированный доступ без рекуррентов',
    desc: 'Отличный способ привлечь быстрый стартовый капитал от ранних последователей на запуске.',
    formula: 'Разовый доход = Количество лицензий LTD × Высокий чек LTD',
    cases: ['AppSumo', 'Lifetime SaaS Deals', 'Курсы с вечным доступом'],
    pros: 'Мгновенный приток Cash Flow на ранней стадии, высокая мотивация ранних фанатов.',
    risks: 'Отсутствие повторных платежей в будущем при пожизненных обязательствах по серверу.',
    aiValidation: [
      'Просчитать лимит количества продаваемых LTD-лицензий',
      'Убедиться, что стоимость обслуживания клиента на горизонте 3 лет не превысит цену LTD'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div style="background: rgba(255,209,102,0.1); border: 1px solid #ffd166; padding: 0.75rem; border-radius: 10px; font-size: 0.85rem; color: #ffd166; display: flex; justify-content: space-between;">
            <span>⚡ Специальное предложение:</span> <strong>Осталось 4 из 50 лицензий!</strong>
          </div>
          <div class="interactive-tier-card active" style="margin-top: 0.5rem;">
            <div class="tier-name">Lifetime Unlimited License</div>
            <div class="tier-price">99 900 ₸ <span>один раз навсегда</span></div>
            <ul class="tier-features">
              <li>✓ Вечный доступ ко всем обновлениям</li>
              <li>✓ Никаких ежемесячных списаний</li>
            </ul>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Пожизненная лицензия успешно приобретена!')">
          ⚡ Купить вечный доступ (99 900 ₸)
        </button>
      </div>
    `
  },
  {
    id: 'membership',
    num: '05',
    category: 'sub',
    title: 'Членство в клубе (Membership)',
    icon: '👑',
    subtitle: 'Плата не просто за софт, а за доступ к комьюнити, связям и закрытым ивентам',
    desc: 'Ценность основывается на статусе, нетворкинг-сферах и непубличных материалах.',
    formula: 'Доход = Члены клуба × Стоимость взноса (ежемесячного или ежегодного)',
    cases: ['Product Masters Club', 'Patreon', 'Soho House', 'YPO'],
    pros: 'Высокая удерживаемость (Retention) из-за социальных связей и чувства принадлежности.',
    risks: 'Требует регулярной фасилитации комьюнити и организации ивентов.',
    aiValidation: [
      'Оценить ценность нетворкинга для целевой аудитории',
      'Проверить готовность платить за статус и доступ к экспертам'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="tiers-interactive-grid">
          <div class="interactive-tier-card active">
            <div class="tier-badge">VIP Сферы</div>
            <div class="tier-name">Founder Club Membership</div>
            <div class="tier-price">25 000 ₸ <span>/ мес</span></div>
            <ul class="tier-features">
              <li>✓ Закрытый чат основателей</li>
              <li>✓ Еженедельные мастермайнды</li>
              <li>✓ Прямой доступ к инвесторам</li>
            </ul>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Вы вступили в клуб основателей!')">
          ⚡ Вступить в клуб
        </button>
      </div>
    `
  },
  {
    id: 'paid-cert',
    num: '06',
    category: 'sub',
    title: 'Платная сертификация',
    icon: '📜',
    subtitle: 'Сама программа или обучение бесплатны, но официальный диплом/сертификат платный',
    desc: 'Широко используется в EdTech массовых курсах. Позволяет набрать миллионы студентов.',
    formula: 'Доход = Бесплатные студенты × Конверсия в сертификат × Цена сертификации',
    cases: ['Coursera', 'edX', 'AWS Certifications', 'Scrum Alliance'],
    pros: 'Огромный охват аудитории, понятная ценность для резюме и работодателей.',
    risks: 'Низкая конверсия в покупку, если сертификат не признан индустрией.',
    aiValidation: [
      'Определить ценность сертификата на рынке труда в вашей нише',
      'Установить барьер прохождения тестов для авторитета диплома'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Прохождение курса:</span> <span style="color: #00f5d4;">БЕСПЛАТНО (0 ₸)</span></div>
          <div class="receipt-row"><span>Официальный диплом с верификацией:</span> <span>19 900 ₸</span></div>
          <div class="receipt-row total"><span>Итого за сертификат:</span> <span>19 900 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Сертификат верифицирован и отправлен!')">
          ⚡ Оплатить верификацию диплома
        </button>
      </div>
    `
  },

  // CATEGORY 2: USAGE & METERED
  {
    id: 'pay-per-use',
    num: '07',
    category: 'usage',
    title: 'Оплата за использование (Pay-Per-Use)',
    icon: '⚡',
    subtitle: 'Клиент платит строго за фактически потребленный объём ресурсов или вызовов API',
    desc: 'Идеальная модель для инфраструктурных сервисов и вычислений. Клиент платит только за то, что потратил.',
    formula: 'Выручка = Объем потребления (гигабайты / вызовы API / часы) × Тариф за единицу',
    cases: ['Amazon AWS', 'Twilio', 'OpenAI API', 'Cloudflare'],
    pros: 'Справедливая ценовая политика; гиганты платят миллионы, стартапы — копейки.',
    risks: 'Непредсказуемость выручки; клиенты могут бояться скачков чека.',
    aiValidation: [
      'Рассчитать себестоимость 1 единицы потребления (Unit Cost)',
      'Разработать систему алертов порога расходов для клиентов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Объем вызовов AI API в месяц:</span>
            <span class="control-value" id="ppu-count">50 000 запросов</span>
          </div>
          <input type="range" class="custom-slider" min="1000" max="500000" step="1000" value="50000" id="ppu-slider" oninput="updatePpuCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Цена за 1 000 токенов/запросов:</span> <span>120 ₸</span></div>
          <div class="receipt-row total"><span>Итого за потребление:</span> <span id="ppu-total">6 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Счет за потребление оплачен!')">
          ⚡ Пополнить баланс API
        </button>
      </div>
    `
  },
  {
    id: 'prepaid-credits',
    num: '08',
    category: 'usage',
    title: 'Предоплаченные кредиты (Prepaid Tokens)',
    icon: '🪙',
    subtitle: 'Покупка пакетов внутренней валюты/токенов заранее, списание по мере расхода',
    desc: 'Обеспечивает предоплату Cash Flow и скрывает психологческое сопротивление прямым тратам.',
    formula: 'Доход = Количество проданных пакетов кредитов × Цена пакета',
    cases: ['Midjourney', 'Depositphotos', 'Аркадные автоматы', 'Игровые валюты'],
    pros: 'Предоплата на ваш счет; часть купленных кредитов никогда не расходуется (Breakage).',
    risks: 'Необходимость интуитивного пересчета стоимости внутренних кредитов в реальные деньги.',
    aiValidation: [
      'Определить оптимальные размеры пакетов кредитов (Small / Medium / Bulk)',
      'Продумать механику бонусов при покупке больших пакетов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="tiers-interactive-grid">
          <div class="interactive-tier-card" onclick="selectCreditBundle(100, 5000)">
            <div class="tier-name">100 Токенов</div>
            <div class="tier-price">5 000 ₸</div>
          </div>
          <div class="interactive-tier-card active" onclick="selectCreditBundle(500, 20000)">
            <div class="tier-badge">+20% бесплатно</div>
            <div class="tier-name">500 Токенов</div>
            <div class="tier-price">20 000 ₸</div>
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Ваш текущий баланс:</span> <strong style="color:#00f5d4;" id="credit-balance">500 Токенов</strong></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Пакет токенов зачислен на счет!')">
          ⚡ Купить пакет кредитов
        </button>
      </div>
    `
  },
  {
    id: 'razor-blade',
    num: '09',
    category: 'usage',
    title: 'Бритва и лезвие (Razor & Blade)',
    icon: '🪒',
    subtitle: 'Продажа базового устройства/платформы с минимальной маржой, маржа на расходниках',
    desc: 'Классическая бизнес-модель. Привязывает клиента к постоянным закупкам именно ваших материалов.',
    formula: 'Прибыль = (Доход от базового железа - Затраты) + (Маржа расходника × Частота закупа)',
    cases: ['Nespresso (кофемашины)', 'Gillette', 'Принтеры HP (картриджи)', 'Игровые консоли'],
    pros: 'Низкий барьер покупки главного устройства, пожизненный поток доходов от расходников.',
    risks: 'Появление неофициальных аналогов расходных материалов от сторонних фабрик.',
    aiValidation: [
      'Продумать защиту от сторонних аналогов (чипы, патенты, уникальная форма)',
      'Убедиться в высокой маржинальности расходного элемента'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Базовая кофемашина / POS-терминал:</span> <span style="color:#00f5d4;">12 000 ₸ (По себестоимости)</span></div>
          <div class="receipt-row"><span>Ежемесячный комплект капсул/чековой ленты:</span> <span>18 500 ₸ (Маржа 70%)</span></div>
          <div class="receipt-row total"><span>Прибыль за 1 год с клиента:</span> <span>155 400 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Комплект расходников заказан!')">
          ⚡ Заказать расходные материалы
        </button>
      </div>
    `
  },
  {
    id: 'priority-lane',
    num: '10',
    category: 'usage',
    title: 'Приоритет и Скорость (Priority Pass)',
    icon: '🚀',
    subtitle: 'Базовый сервис работает в общей очереди, платный — дает мгновенный приоритет',
    desc: 'Эффективно монетизирует фактор времени и срочности у платящих пользователей.',
    formula: 'Доход = Срочные клиенты × Надбавка за приоритетный доступ',
    cases: ['Fast Pass в Диснейленде', 'ChatGPT Turbo GPU', 'Авиалинии (Fast Track)', 'Такси Экспресс'],
    pros: 'Высокая маржинальность; не ограничивает базовых пользователей, а ускоряет платящих.',
    risks: 'Если бесплатная очередь слишком медленная — возникает раздражение пользователей.',
    aiValidation: [
      'Настроить баланс времени ожидания для бесплатного и VIP каналов',
      'Проверить готовность бизнеса выполнять гарантии скорости'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="tiers-interactive-grid">
            <div class="interactive-tier-card">
              <div class="tier-name">Обычный поток</div>
              <div class="tier-price">0 ₸</div>
              <ul class="tier-features">
                <li>⏱ Время генерации: 45 сек</li>
                <li>🐢 В общей очереди</li>
              </ul>
            </div>
            <div class="interactive-tier-card active">
              <div class="tier-badge">SPEED 🔥</div>
              <div class="tier-name">Priority GPU Pass</div>
              <div class="tier-price">4 900 ₸ <span>/ мес</span></div>
              <ul class="tier-features">
                <li>⚡ Время генерации: 1.2 сек</li>
                <li>🚀 Выделенные серверы</li>
              </ul>
            </div>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Приоритетный доступ активирован!')">
          ⚡ Перейти на приоритетную скорость
        </button>
      </div>
    `
  },
  {
    id: 'rental-lease',
    num: '11',
    category: 'usage',
    title: 'Аренда и Каршеринг (Rental / Lease)',
    icon: '🚲',
    subtitle: 'Временное пользование дорогим активом без перехода права собственности',
    desc: 'Превращает крупные разовые капитальные затраты клиента (CapEx) в мелкие операционные (OpEx).',
    formula: 'Выручка = Время аренды × Почасовая/посуточная ставка',
    cases: ['Uber', 'Whoosh (Самокаты)', 'Аренда серверов', 'Аренда оборудования'],
    pros: 'Доступность дорогих продуктов для массовой аудитории; частые повторные сессии.',
    risks: 'Амортизация, поломка и износ физических активов; затраты на логистику и обслуживание.',
    aiValidation: [
      'Рассчитать срок окупаемости 1 единицы оборудования с учетом износа',
      'Продумать систему депозитов и страховок от повреждений'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Длительность аренды оборудования:</span>
            <span class="control-value" id="rental-hours">3 часа</span>
          </div>
          <input type="range" class="custom-slider" min="1" max="24" value="3" id="rental-slider" oninput="updateRentalCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Ставка в час:</span> <span>1 500 ₸</span></div>
          <div class="receipt-row total"><span>Итого за аренду:</span> <span id="rental-total">4 500 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Аренда успешно разблокирована!')">
          ⚡ Начать аренду
        </button>
      </div>
    `
  },

  // CATEGORY 3: SUCCESS & B2B
  {
    id: 'success-fee',
    num: '12',
    category: 'b2b',
    title: 'Оплата за результат (Success Fee)',
    icon: '🎯',
    subtitle: 'Сервис получает процент только от реальной чистой прибыли или сэкономленных денег',
    desc: 'Абсолютно наивысшая конверсия в продажу. Клиент не рискует ничем: нет результата — нет оплаты.',
    formula: 'Комиссия = Финансовый эффект клиента (Доход / Экономия) × % Успеха',
    cases: ['Инвестиционные брокеры', 'CPA-сети', 'Оптимизация налогов/закупок'],
    pros: 'Нулевой сопротивление при продаже; неограниченный верхний чек при больших успехах.',
    risks: 'Сложность точного аудита и прозрачного подсчета финансового эффекта у клиента.',
    aiValidation: [
      'Создать прозрачную методику замера точки «До» и «После»',
      'Зафиксировать юридический юридический договор автоматического безакцептного списания'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Сэкономлено на закупках сырья за месяц:</span>
            <span class="control-value" id="success-saved">1 200 000 ₸</span>
          </div>
          <input type="range" class="custom-slider" min="100000" max="5000000" step="50000" value="1200000" id="success-slider" oninput="updateSuccessCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Наша ставка Success Fee:</span> <span>10% от экономии</span></div>
          <div class="receipt-row total"><span>Ваш чистый профит:</span> <span id="success-client-profit">1 080 000 ₸</span></div>
          <div class="receipt-row" style="color:#ffd166;"><span>Комиссия сервиса:</span> <strong id="success-fee-amount">120 000 ₸</strong></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Комиссия от профита перечислена!')">
          ⚡ Оплатить 10% от сэкономленного
        </button>
      </div>
    `
  },
  {
    id: 'isa',
    num: '13',
    category: 'b2b',
    title: 'Income Share Agreement (ISA)',
    icon: '🎓',
    subtitle: 'Обучение/сервис бесплатно, платите процент от зарплаты только после трудоустройства',
    desc: 'Революция в сфере образования. Снимает любой страх «не найти работу после курсов».',
    formula: 'Выплата = Будущая зарплата выпускника × Фиксированный % (например 15%) в течение N месяцев',
    cases: ['Lambda School', 'Microverse', 'Яндекс Практикум ISA'],
    pros: 'Огромный поток заявок на вход, идеальное выравнивание интересов школы и студента.',
    risks: 'Кассовый разрыв (деньги придут через 6-12 месяцев); риск невыплат от недобросовестных выпускников.',
    aiValidation: [
      'Оценить реальную конверсию трудоустройства ваших выпускников',
      'Продумать юридические механизмы скоринга и проверки доходов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Ваша будущая зарплата после обучения:</span>
            <span class="control-value" id="isa-salary">600 000 ₸ / мес</span>
          </div>
          <input type="range" class="custom-slider" min="200000" max="1500000" step="50000" value="600000" id="isa-slider" oninput="updateIsaCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Первоначальный взнос:</span> <span style="color:#00f5d4;">0 ₸ (БЕСПЛАТНО)</span></div>
          <div class="receipt-row"><span>Процент по ISA (12 месяцев):</span> <span>15% от дохода</span></div>
          <div class="receipt-row total"><span>Ежемесячный взнос после оффера:</span> <span id="isa-monthly">90 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Договор ISA успешно подписан!')">
          ⚡ Подписать договор ISA (0 ₸ сейчас)
        </button>
      </div>
    `
  },
  {
    id: 'marketplace-fee',
    num: '14',
    category: 'b2b',
    title: 'Комиссия маркетплейса',
    icon: '🏪',
    subtitle: 'Платформа сводит покупателя и продавца, удерживая % с каждой транзакции',
    desc: 'Классическая модель двухсторонних платформ. Растёт экспоненциально вместе с GMV.',
    formula: 'Доход = Общий оборот продаж (GMV) × Процент комиссии (Take Rate)',
    cases: ['Kaspi.kz', 'Wildberries', 'Airbnb', 'App Store (30%)'],
    pros: 'Огромный масштабируемый потенциал без владения собственными запасами товаров.',
    risks: 'Проблема «Курицы и яйца» на старте (кого привлекать первыми: продавцов или покупателей?).',
    aiValidation: [
      'Рассчитать оптимальный Take Rate, при котором продавцы не уходят в офлайн',
      'Продумать защиты от проведения сделок в обход платформы'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Объем суммы сделки продавца:</span>
            <span class="control-value" id="mp-amount">150 000 ₸</span>
          </div>
          <input type="range" class="custom-slider" min="10000" max="1000000" step="10000" value="150000" id="mp-slider" oninput="updateMpCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Комиссия платформы (Take Rate 12%):</span> <strong style="color:#ffd166;" id="mp-fee">18 000 ₸</strong></div>
          <div class="receipt-row total"><span>Продавец получает на руки:</span> <span id="mp-seller">132 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Транзакция проверена и комиссия удержана!')">
          ⚡ Провести сделку через маркетплейс
        </button>
      </div>
    `
  },
  {
    id: 'setup-arr',
    num: '15',
    category: 'b2b',
    title: 'Setup Fee + Подписка',
    icon: '🛠️',
    subtitle: 'Разовый дорогой платёж за внедрение и настройку софта + регулярная абонентка',
    desc: 'Стандарт для B2B Enterprise софта. Внедрение окупает трудозатраты инженеров.',
    formula: 'Первоначальный чек = Setup Fee (Внедрение) + Первый месяц подписки',
    cases: ['SAP', 'R-Keeper', '1С Enterprise', 'Сложные CRM'],
    pros: 'Высокий разовый чек покрывает CAC; клиент "привязывается" и не уходит из-за вложений.',
    risks: 'Длинный цикл сделки (3-6 месяцев); барьер высокого входа для малого бизнеса.',
    aiValidation: [
      'Рассчитать реальную трудоемкость интеграции 1 клиента в человеко-часах',
      'Проверить возможность стандартизации процесса внедрения'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Разовое внедрение и настройка сервера (Setup Fee):</span> <span>250 000 ₸</span></div>
          <div class="receipt-row"><span>Ежемесячная лицензия (ARR):</span> <span>25 000 ₸ / мес</span></div>
          <div class="receipt-row total"><span>Первый платежный чек:</span> <span>275 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Договор внедрения заключен!')">
          ⚡ Заказать проект внедрения
        </button>
      </div>
    `
  },
  {
    id: 'b2b2c',
    num: '16',
    category: 'b2b',
    title: 'B2B2C (Корпоративная оплата)',
    icon: '🏢',
    subtitle: 'Платит головной офис или работодатель (B2B), а пользуются конечные сотрудники (C)',
    desc: 'Позволяет получить тысячи конечных пользователей через подписание всего одного контракта с HR или CEO.',
    formula: 'Выручка = Корпоративный контракт × Количество филиалов/сотрудников',
    cases: ['Gympass', 'Страховые ДМС', 'Корпоративный English (Skyeng)', 'WeDrink HQ'],
    pros: 'Огромный объём пользователей при минимальных затратах на отдел продаж.',
    risks: 'Зависимость от одного крупного контракта; риск ухода ключевого клиента.',
    aiValidation: [
      'Сформулировать ценность для HR/CEO (повышение продуктивности/лояльности)',
      'Продумать метрики вовлеченности сотрудников для пролонгации контракта'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Заказчик:</span> <span>Головной офис WeDrink (450 точек)</span></div>
          <div class="receipt-row"><span>Стоимость за 1 точку:</span> <span>4 900 ₸ / мес</span></div>
          <div class="receipt-row total"><span>Сумма единого госконтракта:</span> <span style="color:#00f5d4;">2 205 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Корпоративный контракт активирован!')">
          ⚡ Подписать B2B2C контракт на всю сеть
        </button>
      </div>
    `
  },
  {
    id: 'white-label',
    num: '17',
    category: 'b2b',
    title: 'White Label (Лицензирование)',
    icon: '🏷️',
    subtitle: 'Продажа готового софта другим компаниям под их собственным брендом и логотипом',
    desc: 'Клиенты запускают свой сервис за 1 день, а вы получаете регулярные лицензионные отчисления.',
    formula: 'Доход = Паушальный взнос + Ежемесячные роялти за поддержку',
    cases: ['White Label банковские карты', 'Конструкторы приложений', 'Франшизы софта'],
    pros: 'Клиент сам занимается маркетингом и продажами, вы продаете чисто технологическое ядро.',
    risks: 'Размытие прямого контакта с конечным пользователем; требования к отказоустойчивости.',
    aiValidation: [
      'Создать гибкую систему кастомизации брендинга (White Label Panel)',
      'Определить уровень SLA и технической поддержки партнёров'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Лицензия White Label (Ваш бренд и домен):</span> <span>500 000 ₸</span></div>
          <div class="receipt-row"><span>Ежемесячная техподдержка сервера:</span> <span>50 000 ₸ / мес</span></div>
          <div class="receipt-row total"><span>Итого за запуск своего софта:</span> <span>550 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('White Label лицензия сгенерирована!')">
          ⚡ Запустить сервис под своим брендом
        </button>
      </div>
    `
  },

  // CATEGORY 4: ALTERNATIVE & GROWTH
  {
    id: 'hidden-revenue',
    num: '18',
    category: 'alt',
    title: 'Скрытые доходы (Ads / Hidden Revenue)',
    icon: '👁️',
    subtitle: 'Пользователь не платит за продукт ничего. За него платят рекламодатели или спонсоры',
    desc: 'Фундаментальная модель гигантов интернета. Требует многомиллионной аудитории.',
    formula: 'Доход = Количество показов (CPM) / Кликов (CPC) × Ставка рекламодателя',
    cases: ['Google Search', 'Facebook / Meta', 'TikTok', 'Бесплатные мобильные игры'],
    pros: 'Абсолютно взрывной рос пользователей из-за отсутствия какого-либо чека.',
    risks: 'Конфликт интересов: ухудшение UX пользователей из-за навязчивой рекламы.',
    aiValidation: [
      'Оценить необходимый объем DAU/MAU для выхода на окупаемость',
      'Проверить рекламную емкость интерфейса (сколько баннеров выдержит пользователь)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Ежемесячный трафик приложения:</span>
            <span class="control-value" id="ads-views">250 000 просмотров</span>
          </div>
          <input type="range" class="custom-slider" min="10000" max="1000000" step="10000" value="250000" id="ads-slider" oninput="updateAdsCalc(this.value)">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Средний eCPM (Цена за 1000 показов):</span> <span>1 800 ₸</span></div>
          <div class="receipt-row total"><span>Выручка от рекламодателей:</span> <span id="ads-total" style="color:#00f5d4;">450 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Рекламная выплата зачислена!')">
          ⚡ Симулировать выплатную рекламную сессию
        </button>
      </div>
    `
  },
  {
    id: 'data-monetization',
    num: '19',
    category: 'alt',
    title: 'Продажа данных и Аналитики',
    icon: '📊',
    subtitle: 'Агрегация и обезличивание данных пользователей для продажи аналитических отчетов B2B',
    desc: 'Превращает сырые пользовательские действия в ценнейшую аналитику рыночных трендов.',
    formula: 'Доход = Продажи подписок на аналитические отчеты / API данных B2B клиентам',
    cases: ['2GIS Analytics', 'Foursquare Data', 'Nielsen', 'Financial Terminal Data'],
    pros: 'Пассивный высокомаржинальный доход поверх основного действующего сервиса.',
    risks: 'Строгие требования GDPR / Законов о персональных данных; риск репутационных потерь.',
    aiValidation: [
      'Убедиться в 100% анонимизации и агрегации пользовательских данных',
      'Определить B2B-покупателей, готовых платить за исследования этого рынка'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>База данных:</span> <span>Обезличенная аналитика чеков 500 кофеен</span></div>
          <div class="receipt-row"><span>Покупатель:</span> <span>Инвестиционный фонд / Поставщик молочной продукции</span></div>
          <div class="receipt-row total"><span>Стоимость квартального отчета:</span> <span style="color:#ffd166;">850 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Аналитический отчет успешно продан!')">
          ⚡ Выгрузить B2B аналитический отчет
        </button>
      </div>
    `
  },
  {
    id: 'app-marketplace',
    num: '20',
    category: 'alt',
    title: 'Магазин дополнений (App Marketplace)',
    icon: '🧩',
    subtitle: 'Платформа предоставляет ядро, а сторонние разработчики создают плагины и платят %',
    desc: 'Превращает ваш продукт в нерушимую экосистему, которую невозможно сместить с рынка.',
    formula: 'Доход = Продажи сторонних плагинов × Доля платформы (30%)',
    cases: ['Shopify App Store', 'WordPress Plugins', 'Salesforce AppExchange', 'Chrome Web Store'],
    pros: 'Внешние разработчики сами расширяют ваш софт бесплатно для вас.',
    risks: 'Требуется создание открытых API, документации и привлечение комьюнити девелоперов.',
    aiValidation: [
      'Разработать безопасный API и SDK для внешних разработчиков',
      'Продумать систему модерации и распределения доходов 70/30'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Продажи плагина "Telegram-Бот Заказов" (100 скачиваний):</span> <span>500 000 ₸</span></div>
          <div class="receipt-row"><span>Комиссия нашей платформы (30%):</span> <strong style="color:#00f5d4;">150 000 ₸</strong></div>
          <div class="receipt-row total"><span>Выплата разработчику плагина:</span> <span>350 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Продажа плагина проведена!')">
          ⚡ Симулировать покупку плагина в App Store
        </button>
      </div>
    `
  },
  {
    id: 'sponsorship',
    num: '21',
    category: 'alt',
    title: 'Спонсорство и Брендинг',
    icon: '🎗️',
    subtitle: 'Крупный бренд полностью субсидирует сервис взамен на эксклюзивную интеграцию',
    desc: 'Подходит для нишевых медиа, хакатонов, полезных бесплатных утилит для профи.',
    formula: 'Доход = Генеральный спонсорский контракт на фиксированный срок',
    cases: ['Хакатоны (Powered by RedBull)', 'Спецпроекты VC.ru', 'Бесплатные Wi-Fi сети'],
    pros: 'Крупные чеки сразу; пользователю не нужно платить из своего кармана.',
    risks: 'Сложность поиска спонсоров; зависимость от маркетинговых бюджетов партнеров.',
    aiValidation: [
      'Сформулировать охваты и точность попадания в целевую аудиторию спонсора',
      'Создать медиакит с метриками вовлечения'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Спонсор:</span> <span>Бренд напитков / Платежная система</span></div>
          <div class="receipt-row"><span>Формат:</span> <span>Эксклюзивный логотип + Интеграция в Push</span></div>
          <div class="receipt-row total"><span>Спонсорский пакет (Квартал):</span> <span>1 500 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Спонсорский контракт подписан!')">
          ⚡ Активировать спонсорский пакет
        </button>
      </div>
    `
  },
  {
    id: 'pay-what-you-want',
    num: '22',
    category: 'alt',
    title: 'Pay What You Want (Donation)',
    icon: '🎁',
    subtitle: 'Пользователь сам выбирает платить ли ему вообще и какую сумму пожертвовать',
    desc: 'Работает на сильной эмоциональной связи, краудфандинге и благодарности за полезность.',
    formula: 'Доход = Количество пользователей × Средний чек доната (Tip)',
    cases: ['Wikipedia', 'Radiohead (Альбом In Rainbows)', 'Humble Bundle', 'Buy Me a Coffee'],
    pros: 'Высочайшая лояльность сообщества; полное отсутствие юридического барьера покупки.',
    risks: 'Нестабильность доходов; большая часть пользователей выбирает платить 0.',
    aiValidation: [
      'Настроить триггерные экраны благодарности с рекомендуемыми пресетами (500 ₸, 2000 ₸)',
      'Проверить эффект социализации (публичное упоминание щедрых донатеров)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="control-group">
          <div class="control-label">
            <span>Выберите сумму доната/благодарности:</span>
            <span class="control-value" id="pwyw-custom-val">2 000 ₸</span>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <button class="model-pill" onclick="setPwywVal(500)">500 ₸ ☕</button>
            <button class="model-pill active" onclick="setPwywVal(2000)">2 000 ₸ 🍕</button>
            <button class="model-pill" onclick="setPwywVal(5000)">5 000 ₸ 🚀</button>
          </div>
        </div>

        <button class="sim-action-btn" style="background: linear-gradient(135deg, #00f5d4, #00bb9b); color: #000;" onclick="triggerSimPayment('Огромное спасибо за поддержку проекта! ❤️')">
          ❤️ Отправить донат (<span id="pwyw-btn-val">2 000 ₸</span>)
        </button>
      </div>
    `
  }
];

// App Navigation & Rendering Engine
function initApp() {
  renderCategoryTabs();
  renderModelPills();
  loadModel('subscription');
}

function renderCategoryTabs() {
  const container = document.getElementById('category-bar');
  const categories = [
    { id: 'all', label: '⚡ Все 22 модели' },
    { id: 'sub', label: '💳 Подписки и Доступ' },
    { id: 'usage', label: '⚡ Объём и Usage' },
    { id: 'b2b', label: '🤝 Результат & B2B' },
    { id: 'alt', label: '🎁 Альтернативные' }
  ];

  container.innerHTML = categories.map(c => `
    <button class="category-tab ${c.id === currentCategory ? 'active' : ''}" onclick="filterCategory('${c.id}')">
      ${c.label}
    </button>
  `).join('');
}

function filterCategory(catId) {
  playClick();
  currentCategory = catId;
  renderCategoryTabs();
  renderModelPills();
}

function renderModelPills() {
  const container = document.getElementById('models-scroll-bar');
  const filtered = currentCategory === 'all' 
    ? modelsData 
    : modelsData.filter(m => m.category === currentCategory);

  container.innerHTML = filtered.map(m => `
    <button class="model-pill ${m.id === currentModelId ? 'active' : ''}" onclick="loadModel('${m.id}')">
      <span class="model-number">${m.num}</span>
      <span>${m.icon} ${m.title.split('(')[0]}</span>
    </button>
  `).join('');
}

function loadModel(modelId) {
  playClick();
  currentModelId = modelId;
  const model = modelsData.find(m => m.id === modelId);
  if (!model) return;

  renderModelPills();

  // Render Left Panel: Visual Stage
  const stageHeader = document.getElementById('stage-header');
  stageHeader.innerHTML = `
    <div class="model-title-wrap">
      <div class="model-icon-box">${model.icon}</div>
      <div>
        <h2 class="model-title">#${model.num} — ${model.title}</h2>
        <p class="model-subtitle">${model.subtitle}</p>
      </div>
    </div>
  `;

  const stageBody = document.getElementById('stage-body');
  stageBody.innerHTML = model.renderWidget();

  // Render Right Panel: Sidebar Information
  const sidebarTitle = document.getElementById('sidebar-title');
  sidebarTitle.innerHTML = `<span>💡</span> Разбор: ${model.title.split('(')[0]}`;

  const sidebarBody = document.getElementById('sidebar-body');
  sidebarBody.innerHTML = `
    <div class="info-card-block">
      <div class="info-block-title">📌 Суть и принцип работы</div>
      <p class="info-block-text">${model.desc}</p>
    </div>

    <div class="info-card-block">
      <div class="info-block-title">📐 Формула Unit-экономики</div>
      <div class="formula-box">${model.formula}</div>
    </div>

    <div class="info-card-block">
      <div class="info-block-title">🏢 Где применяется в мире</div>
      <div class="example-tags-wrap">
        ${model.cases.map(c => `<span class="example-tag">${c}</span>`).join('')}
      </div>
    </div>

    <div class="info-card-block">
      <div class="info-block-title" style="color: #00f5d4;">👍 Главный плюс</div>
      <p class="info-block-text" style="color: #e2e8f0;">${model.pros}</p>
    </div>

    <div class="info-card-block">
      <div class="info-block-title" style="color: #ff6b6b;">⚠️ Ключевой риск</div>
      <p class="info-block-text" style="color: #cbd5e1;">${model.risks}</p>
    </div>

    <div class="ai-validation-box">
      <div class="ai-validation-title">⚡ AI-проверка гипотез</div>
      <ul class="ai-validation-list">
        ${model.aiValidation.map(v => `<li>${v}</li>`).join('')}
      </ul>
    </div>
  `;
}

// Widget Interactions & Calculations
function selectSubTier(type) {
  playClick();
  const planName = document.getElementById('sub-plan-name');
  const totalPrice = document.getElementById('sub-total-price');
  
  if (type === 'annual') {
    planName.textContent = 'Годовая подписка (-20%)';
    totalPrice.textContent = '95 880 ₸';
  } else {
    planName.textContent = 'Ежемесячная подписка';
    totalPrice.textContent = '9 990 ₸';
  }
}

function toggleFreemiumPro() {
  playChime(659.25, 0.3);
  const tag = document.getElementById('freemium-status-tag');
  const feature = document.getElementById('pro-feature-row');
  const btn = document.getElementById('freemium-btn');

  if (tag.textContent === 'FREE PLAN') {
    tag.textContent = 'PRO ACTIVE 🔥';
    tag.style.color = '#00f5d4';
    feature.style.opacity = '1';
    feature.querySelector('span:last-child').textContent = '✓ Разблокировано';
    feature.querySelector('span:last-child').style.color = '#00f5d4';
    btn.textContent = '✓ Настройки подписки PRO';
    showToast('🎉 Все PRO-функции разблокированы!');
  } else {
    tag.textContent = 'FREE PLAN';
    tag.style.color = '#94a3b8';
    feature.style.opacity = '0.5';
    feature.querySelector('span:last-child').textContent = 'Только в PRO';
    feature.querySelector('span:last-child').style.color = '#ffd166';
    btn.textContent = '⚡ Разблокировать PRO-фичи (14 990 ₸/мес)';
  }
}

function updateSeatCalc(val) {
  playClick();
  document.getElementById('seat-count-display').textContent = `${val} мест`;
  const rate = 3500;
  let discount = 0;
  if (val > 10) discount = 0.15; // 15% discount for 10+ seats
  
  const total = val * rate * (1 - discount);
  document.getElementById('seat-discount').textContent = `${discount * 100}%`;
  document.getElementById('seat-total').textContent = `${total.toLocaleString()} ₸`;
}

function updatePpuCalc(val) {
  document.getElementById('ppu-count').textContent = `${parseInt(val).toLocaleString()} запросов`;
  const total = (val / 1000) * 120;
  document.getElementById('ppu-total').textContent = `${Math.round(total).toLocaleString()} ₸`;
}

function selectCreditBundle(tokens, price) {
  playClick();
  document.getElementById('credit-balance').textContent = `${tokens} Токенов`;
}

function updateRentalCalc(val) {
  document.getElementById('rental-hours').textContent = `${val} часа`;
  const total = val * 1500;
  document.getElementById('rental-total').textContent = `${total.toLocaleString()} ₸`;
}

function updateSuccessCalc(val) {
  document.getElementById('success-saved').textContent = `${parseInt(val).toLocaleString()} ₸`;
  const fee = val * 0.10;
  const clientProfit = val - fee;
  
  document.getElementById('success-fee-amount').textContent = `${Math.round(fee).toLocaleString()} ₸`;
  document.getElementById('success-client-profit').textContent = `${Math.round(clientProfit).toLocaleString()} ₸`;
}

function updateIsaCalc(val) {
  document.getElementById('isa-salary').textContent = `${parseInt(val).toLocaleString()} ₸ / мес`;
  const monthly = val * 0.15;
  document.getElementById('isa-monthly').textContent = `${Math.round(monthly).toLocaleString()} ₸`;
}

function updateMpCalc(val) {
  document.getElementById('mp-amount').textContent = `${parseInt(val).toLocaleString()} ₸`;
  const fee = val * 0.12;
  const seller = val - fee;
  
  document.getElementById('mp-fee').textContent = `${Math.round(fee).toLocaleString()} ₸`;
  document.getElementById('mp-seller').textContent = `${Math.round(seller).toLocaleString()} ₸`;
}

function updateAdsCalc(val) {
  document.getElementById('ads-views').textContent = `${parseInt(val).toLocaleString()} просмотров`;
  const total = (val / 1000) * 1800;
  document.getElementById('ads-total').textContent = `${Math.round(total).toLocaleString()} ₸`;
}

function setPwywVal(val) {
  playClick();
  document.getElementById('pwyw-custom-val').textContent = `${val.toLocaleString()} ₸`;
  document.getElementById('pwyw-btn-val').textContent = `${val.toLocaleString()} ₸`;
}

function triggerSimPayment(msg) {
  playChime(880, 0.35); // A5 chime
  showToast(`✅ ${msg}`);
}

function showToast(msg) {
  const existing = document.querySelector('.sim-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'sim-toast';
  toast.innerHTML = msg;
  document.querySelector('.main-stage').appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle');
  btn.textContent = soundEnabled ? '🔊 Звук: Вкл' : '🔇 Звук: Выкл';
  if (soundEnabled) playChime();
}

// Global Initialization
window.addEventListener('DOMContentLoaded', initApp);
