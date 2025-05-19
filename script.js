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

  // ✅ Nouveau calcul du montant à investir
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
document.getElementById('theme-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  this.textContent = isDark ? '☀️ Mode clair' : '🌙 Mode sombre';
});
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = localStorage.getItem('theme') === 'dark';

if (prefersDark) {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️ Mode clair';
}

themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  this.textContent = isDark ? '☀️ Mode clair' : '🌙 Mode sombre';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

