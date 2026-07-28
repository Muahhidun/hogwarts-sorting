/* ==========================================
   MONETIZATION MATRIX 22 - ENTERPRISE B2B SAAS LOGIC
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

// State variables for interactive widgets
let subCycle = 'annual';
let teamMembers = ['alex@acme-corp.com', 'sarah.m@acme-corp.com', 'dev.lead@acme-corp.com'];
let seatPlanRate = 15;
let seatSsoAddon = false;

const modelsData = [
  // 01: SUBSCRIPTION
  {
    id: 'subscription',
    num: '01',
    category: 'sub',
    title: 'Subscription (Рекуррентная подписка)',
    icon: '🔁',
    subtitle: 'Автоматические регулярные списания (SaaS / B2B Billing)',
    desc: 'Классическая бизнес-модель B2B SaaS. Клиент привязывает корпоративную карту или подписывает безакцептное списание (Stripe Billing / Recurring Invoicing). Обеспечивает высокий и предсказуемый MRR/ARR.',
    formula: 'ARR = MRR × 12 = (Количество клиентов × Средний чек ARPU) × 12',
    cases: ['Netflix', 'Spotify', 'Salesforce', 'ChatGPT Plus', 'WeDrink POS'],
    pros: 'Высокая предсказуемость денежных потоков (MRR), высокий мультипликатор оценки компании при LTV/CAC > 3x.',
    risks: 'Involuntary Churn (ошибки карт), высокие затраты на удержание (Retention) и технический саппорт.',
    aiValidation: [
      'Валидировать показатель оттока (Churn Rate < 2% в месяц для B2B)',
      'Проверить готовность финотдела клиента к регулярным списаниям вместо единовременного бюджета',
      'Рассчитать окупаемость привлечения клиента (CAC Payback Period < 12 месяцев)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Конфигуратор корпоративной подписки</span>
          <span style="color: var(--primary-accent);">Stripe Billing Engine v4.2</span>
        </div>

        <div style="display:flex; gap:0.5rem; align-items:center; background:#161e2e; padding:0.4rem; border-radius:6px; width:fit-content;">
          <button class="sim-action-btn ${subCycle === 'monthly' ? '' : 'secondary'}" style="padding:0.4rem 0.8rem; font-size:0.78rem;" onclick="setSubCycle('monthly')">Ежемесячно</button>
          <button class="sim-action-btn ${subCycle === 'annual' ? '' : 'secondary'}" style="padding:0.4rem 0.8rem; font-size:0.78rem;" onclick="setSubCycle('annual')">Ежегодно (-20% Скидка)</button>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Модули и Возможности</th>
              <th>Standard</th>
              <th>Business PRO</th>
              <th>Enterprise SLA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Количество активных пользователей</td>
              <td>До 5 мест</td>
              <td>До 25 мест</td>
              <td>Безлимитно</td>
            </tr>
            <tr>
              <td>Выгрузка отчетов и аналитики</td>
              <td>CSV / Excel</td>
              <td>API / BI Connectors</td>
              <td>Real-time Stream</td>
            </tr>
            <tr>
              <td>SAML SSO & Audit Logs</td>
              <td>❌</td>
              <td>✓ Включено</td>
              <td>✓ Включено</td>
            </tr>
            <tr>
              <td>Гарантия SLA и Поддержка</td>
              <td>Email 24ч</td>
              <td>Чат 1ч</td>
              <td>Dedicated AM 99.9%</td>
            </tr>
            <tr>
              <td><strong>Стоимость плана:</strong></td>
              <td><strong style="color:var(--text-muted);">${subCycle === 'annual' ? '7 900 ₸/мес' : '9 900 ₸/мес'}</strong></td>
              <td><strong style="color:var(--primary-accent);">${subCycle === 'annual' ? '19 900 ₸/мес' : '24 900 ₸/мес'}</strong></td>
              <td><strong style="color:var(--secondary-accent);">${subCycle === 'annual' ? '49 900 ₸/мес' : '59 900 ₸/мес'}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="receipt-output-box">
          <div class="receipt-title">Спецификация и детализация счета (Invoice Specification)</div>
          <div class="receipt-row"><span>Выбранный тарифный план:</span> <strong>Business PRO (${subCycle === 'annual' ? 'Годовой контракт' : 'Ежемесячный'})</strong></div>
          <div class="receipt-row"><span>Субтотал:</span> <span>${subCycle === 'annual' ? '238 800 ₸' : '24 900 ₸'}</span></div>
          <div class="receipt-row"><span>НДС / Налог (12%):</span> <span>${subCycle === 'annual' ? '28 656 ₸' : '2 988 ₸'}</span></div>
          <div class="receipt-row total"><span>Итоговый чек к оплате:</span> <span id="sub-final-total">${subCycle === 'annual' ? '267 456 ₸ / год' : '27 888 ₸ / мес'}</span></div>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button class="sim-action-btn" style="flex:1;" onclick="triggerSimPayment('Подписка Business PRO успешно активирована!')">
            ⚡ Подписать корпоративную подписку
          </button>
          <button class="sim-action-btn secondary" onclick="triggerSimPayment('Образец счета PDF сгенерирован!')">
            📄 Скачать счет (PDF)
          </button>
        </div>
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
    subtitle: 'Базовый инструмент бесплатно, платит 2-5% продвинутых команд',
    desc: 'Продукт распространяется свободно. Бесплатный тариф создает продуктовый воронковый охват (Product-Led Growth), а лимиты использования органично подталкивают команды к покупке PRO.',
    formula: 'Платная выручка = (Общий Free охват × % Конверсии 2-5%) × ARPU PRO плана',
    cases: ['Figma', 'Slack', 'Zoom', 'Notion', 'Dropbox'],
    pros: 'Огромный бесплатный органический охват (PLG), нулевая стоимость первичного привлечения (CAC).',
    risks: 'Высокие расходы на инфраструктуру 95% неплатящих пользователей; сложность соблюдения баланса Free/PRO.',
    aiValidation: [
      'Определить точно "лимит триггера" (например: 3 проекта, 10 000 сообщений в истории)',
      'Проверить, чтобы бесплатная версия создавала полноценную самостоятельную ценность',
      'Рассчитать юнит-экономику хранения данных бесплатников'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Управление лимитами тарифов (PLG Gate Manager)</span>
          <span style="color:var(--amber-accent);" id="freemium-badge-status">ТЕКУЩИЙ ТАРИФ: FREE</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          <div style="background:#161e2e; padding:1rem; border-radius:8px; border:1px solid var(--panel-border);">
            <div style="font-size:0.75rem; color:var(--text-dim); font-weight:700;">ЛИМИТ ПРОЕКТОВ WDRINK</div>
            <div style="font-size:1.4rem; font-weight:700; margin:0.3rem 0; color:#fff;" id="freemium-proj-val">3 / 3 Проекта</div>
            <div style="background:#334155; height:6px; border-radius:3px; overflow:hidden;">
              <div style="background:var(--amber-accent); width:100%; height:100%;" id="freemium-proj-bar"></div>
            </div>
            <div style="font-size:0.72rem; color:var(--amber-accent); margin-top:0.4rem;">⚠️ Достигнут лимит бесплатного плана</div>
          </div>

          <div style="background:#161e2e; padding:1rem; border-radius:8px; border:1px solid var(--panel-border);">
            <div style="font-size:0.75rem; color:var(--text-dim); font-weight:700;">ИСТОРИЯ АНАЛИТИКИ СКЛАДА</div>
            <div style="font-size:1.4rem; font-weight:700; margin:0.3rem 0; color:#fff;" id="freemium-hist-val">7 дней</div>
            <div style="background:#334155; height:6px; border-radius:3px; overflow:hidden;">
              <div style="background:var(--primary-accent); width:30%; height:100%;" id="freemium-hist-bar"></div>
            </div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.4rem;">PRO открывает 365 дней истории</div>
          </div>
        </div>

        <button class="sim-action-btn" id="freemium-upgrade-btn" onclick="toggleFreemiumEnterprise()">
          ⚡ Переключить аккаунт на PRO Enterprise (19 900 ₸/мес)
        </button>
      </div>
    `
  },

  // 03: PER SEAT
  {
    id: 'per-seat',
    num: '03',
    category: 'sub',
    title: 'Per Seat (За рабочее место)',
    icon: '👥',
    subtitle: 'Чек масштабируется автоматически вместе со штатом клиента',
    desc: 'Оплата рассчитывается за каждого зарегистрированного активного пользователя в организации. Позволяет расти внутри существующего клиента без работы отдела продаж (Expansion Revenue).',
    formula: 'Ежемесячный чек = Количество активных сотрудников (Seats) × Ставка за 1 место + Add-ons',
    cases: ['Google Workspace', 'Slack', 'Asana', 'Jira', 'HubSpot'],
    pros: 'Встроенный механизм естественного роста выручки (Net Dollar Retention > 120%).',
    risks: 'Сотрудники клиента передают логины "по наследству", чтобы сэкономить на лицензиях.',
    aiValidation: [
      'Проверить систему защиты от передачи логинов (2FA / IP lock)',
      'Настроить систему автоматического пересчета прорейта (Prorated Billing) при добавлении сотрудников в середине месяца'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Управление корпоративными лицензиями (Team Roster)</span>
          <span style="color:var(--primary-accent);">Тариф: $15 / seat / мес</span>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <input type="email" id="new-member-email" placeholder="colleague@company.com" style="flex:1; background:#161e2e; border:1px solid var(--panel-border); border-radius:6px; padding:0.5rem 0.8rem; color:#fff; font-size:0.8rem;">
          <button class="sim-action-btn" style="padding:0.5rem 1rem; font-size:0.8rem;" onclick="addTeamMember()">+ Добавить сотрудника</button>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Сотрудник</th>
              <th>Роль</th>
              <th>Статус лицензии</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody id="team-table-body">
            ${teamMembers.map((m, idx) => `
              <tr>
                <td>${m}</td>
                <td><span style="background:#1e293b; padding:0.15rem 0.4rem; border-radius:4px; font-size:0.72rem;">Editor</span></td>
                <td><span style="color:var(--secondary-accent);">Active Seat ($15/mo)</span></td>
                <td><button style="background:none; border:none; color:#ff6b6b; cursor:pointer; font-size:0.75rem;" onclick="removeTeamMember(${idx})">Удалить</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Активных мест (Seats):</span> <strong id="seat-active-count">${teamMembers.length} сотрудников</strong></div>
          <div class="receipt-row"><span>Ставка за 1 место:</span> <span>$15 / мес (~6 750 ₸)</span></div>
          <div class="receipt-row total"><span>Ежемесячный списанный чек:</span> <span id="seat-calc-total">$${teamMembers.length * 15} / мес (~${(teamMembers.length * 15 * 450).toLocaleString()} ₸)</span></div>
        </div>
      </div>
    `
  },

  // 04: PAY-PER-USE / METERED
  {
    id: 'pay-per-use',
    num: '04',
    category: 'usage',
    title: 'Pay-Per-Use / Metered (По факту потребления)',
    icon: '⚡',
    subtitle: 'Клиент платит точно за гигабайты, вызовы API или серверное время',
    desc: 'Оплата рассчитывается по факту использования инфраструктуры. Чем больше трафика или вычислений потребляет клиент, тем выше его чек. Идеально для API и облаков.',
    formula: 'Итоговый чек = ∑ (Объем потребленного ресурса N × Дерево объемных тарифов Tier N)',
    cases: ['Amazon AWS', 'OpenAI API', 'Twilio', 'Stripe Payments', 'Snowflake'],
    pros: 'Справедливая ценовая политика; клиент платит только за реальную выгоду и масштаб.',
    risks: 'Непредсказуемость ежемесячного чека (Bill Shock), клиенты ставят лимиты расхода.',
    aiValidation: [
      'Рассчитать точно маржинальность 1 единицы потребления (Unit Cost vs Unit Price)',
      'Внедрить понятный калькулятор расходов и систему алертов порога бюджета'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Облачный калькулятор потребления API & Storage (Metered Engine)</span>
          <span style="color:var(--secondary-accent);">Регион: eu-central-1</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Вызовы API запросов в месяц:</span>
            <span class="control-value" id="metered-api-val">250 000 вызовов</span>
          </div>
          <input type="range" class="custom-slider" min="10000" max="2000000" step="10000" value="250000" id="metered-api-slider" oninput="updateMeteredDashboard()">
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Объем выгруженного трафика (Data Egress GB):</span>
            <span class="control-value" id="metered-gb-val">120 GB</span>
          </div>
          <input type="range" class="custom-slider" min="10" max="1000" step="10" value="120" id="metered-gb-slider" oninput="updateMeteredDashboard()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-title">Спецификация расхода по ступенчатым тарифам (Volume Tiering)</div>
          <div class="receipt-row"><span>API Invocations ($0.0002 / req):</span> <span id="metered-api-cost">$50.00</span></div>
          <div class="receipt-row"><span>Data Transfer ($0.08 / GB):</span> <span id="metered-gb-cost">$9.60</span></div>
          <div class="receipt-row total"><span>Итого за текущий биллинговый цикл:</span> <span id="metered-total-cost" style="color:var(--secondary-accent);">$59.60 (~26 820 ₸)</span></div>
        </div>

        <div style="background:#161e2e; padding:0.75rem; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
          <span>API Key: <code style="color:#fff;">sk_live_99847291...3892</code></span>
          <button class="sim-action-btn secondary" style="padding:0.25rem 0.5rem; font-size:0.7rem;" onclick="triggerSimPayment('Скопировано в буфер!')">Скопировать ключ</button>
        </div>
      </div>
    `
  },

  // 05: RAZOR & BLADE
  {
    id: 'razor-blade',
    num: '05',
    category: 'usage',
    title: 'Razor & Blade (Бритва и лезвие)',
    icon: '🪒',
    subtitle: 'Дешевое железное ядро + высокая маржа на регулярных расходниках',
    desc: 'Базовое оборудование продается по себестоимости или отдается в залог, а стабильная прибыль извлекается из регулярных поставок проприетарных расходных материалов.',
    formula: 'Совокупная прибыль = (Доход от оборудования - Seбестоимость) + N месяцев × (Объем расходников × Высокая маржа)',
    cases: ['Nespresso', 'Gillette', 'HP Printers', 'POS-терминалы + чековая лента'],
    pros: 'Нулевой барьер покупки главного устройства, привязка клиента к экосистеме.',
    risks: 'Появление совместимых дешевых аналогов от сторонних китайских фабрик.',
    aiValidation: [
      'Продумать аппаратную или юридическую защиту расходника (чипы, форма, патенты)',
      'Убедиться в высокой маржинальности повторяющегося элемента (>60%)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Спецификация комплекта POS-оборудования и материалов</span>
          <span style="color:var(--amber-accent);">Модель: Hardware SaaS</span>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Компонент системы</th>
              <th>Тип платежа</th>
              <th>Себестоимость</th>
              <th>Цена для клиента</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Терминал WeDrink Monoblock 15"</td>
              <td>Разово при старте</td>
              <td>65 000 ₸</td>
              <td><strong style="color:var(--secondary-accent);">65 000 ₸ (По себестоимости)</strong></td>
            </tr>
            <tr>
              <td>Фирменная чековая лента + RFID карты (Набор 1 мес)</td>
              <td>Ежемесячно</td>
              <td>4 200 ₸</td>
              <td><strong style="color:var(--primary-accent);">18 500 ₸ (Маржа 77%)</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="receipt-output-box">
          <div class="receipt-title">Прогноз Total Cost of Ownership (TCO 1 год)</div>
          <div class="receipt-row"><span>Маржа с продажи моноблока:</span> <span>0 ₸</span></div>
          <div class="receipt-row"><span>Прибыль с расходников за 12 месяцев:</span> <span>171 600 ₸</span></div>
          <div class="receipt-row total"><span>Чистая прибыль с 1 кофейни за год:</span> <span style="color:var(--secondary-accent);">171 600 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Заказ на поставку расходников оформлен!')">
          ⚡ Заказать ежемесячный комплект расходников (18 500 ₸)
        </button>
      </div>
    `
  },

  // 06: SUCCESS FEE
  {
    id: 'success-fee',
    num: '06',
    category: 'b2b',
    title: 'Success Fee (Оплата за результат)',
    icon: '🎯',
    subtitle: 'Комиссия удерживается только от реальной чистой прибыли или экономии',
    desc: 'Сервис получает процент только тогда, когда клиент реально заработал или сэкономил деньги благодаря продукту. Полностью снимает страх рисков при продаже.',
    formula: 'Комиссия сервиса = Подтвержденный финансовый эффект × Фиксированный процент (например 10%)',
    cases: ['Инвестиционные брокеры', 'Оптимизация закупщиков', 'CPA-маркетинг', 'Юридические компании'],
    pros: 'Максимально высокая конверсия в сделку; клиент не рискует собственными деньгами.',
    risks: 'Сложность независимого аудита и прозрачного подсчета чистого эффекта.',
    aiValidation: [
      'Зафиксировать прозрачные формулы замера точки "До" и "После"',
      'Оформить безакцептный автосписательный эскроу-договор'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Аудит экономии на закупках сырья (Success Fee Audit)</span>
          <span style="color:var(--secondary-accent);">Ставка: 10% от экономии</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Фактическая экономия кофейни за месяц:</span>
            <span class="control-value" id="sf-saved-val">1 500 000 ₸</span>
          </div>
          <input type="range" class="custom-slider" min="100000" max="5000000" step="100000" value="1500000" id="sf-slider" oninput="updateSfDashboard()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Финансовый эффект клиента:</span> <span>+<span id="sf-effect-display">1 500 000</span> ₸</span></div>
          <div class="receipt-row"><span>Чистая выгода клиента (90%):</span> <strong style="color:var(--secondary-accent);" id="sf-client-net">1 350 000 ₸</strong></div>
          <div class="receipt-row total"><span>Комиссия сервиса (10% Success Fee):</span> <span id="sf-service-fee" style="color:var(--primary-accent);">150 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Счет за результат успешно списан!')">
          ⚡ Списать 10% от подтвержденного профита
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
    subtitle: 'Обучение 0 ₸, выплата % от зарплаты только после трудоустройства',
    desc: 'Студент учится бесплатно. Оплата начинается только при достижении целевого уровня зарплаты в виде фиксированного % от дохода в течение 12-24 месяцев.',
    formula: 'Выплата = Фактическая зарплата выпускника × % по ISA (например 15%) в течение N месяцев',
    cases: ['Lambda School', 'Microverse', 'Яндекс Практикум ISA', 'Make School'],
    pros: 'Огромный поток абитуриентов, идеальное выравнивание интересов школы и студента.',
    risks: 'Кассовый разрыв (деньги приходят через 6-12 месяцев); риск скрытия доходов выпускниками.',
    aiValidation: [
      'Провести скоринг абитуриентов на старте для оценки вероятности трудоустройства',
      'Зафиксировать кап (Cap) максимальной выплаты (например не более 1.5х от базовой цены курса)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Калькулятор выплат по договору ISA (Income Share Contract)</span>
          <span style="color:var(--primary-accent);">Порог активации: >300 000 ₸/мес</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Зарплата выпускника после оффера:</span>
            <span class="control-value" id="isa-sal-val">650 000 ₸ / мес</span>
          </div>
          <input type="range" class="custom-slider" min="200000" max="1500000" step="50000" value="650000" id="isa-sal-slider" oninput="updateIsaDashboard()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Взнос во время учебы:</span> <span style="color:var(--secondary-accent);">0 ₸ (Полностью бесплатно)</span></div>
          <div class="receipt-row"><span>Условие выплат:</span> <span>15% от зарплаты в течение 12 месяцев</span></div>
          <div class="receipt-row total"><span>Ежемесячный платеж студента:</span> <span id="isa-pay-monthly" style="color:var(--primary-accent);">97 500 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Договор ISA верифицирован и подписан!')">
          ⚡ Подписать цифровой договор ISA (0 ₸ сегодня)
        </button>
      </div>
    `
  },

  // 08: MARKETPLACE FEE
  {
    id: 'marketplace-fee',
    num: '08',
    category: 'b2b',
    title: 'Marketplace Take Rate (Комиссия)',
    icon: '🏪',
    subtitle: 'Платформа сводит продавцов и покупателей, удерживая % с каждой сделки',
    desc: 'Маркетплейс выступает гарантом расчетов, логистики и доверия, удерживая определенный процент (Take Rate) от совокупного объема проходящих продаж (GMV).',
    formula: 'Выручка платформы = Общий оборот продаж (GMV) × Процент комиссии (Take Rate)',
    cases: ['Kaspi.kz', 'Wildberries', 'Airbnb', 'Uber', 'App Store'],
    pros: 'Колоссальный потенциал масштабирования без владения физическими складами.',
    risks: 'Уход продавцов и покупателей в прямой офлайн в обход платформы.',
    aiValidation: [
      'Рассчитать оптимальный Take Rate (обычно от 5% до 15% в зависимости от категории)',
      'Внедрить ценности (гарантии возврат, безопасная сделка), удерживающие внутри платформы'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Спецификация комиссии платформы (Take Rate Engine)</span>
          <span style="color:var(--secondary-accent);">Категория: HoReCa Специи</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Сумма заказа покупателя (GMV):</span>
            <span class="control-value" id="mp-gmv-val">250 000 ₸</span>
          </div>
          <input type="range" class="custom-slider" min="10000" max="1000000" step="10000" value="250000" id="mp-gmv-slider" oninput="updateMpDashboard()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Комиссия маркетплейса (12% Take Rate):</span> <strong style="color:var(--amber-accent);" id="mp-take-cost">30 000 ₸</strong></div>
          <div class="receipt-row"><span>Эквайринг и логистика (2%):</span> <span>5 000 ₸</span></div>
          <div class="receipt-row total"><span>Выплата поставщику на р/с:</span> <span id="mp-vendor-net" style="color:var(--secondary-accent);">215 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Транзакция проверена и выплачена поставщику!')">
          ⚡ Провести расчет через безопасную сделку
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
    subtitle: 'Разовый дорогой платеж за настройку + регулярная подписка',
    desc: 'Стандарт для корпоративного софта (Enterprise B2B). Оплата за внедрение полностью покрывает затраты инженеров на интеграцию, а подписка приносит высокую маржу.',
    formula: 'Первичный чек = Setup Fee (Разовое внедрение) + 1-й год ARR',
    cases: ['Salesforce', 'SAP', '1С Enterprise', 'Сложные CRM системы'],
    pros: 'Высокий разовый платеж покрывает стоимость привлечения (CAC); клиент крепко привязывается.',
    risks: 'Длинный цикл интеграции (от 1 до 6 месяцев) и высокий барьер входа.',
    aiValidation: [
      'Составить калькулятор трудозатрат инженеров на интеграцию 1 клиента',
      'Разбить оплату внедрения на этапы (Milestone-based Payments)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Смета внедрения Enterprise решения (SOW Breakdown)</span>
          <span style="color:var(--primary-accent);">Проект: WeDrink ERP Connect</span>
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
          <div class="receipt-row total"><span>Первоначальный платеж проекта:</span> <span style="color:var(--secondary-accent);">530 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Смета и договор внедрения утверждены!')">
          ⚡ Утвердить смету и начать интеграцию
        </button>
      </div>
    `
  },

  // 10: B2B2C
  {
    id: 'b2b2c',
    num: '10',
    category: 'b2b',
    title: 'B2B2C (Корпоративная оплата)',
    icon: '🏢',
    subtitle: 'Платит головной офис (B2B), а пользуются сотрудники (C)',
    desc: 'Один крупный контракт с дирекцией или HR-департаментом открывает доступ к тысячам конечных пользователей компании за один день.',
    formula: 'Годовой чек = Корпоративный контракт × Количество филиалов/сотрудников × Оптовый тариф',
    cases: ['Gympass', 'Корпоративное страхование ДМС', 'Skyeng Corporate', 'WeDrink HQ Contract'],
    pros: 'Огромный объем пользователей при минимальных затратах на отдел продаж.',
    risks: 'Высокая зависимость от продления одного крупного контракта.',
    aiValidation: [
      'Сформулировать четкий ценностный ROI для HR/CEO (снижение текучести, продуктивность)',
      'Внедрить дашборд вовлеченности сотрудников для демонстрации ценности перед продлением'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Спецификация корпоративного контракта B2B2C</span>
          <span style="color:var(--secondary-accent);">Заказчик: WeDrink HQ (450 точек)</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Количество точек в сети:</span> <span>450 филиалов</span></div>
          <div class="receipt-row"><span>Оптовая корпоративная ставка за точку:</span> <span>4 500 ₸ / мес (вместо 9 900 ₸)</span></div>
          <div class="receipt-row total"><span>Ежемесячный счет на Головной Офис:</span> <span style="color:var(--secondary-accent);">2 025 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Единый B2B2C контракт успешно подписан!')">
          ⚡ Подписать контракт на всю сеть (450 точек)
        </button>
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
    subtitle: 'Готовый софт продается партнерам для запуска под их брендом',
    desc: 'Платформа предоставляет готовое технологическое ядро, а партнер ставит свой логотип, домен и продает софт своей аудитории.',
    formula: 'Доход = Паушальный взнос за запуск + Ежемесячное лицензионное роялти',
    cases: ['White Label банкинг', 'Конструкторы приложений', 'Франшизы софта'],
    pros: 'Партнеры сами берут на себя маркетинг и продажи на своих локальных рынках.',
    risks: 'Размытие прямого контакта с конечным клиентом.',
    aiValidation: [
      'Создать панель авто-настройки брендинга (домены, логотипы, цвета)',
      'Зафиксировать жесткие стандарты техподдержки первого уровня со стороны партнера'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Конфигуратор White Label платформы</span>
          <span style="color:var(--primary-accent);">Домен: pos.mybrand.kz</span>
        </div>

        <div class="control-group">
          <label class="control-label">Укажите название вашего бренда:</label>
          <input type="text" value="Apex Coffee POS" style="background:#161e2e; border:1px solid var(--panel-border); padding:0.5rem 0.8rem; border-radius:6px; color:#fff; font-size:0.8rem;">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Паушальный взнос (Запуск White Label):</span> <span>450 000 ₸</span></div>
          <div class="receipt-row"><span>Ежемесячное лицензионное роялти:</span> <span>45 000 ₸ / мес</span></div>
          <div class="receipt-row total"><span>Итого за старт собственного софта:</span> <span style="color:var(--secondary-accent);">495 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('White Label платформа собрана!')">
          ⚡ Сгенерировать White Label дистрибутив
        </button>
      </div>
    `
  },

  // 12: PREPAID CREDITS
  {
    id: 'prepaid-credits',
    num: '12',
    category: 'usage',
    title: 'Prepaid Credits (Предоплаченные токены)',
    icon: '🪙',
    subtitle: 'Покупка пакетов внутренней валюты заранее, списание по мере работы',
    desc: 'Клиент покупает токены/кредиты авансом. Это сглаживает психологическое сопротивление тратам и дает компании чистый авансовый Cash Flow.',
    formula: 'Доход = Проданные пакеты токенов + Доход от несписанных остатков (Breakage)',
    cases: ['Midjourney', 'Depositphotos', 'Игровые валюты', 'Twilio Credits'],
    pros: 'Предоплата на счет компании; 10-15% токенов сгорает или не расходуется вовсе.',
    risks: 'Необходимость простого пересчета баланса токенов в реальные деньги.',
    aiValidation: [
      'Настроить авто-пополнение (Auto-topup) при снижении баланса ниже порога',
      'Продумать бонусы за покупку крупных пакетов токенов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Баланс пакетов кредитов генерации</span>
          <span style="color:var(--secondary-accent);" id="credits-balance-display">Баланс: 500 Токенов</span>
        </div>

        <div class="tiers-interactive-grid">
          <div class="interactive-tier-card" onclick="selectCreditPack(100, 5000)">
            <div class="tier-name">100 Токенов</div>
            <div class="tier-price">5 000 ₸</div>
          </div>
          <div class="interactive-tier-card active" onclick="selectCreditPack(500, 20000)">
            <div class="tier-badge">Выгодно +20%</div>
            <div class="tier-name">500 Токенов</div>
            <div class="tier-price">20 000 ₸</div>
          </div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Пакет токенов пополнен!')">
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
    title: 'Lifetime Access (Пожизненный доступ)',
    icon: '♾️',
    subtitle: 'Один крупный разовый платёж за вечную лицензию без подписок',
    desc: 'Используется для быстрого сбора инвестиций от ранних фанатов (Early Adopters) на запуске продукта.',
    formula: 'Разовый приток = Количество проданных LTD лицензий × Крупный чек LTD',
    cases: ['AppSumo', 'Lifetime SaaS Deals', 'Курсы с вечным доступом'],
    pros: 'Мгновенный приток капитала (Cash Flow) на ранней стадии продукта.',
    risks: 'Отсутствие рекуррентных платежей в будущем при вечных затратах на сервера.',
    aiValidation: [
      'Установить жесткий лимит на количество продаваемых вечных лицензий',
      'Убедиться, что затраты на обслуживание 1 пользователя за 3 года ниже цены LTD'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Лимитированная серия Lifetime Лицензий</span>
          <span style="color:var(--amber-accent);">Осталось 3 из 50 лицензий</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Тип лицензии:</span> <strong>Unlimited Lifetime Pass</strong></div>
          <div class="receipt-row"><span>Обновления софта:</span> <span>Вечно включены</span></div>
          <div class="receipt-row total"><span>Разовый платеж за вечный доступ:</span> <span style="color:var(--secondary-accent);">120 000 ₸ (Один раз)</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Пожизненная лицензия успешно приобретена!')">
          ⚡ Купить вечную лицензию (120 000 ₸)
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
    subtitle: 'Плата за статус, сообщество, связей и непубличный контент',
    desc: 'Основная ценность — не софт, а окружение, закрытый нетворкинг и доступ к экспертам.',
    formula: 'Выручка = Члены клуба × Ежегодный клубный взнос',
    cases: ['Product Masters Club', 'YPO', 'Patreon', 'Soho House'],
    pros: 'Очень высокое удержание (Retention) из-за социальных связей и авторитета.',
    risks: 'Требуется постоянная организация ивентов и фасилитация комьюнити.',
    aiValidation: [
      'Определить четкие критерии отбора членов клуба (Vetting process)',
      'Проверить ценность нетворкинга для целевой аудитории'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Закрытый клуб основателей (Executive Membership)</span>
          <span style="color:var(--secondary-accent);">Статус: Верифицирован</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Клубный доступ:</span> <span>Founder Executive Pass</span></div>
          <div class="receipt-row"><span>Преимущества:</span> <span>Мастермайнды + Чат 300+ CEO</span></div>
          <div class="receipt-row total"><span>Ежемесячный клубный взнос:</span> <span style="color:var(--primary-accent);">25 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Вы приняли приглашение в закрытый клуб!')">
          ⚡ Вступить в клуб основателей
        </button>
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
    subtitle: 'Курс бесплатный, но верифицированный диплом оплачивается отдельно',
    desc: 'Модель EdTech массового охвата. Знания отдаются бесплатно, а документ для работодателя монетизируется.',
    formula: 'Доход = Бесплатные студенты × Конверсия в диплом × Стоимость экзамена',
    cases: ['Coursera', 'edX', 'AWS Certifications', 'Scrum Alliance'],
    pros: 'Огромный бесплатный воронковый охват студентов по всему миру.',
    risks: 'Низкая конверсия, если диплом не имеет официального авторитета на рынке.',
    aiValidation: [
      'Убедиться в признании диплома работодателями ниши',
      'Внедрить прокторинг (контроль честности сдачи экзамена)'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Верификация знаний и выдача диплома</span>
          <span style="color:var(--secondary-accent);">Proctoring: Active</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Обучение на курсе:</span> <span style="color:var(--secondary-accent);">0 ₸ (БЕСПЛАТНО)</span></div>
          <div class="receipt-row"><span>Официальный диплом с внесением в реестр:</span> <span>19 900 ₸</span></div>
          <div class="receipt-row total"><span>Итого за верификацию:</span> <span>19 900 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Диплом верифицирован и занесен в реестр!')">
          ⚡ Оплатить верифицированный диплом
        </button>
      </div>
    `
  },

  // 16: PRIORITY & SPEED
  {
    id: 'priority-lane',
    num: '16',
    category: 'usage',
    title: 'Priority & Speed (Приоритетная скорость)',
    icon: '🚀',
    subtitle: 'Базовый сервис в общей очереди, платный — мгновенная скорость',
    desc: 'Монетизирует фактор времени и срочности для профессионалов, не ограничивая доступ базовым пользователям.',
    formula: 'Доход = Количество срочных пользователей × Надбавка за выделенный сервер',
    cases: ['Fast Pass Диснейленд', 'ChatGPT Turbo', 'Fast Track аэропорты'],
    pros: 'Высокая маржинальность; за скорость готовы платить самые платящие клиенты.',
    risks: 'Раздражение бесплатных пользователей, если общая очередь слишком медленная.',
    aiValidation: [
      'Настроить четкий гарантийный latency (например <0.3 сек против 4.5 сек)',
      'Обеспечить инфраструктуру выделенных VIP серверов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Мониторинг загрузки серверов генерации</span>
          <span style="color:var(--amber-accent);">Загрузка общего узла: 89%</span>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Тарифный поток</th>
              <th>Скорость отклика</th>
              <th>Приоритет GPU</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Общая очередь (Free)</td>
              <td>4.8 секунды</td>
              <td>Низкий (в очереди)</td>
            </tr>
            <tr>
              <td><strong style="color:var(--secondary-accent);">Fast-Lane Priority Pass</strong></td>
              <td><strong style="color:var(--secondary-accent);">0.3 секунды</strong></td>
              <td><strong style="color:var(--secondary-accent);">Выделенный VIP узел</strong></td>
            </tr>
          </tbody>
        </table>

        <button class="sim-action-btn" onclick="triggerSimPayment('Приоритетная скорость активирована!')">
          ⚡ Активировать Priority Speed Pass (4 900 ₸/мес)
        </button>
      </div>
    `
  },

  // 17: RENTAL / LEASE
  {
    id: 'rental-lease',
    num: '17',
    category: 'usage',
    title: 'Rental / Lease (Аренда и Лизинг)',
    icon: '🚲',
    subtitle: 'Временное пользование активом без выкупа в собственность',
    desc: 'Превращает разовые крупные капвложения клиента в мелкие ежемесячные операционные расходы.',
    formula: 'Выручка = Время пользования × Почасовая или посуточная ставка аренды',
    cases: ['Whoosh', 'Uber', 'Аренда серверов', 'Лизинг оборудования'],
    pros: 'Доступность дорогих активов для массового рынка; частые повторные платежи.',
    risks: 'Износ, амортизация и поломка физического оборудования.',
    aiValidation: [
      'Рассчитать срок полной окупаемости 1 единицы техники с учетом ремонта',
      'Зафиксировать условия страхования и залоговых депозитов'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Калькулятор аренды коммерческого оборудования</span>
          <span style="color:var(--primary-accent);">Срок: 12 месяцев</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Длительность аренды (в месяцах):</span>
            <span class="control-value" id="lease-months-val">12 месяцев</span>
          </div>
          <input type="range" class="custom-slider" min="1" max="36" value="12" id="lease-slider" oninput="updateLeaseDashboard()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Стоимость оборудования при покупке:</span> <span>1 200 000 ₸</span></div>
          <div class="receipt-row total"><span>Ежемесячный платеж по аренде:</span> <span id="lease-monthly-cost" style="color:var(--secondary-accent);">45 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Договор аренды успешно оформлен!')">
          ⚡ Оформить аренду оборудования
        </button>
      </div>
    `
  },

  // 18: HIDDEN REVENUE / ADS
  {
    id: 'hidden-revenue',
    num: '18',
    category: 'alt',
    title: 'Hidden Revenue / Ads (Рекламная модель)',
    icon: '👁️',
    subtitle: 'Пользователь не платит 0 ₸, за него платят рекламодатели',
    desc: 'Продукт полностью бесплатен для аудитории. Выручка формируется за счет продажи внимания пользователей рекламодателям.',
    formula: 'Доход = (Количество показов / 1000) × Ставка eCPM рекламодателя',
    cases: ['Google', 'TikTok', 'Meta / Instagram', 'Бесплатные игры'],
    pros: 'Взрывной рост базы пользователей из-за отсутствия барьера оплаты.',
    risks: 'Риск ухудшения UX из-за перегрузки интерфейса рекламой.',
    aiValidation: [
      'Оценить необходимый объем MAU (обычно > 100k) для окупаемости',
      'Настроить точный таргетинг рекламы для повышения eCPM'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Монетизация рекламного трафика (eCPM Network)</span>
          <span style="color:var(--secondary-accent);">Сеть: Google AdX</span>
        </div>

        <div class="control-group">
          <div class="control-label">
            <span>Просмотры страниц в месяц:</span>
            <span class="control-value" id="ads-views-val">350 000 просмотров</span>
          </div>
          <input type="range" class="custom-slider" min="10000" max="1000000" step="10000" value="350000" id="ads-slider" oninput="updateAdsDashboard()">
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Средняя ставка eCPM:</span> <span>1 600 ₸ за 1000 показов</span></div>
          <div class="receipt-row total"><span>Выплата от рекламодателей:</span> <span id="ads-net-total" style="color:var(--secondary-accent);">560 000 ₸ / мес</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Рекламный доход выведен на счет!')">
          ⚡ Симулировать выплату рекламной сети
        </button>
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
    subtitle: 'Агрегация и продажа аналитики рынка B2B-клиентам',
    desc: 'Обезличенные данные о поведении пользователей упаковываются в дорогостоящие аналитические отчеты для крупных брендов.',
    formula: 'Доход = Продажи подписок на аналитический терминал B2B клиентам',
    cases: ['2GIS Analytics', 'Nielsen', 'Bloomberg Terminal', 'Foursquare Data'],
    pros: 'Высокая маржинальность продажи данных поверх действующего бизнеса.',
    risks: 'Строгие законы о персональных данных (GDPR / Законы РК).',
    aiValidation: [
      'Убедиться в 100% анонимизации данных',
      'Проверить ценность отчетов для корпоративных аналитиков'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Выгрузка агрегированного аналитического отчета</span>
          <span style="color:var(--primary-accent);">Статус: Анонимизировано</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Объем выборки:</span> <span>Данные 450 кофеен за 12 месяцев</span></div>
          <div class="receipt-row"><span>Покупатель:</span> <span>Дистрибьютор кофейного зерна</span></div>
          <div class="receipt-row total"><span>Стоимость отчета:</span> <span style="color:var(--secondary-accent);">750 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Аналитический отчет успешно продан!')">
          ⚡ Выгрузить аналитический B2B отчет
        </button>
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
    subtitle: 'Платформа получает 15-30% с продаж сторонних разработчиков',
    desc: 'Внешние разработчики создают дополнения для вашей платформы, а вы удерживаете комиссию с каждой продажи плагина.',
    formula: 'Доход = Продажи плагинов сторонних девелоперов × 30% комиссии платформы',
    cases: ['Shopify App Store', 'WordPress', 'Salesforce AppExchange'],
    pros: 'Сторонние разработчики бесплатно расширяют функционал вашего продукта.',
    risks: 'Требуется создание открытых API и поддержка комьюнити девелоперов.',
    aiValidation: [
      'Разработать открытый SDK и документацию API',
      'Зафиксировать разделение доходов 70/30'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Биллинг магазина плагинов (App Marketplace)</span>
          <span style="color:var(--secondary-accent);">Доля платформы: 30%</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Продажи плагина "WhatsApp Рассылка" (100 продаж):</span> <span>600 000 ₸</span></div>
          <div class="receipt-row"><span>Комиссия нашей платформы (30%):</span> <strong style="color:var(--secondary-accent);">180 000 ₸</strong></div>
          <div class="receipt-row total"><span>Выплата стороннему разработчику:</span> <span>420 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Расчет магазина плагинов проведен!')">
          ⚡ Провести расчет с разработчиком плагина
        </button>
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
    subtitle: 'Крупный бренд финансирует проект взамен на интеграцию',
    desc: 'Генеральный спонсор платит крупную фиксированную сумму за эксклюзивное присутствие своего бренда в вашем продукте.',
    formula: 'Доход = Фиксированный контракт со спонсором на квартал/год',
    cases: ['Хакатоны RedBull', 'Спецпроекты VC.ru', 'Бесплатный Wi-Fi в метро'],
    pros: 'Крупные платежи сразу; пользователи получают продукт бесплатно.',
    risks: 'Зависимость от маркетинговых бюджетов нескольких крупных спонсоров.',
    aiValidation: [
      'Сформировать прозрачный медиакит с охватами целевой аудитории',
      'Зафиксировать требования к брендингу'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Спецификация спонсорского контракта</span>
          <span style="color:var(--amber-accent);">Спонсор: Банковский бренд</span>
        </div>

        <div class="receipt-output-box">
          <div class="receipt-row"><span>Формат:</span> <span>Генеральный спонсор ивента / раздела</span></div>
          <div class="receipt-row"><span>Срок интеграции:</span> <span>3 месяца</span></div>
          <div class="receipt-row total"><span>Сумма спонсорского контракта:</span> <span style="color:var(--secondary-accent);">1 800 000 ₸</span></div>
        </div>

        <button class="sim-action-btn" onclick="triggerSimPayment('Спонсорский контракт активирован!')">
          ⚡ Активировать спонсорский пакет
        </button>
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
    subtitle: 'Пользователь сам решает сколько заплатить за продукт',
    desc: 'Добровольные пожертвования и чаевые. Опирается на высокую лояльность аудитории и благодарность за полезный контент/софт.',
    formula: 'Доход = Количество пользователей × Средний размер чаевых (Tip)',
    cases: ['Wikipedia', 'Radiohead', 'Buy Me a Coffee', 'Humble Bundle'],
    pros: 'Высочайшая лояльность сообщества, отсутствие барьера покупки.',
    risks: 'Нестабильность доходов; 80-90% пользователей выбирает 0.',
    aiValidation: [
      'Настроить подсказки сумм (пресеты 500 ₸, 2000 ₸, 5000 ₸)',
      'Внедрить публичную доску благодарности меценатам'
    ],
    renderWidget: () => `
      <div class="simulator-card">
        <div class="sim-section-title">
          <span>Поддержка независимого проекта (Tip Jar)</span>
          <span style="color:var(--secondary-accent);" id="pwyw-val-display">Выбрано: 2 000 ₸</span>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="sim-action-btn secondary" style="flex:1;" onclick="setPwywVal(500)">500 ₸ ☕</button>
          <button class="sim-action-btn" style="flex:1;" onclick="setPwywVal(2000)">2 000 ₸ 🍕</button>
          <button class="sim-action-btn secondary" style="flex:1;" onclick="setPwywVal(5000)">5 000 ₸ 🚀</button>
        </div>

        <button class="sim-action-btn" style="background:var(--secondary-accent); color:#000;" onclick="triggerSimPayment('Огромное спасибо за поддержку проекта!')">
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

  // Render Left Panel (75%)
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

  // Render Right Panel (25%)
  const sidebarTitle = document.getElementById('sidebar-title');
  sidebarTitle.innerHTML = `<span>📊</span> Бизнес-разбор: ${model.title.split('(')[0]}`;

  const sidebarBody = document.getElementById('sidebar-body');
  sidebarBody.innerHTML = `
    <div class="info-card-block">
      <div class="info-block-title">📌 Суть и механика модели</div>
      <p class="info-block-text">${model.desc}</p>
    </div>

    <div class="info-card-block">
      <div class="info-block-title">📐 Формула Unit-экономики</div>
      <div class="formula-box">${model.formula}</div>
    </div>

    <div class="info-card-block">
      <div class="info-block-title">🏢 Где применяется на рынке</div>
      <div class="example-tags-wrap">
        ${model.cases.map(c => `<span class="example-tag">${c}</span>`).join('')}
      </div>
    </div>

    <div class="info-card-block">
      <div class="info-block-title" style="color:var(--secondary-accent);">👍 Главный плюс для бизнеса</div>
      <p class="info-block-text" style="color:var(--text-main);">${model.pros}</p>
    </div>

    <div class="info-card-block">
      <div class="info-block-title" style="color:#ff6b6b;">⚠️ Ключевой риск и подводный камень</div>
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

// Widget Handlers
function setSubCycle(cycle) {
  playClick();
  subCycle = cycle;
  loadModel('subscription');
}

function toggleFreemiumEnterprise() {
  playChime(659.25, 0.3);
  const status = document.getElementById('freemium-badge-status');
  const projVal = document.getElementById('freemium-proj-val');
  const projBar = document.getElementById('freemium-proj-bar');
  const btn = document.getElementById('freemium-upgrade-btn');

  if (status.textContent.includes('FREE')) {
    status.textContent = 'ТЕКУЩИЙ ТАРИФ: PRO ENTERPRISE';
    status.style.color = 'var(--secondary-accent)';
    projVal.textContent = 'Безлимитно (PRO Active)';
    projBar.style.background = 'var(--secondary-accent)';
    btn.textContent = '✓ Аккаунт успешно переведен на PRO';
    showToast('🎉 Все корпоративные лимиты сняты!');
  } else {
    status.textContent = 'ТЕКУЩИЙ ТАРИФ: FREE';
    status.style.color = 'var(--amber-accent)';
    projVal.textContent = '3 / 3 Проекта';
    projBar.style.background = 'var(--amber-accent)';
    btn.textContent = '⚡ Переключить аккаунт на PRO Enterprise (19 900 ₸/мес)';
  }
}

function addTeamMember() {
  const input = document.getElementById('new-member-email');
  if (input && input.value.trim()) {
    playClick();
    teamMembers.push(input.value.trim());
    input.value = '';
    loadModel('per-seat');
  }
}

function removeTeamMember(idx) {
  playClick();
  teamMembers.splice(idx, 1);
  loadModel('per-seat');
}

function updateMeteredDashboard() {
  const apiVal = document.getElementById('metered-api-slider').value;
  const gbVal = document.getElementById('metered-gb-slider').value;

  document.getElementById('metered-api-val').textContent = `${parseInt(apiVal).toLocaleString()} вызовов`;
  document.getElementById('metered-gb-val').textContent = `${gbVal} GB`;

  const apiCost = (apiVal / 1000) * 0.2;
  const gbCost = gbVal * 0.08;
  const totalUsd = apiCost + gbCost;

  document.getElementById('metered-api-cost').textContent = `$${apiCost.toFixed(2)}`;
  document.getElementById('metered-gb-cost').textContent = `$${gbCost.toFixed(2)}`;
  document.getElementById('metered-total-cost').textContent = `$${totalUsd.toFixed(2)} (~${Math.round(totalUsd * 450).toLocaleString()} ₸)`;
}

function updateSfDashboard() {
  const val = document.getElementById('sf-slider').value;
  document.getElementById('sf-saved-val').textContent = `${parseInt(val).toLocaleString()} ₸`;
  document.getElementById('sf-effect-display').textContent = `${parseInt(val).toLocaleString()}`;
  
  const fee = val * 0.10;
  const net = val - fee;

  document.getElementById('sf-client-net').textContent = `${Math.round(net).toLocaleString()} ₸`;
  document.getElementById('sf-service-fee').textContent = `${Math.round(fee).toLocaleString()} ₸`;
}

function updateIsaDashboard() {
  const val = document.getElementById('isa-sal-slider').value;
  document.getElementById('isa-sal-val').textContent = `${parseInt(val).toLocaleString()} ₸ / мес`;
  const monthly = val * 0.15;
  document.getElementById('isa-pay-monthly').textContent = `${Math.round(monthly).toLocaleString()} ₸ / мес`;
}

function updateMpDashboard() {
  const val = document.getElementById('mp-gmv-slider').value;
  document.getElementById('mp-gmv-val').textContent = `${parseInt(val).toLocaleString()} ₸`;
  const take = val * 0.12;
  const net = val - take - 5000;

  document.getElementById('mp-take-cost').textContent = `${Math.round(take).toLocaleString()} ₸`;
  document.getElementById('mp-vendor-net').textContent = `${Math.round(net).toLocaleString()} ₸`;
}

function selectCreditPack(tokens, price) {
  playClick();
  document.getElementById('credits-balance-display').textContent = `Баланс: ${tokens} Токенов`;
}

function updateLeaseDashboard() {
  const val = document.getElementById('lease-slider').value;
  document.getElementById('lease-months-val').textContent = `${val} месяцев`;
  const monthly = (1200000 / val) + 15000;
  document.getElementById('lease-monthly-cost').textContent = `${Math.round(monthly).toLocaleString()} ₸ / мес`;
}

function updateAdsDashboard() {
  const val = document.getElementById('ads-slider').value;
  document.getElementById('ads-views-val').textContent = `${parseInt(val).toLocaleString()} просмотров`;
  const total = (val / 1000) * 1600;
  document.getElementById('ads-net-total').textContent = `${Math.round(total).toLocaleString()} ₸ / мес`;
}

function setPwywVal(val) {
  playClick();
  document.getElementById('pwyw-val-display').textContent = `Выбрано: ${val.toLocaleString()} ₸`;
  document.getElementById('pwyw-btn-val').textContent = `${val.toLocaleString()} ₸`;
}

let pendingSimMsg = '';

function triggerSimPayment(msg) {
  playClick();
  pendingSimMsg = msg;

  const currentModel = modelsData.find(m => m.id === currentModelId);
  const title = currentModel ? currentModel.title.split('(')[0] : 'Оплата услуги';
  
  let amount = '24 900 ₸';
  const priceEl = document.querySelector('.tier-price') || document.querySelector('#sub-final-total') || document.querySelector('#seat-calc-total') || document.querySelector('#metered-total-cost') || document.querySelector('#sf-service-fee');
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
