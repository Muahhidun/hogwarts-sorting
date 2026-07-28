/* ==========================================
   MONETIZATION MATRIX 22 - MARKETING-DRIVEN B2B/B2C LOGIC
   ========================================== */

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

function playChime(freq = 587.33, duration = 0.2) {
  if (!soundEnabled) return;
  initAudio();
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
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
    osc.frequency.setValueAtTime(350, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch (e) {}
}

let currentCategory = 'all';
let currentModelId = 'subscription';

// Active state values for widgets
let subSelectedPeriod = 'year';
let seatPackageCount = 10;
let teamMembers = ['alex@acme.com', 'sarah@acme.com', 'dev.lead@acme.com'];
let overusageFlexAllowed = true;

const modelsData = [
  // 01: SUBSCRIPTION
  {
    id: 'subscription',
    num: '01',
    category: 'sub',
    title: 'Subscription (Рекуррентная подписка)',
    icon: '🔁',
    subtitle: 'Маркетинговая линейка периодов подписки (от года к неделе)',
    desc: 'Классическая подписка с агрессивной маркетинговой упаковкой. Карточки расположены СЛЕВА НАПРАВО — от самого выгодного годового плана (с минимальной пересчитанной ценой в месяц) до короткой недельной пробной подписки.',
    formula: 'ARR = Годовой чек + Рекуррентные продления. (LTV = ARPU / Churn)',
    cases: ['Netflix', 'Spotify', 'ChatGPT Plus', 'Duolingo', 'WeDrink POS'],
    pros: 'Высокая конверсия в годовые подписки за счет контраста цен; стабильный предсказуемый MRR/ARR.',
    risks: 'Клиенты могут отменять подписку после завершения первого периода, если не почувствуют постоянную ценность.',
    aiValidation: [
      'Проверить конверсию из пробной недели в полноценную месячную/годовую подписку',
      'Оценить уровень оттока (Churn Rate) по каждому периоду отдельно',
      'Настроить авто-напоминания о продлении для снижения Involuntary Churn'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Выберите идеальный план подписки</div>
            <div class="marketing-hero-sub">Получите неограниченный доступ ко всем возможностям платформы</div>
          </div>
          <div class="marketing-savings-badge">🔥 Сэкономьте до 48 000 ₸ при оплате за год</div>
        </div>

        <div class="marketing-cards-grid">
          <!-- 1. ГОД (Слева - самый выгодный) -->
          <div class="marketing-plan-card featured ${subSelectedPeriod === 'year' ? 'active' : ''}" onclick="selectSubPeriod('year')">
            <div class="marketing-card-badge gold">САМЫЙ ВЫГОДНЫЙ 🔥</div>
            <div class="plan-card-period">1 Год (12 мес)</div>
            <div class="plan-card-display-price">6 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Списывается 72 000 ₸ разово за 12 месяцев</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 48 000 ₸</li>
              <li>✓ Все PRO-модули</li>
              <li>✓ VIP поддержка 24/7</li>
            </ul>
          </div>

          <!-- 2. ПОЛГОДА -->
          <div class="marketing-plan-card ${subSelectedPeriod === 'half' ? 'active' : ''}" onclick="selectSubPeriod('half')">
            <div class="marketing-card-badge">Скидка -30%</div>
            <div class="plan-card-period">6 Месяцев</div>
            <div class="plan-card-display-price">7 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Списывается 42 000 ₸ за 6 месяцев</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 18 000 ₸</li>
              <li>✓ Все PRO-модули</li>
            </ul>
          </div>

          <!-- 3. 3 МЕСЯЦА -->
          <div class="marketing-plan-card ${subSelectedPeriod === 'quarter' ? 'active' : ''}" onclick="selectSubPeriod('quarter')">
            <div class="plan-card-period">3 Месяца</div>
            <div class="plan-card-display-price">9 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Списывается 27 000 ₸ за 3 месяца</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 3 000 ₸</li>
              <li>✓ Базовые модули</li>
            </ul>
          </div>

          <!-- 4. 1 МЕСЯЦ -->
          <div class="marketing-plan-card ${subSelectedPeriod === 'month' ? 'active' : ''}" onclick="selectSubPeriod('month')">
            <div class="plan-card-period">1 Месяц</div>
            <div class="plan-card-display-price">10 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Стандартная гибкая подписка</div>
            <ul class="plan-card-features">
              <li>✓ Без обязательств</li>
              <li>✓ Отмена в любой момент</li>
            </ul>
          </div>

          <!-- 5. 1 НЕДЕЛЯ (Тест-драйв) -->
          <div class="marketing-plan-card ${subSelectedPeriod === 'week' ? 'active' : ''}" onclick="selectSubPeriod('week')">
            <div class="plan-card-period">1 Неделя (Тест)</div>
            <div class="plan-card-display-price">8 000 ₸ <span>/ нед</span></div>
            <div class="plan-card-small-print">70% стоимости месяца — идеальный тест-драйв</div>
            <ul class="plan-card-features">
              <li>✓ Полный тест на 7 дней</li>
              <li>✓ Быстрый старт</li>
            </ul>
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-title">Спецификация платежа</div>
          <div class="receipt-row"><span>Выбранный период:</span> <strong id="sub-period-title">1 Год (72 000 ₸)</strong></div>
          <div class="receipt-row"><span>Эквивалент стоимости в месяц:</span> <strong style="color:var(--secondary-accent);" id="sub-monthly-eq">6 000 ₸ / мес</strong></div>
          <div class="receipt-row total"><span>Итого к оплате сейчас:</span> <span id="sub-total-charge">72 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Подписка успешно оформлена!')">
          ⚡ Оформить подписку с гарантией возврата 14 дней
        </button>
      </div>
    `
  },

  // 02: FREEMIUM
  {
    id: 'freemium',
    num: '02',
    category: 'sub',
    title: 'Freemium (Бесплатный вход + PRO)',
    icon: '🔓',
    subtitle: 'Маркетинговая воронка: продукт бесплатен, пока не упретесь в лимиты',
    desc: 'Бесплатный тариф привлекает огромный поток клиентов без барьера входа. Как только пользователь активно начинает работать с софтом, он упирается в продуктовые лимиты (Gate Limits) и совершает апгрейд до PRO.',
    formula: 'Конверсия PLG = Платные пользователи PRO / Общая база бесплатников (Обычно 2-5%)',
    cases: ['Figma', 'Slack', 'Zoom', 'Notion', 'Dropbox'],
    pros: 'Виральный охват, отсутствие затрат на первичную рекламу, высокая конверсия теплых пользователей.',
    risks: 'Если бесплатный тариф слишком щедрый — пользователи никогда не перейдут на платный.',
    aiValidation: [
      'Определить точные лимиты бесплатной версии (например 3 проекта, 1000 токенов)',
      'Протестировать триггерную рассылку при достижении 80% бесплатного лимита'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner" style="border-color:var(--amber-accent);">
          <div>
            <div class="marketing-hero-title">Вы используете план: FREE WORKSPACE</div>
            <div class="marketing-hero-sub">Базовые функции бесплатны навсегда. Для снятия лимитов перейдите на PRO.</div>
          </div>
          <div class="marketing-savings-badge" style="background:rgba(245,158,11,0.15); color:var(--amber-accent); border-color:var(--amber-accent);">
            ⚠️ Лимит исчерпан на 95%
          </div>
        </div>

        <div style="background:#141c2b; border:1px solid var(--panel-border); padding:1rem; border-radius:10px; display:flex; flex-direction:column; gap:0.75rem;">
          <div class="control-label">
            <span>Использовано бесплатных проектов:</span>
            <span style="color:var(--amber-accent);">3 из 3 проектов (100%)</span>
          </div>
          <div style="background:#334155; height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:var(--amber-accent); width:100%; height:100%;"></div>
          </div>

          <div class="control-label" style="margin-top:0.5rem;">
            <span>Использовано AI-токенов анализа:</span>
            <span style="color:var(--primary-accent);">950 из 1 000 токенов (95%)</span>
          </div>
          <div style="background:#334155; height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:var(--primary-accent); width:95%; height:100%;"></div>
          </div>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Возможности</th>
              <th>FREE Plan</th>
              <th>PRO Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Количество проектов</td>
              <td>До 3 проектов</td>
              <td><strong style="color:var(--secondary-accent);">Безлимитно</strong></td>
            </tr>
            <tr>
              <td>Глубина аналитики</td>
              <td>7 дней</td>
              <td><strong style="color:var(--secondary-accent);">365 дней + AI Прогноз</strong></td>
            </tr>
            <tr>
              <td>Экспорт отчетов</td>
              <td>Только PDF</td>
              <td><strong style="color:var(--secondary-accent);">Excel, CSV, API</strong></td>
            </tr>
          </tbody>
        </table>

        <button class="sim-action-btn" style="background:linear-gradient(135deg, var(--secondary-accent), #059669); color:#000;" onclick="triggerSimPayment('PRO доступ успешно активирован на 7 дней бесплатно!')">
          ⚡ Снять все ограничения — Попробовать PRO за 0 ₸ (7 дней бесплатно)
        </button>
      </div>
    `
  },

  // 03: PER SEAT
  {
    id: 'per-seat',
    num: '03',
    category: 'sub',
    title: 'Per Seat (Оплата за сотрудников)',
    icon: '👥',
    subtitle: 'Маркетинговые оптовые пакеты мест (от крупных к мелким)',
    desc: 'Оплата за каждого сотрудника. Маркетинг выстроен на оптовых скидках: покупать пакет из 10 или 25 мест выгоднее в пересчете на 1 сотрудника, что стимулирует компании сразу брать крупные пакеты.',
    formula: 'Итоговый чек = Пакет мест × Оптовая цена за 1 место',
    cases: ['Google Workspace', 'Slack', 'Jira', 'HubSpot', 'Zoom Business'],
    pros: 'Автоматический рост чека вместе с расширением штата клиента (Land & Expand).',
    risks: 'Клиенты передают логины друг другу, чтобы не покупать новые места.',
    aiValidation: [
      'Определить оптимальный размер оптовых пакетов (5, 10, 25, 50 мест)',
      'Настроить авто-прорейт при добавлении сотрудников в середине месяца'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Оптовые пакеты рабочих мест для команд</div>
            <div class="marketing-hero-sub">Чем больше команда — тем ниже цена за 1 сотрудника!</div>
          </div>
        </div>

        <div class="marketing-cards-grid">
          <!-- 25 мест (Слева - самый выгодный) -->
          <div class="marketing-plan-card featured ${seatPackageCount === 25 ? 'active' : ''}" onclick="selectSeatPkg(25, 7)">
            <div class="marketing-card-badge gold">ОПТ -53% 🔥</div>
            <div class="plan-card-period">Пакет 25 Мест</div>
            <div class="plan-card-display-price">$7 <span>/ место / мес</span></div>
            <div class="plan-card-small-print">Эквивалент ~$175 / мес за всю компанию</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 53% на сотрудника</li>
              <li>✓ Admin Security Log</li>
            </ul>
          </div>

          <!-- 10 мест -->
          <div class="marketing-plan-card ${seatPackageCount === 10 ? 'active' : ''}" onclick="selectSeatPkg(10, 9)">
            <div class="marketing-card-badge">Экономия 40%</div>
            <div class="plan-card-period">Пакет 10 Мест</div>
            <div class="plan-card-display-price">$9 <span>/ место / мес</span></div>
            <div class="plan-card-small-print">Эквивалент ~$90 / мес за компанию</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 40% на сотрудника</li>
              <li>✓ Централизованный счет</li>
            </ul>
          </div>

          <!-- 5 мест -->
          <div class="marketing-plan-card ${seatPackageCount === 5 ? 'active' : ''}" onclick="selectSeatPkg(5, 12)">
            <div class="plan-card-period">Пакет 5 Мест</div>
            <div class="plan-card-display-price">$12 <span>/ место / мес</span></div>
            <div class="plan-card-small-print">Эквивалент ~$60 / мес за команду</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 20%</li>
              <li>✓ Общий воркспейс</li>
            </ul>
          </div>

          <!-- 1 место -->
          <div class="marketing-plan-card ${seatPackageCount === 1 ? 'active' : ''}" onclick="selectSeatPkg(1, 15)">
            <div class="plan-card-period">1 Место</div>
            <div class="plan-card-display-price">$15 <span>/ место / мес</span></div>
            <div class="plan-card-small-print">Стандартная цена за 1 юзера</div>
            <ul class="plan-card-features">
              <li>✓ Персональная лицензия</li>
            </ul>
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-title">Расчет стоимости пакета</div>
          <div class="receipt-row"><span>Выбранный пакет:</span> <strong id="seat-pkg-title">Пакет 10 Мест ($9 / место)</strong></div>
          <div class="receipt-row total"><span>Общий ежемесячный чек:</span> <span id="seat-pkg-total-usd">$90 / мес (~40 500 ₸)</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Командный пакет рабочих мест оформлен!')">
          ⚡ Оформить пакет мест для компании
        </button>
      </div>
    `
  },

  // 04: PAY-PER-USE / METERED
  {
    id: 'pay-per-use',
    num: '04',
    category: 'usage',
    title: 'Pay-Per-Use (Оплата по факту + Overusage Flex)',
    icon: '⚡',
    subtitle: 'Оплата за фактическое потребление с опцией автоматического перерасхода',
    desc: 'Клиент заказывает базовый лимит потребления, но может включить галочку Flex Bill. При превышении лимита сервис не блокирует работу, а автоматически тарифицирует превышение по факту.',
    formula: 'Итоговый чек = Базовый лимит + (Фактический перерасход × Ставка Overusage)',
    cases: ['Amazon AWS', 'OpenAI API', 'Twilio', 'Stripe'],
    pros: 'Гарантия бесперебойной работы сервиса клиента даже при внезапных пиках трафика.',
    risks: 'Клиент может удивиться обратному чеку при бесконтрольном автоматическом перерасходе.',
    aiValidation: [
      'Внедрить понятный переключатель согласия на Flex Overusage',
      'Настроить алерты при превышении базового лимита на 120% и 150%'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Настройка лимитов и гибкой тарификации (Flex Billing)</span>
          <span style="color:var(--secondary-accent);">Status: Auto-Scale Active</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Базовый лимит запросов в месяц:</span>
            <span class="control-value" id="ppu-req-display">100 000 запросов</span>
          </div>
          <input type="range" class="custom-slider" min="10000" max="1000000" step="10000" value="100000" id="ppu-req-slider" oninput="updatePpuFlexCalc()">
        </div>

        <div style="background:#141c2b; border:1px solid var(--panel-border); padding:0.85rem 1.1rem; border-radius:8px; display:flex; align-items:center; gap:0.75rem;">
          <input type="checkbox" id="flex-allow-check" checked onchange="updatePpuFlexCalc()" style="width:18px; height:18px; cursor:pointer;">
          <div>
            <div style="font-size:0.82rem; font-weight:700; color:#fff;">Разрешить перерасход (Flex Overusage Billing)</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">При превышении лимита не блокировать сервис, а списывать по $0.0015 за дополнительный запрос.</div>
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Базовый план (100 000 запросов):</span> <span>$20.00 (~9 000 ₸)</span></div>
          <div class="receipt-row"><span>Статус лимита:</span> <span id="flex-status-text" style="color:var(--secondary-accent);">☑ Бесперебойный режим (Flex)</span></div>
          <div class="receipt-row total"><span>Фиксированный минимальный чек:</span> <span id="flex-min-total">$20.00 / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Настройки Flex Billing сохранены!')">
          ⚡ Сохранить конфигурацию потребления
        </button>
      </div>
    `
  },

  // 05: RAZOR & BLADE
  {
    id: 'razor-blade',
    num: '05',
    category: 'usage',
    title: 'Razor & Blade (Оборудование за 0 ₸)',
    icon: '🪒',
    subtitle: 'Маркетинговые пакеты расходников (от года к месяцу)',
    desc: 'Главный маркетинг: при подписке на годовой контракт расходных материалов само терминальное оборудование отдается БЕСПЛАТНО (за 0 ₸).',
    formula: 'Прибыль = (Маржа с расходников × Срок подписки) - Субсидия на оборудование',
    cases: ['Nespresso', 'Gillette', 'HP Instant Ink', 'POS-терминалы'],
    pros: 'Нулевой барьер старта для клиентов; постоянная маржа с расходников (>70%).',
    risks: 'Отмена подписки клиентом до того, как окупилась субсидия на железное оборудование.',
    aiValidation: [
      'Зафиксировать минимальный срок подписки на расходники в договоре (12 месяцев)',
      'Проверить маржинальность расходных наборов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">POS-Терминал за 0 ₸ при годовой подписке!</div>
            <div class="marketing-hero-sub">Выберите комплект расходных материалов для вашей кофейни</div>
          </div>
          <div class="marketing-savings-badge">🎁 Терминал за 0 ₸</div>
        </div>

        <div class="marketing-cards-grid">
          <!-- 1 Год (Слева) -->
          <div class="marketing-plan-card featured" onclick="triggerSimPayment('Оформлен годовой комплект! Оборудование 0 ₸')">
            <div class="marketing-card-badge gold">ОБОРУДОВАНИЕ 0 ₸ 🔥</div>
            <div class="plan-card-period">1 Год Комплект</div>
            <div class="plan-card-display-price">14 500 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Терминал в подарок (Экономия 65 000 ₸)</div>
            <ul class="plan-card-features">
              <li>✓ Терминал 15" БЕСПЛАТНО</li>
              <li>✓ Чековая лента 12 мес</li>
            </ul>
          </div>

          <!-- 6 Месяцев -->
          <div class="marketing-plan-card" onclick="triggerSimPayment('Оформлен комплект на 6 месяцев!')">
            <div class="marketing-card-badge">Скидка 50% на POS</div>
            <div class="plan-card-period">6 Месяцев</div>
            <div class="plan-card-display-price">16 500 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Терминал за 32 500 ₸ (Скидка 50%)</div>
            <ul class="plan-card-features">
              <li>✓ Скидка на POS 50%</li>
              <li>✓ Лента на 6 мес</li>
            </ul>
          </div>

          <!-- 1 Месяц -->
          <div class="marketing-plan-card" onclick="triggerSimPayment('Оформлен 1 месяц')">
            <div class="plan-card-period">1 Месяц</div>
            <div class="plan-card-display-price">18 500 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Терминал выкупается за 65 000 ₸</div>
            <ul class="plan-card-features">
              <li>✓ Без обязательств</li>
              <li>✓ Стандартный набор</li>
            </ul>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Заказ оборудования за 0 ₸ оформлен!')">
          ⚡ Заказать POS-терминал за 0 ₸ с комплектом
        </button>
      </div>
    `
  },

  // 06: SUCCESS FEE
  {
    id: 'success-fee',
    num: '06',
    category: 'b2b',
    title: 'Success Fee (Реклама за результат)',
    icon: '🎯',
    subtitle: 'Wolt / Delivery реклама: 0 ₸ за показы, 10% только с реальных покупок',
    desc: 'Маркетинговый офер: Ресторан выставляет рекламные блюда в приложении бесплатно. Просмотры и клики стоят 0 ₸. Комиссия 10% списывается СТРОГО если клиент оформил и оплатил заказ.',
    formula: 'Комиссия = Доставленные и оплаченные заказы × 10% (Просмотры не платящих = 0 ₸)',
    cases: ['Wolt / Choco', 'CPA Рекламные сети', 'Booking.com', 'Uber Eats'],
    pros: 'Рестораны соглашаются мгновенно, так как риски неоплаты рекламы отсутствуют.',
    risks: 'Сложность независимой отслеживаемости факта оплаты заказа.',
    aiValidation: [
      'Показать ресторану прозрачную аналитику «Просмотры -> Купленные заказы»',
      'Зафиксировать автосписание комиссии после подтверждения доставки'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner" style="border-color:var(--secondary-accent);">
          <div>
            <div class="marketing-hero-title">Wolt Ads: Реклама блюд с гарантией продажи</div>
            <div class="marketing-hero-sub">0 ₸ за просмотры и клики. Вы платите 10% комиссии ТОЛЬКО с оплаченных заказов!</div>
          </div>
          <div class="marketing-savings-badge" style="background:rgba(16,185,129,0.15); color:var(--secondary-accent); border-color:var(--secondary-accent);">
            ✓ 0 ₸ Неоплаченные просмотры
          </div>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Продажи блюд по рекламе за месяц:</span>
            <span class="control-value" id="sf-orders-val">120 заказов (600 000 ₸)</span>
          </div>
          <input type="range" class="custom-slider" min="10" max="500" step="10" value="120" id="sf-orders-slider" oninput="updateWoltAdsCalc()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Просмотров рекламы (15 000 человек):</span> <span style="color:var(--secondary-accent);">0 ₸ (БЕСПЛАТНО)</span></div>
          <div class="receipt-row"><span>Выручка ресторана с проданных заказов:</span> <strong>600 000 ₸</strong></div>
          <div class="receipt-row total"><span>Комиссия за результат (10% Success Fee):</span> <span id="sf-wolt-fee" style="color:var(--primary-accent);">60 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Рекламная кампания за результат запущена!')">
          ⚡ Запустить рекламу блюд без риска (0 ₸ за просмотры)
        </button>
      </div>
    `
  },

  // 07: ISA (INCOME SHARE AGREEMENT)
  {
    id: 'isa',
    num: '07',
    category: 'b2b',
    title: 'Income Share Agreement (ISA)',
    icon: '🎓',
    subtitle: '100% бесплатное обучение! Оплата после получения оффера',
    desc: 'Маркетинговый упор: Обучение абсолютно БЕСПЛАТНО на старте (0 ₸). Оплата 15% от зарплаты в течение 12 месяцев включается СТРОГО после трудоустройства с зарплатой от 300 000 ₸.',
    formula: 'Выплата = 0 ₸ во время учебы. Позже: Зарплата × 15% (12 месяцев)',
    cases: ['Lambda School', 'Microverse', 'Яндекс Практикум ISA', 'Make School'],
    pros: 'Невероятный поток абитуриентов; полная уверенность студента в результатах учебы.',
    risks: 'Кассовый разрыв до момента первых трудоустройств студентов.',
    aiValidation: [
      'Выделить крупно зеленым цветом «0 ₸ ВО ВРЕМЯ УЧЕБЫ» на первом экране',
      'Зафиксировать кап (Cap) максимальной суммы выплат'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner" style="border-color:var(--secondary-accent);">
          <div>
            <div class="marketing-hero-title" style="font-size:1.1rem; color:var(--secondary-accent);">🎓 100% БЕСПЛАТНОЕ ОБУЧЕНИЕ IT-ПРОФЕССИЯМ</div>
            <div class="marketing-hero-sub">Учитесь 6 месяцев без взносов. Платите только после того, как устроитесь на работу!</div>
          </div>
          <div style="font-size:1.3rem; font-weight:800; color:var(--secondary-accent);">0 ₸ СЕЙЧАС</div>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Ваша будущая зарплата в IT после оффера:</span>
            <span class="control-value" id="isa-mkt-sal">600 000 ₸ / мес</span>
          </div>
          <input type="range" class="custom-slider" min="300000" max="1500000" step="50000" value="600000" id="isa-mkt-slider" oninput="updateIsaMktCalc()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Взнос при поступлении и во время учебы:</span> <strong style="color:var(--secondary-accent);">0 ₸ (БЕСПЛАТНО)</strong></div>
          <div class="receipt-row"><span>Условие выплат:</span> <span>Только при зарплате > 300 000 ₸ (15% от дохода)</span></div>
          <div class="receipt-row total"><span>Ежемесячный взнос ПОСЛЕ получения оффера:</span> <span id="isa-mkt-pay" style="color:var(--primary-accent);">90 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" style="background:linear-gradient(135deg, var(--secondary-accent), #059669); color:#000;" onclick="triggerSimPayment('Заявка на бесплатное обучение по ISA принята!')">
          ⚡ Поступить бесплатно (0 ₸ первый взнос)
        </button>
      </div>
    `
  },

  // 08: MARKETPLACE FEE
  {
    id: 'marketplace-fee',
    num: '08',
    category: 'b2b',
    title: 'Marketplace Take Rate (Kaspi / WB)',
    icon: '🏪',
    subtitle: 'Доступ к 10 000 000 покупателям Kaspi/WB за 0 ₸ стартовых взносов',
    desc: 'Маркетинговый офер для продавцов: Регистрация и размещение товаров бесплатны. Платформа берет комиссии с продаж (Take Rate 8-12%) + ежемесячный личный кабинет и логистику.',
    formula: 'Доход = (GMV × Take Rate %) + Подписка на кабинет (15 000 ₸) + Логистика',
    cases: ['Kaspi.kz', 'Wildberries', 'Shopify', 'Airbnb'],
    pros: 'Мгновенный вывод продавца на многомиллионную аудиторию покупателей.',
    risks: 'Попытки ухода продавцов в прямые сделки.',
    aiValidation: [
      'Указать детализированный прозрачный расчет всех комиссий продавца',
      'Продемонстрировать объемы трафика покупателей на платформе'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Продавайте на Kaspi / WB: 10 млн покупателей</div>
            <div class="marketing-hero-sub">0 ₸ за регистрацию магазина. Оплата комиссии только с проданных товаров!</div>
          </div>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Статья комиссий продавца</th>
              <th>Условие тарифа</th>
              <th>Сумма с заказа</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Комиссия с продажи товара (Take Rate 10%)</td>
              <td>Списание при успешной покупке</td>
              <td><strong>15 000 ₸</strong> (при чеке 150 000 ₸)</td>
            </tr>
            <tr>
              <td>Обслуживание личного кабинета продавца</td>
              <td>Фиксированная подписка</td>
              <td><strong>15 000 ₸ / мес</strong></td>
            </tr>
            <tr>
              <td>Хранение и логистика склада (FBO)</td>
              <td>За единицу товара</td>
              <td><strong>850 ₸ / заказ</strong></td>
            </tr>
          </tbody>
        </table>

        <button class="sim-action-btn" onclick="triggerSimPayment('Магазин продавца успешно зарегистрирован!')">
          ⚡ Открыть магазин на маркетплейсе (0 ₸ старт)
        </button>
      </div>
    `
  },

  // 12: PREPAID TOKENS
  {
    id: 'prepaid-credits',
    num: '12',
    category: 'usage',
    title: 'Prepaid Tokens (Токены Antigravity / Claude)',
    icon: '🪙',
    subtitle: 'Маркетинговые пакеты токенов (от крупных к мелким)',
    desc: 'Оплата генераций токенами в стиле Claude/Antigravity. Слева расположен самый крупный пакет с максимальной скидкой на 1000 токенов, что монетизирует оптовый закуп.',
    formula: 'Доход = Проданные оптовые пакеты токенов',
    cases: ['Claude API', 'Midjourney', 'Depositphotos', 'Twilio'],
    pros: 'Предоплата на счет сервиса; оптовые скидки стимулируют крупный чек.',
    risks: 'Сложность интуитивного пересчета стоимости токенов в деньги.',
    aiValidation: [
      'Показать пересчитанную стоимость 1000 токенов на каждой карточке',
      'Настроить авто-пополнение при балансе < 50 токенов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Пакеты токенов для генерации AI</div>
            <div class="marketing-hero-sub">Покупайте токены оптом и экономьте до 50% на стоимости генераций!</div>
          </div>
        </div>

        <div class="marketing-cards-grid">
          <!-- 2000 Токенов (Слева - самый выгодный) -->
          <div class="marketing-plan-card featured" onclick="selectTokenPack(2000, 20)">
            <div class="marketing-card-badge gold">САМАЯ ВЫГОДНАЯ ЦЕНА 🔥 -50%</div>
            <div class="plan-card-period">2 000 Токенов</div>
            <div class="plan-card-display-price">$0.01 <span>/ 1k токенов</span></div>
            <div class="plan-card-small-print">Разовый платеж $20 (~9 000 ₸)</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 50%</li>
              <li>✓ Доступ к Claude 3.5</li>
            </ul>
          </div>

          <!-- 1000 Токенов -->
          <div class="marketing-plan-card" onclick="selectTokenPack(1000, 15)">
            <div class="marketing-card-badge">Скидка 25%</div>
            <div class="plan-card-period">1 000 Токенов</div>
            <div class="plan-card-display-price">$0.015 <span>/ 1k токенов</span></div>
            <div class="plan-card-small-print">Разовый платеж $15 (~6 750 ₸)</div>
            <ul class="plan-card-features">
              <li>✓ Экономия 25%</li>
            </ul>
          </div>

          <!-- 500 Токенов -->
          <div class="marketing-plan-card" onclick="selectTokenPack(500, 10)">
            <div class="plan-card-period">500 Токенов</div>
            <div class="plan-card-display-price">$0.02 <span>/ 1k токенов</span></div>
            <div class="plan-card-small-print">Разовый платеж $10 (~4 500 ₸)</div>
          </div>

          <!-- 100 Токенов -->
          <div class="marketing-plan-card" onclick="selectTokenPack(100, 5)">
            <div class="plan-card-period">100 Токенов</div>
            <div class="plan-card-display-price">$0.05 <span>/ 1k токенов</span></div>
            <div class="plan-card-small-print">Стартовый пакет $5 (~2 250 ₸)</div>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Пакет токенов зачислен на баланс!')">
          ⚡ Пополнить баланс токенов
        </button>
      </div>
    `
  },

  // 13: LIFETIME ACCESS
  {
    id: 'lifetime',
    num: '13',
    category: 'sub',
    title: 'Lifetime Access (Экономия 180 000 ₸)',
    icon: '♾️',
    subtitle: 'Маркетинговый офер: выкуп подписки навсегда с дисконтом',
    desc: 'Маркетинговая подача: Показываем клиенту сколько он потратит за 4 года подписки (480 000 ₸), и предлагаем выкупить вечную лицензию сегодня за 300 000 ₸, сэкономив 180 000 ₸ навсегда.',
    formula: 'Выгода клиента = (Месячный чек × 48 месяцев) - Единоразовая цена LTD',
    cases: ['AppSumo', 'Lifetime Deals', 'Курсы с вечным доступом'],
    pros: 'Мгновенный крупный приток денег на счет; высокая конверсия преданных пользователей.',
    risks: 'Отсутствие повторных платежей в будущем от этого клиента.',
    aiValidation: [
      'Показать калькулятор экономии наглядно в цифрах на главном баннере',
      'Указать лимит доступных вечных лицензий (осталось 5 штук)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner" style="border-color:var(--amber-accent);">
          <div>
            <div class="marketing-hero-title">🔥 СЭКОНОМЬТЕ 180 000 ₸ НА ПОДПИСКЕ!</div>
            <div class="marketing-hero-sub">За 4 года подписки вы потратите 480 000 ₸. Выкупите вечный доступ один раз за 300 000 ₸!</div>
          </div>
          <div class="marketing-savings-badge" style="background:rgba(245,158,11,0.15); color:var(--amber-accent); border-color:var(--amber-accent);">
            Экономия 180 000 ₸
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Стоимость подписки за 4 года (48 мес × 10 000 ₸):</span> <span style="text-decoration:line-through; color:var(--text-dim);">480 000 ₸</span></div>
          <div class="receipt-row"><span>Единоразовый выкуп бессрочной лицензии:</span> <strong>300 000 ₸ (Один раз)</strong></div>
          <div class="receipt-row total"><span>Ваша чистая выгода навсегда:</span> <span style="color:var(--secondary-accent);">180 000 ₸ Экономии</span></div>
        </div>

        <button class="sim-action-btn" style="background:linear-gradient(135deg, var(--amber-accent), #d97706); color:#000;" onclick="triggerSimPayment('Бессрочная лицензия успешно выкуплена!')">
          ⚡ Выкупить вечный доступ и сэкономить 180 000 ₸
        </button>
      </div>
    `
  },

  // 09: SETUP FEE + ARR
  {
    id: 'setup-arr',
    num: '09',
    category: 'b2b',
    title: 'Setup Fee + ARR (Внедрение + Подписка)',
    icon: '🛠️',
    subtitle: 'Разовый чек за настройки + годовая подписка софта',
    desc: 'Enterprise B2B модель. Разовое внедрение (350k ₸) покрывает затраты инженеров, а годовая лицензия приносит высокую рекуррентную маржу.',
    formula: 'Первый чек = Setup Fee + 1-й год ARR',
    cases: ['Salesforce', 'SAP', '1С Enterprise'],
    pros: 'Высокий разовый чек полностью покрывает CAC.',
    risks: 'Длинный цикл интеграции.',
    aiValidation: ['Разбить внедрение на этапы с депозитом 30%'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Enterprise Внедрение софта</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Настройка и интеграция (Setup Fee):</span> <span>350 000 ₸</span></div>
          <div class="receipt-row"><span>Годовая подписка (ARR):</span> <span>180 000 ₸ / год</span></div>
          <div class="receipt-row total"><span>Первоначальный счет:</span> <span style="color:var(--secondary-accent);">530 000 ₸</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Смета внедрения утверждена!')">⚡ Утвердить проект внедрения</button>
      </div>
    `
  },

  // 10: B2B2C
  {
    id: 'b2b2c',
    num: '10',
    category: 'b2b',
    title: 'B2B2C (Корпоративный контракт)',
    icon: '🏢',
    subtitle: 'Платит Head Office за 500+ сотрудников со скидкой 60%',
    desc: 'Маркетинговый упор на экономию для HR/CEO: Вместо покупки лицензий рознично по 9 900 ₸, головной офис покупает контракт на все 500 сотрудников по 3 900 ₸/мес.',
    formula: 'Контракт = 500 сотрудников × 3 900 ₸/мес = 1 950 000 ₸/мес',
    cases: ['Gympass', 'Skyeng Corporate', 'WeDrink HQ'],
    pros: 'Получение тысяч пользователей за 1 сделку.',
    risks: 'Зависимость от продления 1 клиента.',
    aiValidation: ['Показать HR дашборд активности сотрудников'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">B2B2C Корпоративный контракт на 500 филиалов</div>
            <div class="marketing-hero-sub">Экономия 60% для головного офиса компании!</div>
          </div>
        </div>
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Розничная цена (500 точек × 9 900 ₸):</span> <span style="text-decoration:line-through;">4 950 000 ₸</span></div>
          <div class="receipt-row total"><span>Единый B2B2C контракт HQ (3 900 ₸/точку):</span> <span style="color:var(--secondary-accent);">1 950 000 ₸ / мес</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('B2B2C контракт на 500 точек подписан!')">⚡ Подписать B2B2C контракт</button>
      </div>
    `
  },

  // 11: WHITE LABEL
  {
    id: 'white-label',
    num: '11',
    category: 'b2b',
    title: 'White Label (Лицензирование)',
    icon: '🏷️',
    subtitle: 'Запуск софта под своим брендом за 1 день',
    desc: 'Партнер покупает готовое ядро софта и запускает сервис под своим доменом и логотипом.',
    formula: 'Доход = Взнос за запуск + Ежемесячное роялти',
    cases: ['White Label банкинг', 'Франшизы софта'],
    pros: 'Партнеры сами продают софт на своих рынках.',
    risks: 'Размытие прямого контакта с клиентами.',
    aiValidation: ['Настроить панель брендинга'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>White Label Лицензирование</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Запуск сервиса под вашим брендом:</span> <span>450 000 ₸</span></div>
          <div class="receipt-row total"><span>Итого за старт:</span> <span style="color:var(--secondary-accent);">450 000 ₸</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('White Label лицензия сгенерирована!')">⚡ Запустить софт под своим брендом</button>
      </div>
    `
  },

  // 15: PAID CERTIFICATION
  {
    id: 'paid-cert',
    num: '15',
    category: 'sub',
    title: 'Платная сертификация',
    icon: '📜',
    subtitle: 'Бесплатное обучение + оплата официального диплома',
    desc: 'Знания отдаются бесплатно, а официальный верифицированный диплом монетизируется.',
    formula: 'Доход = Студенты × Конверсия в диплом × 19 900 ₸',
    cases: ['Coursera', 'edX', 'AWS Certifications'],
    pros: 'Огромный воронковый охват студентов.',
    risks: 'Низкая конверсия без авторитета на рынке.',
    aiValidation: ['Внедрить прокторинг экзамена'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Выдача официального диплома</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Курс обучения:</span> <span style="color:var(--secondary-accent);">0 ₸ (Бесплатно)</span></div>
          <div class="receipt-row total"><span>Верифицированный диплом:</span> <span>19 900 ₸</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Диплом верифицирован!')">⚡ Оплатить верифицированный диплом</button>
      </div>
    `
  },

  // 16: PRIORITY & SPEED
  {
    id: 'priority-lane',
    num: '16',
    category: 'usage',
    title: 'Priority & Speed (Приоритет)',
    icon: '🚀',
    subtitle: 'Выделенная скорость отклика (0.3 сек против 4.5 сек)',
    desc: 'Бесплатные пользователи ждут в общей очереди, платные клиенты получают мгновенную скорость.',
    formula: 'Доход = Срочные юзеры × 4 900 ₸/мес',
    cases: ['ChatGPT Plus Turbo', 'Fast Track'],
    pros: 'Высокая маржинальность; профессионалы ценят время.',
    risks: 'Раздражение общей очереди.',
    aiValidation: ['Гарантировать latency < 0.3 сек'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Скорость отклика серверов</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row"><span>Общая очередь (Free):</span> <span>4.5 секунды</span></div>
          <div class="receipt-row total"><span>Priority Pass (VIP Node):</span> <span style="color:var(--secondary-accent);">0.3 секунды (4 900 ₸/мес)</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Priority Pass активирован!')">⚡ Активировать Priority Speed Pass</button>
      </div>
    `
  },

  // 17: RENTAL / LEASE
  {
    id: 'rental-lease',
    num: '17',
    category: 'usage',
    title: 'Rental / Lease (Аренда активов)',
    icon: '🚲',
    subtitle: 'Почасовая или посуточная ставка пользования активом',
    desc: 'Превращает крупные капвложения в мелкие операционные расходы.',
    formula: 'Выручка = Время аренды × Ставка',
    cases: ['Whoosh', 'Uber', 'Лизинг серверов'],
    pros: 'Доступность дорогих активов.',
    risks: 'Износ оборудования.',
    aiValidation: ['Зафиксировать страховку активов'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Аренда оборудования</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row total"><span>Ежемесячная аренда:</span> <span style="color:var(--secondary-accent);">45 000 ₸ / мес</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Аренда оформлена!')">⚡ Оформить аренду оборудования</button>
      </div>
    `
  },

  // 18: HIDDEN REVENUE
  {
    id: 'hidden-revenue',
    num: '18',
    category: 'alt',
    title: 'Hidden Revenue / Ads (Реклама)',
    icon: '👁️',
    subtitle: 'Пользователь платит 0 ₸, за него платят рекламодатели',
    desc: 'Продукт бесплатен. Доход генерируется от показов рекламы.',
    formula: 'Доход = (Показы / 1000) × eCPM',
    cases: ['Google', 'TikTok', 'Meta'],
    pros: 'Взрывной рост аудитории.',
    risks: 'Конфликт с UX.',
    aiValidation: ['Оценить MAU > 100k'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Рекламный доход (eCPM Engine)</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row total"><span>Выплата от рекламодателей:</span> <span style="color:var(--secondary-accent);">560 000 ₸ / мес</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Рекламный доход выведен!')">⚡ Симулировать выплату рекламной сети</button>
      </div>
    `
  },

  // 19: DATA MONETIZATION
  {
    id: 'data-monetization',
    num: '19',
    category: 'alt',
    title: 'Data Monetization (Продажа данных)',
    icon: '📊',
    subtitle: 'Агрегация и продажа аналитики рынка B2B-клиентам',
    desc: 'Обезличенные данные упаковываются в отчеты для крупных брендов.',
    formula: 'Доход = Продажа B2B отчетов',
    cases: ['2GIS Analytics', 'Nielsen'],
    pros: 'Высокая маржа.',
    risks: 'Законы о персональных данных.',
    aiValidation: ['100% анонимизация данных'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Продажа B2B аналитики</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row total"><span>Стоимость отчета:</span> <span style="color:var(--secondary-accent);">750 000 ₸</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Отчет продан!')">⚡ Выгрузить B2B аналитический отчет</button>
      </div>
    `
  },

  // 20: APP MARKETPLACE
  {
    id: 'app-marketplace',
    num: '20',
    category: 'alt',
    title: 'App Marketplace (Магазин плагинов)',
    icon: '🧩',
    subtitle: 'Платформа получает 30% с продаж сторонних девелоперов',
    desc: 'Разработчики создают дополнения, а платформа удерживает комиссию.',
    formula: 'Доход = Продажи плагинов × 30%',
    cases: ['Shopify App Store', 'WordPress'],
    pros: 'Бесплатное расширение экосистемы.',
    risks: 'Нужен открытый SDK.',
    aiValidation: ['Разработать API SDK'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>App Store Комиссия</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row total"><span>Доля платформы (30%):</span> <span style="color:var(--secondary-accent);">180 000 ₸</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Продажа плагина проведена!')">⚡ Симулировать сделку в App Store</button>
      </div>
    `
  },

  // 21: SPONSORSHIP
  {
    id: 'sponsorship',
    num: '21',
    category: 'alt',
    title: 'Спонсорство и Брендинг',
    icon: '🎗️',
    subtitle: 'Крупный бренд субсидирует сервис за интеграцию',
    desc: 'Фиксированный контракт со спонсором на квартал/год.',
    formula: 'Доход = Спонсорский пакет',
    cases: ['Хакатоны RedBull', 'VC.ru'],
    pros: 'Крупные чеки сразу.',
    risks: 'Поиск спонсоров.',
    aiValidation: ['Сформировать медиакит'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Спонсорский пакет</span></div>
        <div class="receipt-output-box">
          <div class="receipt-row total"><span>Спонсорский контракт:</span> <span style="color:var(--secondary-accent);">1 800 000 ₸ / квартал</span></div>
        </div>
        <button class="sim-action-btn" onclick="triggerSimPayment('Спонсорский пакет активирован!')">⚡ Активировать спонсорский контракт</button>
      </div>
    `
  },

  // 22: PAY WHAT YOU WANT
  {
    id: 'pay-what-you-want',
    num: '22',
    category: 'alt',
    title: 'Pay What You Want (Donation)',
    icon: '🎁',
    subtitle: 'Пользователь сам выбирает сумму пожертвования',
    desc: 'Добровольные чаевые и донаты на основе благодарности.',
    formula: 'Доход = Донаты пользователей',
    cases: ['Wikipedia', 'Buy Me a Coffee'],
    pros: 'Лояльность сообщества.',
    risks: 'Нестабильность доходов.',
    aiValidation: ['Настроить пресеты сумм'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title"><span>Донаты и Чаевые</span></div>
        <div style="display:flex; gap:0.5rem;">
          <button class="sim-action-btn secondary" style="flex:1;" onclick="setPwywVal(500)">500 ₸ ☕</button>
          <button class="sim-action-btn" style="flex:1;" onclick="setPwywVal(2000)">2 000 ₸ 🍕</button>
          <button class="sim-action-btn secondary" style="flex:1;" onclick="setPwywVal(5000)">5 000 ₸ 🚀</button>
        </div>
        <button class="sim-action-btn" style="background:var(--secondary-accent); color:#000;" onclick="triggerSimPayment('Донат отправлен!')">❤️ Отправить донат (<span id="pwyw-btn-val">2 000 ₸</span>)</button>
      </div>
    `
  }
];

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

  // Render Left Stage (75%)
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

  // Render Right Sidebar (25%)
  const sidebarTitle = document.getElementById('sidebar-title');
  sidebarTitle.innerHTML = `<span>📊</span> Маркетинг & Бизнес-разбор`;

  const sidebarBody = document.getElementById('sidebar-body');
  sidebarBody.innerHTML = `
    <div class="info-card-block">
      <div class="info-block-title">📌 Продуктовая механика и маркетинг</div>
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
      <div class="info-block-title" style="color:var(--secondary-accent);">👍 Маркетинговый плюс для продаж</div>
      <p class="info-block-text" style="color:var(--text-main);">${model.pros}</p>
    </div>

    <div class="info-card-block">
      <div class="info-block-title" style="color:#ff6b6b;">⚠️ Риск и уязвимость конверсии</div>
      <p class="info-block-text" style="color:var(--text-muted);">${model.risks}</p>
    </div>

    <div class="ai-validation-box">
      <div class="ai-validation-title">⚡ AI-проверка гипотез</div>
      <ul class="ai-validation-list">
        ${model.aiValidation.map(v => `<li>${v}</li>`).join('')}
      </ul>
    </div>
  `;
}

// Widget Selectors
function selectSubPeriod(period) {
  playClick();
  subSelectedPeriod = period;
  loadModel('subscription');
}

function selectSeatPkg(seats, rate) {
  playClick();
  seatPackageCount = seats;
  loadModel('per-seat');
}

function updatePpuFlexCalc() {
  const reqVal = document.getElementById('ppu-req-slider').value;
  const allowFlex = document.getElementById('flex-allow-check').checked;

  document.getElementById('ppu-req-display').textContent = `${parseInt(reqVal).toLocaleString()} запросов`;
  document.getElementById('flex-status-text').textContent = allowFlex ? '☑ Бесперебойный режим (Flex Active)' : '☒ Жесткий лимит (Block Overuse)';
  document.getElementById('flex-status-text').style.color = allowFlex ? 'var(--secondary-accent)' : 'var(--amber-accent)';
  
  const baseCost = (reqVal / 1000) * 0.2;
  document.getElementById('flex-min-total').textContent = `$${baseCost.toFixed(2)} / мес (~${Math.round(baseCost * 450).toLocaleString()} ₸)`;
}

function updateWoltAdsCalc() {
  const val = document.getElementById('sf-orders-slider').value;
  const totalSales = val * 5000;
  const fee = totalSales * 0.10;

  document.getElementById('sf-orders-val').textContent = `${val} заказов (${totalSales.toLocaleString()} ₸)`;
  document.getElementById('sf-wolt-fee').textContent = `${Math.round(fee).toLocaleString()} ₸`;
}

function updateIsaMktCalc() {
  const val = document.getElementById('isa-mkt-slider').value;
  document.getElementById('isa-mkt-sal').textContent = `${parseInt(val).toLocaleString()} ₸ / мес`;
  const pay = val * 0.15;
  document.getElementById('isa-mkt-pay').textContent = `${Math.round(pay).toLocaleString()} ₸ / мес`;
}

function updateMpDashboard() {
  const val = document.getElementById('mp-gmv-slider').value;
  document.getElementById('mp-gmv-val').textContent = `${parseInt(val).toLocaleString()} ₸`;
  const take = val * 0.10;
  const net = val - take - 15000 - 850;

  document.getElementById('mp-take-cost').textContent = `${Math.round(take).toLocaleString()} ₸`;
  document.getElementById('mp-vendor-net').textContent = `${Math.round(net).toLocaleString()} ₸`;
}

function selectTokenPack(tokens, price) {
  playClick();
  loadModel('prepaid-credits');
}

function setPwywVal(val) {
  playClick();
  document.getElementById('pwyw-btn-val').textContent = `${val.toLocaleString()} ₸`;
}

let pendingSimMsg = '';

function triggerSimPayment(msg) {
  playClick();
  pendingSimMsg = msg;

  const currentModel = modelsData.find(m => m.id === currentModelId);
  const title = currentModel ? currentModel.title.split('(')[0] : 'Оплата услуги';
  
  let amount = '24 900 ₸';
  const priceEl = document.querySelector('.plan-card-display-price') || document.querySelector('#sub-total-charge') || document.querySelector('#seat-pkg-total-usd') || document.querySelector('#sf-wolt-fee');
  if (priceEl) amount = priceEl.textContent.trim();

  document.getElementById('checkout-item-name').textContent = `Модель: ${title}`;
  document.getElementById('checkout-amount-val').textContent = amount;
  document.getElementById('checkout-btn-amount').textContent = amount;

  document.getElementById('checkout-modal-overlay').style.display = 'flex';
}

function closeCheckoutModal() {
  playClick();
  document.getElementById('checkout-modal-overlay').style.display = 'none';
}

function setPayMethod(method) {
  playClick();
  document.getElementById('tab-card').classList.toggle('active', method === 'card');
  document.getElementById('tab-b2b').classList.toggle('active', method === 'b2b');

  document.getElementById('pay-form-card').style.display = method === 'card' ? 'flex' : 'none';
  document.getElementById('pay-form-b2b').style.display = method === 'b2b' ? 'flex' : 'none';
}

function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  value = value.match(/.{1,4}/g)?.join(' ') || '';
  input.value = value.substring(0, 19);

  const brandTag = document.getElementById('card-brand-icon');
  if (value.startsWith('5')) {
    brandTag.textContent = 'MC';
    brandTag.style.background = '#eb001b';
  } else {
    brandTag.textContent = 'VISA';
    brandTag.style.background = '#3b82f6';
  }
}

function formatCardExp(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  input.value = value.substring(0, 5);
}

function submitCheckoutPayment() {
  const btn = document.getElementById('checkout-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '⏳ Проведение 3D-Secure платежа...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '⚡ Подтвердить и оплатить';
    closeCheckoutModal();
    playChime(880, 0.35);
    showToast(`✅ ${pendingSimMsg || 'Транзакция успешно проведена!'}`);
  }, 1200);
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

window.addEventListener('DOMContentLoaded', initApp);
