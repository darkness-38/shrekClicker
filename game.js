// Oyun Değişkenleri
let score = 0;
let clickPower = 1;
let passiveIncome = 0;
let totalClicks = 0; // Başarımlar için toplam tıklama
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
    // Tıklama gücünü de bir yerde gösterebiliriz ama şimdilik sadece CPS var
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
