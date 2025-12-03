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
// type: 'cps' (Pasif Gelir) veya 'click' (Tıklama Gücü)
// power: Sağladığı değer
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

    // Oyun Döngüsü (Her 1 saniyede bir pasif gelir ekle)
    setInterval(() => {
        score += passiveIncome;
        updateUI();
        checkAchievements();
    }, 1000);

    // Daha sık UI güncellemesi (buton durumları için)
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

// Tıklama Efekti
function createClickEffect(e) {
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

// Başarımları Listele
function renderAchievements() {
    achievementsContainer.innerHTML = '';
    achievements.forEach(ach => {
        const card = document.createElement('div');
        card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;
        card.id = `ach-${ach.id}`;

        card.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <h3>${ach.name}</h3>
                <p class="achievement-desc">${ach.desc}</p>
                <p style="font-size: 0.8rem; color: #ff9800; font-weight: bold;">Ödül: ${ach.reward} 🧅</p>
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
            score += ach.reward; // Ödülü ver
            showNotification(ach.name, ach.reward);
            updateAchievementCard(ach.id);
            updateUI(); // Puan arttığı için UI güncelle
            newUnlock = true;
        }
    });
}

function updateAchievementCard(id) {
    const card = document.getElementById(`ach-${id}`);
    if (card) {
        card.classList.add('unlocked');
    }
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

// Oyunu Başlat
init();
