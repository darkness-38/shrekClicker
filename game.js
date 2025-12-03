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
const achievementsContainer = document.getElementById('achievements-container');
const notification = document.getElementById('achievement-notification');
const notificationText = document.getElementById('achievement-text');

// Yükseltme Verileri
const upgrades = [
    { id: 'onion', name: 'Soğan', baseCost: 15, currentCost: 15, cps: 0.5, count: 0, icon: '🧅' },
    { id: 'donkey', name: 'Eşek', baseCost: 100, currentCost: 100, cps: 3, count: 0, icon: '🐴' },
    { id: 'gingerbread', name: 'Kurabiye Adam', baseCost: 300, currentCost: 300, cps: 8, count: 0, icon: '🍪' },
    { id: 'swamp', name: 'Bataklık', baseCost: 1000, currentCost: 1000, cps: 20, count: 0, icon: '🏞️' },
    { id: 'dragon', name: 'Ejderha', baseCost: 5000, currentCost: 5000, cps: 60, count: 0, icon: '🐉' },
    { id: 'fiona', name: 'Prenses Fiona', baseCost: 20000, currentCost: 20000, cps: 200, count: 0, icon: '👸' },
    { id: 'castle', name: 'Farquaad\'ın Kalesi', baseCost: 100000, currentCost: 100000, cps: 500, count: 0, icon: '🏰' }
];

// Başarım Verileri
const achievements = [
    { id: 'first_click', name: 'İlk Adım', desc: 'İlk soğanını tıkla.', condition: () => totalClicks >= 1, unlocked: false, icon: '👆' },
    { id: 'onion_lover', name: 'Soğan Aşığı', desc: '100 soğan biriktir.', condition: () => score >= 100, unlocked: false, icon: '🧅' },
    { id: 'donkey_friend', name: 'Eşek Dostu', desc: 'Bir Eşek satın al.', condition: () => upgrades.find(u => u.id === 'donkey').count >= 1, unlocked: false, icon: '🐴' },
    { id: 'click_master', name: 'Tıklama Ustası', desc: '1000 kez tıkla.', condition: () => totalClicks >= 1000, unlocked: false, icon: '🖱️' },
    { id: 'rich_ogre', name: 'Zengin Ogre', desc: '10,000 soğan biriktir.', condition: () => score >= 10000, unlocked: false, icon: '💰' },
    { id: 'swamp_king', name: 'Bataklık Kralı', desc: 'Saniyede 100 soğan kazan.', condition: () => passiveIncome >= 100, unlocked: false, icon: '👑' }
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
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
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
    upgrades.forEach((upgrade, index) => {
        const card = document.createElement('div');
        card.className = 'upgrade-card disabled';
        card.id = `upgrade-${index}`;
        card.onclick = () => buyUpgrade(index);

        card.innerHTML = `
            <div class="upgrade-icon" style="font-size: 2.5rem; margin-right: 15px;">${upgrade.icon}</div>
            <div class="upgrade-info" style="flex: 1;">
                <h3>${upgrade.name}</h3>
                <p class="upgrade-cost">${Math.floor(upgrade.currentCost)} 🧅</p>
                <p style="font-size: 0.8rem; color: #666;">+${upgrade.cps}/sn</p>
            </div>
            <div class="upgrade-count" id="count-${index}">${upgrade.count}</div>
        `;
        upgradesContainer.appendChild(card);
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
            showNotification(ach.name);
            updateAchievementCard(ach.id);
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

function showNotification(name) {
    notificationText.innerText = name;
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
        passiveIncome += upgrade.cps;
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
