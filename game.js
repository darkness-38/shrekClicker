// Oyun Değişkenleri
let score = 0;
let clickPower = 1;
let passiveIncome = 0;

// DOM Elementleri
const scoreElement = document.getElementById('score');
const cpsElement = document.getElementById('cps');
const clickBtn = document.getElementById('click-btn');
const upgradesContainer = document.getElementById('upgrades-container');
const clickSection = document.querySelector('.click-section');

// Yükseltme Verileri
const upgrades = [
    {
        id: 'onion',
        name: 'Soğan',
        baseCost: 15,
        currentCost: 15,
        cps: 0.5,
        count: 0,
        icon: '🧅'
    },
    {
        id: 'donkey',
        name: 'Eşek',
        baseCost: 100,
        currentCost: 100,
        cps: 3,
        count: 0,
        icon: '🐴'
    },
    {
        id: 'swamp',
        name: 'Bataklık',
        baseCost: 500,
        currentCost: 500,
        cps: 10,
        count: 0,
        icon: '🏞️'
    },
    {
        id: 'dragon',
        name: 'Ejderha',
        baseCost: 2000,
        currentCost: 2000,
        cps: 40,
        count: 0,
        icon: '🐉'
    },
    {
        id: 'fiona',
        name: 'Prenses Fiona',
        baseCost: 10000,
        currentCost: 10000,
        cps: 150,
        count: 0,
        icon: '👸'
    }
];

// Başlangıç
function init() {
    renderUpgrades();
    updateUI();
    
    // Oyun Döngüsü (Her 1 saniyede bir pasif gelir ekle)
    setInterval(() => {
        score += passiveIncome;
        updateUI();
    }, 1000);

    // Daha sık UI güncellemesi (buton durumları için)
    setInterval(() => {
        checkUpgradeAvailability();
    }, 100);
}

// Tıklama Olayı
clickBtn.addEventListener('click', (e) => {
    score += clickPower;
    createClickEffect(e);
    updateUI();
});

// Tıklama Efekti
function createClickEffect(e) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.innerText = `+${clickPower}`;
    
    // Mouse pozisyonuna göre konumlandırma (basitçe butonun ortasından rastgele biraz sapma ile)
    const rect = clickBtn.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    
    // Rastgele saçılma
    const randomX = (Math.random() - 0.5) * 40;
    
    effect.style.left = `${x + randomX}px`;
    effect.style.top = `${y - 20}px`;
    
    document.body.appendChild(effect);
    
    // Animasyon bitince sil
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

// Yükseltmeleri Listele
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    
    upgrades.forEach((upgrade, index) => {
        const card = document.createElement('div');
        card.className = 'upgrade-card disabled'; // Başlangıçta hepsi disabled olabilir
        card.id = `upgrade-${index}`;
        card.onclick = () => buyUpgrade(index);
        
        card.innerHTML = `
            <div class="upgrade-icon" style="font-size: 2rem; margin-right: 15px;">${upgrade.icon}</div>
            <div class="upgrade-info" style="flex: 1;">
                <h3>${upgrade.name}</h3>
                <p class="upgrade-cost">Maliyet: ${Math.floor(upgrade.currentCost)} Soğan</p>
                <p style="font-size: 0.8rem; color: #666;">+${upgrade.cps} / sn</p>
            </div>
            <div class="upgrade-count" id="count-${index}">${upgrade.count}</div>
        `;
        
        upgradesContainer.appendChild(card);
    });
}

// Yükseltme Satın Alma
function buyUpgrade(index) {
    const upgrade = upgrades[index];
    
    if (score >= upgrade.currentCost) {
        score -= upgrade.currentCost;
        upgrade.count++;
        passiveIncome += upgrade.cps;
        
        // Maliyet artışı (%15)
        upgrade.currentCost = Math.ceil(upgrade.currentCost * 1.15);
        
        updateUI();
        renderUpgrades(); // Kartı güncelle (yeni maliyet için)
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
