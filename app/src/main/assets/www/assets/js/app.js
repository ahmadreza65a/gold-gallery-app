// =====================================================
// منطق تعاملی پنل مشتریان گالری طلا و جواهر
// =====================================================

const formatToman = (num) => Number(num).toLocaleString('fa-IR');

// --- ناوبری بین صفحات ---
function navigateTo(pageId) {
  document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  // به‌روزرسانی دکمه فعال نوار پایین
  const navMap = {
    'page-home': 'page-home',
    'page-rates': 'page-rates',
    'page-trade': 'page-rates',
    'page-gallery': 'page-rates',
    'page-product-detail': 'page-rates',
    'page-vault': 'page-vault',
    'page-growth': 'page-vault',
    'page-delivery': 'page-vault',
    'page-wallet': 'page-vault',
    'page-history': 'page-vault',
    'page-installment': 'page-vault',
    'page-loans': 'page-vault',
    'page-loan-detail': 'page-vault',
    'page-profile': 'page-profile',
    'page-kyc': 'page-profile',
    'page-support': 'page-profile'
  };
  const activeNav = navMap[pageId] || 'page-home';
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === activeNav);
  });

  if (pageId === 'page-rates') initMarketChart();
  if (pageId === 'page-growth') renderGrowthView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- اعلان Toast ---
function showToast(msg) {
  document.getElementById('toastMsg').textContent = msg;
  const toastEl = document.getElementById('appToast');
  new bootstrap.Toast(toastEl, { delay: 2600 }).show();
}

// ==================== نرخ لحظه‌ای فلزات و ارز ====================
const marketRates = [
  { cat: 'metals', name: 'طلای ۱۸ عیار (گرم)', price: 4260000, change: '+۱.۸٪', icon: 'bi-coin' },
  { cat: 'metals', name: 'طلای آب‌شده (مثقال)', price: 18450000, change: '+۱.۵٪', icon: 'bi-bricks' },
  { cat: 'metals', name: 'نقره ۹۹۹ (گرم)', price: 68500, change: '+۰.۹٪', icon: 'bi-gem' },
  { cat: 'coins', name: 'سکه امامی', price: 52300000, change: '+۱.۲٪', icon: 'bi-disc-fill' },
  { cat: 'coins', name: 'نیم سکه بهار آزادی', price: 26800000, change: '+۰.۸٪', icon: 'bi-disc' },
  { cat: 'coins', name: 'ربع سکه بهار آزادی', price: 16900000, change: '+۰.۴٪', icon: 'bi-circle-fill' },
  { cat: 'currency', name: 'دلار آمریکا (USD)', price: 68500, change: '+۰.۶٪', icon: 'bi-currency-dollar' },
  { cat: 'currency', name: 'یورو اروپا (EUR)', price: 73200, change: '+۰.۵٪', icon: 'bi-currency-euro' },
  { cat: 'currency', name: 'درهم امارات (AED)', price: 18650, change: '+۰.۴٪', icon: 'bi-cash-coin' },
  { cat: 'currency', name: 'لیر ترکیه (TRY)', price: 1980, change: '+۰.۲٪', icon: 'bi-cash' }
];

function renderRates(filter = 'all') {
  const container = document.getElementById('ratesList');
  const items = filter === 'all' ? marketRates : marketRates.filter(r => r.cat === filter);
  container.innerHTML = items.map(r => `
    <div class="luxury-card d-flex justify-content-between align-items-center py-2">
      <div class="d-flex align-items-center gap-2">
        <div class="quick-action-box" style="width:40px;height:40px;font-size:1.05rem"><i class="bi ${r.icon}"></i></div>
        <div>
          <div class="fw-bold small">${r.name}</div>
          <span class="badge-profit" style="font-size:0.68rem">${r.change}</span>
        </div>
      </div>
      <div class="fw-bold text-gold small">${formatToman(r.price)} تومان</div>
    </div>
  `).join('');
}

function filterRates(cat, btn) {
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRates(cat);
}

function refreshRates() {
  showToast('نرخ‌های بازار با موفقیت به‌روزرسانی شد');
}

let marketChartInstance = null;
function initMarketChart() {
  const ctx = document.getElementById('marketChart');
  if (!ctx || marketChartInstance) return;
  const grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 150);
  grad.addColorStop(0, 'rgba(223, 180, 92, 0.42)');
  grad.addColorStop(1, 'rgba(223, 180, 92, 0.0)');

  marketChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['۱۰:۰۰', '۱۲:۰۰', '۱۴:۰۰', '۱۶:۰۰', '۱۸:۰۰', 'اکنون'],
      datasets: [{
        data: [18120000, 18210000, 18190000, 18340000, 18390000, 18450000],
        borderColor: '#f8e1a1',
        borderWidth: 2.5,
        backgroundColor: grad,
        fill: true,
        tension: 0.4,
        pointRadius: 3.5,
        pointBackgroundColor: '#f8e1a1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#a5a198', font: { size: 10 } } },
        y: { display: false }
      }
    }
  });
}

// ==================== خرید و فروش آنلاین طلا ====================
let tradeMode = 'buy';
let currentGoldRate = 4260000;

function setTradeMode(mode) {
  tradeMode = mode;
  document.getElementById('btnModeBuy').classList.toggle('active', mode === 'buy');
  document.getElementById('btnModeSell').classList.toggle('active', mode === 'sell');
  document.getElementById('tradeSubmitBtn').textContent = mode === 'buy' ? 'ثبت سفارش خرید' : 'ثبت سفارش فروش';
}

function setGoldCategory(label, rate, btn) {
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentGoldRate = rate;
  document.getElementById('tradeCatLabel').textContent = label;
  document.getElementById('tradeUnitRate').textContent = `${formatToman(rate)} تومان`;
  calcFromWeight();
}

function calcFromAmount() {
  const amount = parseFloat(document.getElementById('tradeAmountInput').value) || 0;
  const weight = amount / currentGoldRate;
  document.getElementById('tradeWeightInput').value = weight.toFixed(3);
  document.getElementById('tradeFeeDisplay').textContent = `${formatToman(Math.round(amount * 0.005))} تومان`;
}

function calcFromWeight() {
  const weight = parseFloat(document.getElementById('tradeWeightInput').value) || 0;
  const amount = Math.round(weight * currentGoldRate);
  document.getElementById('tradeAmountInput').value = amount;
  document.getElementById('tradeFeeDisplay').textContent = `${formatToman(Math.round(amount * 0.005))} تومان`;
}

function quickWeight(w) {
  document.getElementById('tradeWeightInput').value = w;
  calcFromWeight();
}

function submitTradeOrder() {
  const w = document.getElementById('tradeWeightInput').value;
  showToast(`سفارش ${tradeMode === 'buy' ? 'خرید' : 'فروش'} ${w} گرم طلا با موفقیت ثبت شد`);
}

// ==================== روند رشد و سود همه خریدها (امانی + تحویل‌شده) ====================
const customerPurchases = [
  {
    id: 0,
    type: 'custody',
    statusLabel: 'امانی در خزانه',
    title: 'طلای آب‌شده امانی (۵۰ گرم)',
    date: '۱۵ شهریور ۱۴۰۵',
    meta: 'تاریخ خرید: ۱۵ شهریور • نگهداری امانی در خزانه گالری',
    buyPrice: 185000000,
    currentPrice: 213000000,
    labels: ['۱۵ شهریور', '۱ مهر', '۱۵ مهر', '۱ آبان', '۱۵ آبان', 'امروز'],
    series: [185000000, 191500000, 198000000, 203200000, 208500000, 213000000]
  },
  {
    id: 1,
    type: 'custody',
    statusLabel: 'قرارداد امانی #۴۰۸۲',
    title: 'طلای آب‌شده ۱۸ عیار (۸۰ گرم)',
    date: '۱۰ مهر ۱۴۰۵',
    meta: 'تاریخ خرید: ۱۰ مهر • قرارداد امانی نزد طلافروش',
    buyPrice: 306000000,
    currentPrice: 340800000,
    labels: ['۱۰ مهر', '۲۰ مهر', '۱ آبان', '۱۰ آبان', '۲۰ آبان', 'امروز'],
    series: [306000000, 312000000, 320500000, 326000000, 334000000, 340800000]
  },
  {
    id: 2,
    type: 'delivered',
    statusLabel: 'تحویل‌شده (فیزیکی)',
    title: 'دستبند طلای نو کارتیه (۱۲.۴ گرم)',
    date: '۵ مرداد ۱۴۰۵',
    meta: 'تاریخ خرید: ۵ مرداد • تحویل حضوری در گالری',
    buyPrice: 53000000,
    currentPrice: 59800000,
    labels: ['۵ مرداد', '۲۵ مرداد', '۱۵ شهریور', '۵ مهر', '۲۵ مهر', 'امروز'],
    series: [53000000, 54200000, 55800000, 57100000, 58600000, 59800000]
  },
  {
    id: 3,
    type: 'delivered',
    statusLabel: 'تحویل‌شده (فیزیکی)',
    title: 'سکه امامی بانکی (۱ عدد)',
    date: '۲۰ شهریور ۱۴۰۵',
    meta: 'تاریخ خرید: ۲۰ شهریور • تحویل فیزیکی با وکیوم گالری',
    buyPrice: 46500000,
    currentPrice: 52300000,
    labels: ['۲۰ شهریور', '۵ مهر', '۲۰ مهر', '۵ آبان', '۲۰ آبان', 'امروز'],
    series: [46500000, 47800000, 49100000, 50200000, 51400000, 52300000]
  }
];

let selectedPurchaseId = 0;
let currentPurchaseFilter = 'all';
let growthChartInstance = null;

function filterPurchases(filter, btn) {
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPurchaseFilter = filter;
  const filtered = filter === 'all' ? customerPurchases : customerPurchases.filter(p => p.type === filter);
  if (filtered.length > 0) selectedPurchaseId = filtered[0].id;
  renderGrowthView();
}

function openPurchaseGrowth(id) {
  selectedPurchaseId = id;
  navigateTo('page-growth');
}

function renderGrowthView() {
  const listEl = document.getElementById('purchaseSelectorList');
  const filtered = currentPurchaseFilter === 'all'
    ? customerPurchases
    : customerPurchases.filter(p => p.type === currentPurchaseFilter);

  listEl.innerHTML = filtered.map(p => {
    const profit = p.currentPrice - p.buyPrice;
    const activeBorder = p.id === selectedPurchaseId ? 'border-color: var(--gold-border-strong); box-shadow: var(--gold-glow);' : '';
    return `
      <div class="luxury-card clickable d-flex justify-content-between align-items-center py-2" style="${activeBorder}" onclick="selectPurchase(${p.id})">
        <div>
          <div class="fw-bold small">${p.title}</div>
          <div class="text-muted-gold" style="font-size:0.72rem">${p.statusLabel} • ${p.date}</div>
        </div>
        <div class="text-end">
          <div class="badge-profit">+${formatToman(profit)} ت</div>
        </div>
      </div>
    `;
  }).join('');

  const item = customerPurchases.find(p => p.id === selectedPurchaseId) || customerPurchases[0];
  const profit = item.currentPrice - item.buyPrice;
  const pct = ((profit / item.buyPrice) * 100).toFixed(1);

  document.getElementById('growthItemTitle').textContent = item.title;
  document.getElementById('growthItemMeta').textContent = item.meta;
  document.getElementById('growthItemStatus').textContent = item.statusLabel;
  document.getElementById('growthBuyPrice').textContent = `${formatToman(item.buyPrice)} تومان`;
  document.getElementById('growthCurrentPrice').textContent = `${formatToman(item.currentPrice)} تومان`;
  document.getElementById('growthProfitToman').textContent = `+${formatToman(profit)} تومان`;
  document.getElementById('growthProfitPercent').textContent = `+${pct}٪ رشد`;

  const ctx = document.getElementById('growthChart');
  if (growthChartInstance) growthChartInstance.destroy();
  const grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 190);
  grad.addColorStop(0, 'rgba(248, 225, 161, 0.45)');
  grad.addColorStop(1, 'rgba(223, 180, 92, 0.0)');

  growthChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: item.labels,
      datasets: [{
        label: 'ارزش به تومان',
        data: item.series,
        borderColor: '#f8e1a1',
        borderWidth: 2.8,
        backgroundColor: grad,
        fill: true,
        tension: 0.38,
        pointRadius: 4,
        pointBackgroundColor: '#f8e1a1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => `${formatToman(c.raw)} تومان`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#a5a198', font: { size: 10 } } },
        y: {
          grid: { color: 'rgba(223, 180, 92, 0.08)' },
          ticks: {
            color: '#a5a198',
            font: { size: 9 },
            callback: (v) => (v / 1000000).toFixed(0) + 'M'
          }
        }
      }
    }
  });
}

function selectPurchase(id) {
  selectedPurchaseId = id;
  renderGrowthView();
}

// ==================== ویترین گالری طلا ====================
const galleryProducts = [
  { id: 1, cat: 'new', name: 'دستبند طلای نو کارتیه', code: '۱۸ عیار | کد N-1042', weight: '۱۲.۴ گرم', wage: '۷٪', price: 59800000, icon: 'bi-gem' },
  { id: 2, cat: 'used', name: 'گردنبند دست دوم زنجیری', code: '۱۸ عیار | کد D-2019', weight: '۸.۲ گرم', wage: 'بدون اجرت', price: 36500000, icon: 'bi-stars' },
  { id: 3, cat: 'new', name: 'انگشتر مینیمال نو', code: '۱۸ عیار | کد N-1088', weight: '۴.۵ گرم', wage: '۶٪', price: 22100000, icon: 'bi-record-circle' },
  { id: 4, cat: 'used', name: 'النگو دست دوم تراش‌دار', code: '۱۸ عیار | کد D-2054', weight: '۱۵.۰ گرم', wage: 'کم‌اجرت', price: 66400000, icon: 'bi-circle' },
  { id: 5, cat: 'coin', name: 'سکه امامی بانکی', code: 'کد ST-001', weight: '۸.۱۳۳ گرم', wage: 'بانکی', price: 52300000, icon: 'bi-disc-fill' },
  { id: 6, cat: 'coin', name: 'شمش طلای ۲۴ عیار', code: 'کد A-995', weight: '۱۰.۰۰۰ گرم', wage: 'خالص', price: 58900000, icon: 'bi-bricks' }
];

function renderGallery(cat = 'all', btn = null) {
  if (btn) {
    btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const items = cat === 'all' ? galleryProducts : galleryProducts.filter(p => p.cat === cat);
  document.getElementById('galleryGrid').innerHTML = items.map(p => `
    <div class="col-6">
      <div class="product-card" style="cursor:pointer" onclick="openProductDetail(${p.id})">
        <div class="product-visual"><i class="bi ${p.icon}"></i></div>
        <div class="p-2 d-flex flex-column flex-grow-1 justify-content-between">
          <div>
            <div class="fw-bold small mb-1">${p.name}</div>
            <div class="text-muted-gold" style="font-size:0.7rem">${p.weight} • ${p.wage}</div>
          </div>
          <div class="mt-2">
            <div class="fw-bold text-gold small mb-2">${formatToman(p.price)} ت</div>
            <button class="btn btn-gold w-100 py-1" style="font-size:0.74rem">سفارش خرید</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function openProductDetail(id) {
  const p = galleryProducts.find(x => x.id === id);
  if (!p) return;
  document.getElementById('detailIcon').innerHTML = `<i class="bi ${p.icon}"></i>`;
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailCode').textContent = p.code;
  document.getElementById('detailWeight').textContent = p.weight;
  document.getElementById('detailWage').textContent = p.wage;
  document.getElementById('detailPrice').textContent = `${formatToman(p.price)} تومان`;
  navigateTo('page-product-detail');
}

// ==================== کیف پول ====================
let walletBalance = 185400000;
function walletAction(type) {
  if (type === 'deposit') {
    walletBalance += 10000000;
    showToast('۱۰,۰۰۰,۰۰۰ تومان با موفقیت به کیف پول واریز شد');
  } else {
    if (walletBalance >= 10000000) {
      walletBalance -= 10000000;
      showToast('درخواست برداشت ۱۰,۰۰۰,۰۰۰ تومان ثبت شد');
    }
  }
  document.getElementById('walletBalanceDisplay').textContent = formatToman(walletBalance);
}

// ==================== فروش اقساطی ====================
let instMonths = 6;
function setInstMonths(m, btn) {
  instMonths = m;
  btn.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  calcInstallment();
}

function calcInstallment() {
  const total = parseInt(document.getElementById('instRange').value, 10);
  const down = Math.round(total * 0.3);
  const remain = total - down;
  const withInterest = Math.round(remain * (1 + 0.025 * instMonths));
  const monthly = Math.round(withInterest / instMonths);

  document.getElementById('instTotalLabel').textContent = `${formatToman(total)} تومان`;
  document.getElementById('instDownLabel').textContent = `${formatToman(down)} تومان`;
  document.getElementById('instMonthlyLabel').textContent = `${formatToman(monthly)} تومان`;
}

// ==================== جزئیات ۴ نوع وام ====================
const loanData = {
  goods: {
    title: 'وام خرید کالا',
    icon: 'bi-bag-check',
    max: '۲۰۰,۰۰۰,۰۰۰ تومان',
    pill1: 'کارمزد: ۲۳٪',
    pill2: 'بازپرداخت: ۶ تا ۱۸ ماه',
    bullets: [
      'مناسب برای خرید طلا، موبایل و کالاهای دیجیتال',
      'بدون نیاز به ضامن رسمی در صورت ارائه وثیقه طلا',
      'تایید و تحویل کالا حداکثر ظرف ۴۸ ساعت کاری',
      'مدارک مورد نیاز: کارت ملی و تکمیل احراز هویت در پروفایل'
    ]
  },
  invest: {
    title: 'وام سرمایه‌گذاری',
    icon: 'bi-graph-up-arrow',
    max: '۵۰۰,۰۰۰,۰۰۰ تومان',
    pill1: 'وثیقه: طلای خزانه',
    pill2: 'بازپرداخت: ۳ تا ۱۲ ماه',
    bullets: [
      'تامین نقدینگی سریع بدون نیاز به فروش طلای شما',
      'پرداخت تسهیلات تا ۷۰٪ ارزش روز طلای امانی در خزانه',
      'حفظ کامل سود رشد قیمت طلا برای مشتری در طول دوره',
      'امکان تسویه زودتر از موعد با کسر سود باقی‌مانده'
    ]
  },
  resalat: {
    title: 'وام بانک رسالت',
    icon: 'bi-bank2',
    max: '۳۰۰,۰۰۰,۰۰۰ تومان',
    pill1: 'کارمزد قرض‌الحسنه: ۲٪',
    pill2: 'بازپرداخت: ۱۲ تا ۲۴ ماه',
    bullets: [
      'تسهیلات قرض‌الحسنه بدون سود بانکی (فقط ۲٪ کارمزد سالانه)',
      'امکان تامین امتیاز و انجام کامل مراحل به‌صورت غیرحضوری',
      'نیازمند اعتبارسنجی سامانه مرآت و حساب فعال بانک رسالت',
      'پشتیبانی کامل کارشناسان گالری تا مرحله واریز تسهیلات'
    ]
  },
  bazaar: {
    title: 'وام بازاری',
    icon: 'bi-lightning-charge',
    max: '۱,۰۰۰,۰۰۰,۰۰۰ تومان',
    pill1: 'پرداخت فوری: ۲۴ ساعته',
    pill2: 'مدت: ۱ تا ۶ ماه',
    bullets: [
      'پرداخت آنی و بدون بروکراسی و صف‌های طولانی بانکی',
      'پشتوانه: طلای آب‌شده، سکه بانکی یا طلای زینتی',
      'امکان تمدید قرارداد در پایان دوره با توافق طرفین',
      'تحویل فوری وثیقه بلافاصله پس از تسویه کامل'
    ]
  }
};

function openLoanDetail(key) {
  const d = loanData[key];
  if (!d) return;
  document.getElementById('loanDetailTitle').textContent = d.title;
  document.getElementById('loanDetailIcon').innerHTML = `<i class="bi ${d.icon}"></i>`;
  document.getElementById('loanDetailMax').textContent = d.max;
  document.getElementById('loanDetailPill1').textContent = d.pill1;
  document.getElementById('loanDetailPill2').textContent = d.pill2;
  document.getElementById('loanDetailSectionHeading').textContent = `توضیحات و شرایط ${d.title}`;
  document.getElementById('loanDetailBullets').innerHTML = d.bullets
    .map(b => `<li class="d-flex gap-2"><i class="bi bi-dot text-gold fs-5" style="line-height:1.1"></i><span>${b}</span></li>`)
    .join('');
  document.getElementById('loanApplyBtn').textContent = `ثبت درخواست ${d.title}`;
  navigateTo('page-loan-detail');
}

// ==================== پروفایل و احراز هویت (KYC) ====================
function previewProfilePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    document.getElementById('kycAvatarPreview').src = src;
    document.getElementById('profileAvatar').src = src;
    document.getElementById('homeAvatar').src = src;
    showToast('تصویر پروفایل با موفقیت الصاق شد');
  };
  reader.readAsDataURL(file);
}

function saveKycProfile(e) {
  e.preventDefault();
  const name = document.getElementById('kycName').value.trim();
  const card = document.getElementById('kycCard').value.trim();
  document.getElementById('homeUserName').textContent = `سلام، ${name}`;
  document.getElementById('profileFullName').textContent = name;
  document.getElementById('walletCardHolder').textContent = name;
  document.getElementById('walletCardNumber').textContent = card;
  showToast('مشخصات کاربری و بانکی شما ذخیره و تایید شد');
  navigateTo('page-profile');
}

// ==================== چت پشتیبانی VIP ====================
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const txt = input.value.trim();
  if (!txt) return;
  const box = document.getElementById('chatMessages');
  box.innerHTML += `<div class="chat-bubble-user">${txt}</div>`;
  input.value = '';
  box.scrollTop = box.scrollHeight;
  setTimeout(() => {
    box.innerHTML += `<div class="chat-bubble-bot">پیام شما دریافت شد. کارشناس ویژه VIP تا لحظاتی دیگر پاسخگوی شماست.</div>`;
    box.scrollTop = box.scrollHeight;
  }, 600);
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
  renderRates('all');
  renderGallery('all');
  calcInstallment();
});

// ==================== دکمه برگشت اندروید ====================
const _pageStack = ['page-home'];
const _origNavigate = navigateTo;
navigateTo = function (id) {
  if (_pageStack[_pageStack.length - 1] !== id) _pageStack.push(id);
  _origNavigate(id);
};
window.androidBack = function () {
  if (_pageStack.length > 1) {
    _pageStack.pop();
    _origNavigate(_pageStack[_pageStack.length - 1]);
    return true;
  }
  return false;
};
