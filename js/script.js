// ========= Página inicial: Dark Mode =========
// (Mantém a mesma função do seu HTML: alterna a classe 'dark')
function toggleDarkMode() {
  document.body.classList.toggle('dark');

  const logo = document.getElementById("logo");
  if (!logo) return;

  if (document.body.classList.contains("dark")) {
    logo.src = "images/logo-dark.png";
  } else {
    logo.src = "images/logo-light.png";
  }
}

// ========= Página de validação: alternar CPF/CNPJ =========
function switchMode(mode) {
  const cpfSection = document.getElementById("cpfSection");
  const cnpjSection = document.getElementById("cnpjSection");
  const cpfBtn = document.getElementById("cpfBtn");
  const cnpjBtn = document.getElementById("cnpjBtn");

  if (!cpfSection || !cnpjSection || !cpfBtn || !cnpjBtn) return; // página inicial não tem esses elementos

  if (mode === 'cpf') {
    cpfSection.style.display = "block";
    cnpjSection.style.display = "none";
    cpfBtn.classList.add("active");
    cpfBtn.classList.remove("inactive");
    cnpjBtn.classList.remove("active");
    cnpjBtn.classList.add("inactive");
  } else {
    cpfSection.style.display = "none";
    cnpjSection.style.display = "block";
    cnpjBtn.classList.add("active");
    cnpjBtn.classList.remove("inactive");
    cpfBtn.classList.remove("active");
    cpfBtn.classList.add("inactive");
  }
}

// ========= CPF =========
function validateCPF() {
  const input = document.getElementById("cpfInput");
  const result = document.getElementById("cpfResult");
  if (!input || !result) return;

  const cpf = input.value.replace(/\D/g, "");

  if (cpf.length !== 11) {
    result.innerHTML = "<span class='invalid'>Digite 11 números para o CPF.</span>";
    return;
  }

  if (/^(\d)\1+$/.test(cpf)) {
    result.innerHTML = "<span class='invalid'>CPF Inválido</span>";
    return;
  }

  let sum = 0, remainder;

  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    result.innerHTML = "<span class='invalid'>CPF Inválido</span>";
    return;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    result.innerHTML = "<span class='invalid'>CPF Inválido</span>";
    return;
  }

  result.innerHTML = "<span class='valid'>CPF Válido</span>";
}

function generateCPF() {
  const output = document.getElementById("cpfGenerated");
  if (!output) return;

  const n = [];
  for (let i = 0; i < 9; i++) n.push(Math.floor(Math.random() * 9));
  let d1 = 0, d2 = 0;

  for (let i = 0; i < 9; i++) {
    d1 += n[i] * (10 - i);
    d2 += n[i] * (11 - i);
  }
  d1 = (d1 * 10) % 11; if (d1 === 10) d1 = 0;
  d2 += d1 * 2; d2 = (d2 * 10) % 11; if (d2 === 10) d2 = 0;

  n.push(d1); n.push(d2);
  let cpf = n.join("");

  const format = document.querySelector("input[name='cpfFormat']:checked")?.value;
  if (format === "pontuado") {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  output.innerHTML = "<div>CPF Gerado!</div><div class='generated'>" + cpf + "</div>";
}

// ========= CNPJ =========
function validateCNPJ() {
  const input = document.getElementById("cnpjInput");
  const result = document.getElementById("cnpjResult");
  if (!input || !result) return;

  const cnpj = input.value.replace(/\D/g, "");

  if (cnpj.length !== 14) {
    result.innerHTML = "<span class='invalid'>Digite 14 números para o CNPJ.</span>";
    return;
  }
  if (/^(\d)\1+$/.test(cnpj)) {
    result.innerHTML = "<span class='invalid'>CNPJ Inválido</span>";
    return;
  }

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (resultDigit != digits.charAt(0)) {
    result.innerHTML = "<span class='invalid'>CNPJ Inválido</span>";
    return;
  }

  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += numbers.charAt(length - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (resultDigit != digits.charAt(1)) {
    result.innerHTML = "<span class='invalid'>CNPJ Inválido</span>";
    return;
  }

  result.innerHTML = "<span class='valid'>CNPJ Válido</span>";
}

function generateCNPJ() {
  const output = document.getElementById("cnpjGenerated");
  if (!output) return;

  const n = [];
  for (let i = 0; i < 12; i++) n.push(Math.floor(Math.random() * 9));

  let d1 = 0, d2 = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    d1 += n[i] * pos--;
    if (pos < 2) pos = 9;
  }
  d1 = (d1 % 11 < 2) ? 0 : 11 - d1 % 11;
  n.push(d1);

  pos = 6;
  for (let i = 0; i < 13; i++) {
    d2 += n[i] * pos--;
    if (pos < 2) pos = 9;
  }
  d2 = (d2 % 11 < 2) ? 0 : 11 - d2 % 11;
  n.push(d2);

  let cnpj = n.join("");

  const format = document.querySelector("input[name='cnpjFormat']:checked")?.value;
  if (format === "pontuado") {
    cnpj = cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  output.innerHTML = "<div>CNPJ Gerado!</div><div class='generated'>" + cnpj + "</div>";
}
