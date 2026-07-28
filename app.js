/* ==========================================
   MONETIZATION MATRIX 22 - COMPLETE LOGIC & SELECTION FIXES
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
let tokenPackageCount = 2000;
let razorPackage = '1year';

const subPeriodDetails = {
  year: { title: '1 Год (12 месяцев)', monthly: '6 000 ₸ / мес', charge: '72 000 ₸' },
  half: { title: '6 Месяцев', monthly: '7 000 ₸ / мес', charge: '42 000 ₸' },
  quarter: { title: '3 Месяца', monthly: '9 000 ₸ / мес', charge: '27 000 ₸' },
  month: { title: '1 Месяц', monthly: '10 000 ₸ / мес', charge: '10 000 ₸' },
  week: { title: '1 Неделя (Тест)', monthly: '8 000 ₸ / нед', charge: '8 000 ₸' }
};

const modelsData = [
  // 01: SUBSCRIPTION
  {
    id: 'subscription',
    num: '01',
    category: 'sub',
    title: 'Subscription (Рекуррентная подписка)',
    icon: '🔁',
    subtitle: 'Маркетинговая линейка периодов подписки (от года к неделе)',
    desc: 'Классическая подписка с маркетинговой упаковкой. Карточки расположены в карусели СЛЕВА НАПРАВО — от самого выгодного годового плана (с минимальной ценой в месяц) до короткой недельной пробной подписки. Нажмите на любую карточку для выбора!',
    formula: 'ARR = Годовой чек + Рекуррентные продления. (LTV = ARPU / Churn)',
    cases: ['Netflix', 'Spotify', 'ChatGPT Plus', 'Duolingo', 'WeDrink POS'],
    pros: 'Высокая конверсия в годовые подписки за счет контраста цен; стабильный предсказуемый MRR/ARR.',
    risks: 'Отток (Churn) после первого периода, если клиент не чувствует ценности.',
    aiValidation: [
      'Проверить конверсию из пробной недели в полноценную годовую подписку',
      'Оценить уровень оттока (Churn Rate) по каждому периоду отдельно'
    ],
    renderWidget: () => {
      const cur = subPeriodDetails[subSelectedPeriod] || subPeriodDetails.year;
      return `
        <div class="simulator-card">
          <div class="marketing-hero-banner">
            <div>
              <div class="marketing-hero-title">Выберите идеальный план подписки</div>
              <div class="marketing-hero-sub">Прокручивайте карточки влево-вправо и нажмите для выбора!</div>
            </div>
            <div class="marketing-savings-badge">🔥 Сэкономьте до 48 000 ₸ при оплате за год</div>
          </div>

          <!-- Горизонтальная карусель карточек 4 на 3 -->
          <div class="marketing-carousel-grid">
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

            <div class="marketing-plan-card ${subSelectedPeriod === 'quarter' ? 'active' : ''}" onclick="selectSubPeriod('quarter')">
              <div class="plan-card-period">3 Месяца</div>
              <div class="plan-card-display-price">9 000 ₸ <span>/ мес</span></div>
              <div class="plan-card-small-print">Списывается 27 000 ₸ за 3 месяца</div>
              <ul class="plan-card-features">
                <li>✓ Экономия 3 000 ₸</li>
              </ul>
            </div>

            <div class="marketing-plan-card ${subSelectedPeriod === 'month' ? 'active' : ''}" onclick="selectSubPeriod('month')">
              <div class="plan-card-period">1 Месяц</div>
              <div class="plan-card-display-price">10 000 ₸ <span>/ мес</span></div>
              <div class="plan-card-small-print">Стандартная гибкая подписка</div>
              <ul class="plan-card-features">
                <li>✓ Без обязательств</li>
              </ul>
            </div>

            <div class="marketing-plan-card ${subSelectedPeriod === 'week' ? 'active' : ''}" onclick="selectSubPeriod('week')">
              <div class="plan-card-period">1 Неделя (Тест)</div>
              <div class="plan-card-display-price">8 000 ₸ <span>/ нед</span></div>
              <div class="plan-card-small-print">70% стоимости месяца — тест сервиса</div>
              <ul class="plan-card-features">
                <li>✓ Тест на 7 дней</li>
              </ul>
            </div>
          </div>

          <div class="receipt-output-box">
            <div class="receipt-title">Спецификация и детализация счета</div>
            <div class="receipt-row"><span>Выбранный период:</span> <strong id="sub-period-title">${cur.title}</strong></div>
            <div class="receipt-row"><span>Эквивалент стоимости в месяц:</span> <strong style="color:var(--secondary-accent);" id="sub-monthly-eq">${cur.monthly}</strong></div>
            <div class="receipt-row total"><span>Итоговый чек к списанию:</span> <span id="sub-total-charge">${cur.charge}</span></div>
          </div>

          <button class="sim-action-btn" onclick="triggerSimPayment('Подписка [${cur.title}] успешно оформлена!')">
            ⚡ Оформить выбранную подписку (${cur.charge})
          </button>
        </div>
      `;
    }
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
    formula: 'Конверсия PLG = Платные пользователи PRO / Общая база бесплатников (2-5%)',
    cases: ['Figma', 'Slack', 'Zoom', 'Notion', 'Dropbox'],
    pros: 'Виральный охват, отсутствие затрат на первичную рекламу.',
    risks: 'Слишком щедрый бесплатный тариф убирает мотивацию к покупке.',
    aiValidation: ['Определить точные лимиты бесплатной версии'],
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
    desc: 'Оплата за каждого сотрудника. Маркетинг выстроен на оптовых скидках: покупать пакет из 10 или 25 мест выгоднее в пересчете на 1 сотрудника. Нажмите на любой пакет для выбора!',
    formula: 'Итоговый чек = Пакет мест × Оптовая цена за 1 место',
    cases: ['Google Workspace', 'Slack', 'Jira', 'HubSpot'],
    pros: 'Автоматический рост чека вместе с расширением штата.',
    risks: 'Передача логинов между сотрудниками.',
    aiValidation: ['Определить оптовые пакеты мест'],
    renderWidget: () => {
      const seatTotals = { 25: '$175 / мес (~78 750 ₸)', 10: '$90 / мес (~40 500 ₸)', 5: '$60 / мес (~27 000 ₸)', 1: '$15 / мес (~6 750 ₸)' };
      const curTotal = seatTotals[seatPackageCount] || '$90 / мес';
      return `
        <div class="simulator-card">
          <div class="marketing-hero-banner">
            <div>
              <div class="marketing-hero-title">Оптовые пакеты рабочих мест для команд</div>
              <div class="marketing-hero-sub">Чем больше команда — тем ниже цена за 1 сотрудника!</div>
            </div>
          </div>

          <div class="marketing-carousel-grid">
            <div class="marketing-plan-card featured ${seatPackageCount === 25 ? 'active' : ''}" onclick="selectSeatPkg(25)">
              <div class="marketing-card-badge gold">ОПТ -53% 🔥</div>
              <div class="plan-card-period">Пакет 25 Мест</div>
              <div class="plan-card-display-price">$7 <span>/ место / мес</span></div>
              <div class="plan-card-small-print">~$175 / мес за всю компанию</div>
            </div>

            <div class="marketing-plan-card ${seatPackageCount === 10 ? 'active' : ''}" onclick="selectSeatPkg(10)">
              <div class="marketing-card-badge">Экономия 40%</div>
              <div class="plan-card-period">Пакет 10 Мест</div>
              <div class="plan-card-display-price">$9 <span>/ место / мес</span></div>
              <div class="plan-card-small-print">~$90 / мес за компанию</div>
            </div>

            <div class="marketing-plan-card ${seatPackageCount === 5 ? 'active' : ''}" onclick="selectSeatPkg(5)">
              <div class="plan-card-period">Пакет 5 Мест</div>
              <div class="plan-card-display-price">$12 <span>/ место / мес</span></div>
              <div class="plan-card-small-print">~$60 / мес за команду</div>
            </div>

            <div class="marketing-plan-card ${seatPackageCount === 1 ? 'active' : ''}" onclick="selectSeatPkg(1)">
              <div class="plan-card-period">1 Место</div>
              <div class="plan-card-display-price">$15 <span>/ место / мес</span></div>
              <div class="plan-card-small-print">Стандартная цена за 1 юзера</div>
            </div>
          </div>

          <div class="receipt-output-box">
            <div class="receipt-title">Расчет стоимости выбранного пакета</div>
            <div class="receipt-row"><span>Выбранный пакет:</span> <strong id="seat-pkg-title">Пакет ${seatPackageCount} Мест</strong></div>
            <div class="receipt-row total"><span>Общий ежемесячный чек:</span> <span id="seat-pkg-total-usd" style="color:var(--secondary-accent);">${curTotal}</span></div>
          </div>

          <button class="sim-action-btn" onclick="triggerSimPayment('Командный пакет из ${seatPackageCount} мест оформлен!')">
            ⚡ Оформить пакет мест (${curTotal})
          </button>
        </div>
      `;
    }
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
    formula: 'Итоговый чек = Базовый лимит + (Перерасход × Ставка Overusage)',
    cases: ['Amazon AWS', 'OpenAI API', 'Twilio', 'Stripe'],
    pros: 'Бесперебойная работа сервиса при пиках трафика.',
    risks: 'Bill Shock при неконтролируемом перерасходе.',
    aiValidation: ['Настроить переключатель Flex Overusage'],
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
            <div style="font-size:0.72rem; color:var(--text-muted);">При превышении лимита списывать по $0.0015 за дополнительный запрос.</div>
          </div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Базовый план (100 000 запросов):</span> <span>$20.00 (~9 000 ₸)</span></div>
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
    desc: 'При подписке на годовой контракт расходных материалов само терминальное оборудование отдается БЕСПЛАТНО (за 0 ₸). Нажмите на карточку пакета для выбора!',
    formula: 'Прибыль = Маржа с расходников - Субсидия на оборудование',
    cases: ['Nespresso', 'Gillette', 'HP Instant Ink', 'POS-терминалы'],
    pros: 'Нулевой барьер старта для клиентов.',
    risks: 'Отмена подписки до окупаемости оборудования.',
    aiValidation: ['Зафиксировать минимальный срок подписки в договоре'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">POS-Терминал за 0 ₸ при годовой подписке!</div>
            <div class="marketing-hero-sub">Выберите комплект расходных материалов для вашей кофейни</div>
          </div>
          <div class="marketing-savings-badge">🎁 Терминал за 0 ₸</div>
        </div>

        <div class="marketing-carousel-grid">
          <div class="marketing-plan-card featured ${razorPackage === '1year' ? 'active' : ''}" onclick="selectRazorPkg('1year')">
            <div class="marketing-card-badge gold">ОБОРУДОВАНИЕ 0 ₸ 🔥</div>
            <div class="plan-card-period">1 Год Комплект</div>
            <div class="plan-card-display-price">14 500 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Терминал в подарок (Экономия 65 000 ₸)</div>
          </div>

          <div class="marketing-plan-card ${razorPackage === '6mon' ? 'active' : ''}" onclick="selectRazorPkg('6mon')">
            <div class="plan-card-period">6 Месяцев</div>
            <div class="plan-card-display-price">16 500 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Терминал за 32 500 ₸ (Скидка 50%)</div>
          </div>

          <div class="marketing-plan-card ${razorPackage === '1mon' ? 'active' : ''}" onclick="selectRazorPkg('1mon')">
            <div class="plan-card-period">1 Месяц</div>
            <div class="plan-card-display-price">18 500 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Терминал выкупается за 65 000 ₸</div>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Заказ оборудования и комплекта расходников оформлен!')">
          ⚡ Заказать POS-терминал с комплектом расходников
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
    desc: 'Ресторан выставляет рекламные блюда в приложении бесплатно. Просмотры и клики стоят 0 ₸. Комиссия 10% списывается СТРОГО если клиент оформил и оплатил заказ.',
    formula: 'Комиссия = Оплаченные заказы × 10% (Просмотры не платящих = 0 ₸)',
    cases: ['Wolt / Choco', 'CPA Рекламные сети', 'Booking.com', 'Uber Eats'],
    pros: 'Отсутствие риска неоплаты рекламы для клиента.',
    risks: 'Сложность отслеживаемости факта оплаты заказа.',
    aiValidation: ['Показать ресторану конверсию Просмотры -> Заказы'],
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
    desc: 'Обучение БЕСПЛАТНО на старте (0 ₸). Оплата 15% от зарплаты в течение 12 месяцев включается СТРОГО после трудоустройства с зарплатой от 300 000 ₸.',
    formula: 'Выплата = 0 ₸ во время учебы. Позже: Зарплата × 15% (12 месяцев)',
    cases: ['Lambda School', 'Microverse', 'Яндекс Практикум ISA'],
    pros: 'Уверенность студента в результатах учебы.',
    risks: 'Кассовый разрыв до первых трудоустройств.',
    aiValidation: ['Выделить 0 ₸ во время учебы крупным фоном'],
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
    desc: 'Регистрация и размещение товаров бесплатны. Платформа берет комиссии с продаж (Take Rate 8-12%) + подписку на личный кабинет и логистику.',
    formula: 'Доход = (GMV × Take Rate %) + Подписка на кабинет + Логистика',
    cases: ['Kaspi.kz', 'Wildberries', 'Shopify', 'Airbnb'],
    pros: 'Вывод продавца на многомиллионную аудиторию.',
    risks: 'Попытки ухода в прямые сделки.',
    aiValidation: ['Показать детализированный расчет всех комиссий'],
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
              <td>Списание при покупке</td>
              <td><strong>15 000 ₸</strong> (при чеке 150 000 ₸)</td>
            </tr>
            <tr>
              <td>Обслуживание личного кабинета продавца</td>
              <td>Фиксированная подписка</td>
              <td><strong>15 000 ₸ / мес</strong></td>
            </tr>
          </tbody>
        </table>

        <button class="sim-action-btn" onclick="triggerSimPayment('Магазин продавца успешно зарегистрирован!')">
          ⚡ Открыть магазин на маркетплейсе (0 ₸ старт)
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
    subtitle: 'Разовый чек за интеграцию + рекуррентная подписка',
    desc: 'Enterprise B2B модель. Разовый платеж за внедрение (350k ₸) покрывает интеграцию инженерами, а годовая лицензия генерирует стабильный ARR.',
    formula: 'Первый чек = Setup Fee (Разово) + 1-й год ARR',
    cases: ['Salesforce', 'SAP', '1С Enterprise'],
    pros: 'Высокий разовый чек полностью покрывает CAC.',
    risks: 'Длинный цикл интеграции.',
    aiValidation: ['Разбить внедрение на этапы с депозитом 30%'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Enterprise Внедрение софта (Salesforce / ERP)</div>
            <div class="marketing-hero-sub">Интеграция "под ключ" инженерами + годовая корпоративная лицензия</div>
          </div>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Статья затрат</th>
              <th>Тип списания</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Интеграция 1С и настройка серверов (Setup Fee)</td>
              <td>Разово при старте</td>
              <td><strong>350 000 ₸</strong></td>
            </tr>
            <tr>
              <td>Годовая корпоративная лицензия софта (ARR)</td>
              <td>Ежегодно</td>
              <td><strong>180 000 ₸ / год</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Депозит при подписании (30% Setup Fee):</span> <span>105 000 ₸</span></div>
          <div class="receipt-row total"><span>Первоначальный счет проекта:</span> <span style="color:var(--secondary-accent);">530 000 ₸</span></div>
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
    risks: 'Зависимость от продления 1 крупного клиента.',
    aiValidation: ['Показать HR дашборд активности сотрудников'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">B2B2C Корпоративный контракт на 500 филиалов</div>
            <div class="marketing-hero-sub">Экономия 60% для головного офиса компании!</div>
          </div>
          <div class="marketing-savings-badge">🔥 Скидка 60% HQ</div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Розничная цена (500 точек × 9 900 ₸):</span> <span style="text-decoration:line-through;">4 950 000 ₸</span></div>
          <div class="receipt-row total"><span>Единый B2B2C контракт HQ (3 900 ₸/точку):</span> <span style="color:var(--secondary-accent);">1 950 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('B2B2C контракт на 500 точек подписан!')">⚡ Подписать B2B2C контракт на сеть</button>
      </div>
    `
  },

  // 11: WHITE LABEL
  {
    id: 'white-label',
    num: '11',
    category: 'b2b',
    title: 'White Label (Лицензирование брендинга)',
    icon: '🏷️',
    subtitle: 'Запуск сервиса под вашим брендом и доменов за 1 день',
    desc: 'Партнер покупает готовое ядро софта, ставит свой логотип, домен (`pos.mybrand.kz`) и продает софт своей локальной аудитории.',
    formula: 'Доход = Паушальный взнос (450k ₸) + Ежемесячное роялти (45k ₸)',
    cases: ['White Label банкинг', 'Франшизы софта'],
    pros: 'Партнеры сами продают софт на своих рынках.',
    risks: 'Отсутствие прямого контакта с конечным клиентом.',
    aiValidation: ['Настроить панель управления брендами партнеров'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Конфигуратор White Label Платформы</div>
            <div class="marketing-hero-sub">Запустите собственный SaaS под своим брендом и доменов за 24 часа</div>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">Ваш домен и бренд софта:</label>
          <input type="text" value="Apex Coffee POS (pos.apex.kz)" style="background:#141c2b; border:1px solid var(--panel-border); padding:0.55rem 0.8rem; border-radius:6px; color:#fff; font-size:0.82rem;">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Паушальный взнос за сборку сборки:</span> <span>450 000 ₸</span></div>
          <div class="receipt-row"><span>Ежемесячное лицензионное роялти:</span> <span>45 000 ₸ / мес</span></div>
          <div class="receipt-row total"><span>Итого за старт собственного бренда:</span> <span style="color:var(--secondary-accent);">495 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('White Label платформа собрана!')">⚡ Запустить софт под своим брендом</button>
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
    desc: 'Оплата генераций токенами в стиле Claude/Antigravity. Слева расположен самый крупный пакет с максимальной скидкой на 1000 токенов. Нажмите на пакет для выбора!',
    formula: 'Доход = Проданные оптовые пакеты токенов',
    cases: ['Claude API', 'Midjourney', 'Depositphotos', 'Twilio'],
    pros: 'Предоплата на счет сервиса; оптовые скидки стимулируют крупный чек.',
    risks: 'Сложность интуитивного пересчета стоимости токенов.',
    aiValidation: ['Показать пересчитанную стоимость 1000 токенов'],
    renderWidget: () => {
      const tokenPrices = { 2000: '$20 (~9 000 ₸)', 1000: '$15 (~6 750 ₸)', 500: '$10 (~4 500 ₸)', 100: '$5 (~2 250 ₸)' };
      const curP = tokenPrices[tokenPackageCount] || '$20 (~9 000 ₸)';
      return `
        <div class="simulator-card">
          <div class="marketing-hero-banner">
            <div>
              <div class="marketing-hero-title">Пакеты токенов для генерации AI</div>
              <div class="marketing-hero-sub">Покупайте токены оптом и экономьте до 50% на стоимости генераций!</div>
            </div>
          </div>

          <div class="marketing-carousel-grid">
            <div class="marketing-plan-card featured ${tokenPackageCount === 2000 ? 'active' : ''}" onclick="selectTokenPack(2000)">
              <div class="marketing-card-badge gold">САМАЯ ВЫГОДНАЯ ЦЕНА 🔥 -50%</div>
              <div class="plan-card-period">2 000 Токенов</div>
              <div class="plan-card-display-price">$0.01 <span>/ 1k токенов</span></div>
              <div class="plan-card-small-print">Разовый платеж $20 (~9 000 ₸)</div>
            </div>

            <div class="marketing-plan-card ${tokenPackageCount === 1000 ? 'active' : ''}" onclick="selectTokenPack(1000)">
              <div class="marketing-card-badge">Скидка 25%</div>
              <div class="plan-card-period">1 000 Токенов</div>
              <div class="plan-card-display-price">$0.015 <span>/ 1k токенов</span></div>
              <div class="plan-card-small-print">Разовый платеж $15 (~6 750 ₸)</div>
            </div>

            <div class="marketing-plan-card ${tokenPackageCount === 500 ? 'active' : ''}" onclick="selectTokenPack(500)">
              <div class="plan-card-period">500 Токенов</div>
              <div class="plan-card-display-price">$0.02 <span>/ 1k токенов</span></div>
              <div class="plan-card-small-print">Разовый платеж $10 (~4 500 ₸)</div>
            </div>

            <div class="marketing-plan-card ${tokenPackageCount === 100 ? 'active' : ''}" onclick="selectTokenPack(100)">
              <div class="plan-card-period">100 Токенов</div>
              <div class="plan-card-display-price">$0.05 <span>/ 1k токенов</span></div>
              <div class="plan-card-small-print">Стартовый пакет $5 (~2 250 ₸)</div>
            </div>
          </div>

          <div class="receipt-output-box">
            <div class="receipt-row"><span>Выбранный пакет токенов:</span> <strong>${tokenPackageCount} Токенов</strong></div>
            <div class="receipt-row total"><span>Итого к оплате:</span> <span style="color:var(--secondary-accent);">${curP}</span></div>
          </div>

          <button class="sim-action-btn" onclick="triggerSimPayment('Пакет из ${tokenPackageCount} токенов зачислен на баланс!')">
            ⚡ Пополнить баланс токенов (${curP})
          </button>
        </div>
      `;
    }
  },

  // 13: LIFETIME ACCESS
  {
    id: 'lifetime',
    num: '13',
    category: 'sub',
    title: 'Lifetime Access (Экономия 180 000 ₸)',
    icon: '♾️',
    subtitle: 'Маркетинговый офер: выкуп подписки навсегда с дисконтом',
    desc: 'За 4 года подписки пользователь потратит 480 000 ₸. Выкуп вечной лицензии сегодня за 300 000 ₸ экономит 180 000 ₸.',
    formula: 'Выгода = (Чек × 48 месяцев) - Единоразовая цена LTD',
    cases: ['AppSumo', 'Lifetime Deals'],
    pros: 'Мгновенный приток денег на счет.',
    risks: 'Отсутствие повторных платежей.',
    aiValidation: ['Показать калькулятор экономии'],
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

  // 14: MEMBERSHIP
  {
    id: 'membership',
    num: '14',
    category: 'sub',
    title: 'Membership (Клубный доступ)',
    icon: '👑',
    subtitle: 'Закрытый клуб основателей 300+ CEO (от Годового к Месячному)',
    desc: 'Оплата за статус, нетворкинг и закрытый доступ. Годовой взнос выгоден со скидкой 40%.',
    formula: 'Выручка = Клубный взнос × Количество членов',
    cases: ['Product Masters', 'YPO', 'Patreon VIP'],
    pros: 'Высокое удержание благодаря социальным связям.',
    risks: 'Необходимость фасилитации комьюнити.',
    aiValidation: ['Внедрить строгий скоринг анкет кандидатов'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Закрытое комьюнити 300+ основателей бизнеса</div>
            <div class="marketing-hero-sub">Еженедельные мастермайнды, закрытый чат и инвестиционные сессии</div>
          </div>
          <div class="marketing-savings-badge">👑 Vetting Approved</div>
        </div>

        <div class="marketing-carousel-grid">
          <div class="marketing-plan-card featured" onclick="triggerSimPayment('Вступили в клуб на 1 Год со скидкой 40%!')">
            <div class="marketing-card-badge gold">СКИДКА -40% 🔥</div>
            <div class="plan-card-period">1 Год Клуба</div>
            <div class="plan-card-display-price">25 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Списывается 300 000 ₸ / год</div>
          </div>

          <div class="marketing-plan-card" onclick="triggerSimPayment('Вступили в клуб на 1 Месяц!')">
            <div class="plan-card-period">1 Месяц Клуба</div>
            <div class="plan-card-display-price">40 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Ежемесячный взнос</div>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Заявка в закрытый клуб одобрена!')">⚡ Подать заявку на вступление в клуб</button>
      </div>
    `
  },

  // 15: PAID CERTIFICATION
  {
    id: 'paid-cert',
    num: '15',
    category: 'sub',
    title: 'Платная сертификация (Coursera / AWS)',
    icon: '📜',
    subtitle: 'Обучение 100% бесплатно! Оплата только диплома для резюме',
    desc: 'Массовый EdTech охват: Смотрите лекции бесплатно (0 ₸). Диплом с внесением в реестр HR оплачивается отдельно.',
    formula: 'Доход = Бесплатные студенты × 19 900 ₸ (Диплом)',
    cases: ['Coursera', 'edX', 'AWS Certifications'],
    pros: 'Огромная воронка студентов без барьера входа.',
    risks: 'Низкая конверсия без международного авторитета.',
    aiValidation: ['Внедрить прокторинг экзамена по паспорту'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner" style="border-color:var(--secondary-accent);">
          <div>
            <div class="marketing-hero-title">Курс "Senior Data Analyst": Обучение 0 ₸</div>
            <div class="marketing-hero-sub">Все 40 уроков доступны бесплатно. Оплачивайте диплом только при требовании HR!</div>
          </div>
          <div class="marketing-savings-badge" style="background:rgba(16,185,129,0.15); color:var(--secondary-accent);">0 ₸ Лекции</div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Прослушивание лекций и практик:</span> <strong style="color:var(--secondary-accent);">0 ₸ (БЕСПЛАТНО)</strong></div>
          <div class="receipt-row"><span>Официальный диплом с верификацией в LinkedIn:</span> <span>19 900 ₸</span></div>
          <div class="receipt-row total"><span>Итого за сертификацию:</span> <span>19 900 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Официальный диплом успешно оплачен и занесен в реестр!')">⚡ Оплатить верифицированный диплом</button>
      </div>
    `
  },

  // 16: PRIORITY & SPEED
  {
    id: 'priority-lane',
    num: '16',
    category: 'usage',
    title: 'Priority & Speed (ChatGPT Plus Turbo)',
    icon: '🚀',
    subtitle: 'Выделенные VIP серверы: 0.3 сек отклик против 4.5 сек',
    desc: 'Монетизирует ценность времени профессионалов. Бесплатные пользователи ждут очереди, платные клиенты получают выделенные GPU.',
    formula: 'Доход = VIP Юзеры × 4 900 ₸ / мес',
    cases: ['ChatGPT Plus Turbo', 'Fast Track аэропорты'],
    pros: 'Высочайшая маржинальность; профи ценят скорость.',
    risks: 'Раздражение в бесплатной очереди.',
    aiValidation: ['Гарантировать latency отклика < 0.3 сек'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Ускоритель генераций Fast-Lane Turbo</div>
            <div class="marketing-hero-sub">Забудьте о задержках и очереди в часы пиковой нагрузки серверов!</div>
          </div>
        </div>

        <div class="marketing-carousel-grid">
          <div class="marketing-plan-card featured" onclick="triggerSimPayment('Priority Pass Turbo активирован!')">
            <div class="marketing-card-badge gold">VIP СКОРОСТЬ 0.3 СЕК 🔥</div>
            <div class="plan-card-period">Priority Pass</div>
            <div class="plan-card-display-price">4 900 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Выделенный GPU узел без очереди</div>
          </div>

          <div class="marketing-plan-card">
            <div class="plan-card-period">Общая очередь (Free)</div>
            <div class="plan-card-display-price">0 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Задержка до 4.8 секунд в пик</div>
          </div>
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
    title: 'Rental / Lease (Аренда оборудования)',
    icon: '🚲',
    subtitle: 'Коммерческое оборудование за 45 000 ₸/мес вместо покупки за 1.2M ₸',
    desc: 'Превращает тяжелые CAPEX затраты клиента в мелкие ежемесячные OPEX расхода. Возможность выкупа в конце срока.',
    formula: 'Выручка = Время пользования × Ставка аренды',
    cases: ['Whoosh', 'Uber', 'Лизинг серверов'],
    pros: 'Доступность дорогого оборудования для малого бизнеса.',
    risks: 'Амортизация и поломка оборудования.',
    aiValidation: ['Зафиксировать страховку активов'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Аренда и Лизинг POS-оборудования</div>
            <div class="marketing-hero-sub">Запустите точку за 45 000 ₸ вместо покупки моноблока за 1 200 000 ₸</div>
          </div>
          <div class="marketing-savings-badge">Экономия CAPEX</div>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Срок лизинга оборудования:</span>
            <span class="control-value" id="lease-mkt-val">12 месяцев</span>
          </div>
          <input type="range" class="custom-slider" min="6" max="36" step="6" value="12" id="lease-mkt-slider" oninput="updateLeaseMktCalc()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Стоимость выкупа оборудования на старте:</span> <span style="text-decoration:line-through;">1 200 000 ₸</span></div>
          <div class="receipt-row total"><span>Ежемесячный лизинговый платеж:</span> <span id="lease-mkt-cost" style="color:var(--secondary-accent);">45 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Договор лизинга успешно оформлен!')">⚡ Оформить оборудование в лизинг</button>
      </div>
    `
  },

  // 18: HIDDEN REVENUE
  {
    id: 'hidden-revenue',
    num: '18',
    category: 'alt',
    title: 'Hidden Revenue / Ads (Рекламная модель)',
    icon: '👁️',
    subtitle: 'Сервис 100% бесплатен для пользователей, платят рекламодатели',
    desc: 'Полное отсутствие барьера входа для аудитории. Выручка формируется за счет продажи показов рекламодателям по eCPM.',
    formula: 'Доход = (Показы / 1000) × Ставка eCPM',
    cases: ['Google', 'TikTok', 'Meta', 'Бесплатные сервисы'],
    pros: 'Взрывной рост базы пользователей.',
    risks: 'Раздражение пользователей от чрезмерной рекламы.',
    aiValidation: ['Оценить необходимый MAU > 100 000'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Монетизация рекламного трафика (Google AdX)</div>
            <div class="marketing-hero-sub">Сервис 100% бесплатен для аудитории. Доход от баннеров и нативной рекламы</div>
          </div>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Просмотры страниц в месяц:</span>
            <span class="control-value" id="ads-mkt-val">350 000 просмотров</span>
          </div>
          <input type="range" class="custom-slider" min="50000" max="1000000" step="50000" value="350000" id="ads-mkt-slider" oninput="updateAdsMktCalc()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Средняя ставка eCPM:</span> <span>1 600 ₸ за 1000 показов</span></div>
          <div class="receipt-row total"><span>Выплата от рекламной сети:</span> <span id="ads-mkt-net" style="color:var(--secondary-accent);">560 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Рекламный доход выведен на счет!')">⚡ Симулировать выплату рекламного дохода</button>
      </div>
    `
  },

  // 19: DATA MONETIZATION
  {
    id: 'data-monetization',
    num: '19',
    category: 'alt',
    title: 'Data Monetization (Продажа аналитики)',
    icon: '📊',
    subtitle: 'Агрегированная аналитика рынка B2B-клиентам (Nielsen / 2GIS)',
    desc: 'Обезличенные данные о продажах 450+ кофеен упаковываются в аналитический терминал для крупных дистрибьюторов зерна.',
    formula: 'Доход = Продажа B2B доступа к терминалу аналитики',
    cases: ['2GIS Analytics', 'Nielsen', 'Bloomberg Terminal'],
    pros: 'Высокая маржинальность продажи данных.',
    risks: 'Законы о персональных данных.',
    aiValidation: ['Гарантировать 100% анонимизацию данных'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Аналитический терминал HoReCa Data Market</div>
            <div class="marketing-hero-sub">Агрегированная анонимная аналитика спроса на кофейное зерно по Алматы и Астане</div>
          </div>
        </div>

        <div class="marketing-carousel-grid">
          <div class="marketing-plan-card featured" onclick="triggerSimPayment('Годовой доступ к аналитическому терминалу активирован!')">
            <div class="marketing-card-badge gold">ГОДОВОЙ ТЕРМИНАЛ 🔥</div>
            <div class="plan-card-period">Годовой B2B Доступ</div>
            <div class="plan-card-display-price">250 000 ₸ <span>/ мес</span></div>
            <div class="plan-card-small-print">Полный сырой API поток данных</div>
          </div>

          <div class="marketing-plan-card" onclick="triggerSimPayment('Разовый аналитический отчет выгружен!')">
            <div class="plan-card-period">Разовый Отчет</div>
            <div class="plan-card-display-price">750 000 ₸ <span>/ разово</span></div>
            <div class="plan-card-small-print">PDF + Excel за последние 12 месяцев</div>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('B2B аналитический доступ активирован!')">⚡ Выгрузить B2B аналитический терминал</button>
      </div>
    `
  },

  // 20: APP MARKETPLACE
  {
    id: 'app-marketplace',
    num: '20',
    category: 'alt',
    title: 'App Marketplace (Shopify App Store)',
    icon: '🧩',
    subtitle: 'Платформа берет 30% с продаж плагинов сторонних девелоперов',
    desc: 'Внешние девелоперы создают плагины для 50 000 клиентов вашей платформы. Вы удерживаете 30% комиссии с каждой продажи плагина.',
    formula: 'Доход = Продажи сторонних плагинов × 30%',
    cases: ['Shopify App Store', 'WordPress', 'Salesforce AppExchange'],
    pros: 'Сторонние девелоперы бесплатно развивают экосистему софта.',
    risks: 'Необходимость поддержки открытых API и документации.',
    aiValidation: ['Разработать открытый SDK и правила модерации'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Магазин приложений WeDrink App Marketplace</div>
            <div class="marketing-hero-sub">Разрабатывайте плагины для 50 000 кофеен и получайте 70% от всех продаж!</div>
          </div>
          <div class="marketing-savings-badge">70% Разработчику</div>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Продажи плагина "WhatsApp CRM" (100 продаж):</span> <span>600 000 ₸</span></div>
          <div class="receipt-row"><span>Комиссия платформы (30% App Store Cut):</span> <strong style="color:var(--secondary-accent);">180 000 ₸</strong></div>
          <div class="receipt-row total"><span>Выплата стороннему разработчику (70%):</span> <span>420 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Транзакция в App Store проведена!')">⚡ Симулировать сделку в App Store</button>
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
    subtitle: 'Эксклюзивная интеграция бренда перед аудиторией 50 000 CEO',
    desc: 'Генеральный спонсор оплачивает эксклюзивный пакет интеграции в сервис на 3 или 12 месяцев.',
    formula: 'Доход = Спонсорские пакета (Platinum / Gold / Silver)',
    cases: ['Хакатоны RedBull', 'Спецпроекты VC.ru', 'Бесплатный Wi-Fi'],
    pros: 'Крупные чеки сразу на счет.',
    risks: 'Зависимость от маркетинговых бюджетов бренда.',
    aiValidation: ['Сформировать медиакит с охватами'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner">
          <div>
            <div class="marketing-hero-title">Пакеты бренда и спонсорства</div>
            <div class="marketing-hero-sub">Эксклюзивный доступ и нативная интеграция вашего бренда перед 50 000 предпринимателями</div>
          </div>
        </div>

        <div class="marketing-carousel-grid">
          <div class="marketing-plan-card featured" onclick="triggerSimPayment('Platinum Спонсорство активировано!')">
            <div class="marketing-card-badge gold">PLATINUM SPONSOR 🔥</div>
            <div class="plan-card-period">Platinum Пакет</div>
            <div class="plan-card-display-price">1 800 000 ₸ <span>/ квартал</span></div>
            <div class="plan-card-small-print">Генеральный бренд приложения</div>
          </div>

          <div class="marketing-plan-card" onclick="triggerSimPayment('Gold Спонсорство активировано!')">
            <div class="plan-card-period">Gold Пакет</div>
            <div class="plan-card-display-price">1 000 000 ₸ <span>/ квартал</span></div>
            <div class="plan-card-small-print">Интеграция в Push-уведомления</div>
          </div>

          <div class="marketing-plan-card" onclick="triggerSimPayment('Silver Спонсорство активировано!')">
            <div class="plan-card-period">Silver Пакет</div>
            <div class="plan-card-display-price">500 000 ₸ <span>/ квартал</span></div>
            <div class="plan-card-small-print">Логотип в партнерах</div>
          </div>
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
    title: 'Pay What You Want (Donation / Чаевые)',
    icon: '🎁',
    subtitle: 'Пользователь сам выбирает размер благодарности проекту',
    desc: 'Добровольная поддержка сообщества на основе лояльности и благодарности за бесплатный софт.',
    formula: 'Доход = Количество донатов × Средний размер чаевых',
    cases: ['Wikipedia', 'Buy Me a Coffee', 'Patreon'],
    pros: 'Высочайшая лояльность аудитории.',
    risks: 'Нестабильность доходов.',
    aiValidation: ['Настроить удобные подсказки сумм чаевых'],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="marketing-hero-banner" style="border-color:var(--secondary-accent);">
          <div>
            <div class="marketing-hero-title">Поддержите независимую разработку (Tip Jar)</div>
            <div class="marketing-hero-sub">Продукт бесплатен. Вы сами выбираете сумму благодарности команде!</div>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="sim-action-btn secondary" style="flex:1;" onclick="setPwywVal(500)">500 ₸ ☕</button>
          <button class="sim-action-btn" style="flex:1;" onclick="setPwywVal(2000)">2 000 ₸ 🍕</button>
          <button class="sim-action-btn secondary" style="flex:1;" onclick="setPwywVal(5000)">5 000 ₸ 🚀</button>
        </div>

        <button class="sim-action-btn" style="background:var(--secondary-accent); color:#000;" onclick="triggerSimPayment('Донат успешно отправлен!')">
          ❤️ Отправить поддержку (<span id="pwyw-btn-val">2 000 ₸</span>)
        </button>
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

// Widget Handlers with Dynamic Selection Fixes
function selectSubPeriod(period) {
  playClick();
  subSelectedPeriod = period;
  loadModel('subscription');
}

function selectSeatPkg(seats) {
  playClick();
  seatPackageCount = seats;
  loadModel('per-seat');
}

function selectTokenPack(tokens) {
  playClick();
  tokenPackageCount = tokens;
  loadModel('prepaid-credits');
}

function selectRazorPkg(pkg) {
  playClick();
  razorPackage = pkg;
  loadModel('razor-blade');
}

function updatePpuFlexCalc() {
  const reqVal = document.getElementById('ppu-req-slider').value;
  document.getElementById('ppu-req-display').textContent = `${parseInt(reqVal).toLocaleString()} запросов`;
  document.getElementById('flex-min-total').textContent = `$${((reqVal / 1000) * 0.2).toFixed(2)} / мес`;
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

function updateLeaseMktCalc() {
  const val = document.getElementById('lease-mkt-slider').value;
  document.getElementById('lease-mkt-val').textContent = `${val} месяцев`;
  const monthly = Math.round((1200000 / val) + 15000);
  document.getElementById('lease-mkt-cost').textContent = `${monthly.toLocaleString()} ₸ / мес`;
}

function updateAdsMktCalc() {
  const val = document.getElementById('ads-mkt-slider').value;
  document.getElementById('ads-mkt-val').textContent = `${parseInt(val).toLocaleString()} просмотров`;
  const net = Math.round((val / 1000) * 1600);
  document.getElementById('ads-mkt-net').textContent = `${net.toLocaleString()} ₸ / мес`;
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
  const priceEl = document.querySelector('#sub-total-charge') || document.querySelector('#seat-pkg-total-usd') || document.querySelector('.plan-card-display-price') || document.querySelector('#sf-wolt-fee');
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
