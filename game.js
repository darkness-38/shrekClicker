// Oyun Değişkenleri
let score = 0;
let clickPower = 1;
let passiveIncome = 0;
let totalClicks = 0; // Başarımlar için toplam tıklama

// DOM Elementleri
const scoreElement = document.getElementById('score');
const cpsElement = document.getElementById('cps');
const clickBtn = document.getElementById('click-btn');
const upgradesContainer = document.getElementById('upgrades-container');
const clickUpgradesContainer = document.getElementById('click-upgrades-container');
const achievementsContainer = document.getElementById('achievements-container');
const notification = document.getElementById('achievement-notification');
const notificationText = document.getElementById('achievement-text');

// Yükseltme Verileri
const upgrades = [
    { id: 'onion', name: 'Soğan', type: 'cps', baseCost: 15, currentCost: 15, power: 0.5, count: 0, icon: '🧅' },
    { id: 'strong_finger', name: 'Güçlü Parmak', type: 'click', baseCost: 50, currentCost: 50, power: 1, count: 0, icon: '👆' },
    { id: 'donkey', name: 'Eşek', type: 'cps', baseCost: 100, currentCost: 100, power: 3, count: 0, icon: '🐴' },
    { id: 'ogre_fist', name: 'Ogre Yumruğu', type: 'click', baseCost: 250, currentCost: 250, power: 3, count: 0, icon: '👊' },
    { id: 'gingerbread', name: 'Kurabiye Adam', type: 'cps', baseCost: 300, currentCost: 300, power: 8, count: 0, icon: '🍪' },
    { id: 'swamp', name: 'Bataklık', type: 'cps', baseCost: 1000, currentCost: 1000, power: 20, count: 0, icon: '🏞️' },
    { id: 'club', name: 'Dev Sopa', type: 'click', baseCost: 1500, currentCost: 1500, power: 10, count: 0, icon: '🪵' },
    { id: 'dragon', name: 'Ejderha', type: 'cps', baseCost: 5000, currentCost: 5000, power: 60, count: 0, icon: '🐉' },
    { id: 'fiona', name: 'Prenses Fiona', type: 'cps', baseCost: 20000, currentCost: 20000, power: 200, count: 0, icon: '👸' },
    { id: 'castle', name: 'Farquaad\'ın Kalesi', type: 'cps', baseCost: 100000, currentCost: 100000, power: 500, count: 0, icon: '🏰' }
];

// Başarım Verileri
const achievements = [
    { id: 'first_click', name: 'İlk Adım', desc: 'İlk soğanını tıkla.', reward: 10, condition: () => totalClicks >= 1, unlocked: false, icon: '👆' },
    { id: 'onion_lover', name: 'Soğan Aşığı', desc: '100 soğan biriktir.', reward: 100, condition: () => score >= 100, unlocked: false, icon: '🧅' },
    { id: 'donkey_friend', name: 'Eşek Dostu', desc: 'Bir Eşek satın al.', reward: 200, condition: () => upgrades.find(u => u.id === 'donkey').count >= 1, unlocked: false, icon: '🐴' },
    { id: 'click_master', name: 'Tıklama Ustası', desc: '1000 kez tıkla.', reward: 500, condition: () => totalClicks >= 1000, unlocked: false, icon: '🖱️' },
    { id: 'rich_ogre', name: 'Zengin Ogre', desc: '10,000 soğan biriktir.', reward: 1000, condition: () => score >= 10000, unlocked: false, icon: '💰' },
    { id: 'swamp_king', name: 'Bataklık Kralı', desc: 'Saniyede 100 soğan kazan.', reward: 2000, condition: () => passiveIncome >= 100, unlocked: false, icon: '👑' },
    { id: 'power_clicker', name: 'Güçlü Tıklayıcı', desc: 'Tıklama gücünü 10 yap.', reward: 1500, condition: () => clickPower >= 10, unlocked: false, icon: '💪' }
];

// Başlangıç
function init() {
    renderUpgrades();
    renderAchievements();
    updateUI();
    createFireflies();

    // Oyun Döngüsü
    setInterval(() => {
        score += passiveIncome;
        updateUI();
        checkAchievements();
    }, 1000);

    // UI Güncellemesi
    setInterval(() => {
        checkUpgradeAvailability();
    }, 100);
}

// Tıklama Olayı
clickBtn.addEventListener('click', (e) => {
    score += clickPower;
    totalClicks++;
    createClickEffect(e);
    updateUI();
    checkAchievements();
});

// Tab Değiştirme
window.switchTab = function (tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.panel-content').forEach(panel => panel.style.display = 'none');

    if (tabName === 'upgrades') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        document.getElementById('upgrades-section').style.display = 'block';
    } else if (tabName === 'click-upgrades') {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        document.getElementById('click-upgrades-section').style.display = 'block';
    } else {
        document.querySelector('.tab-btn:nth-child(3)').classList.add('active');
        document.getElementById('achievements-section').style.display = 'block';
    }
};

// Tıklama Efekti (Parçacıklar ve +Puan)
function createClickEffect(e) {
    // 1. Standart "+1" yazısı
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.innerText = `+${clickPower}`;

    const rect = clickBtn.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    const randomX = (Math.random() - 0.5) * 60;

    effect.style.left = `${x + randomX}px`;
    effect.style.top = `${y - 40}px`;

    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 800);

    // 2. Parçacık Efekti
    createParticleEffect(e);
}

function createParticleEffect(e) {
    const particleCount = 5 + Math.floor(Math.random() * 5);
    const icons = ['🧅', '✨', '💚'];

    const rect = clickBtn.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = icons[Math.floor(Math.random() * icons.length)];

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Yükseltmeleri Listele
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    clickUpgradesContainer.innerHTML = '';

    upgrades.forEach((upgrade, index) => {
        const card = document.createElement('div');
        card.className = `upgrade-card disabled ${upgrade.type}-upgrade`;
        card.id = `upgrade-${index}`;
        card.onclick = () => buyUpgrade(index);

        const powerText = upgrade.type === 'cps' ? `+${upgrade.power}/sn` : `+${upgrade.power} Tık`;
        const typeColor = upgrade.type === 'cps' ? '#666' : '#d84315';

        card.innerHTML = `
            <div class="upgrade-icon" style="font-size: 2.5rem; margin-right: 15px;">${upgrade.icon}</div>
            <div class="upgrade-info" style="flex: 1;">
                <h3>${upgrade.name}</h3>
                <p class="upgrade-cost">${Math.floor(upgrade.currentCost)} 🧅</p>
                <p style="font-size: 0.8rem; color: ${typeColor}; font-weight: bold;">${powerText}</p>
            </div>
            <div class="upgrade-count" id="count-${index}">${upgrade.count}</div>
        `;

        if (upgrade.type === 'cps') {
            upgradesContainer.appendChild(card);
        } else {
            clickUpgradesContainer.appendChild(card);
        }
    });
}

// Başarımları Listele (İlerleme Çubuklu)
function renderAchievements() {
    achievementsContainer.innerHTML = '';
    achievements.forEach(ach => {
        const card = document.createElement('div');
        card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;
        card.id = `ach-${ach.id}`;

        let progress = ach.unlocked ? 100 : 0;
        if (!ach.unlocked) {
            if (ach.id === 'first_click') progress = (totalClicks / 1) * 100;
            if (ach.id === 'click_master') progress = (totalClicks / 1000) * 100;
            if (ach.id === 'onion_lover') progress = (score / 100) * 100;
            if (ach.id === 'rich_ogre') progress = (score / 10000) * 100;
        }
        progress = Math.min(100, Math.max(0, progress));

        card.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info" style="width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>${ach.name}</h3>
                    <span style="font-size: 0.7rem; color: #888;">${Math.floor(progress)}%</span>
                </div>
                <p class="achievement-desc">${ach.desc}</p>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
                <p style="font-size: 0.8rem; color: #ff9800; font-weight: bold; margin-top: 5px;">Ödül: ${ach.reward} 🧅</p>
            </div>
        `;
        achievementsContainer.appendChild(card);
    });
}

// Başarım Kontrolü
function checkAchievements() {
    let newUnlock = false;
    achievements.forEach(ach => {
        if (!ach.unlocked && ach.condition()) {
            ach.unlocked = true;
            score += ach.reward;
            showNotification(ach.name, ach.reward);
            updateAchievementCard(ach.id);
            updateUI();
            newUnlock = true;
        }
    });
}

function updateAchievementCard(id) {
    // Tüm listeyi yeniden render et ki progress bar güncellensin
    renderAchievements();
}

function showNotification(name, reward) {
    notificationText.innerHTML = `${name}<br><span style="font-size: 0.8rem; color: #ffd700;">+${reward} Soğan</span>`;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Yükseltme Satın Alma
function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (score >= upgrade.currentCost) {
        score -= upgrade.currentCost;
        upgrade.count++;

        if (upgrade.type === 'cps') {
            passiveIncome += upgrade.power;
        } else if (upgrade.type === 'click') {
            clickPower += upgrade.power;
        }

        upgrade.currentCost = Math.ceil(upgrade.currentCost * 1.15);

        updateUI();
        renderUpgrades();
        checkAchievements();
    }
}

// UI Güncelleme
function updateUI() {
    scoreElement.innerText = Math.floor(score);
    cpsElement.innerText = passiveIncome.toFixed(1);
    document.title = `${Math.floor(score)} Soğan - Shrek Clicker`;
}

// Yükseltme Erişilebilirliği Kontrolü
function checkUpgradeAvailability() {
    upgrades.forEach((upgrade, index) => {
        const card = document.getElementById(`upgrade-${index}`);
        if (card) {
            if (score >= upgrade.currentCost) {
                card.classList.remove('disabled');
            } else {
                card.classList.add('disabled');
            }
        }
    });
}

// Rastgele Gerçekler
const randomFacts = [
    "Bal, bozulmayan tek gıdadır. 🍯",
    "Ahtapotların üç kalbi vardır. 🐙",
    "Çilek aslında bir meyve değil, bir çiçektir. 🍓",
    "Zürafaların ses telleri yoktur. 🦒",
    "Bir gün Venüs'te bir yıldan daha uzundur. 🪐",
    "İnsan DNA'sı %50 oranında muz DNA'sı ile aynıdır. 🍌",
    "Shrek aslında Yiddish dilinde 'korku' anlamına gelir! 🧅",
    "Dünyadaki karıncaların toplam ağırlığı, insanlarınkine eşittir. 🐜",
    "Su aygırları su altında uyuyabilirler. 🦛",
    "Kangurular geri geri yürüyemezler. 🦘",
    "Kutup ayılarının derisi siyahtır. 🐻‍❄️",
    "Bir bulutun ağırlığı 500 tona ulaşabilir. ☁️"
];

function updateTicker() {
    const tickerText = document.getElementById('fact-text');
    const randomFact = randomFacts[Math.floor(Math.random() * randomFacts.length)];
    tickerText.innerText = randomFact;
}

// Ateş Böcekleri
function createFireflies() {
    const container = document.getElementById('fireflies-container');
    if (!container) return;
    const fireflyCount = 20;

    for (let i = 0; i < fireflyCount; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';

        const startY = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = 15 + Math.random() * 10;

        firefly.style.top = `${startY}vh`;
        firefly.style.left = `-${Math.random() * 10}vw`;
        firefly.style.animationDuration = `${duration}s`;
        firefly.style.animationDelay = `${delay}s`;

        container.appendChild(firefly);
    }
}

// Oyunu Başlat
init();
updateTicker();
setInterval(updateTicker, 15000);
