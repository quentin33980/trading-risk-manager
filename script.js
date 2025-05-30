document.getElementById('risk-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const capital = parseFloat(document.getElementById('capital').value.replace(',', '.'));
  const riskPercentBase = parseFloat(document.getElementById('risk').value.replace(',', '.'));
  const entry = parseFloat(document.getElementById('entry').value.replace(',', '.'));
  const sl1 = parseFloat(document.getElementById('sl').value.replace(',', '.'));
  const sl2Raw = document.getElementById('sl2').value;
  const sl2 = sl2Raw ? parseFloat(sl2Raw.replace(',', '.')) : null;
  const tp1 = parseFloat(document.getElementById('tp1').value.replace(',', '.'));
  const tp2Raw = document.getElementById('tp2').value;
  const tp2 = tp2Raw ? parseFloat(tp2Raw.replace(',', '.')) : null;
  const leverageInput = document.getElementById('leverage');
  
  if (leverageInput.value.trim() === '') {
    leverageInput.value = '1'; // Remplit visuellement le champ avec 1
  }

  const leverage = parseFloat(leverageInput.value.replace(',', '.'));
  const direction = document.getElementById('direction').value;

  if (
    isNaN(capital) || isNaN(riskPercentBase) || isNaN(entry) || isNaN(sl1) || isNaN(tp1) ||
    capital <= 0 || riskPercentBase <= 0 || entry <= 0 || sl1 <= 0
  ) {
    document.getElementById('result').innerHTML = "⚠️ Veuillez remplir tous les champs obligatoires.";
    return;
  }

  let result = '';

  for (let i = 0; i <= 5; i++) {
    const riskPercent = riskPercentBase + i;
    const riskAmount = capital * (riskPercent / 100);
    const slRatio = Math.abs((entry - sl1) / entry);
    const tp1Ratio = (tp1 - entry) / entry;
    const tp2Ratio = tp2 ? (tp2 - entry) / entry : null;
    const sl2Ratio = sl2 ? Math.abs((entry - sl2) / entry) : null;

    const investedAmount = leverage > 0 ? riskAmount / (slRatio * leverage) : 0;
    const sl1Loss = investedAmount * slRatio * leverage;
    const sl2Loss = sl2Ratio ? investedAmount * sl2Ratio * leverage : null;
    const tp1Gain = investedAmount * tp1Ratio * leverage;
    const tp2Gain = tp2Ratio ? investedAmount * tp2Ratio * leverage : null;

    result += `<div style="margin-bottom: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
    <strong>🧮 Résultats pour ${riskPercent.toFixed(1)}% de risque :</strong><br>
    💰 <strong>Montant à investir :</strong> ${investedAmount.toFixed(2)} USDT<br>
    🔻 <strong>SL1 :</strong> -${sl1Loss.toFixed(2)} USDT (${((sl1Loss / investedAmount) * 100).toFixed(1)}%)<br>`;

    if (sl2Loss !== null) {
      result += `🔻 <strong>SL2 :</strong> -${sl2Loss.toFixed(2)} USDT (${((sl2Loss / investedAmount) * 100).toFixed(1)}%)<br>`;
    }

    result += `🎯 <strong>TP1 :</strong> +${tp1Gain.toFixed(2)} USDT (${((tp1Gain / investedAmount) * 100).toFixed(1)}%)<br>`;

    if (tp2Gain !== null) {
      result += `🎯 <strong>TP2 :</strong> +${tp2Gain.toFixed(2)} USDT (${((tp2Gain / investedAmount) * 100).toFixed(1)}%)<br>`;
    }

    result += `📈 <strong>Direction :</strong> ${direction.toUpperCase()}
    </div>`;
  }

  document.getElementById('result').innerHTML = result;
});


document.getElementById('signal-input').addEventListener('input', () => {
  const rawInput = document.getElementById('signal-input').value;
  const input = rawInput
    .replace(/：/g, ':') // Remplace les ":" chinois par des ":" normaux
    .replace(/\s+/g, ' ') // Réduit les espaces et retours à la ligne
    .toLowerCase();

  // Direction
  if (input.includes('long')) {
    document.getElementById('direction').value = 'long';
  } else if (input.includes('short')) {
    document.getElementById('direction').value = 'short';
  }

  // Levier
  const levierMatch = input.match(/levier.*?x(\d+)/i);
  if (levierMatch) {
    document.getElementById('leverage').value = levierMatch[1];
  }

  // Entrée moyenne
  const entryMatch = input.match(/entrée.*?(\d+(?:[\.,]\d+)?)\s*[~\-–]\s*(\d+(?:[\.,]\d+)?)/i);
  if (entryMatch) {
    const val1 = parseFloat(entryMatch[1].replace(',', '.'));
    const val2 = parseFloat(entryMatch[2].replace(',', '.'));
    const moyenne = ((val1 + val2) / 2).toFixed(2);
    document.getElementById('entry').value = moyenne;
  }

  // TP1 / TP2
  const tpMatch = input.match(/tp.*?(\d+(?:[\.,]\d+)?)[\/\-](\d+(?:[\.,]\d+)?)/i);
  if (tpMatch) {
    document.getElementById('tp1').value = tpMatch[1].replace(',', '.');
    document.getElementById('tp2').value = tpMatch[2].replace(',', '.');
  }

  // SL1 / SL2
  const slMatch = input.match(/sl.*?(\d+(?:[\.,]\d+)?)[\/\-](\d+(?:[\.,]\d+)?)/i);
  if (slMatch) {
    document.getElementById('sl').value = slMatch[1].replace(',', '.');
    document.getElementById('sl2').value = slMatch[2].replace(',', '.');
  }
});
