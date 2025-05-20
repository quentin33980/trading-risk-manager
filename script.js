document.getElementById('risk-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const capital = parseFloat(document.getElementById('capital').value.replace(',', '.'));
  const riskPercent = parseFloat(document.getElementById('risk').value.replace(',', '.'));
  const entry = parseFloat(document.getElementById('entry').value.replace(',', '.'));
  const sl = parseFloat(document.getElementById('sl').value.replace(',', '.'));
  const tp1 = parseFloat(document.getElementById('tp1').value.replace(',', '.'));
  const tp2 = parseFloat(document.getElementById('tp2').value.replace(',', '.'));
  const leverage = parseFloat(document.getElementById('leverage').value.replace(',', '.'));
  const direction = document.getElementById('direction').value;

  if (
    isNaN(capital) || isNaN(riskPercent) || isNaN(entry) || isNaN(sl) ||
    isNaN(tp1) || isNaN(tp2) || isNaN(leverage) ||
    capital <= 0 || riskPercent <= 0 || entry <= 0 || sl <= 0 || leverage <= 0
  ) {
    document.getElementById('result').innerHTML = "⚠️ Veuillez entrer des valeurs valides.";
    return;
  }

  const riskAmount = capital * (riskPercent / 100);
  const slRatio = Math.abs((entry - sl) / entry);
  const tp1Ratio = (tp1 - entry) / entry;
  const tp2Ratio = (tp2 - entry) / entry;

  const investedAmount = riskAmount / (slRatio * leverage);
  const tp1Gain = investedAmount * tp1Ratio * leverage;
  const tp2Gain = investedAmount * tp2Ratio * leverage;
  const slLoss = investedAmount * slRatio * leverage;

  const result = `
    <strong>💰 Montant à investir :</strong> ${investedAmount.toFixed(2)} USDT<br>
    <strong>🔻 Perte si SL touché :</strong> -${slLoss.toFixed(2)} USDT (${((slLoss / capital) * 100).toFixed(1)}%)<br>
    <strong>🎯 Gain si TP1 :</strong> +${tp1Gain.toFixed(2)} USDT (${((tp1Gain / capital) * 100).toFixed(1)}%)<br>
    <strong>🎯 Gain si TP2 :</strong> +${tp2Gain.toFixed(2)} USDT (${((tp2Gain / capital) * 100).toFixed(1)}%)<br>
    <strong>📈 Direction :</strong> ${direction.toUpperCase()}
  `;

  document.getElementById('result').innerHTML = result;
});

// Gestion du thème clair/sombre
const toggleButton = document.getElementById('theme-toggle');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    toggleButton.textContent = '🌞 Mode clair';
  } else {
    document.body.classList.remove('dark');
    toggleButton.textContent = '🌙 Mode sombre';
  }
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

toggleButton.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  const newTheme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});
// Gestion de l'affichage du panneau paramètres
const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');

settingsButton.addEventListener('click', () => {
  if (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') {
    settingsPanel.style.display = 'block';
  } else {
    settingsPanel.style.display = 'none';
  }
});
const riskSlider = document.getElementById('risk-slider');
const riskInput = document.getElementById('risk-input');

// Synchronise l'input avec le slider
riskSlider.addEventListener('input', () => {
  riskInput.value = riskSlider.value;
  document.getElementById('risk').value = riskSlider.value;
});

// Synchronise le slider avec l'input
riskInput.addEventListener('input', () => {
  riskSlider.value = riskInput.value;
  document.getElementById('risk').value = riskInput.value;
});
