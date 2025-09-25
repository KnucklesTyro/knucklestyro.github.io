let qr;

function generateQRCode() {
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = ""; // limpa anterior

  const text = document.getElementById("qrText").value.trim();
  const color = document.getElementById("qrColor").value;
  const logoFile = document.getElementById("logoUpload").files[0];

  if (!text) {
    alert("Digite um texto ou URL para gerar o QR Code!");
    return;
  }

  // cria um container temporário para a lib desenhar
  const temp = document.createElement("div");
  qrContainer.appendChild(temp);

  // Gera o QR (pedimos render em canvas)
  new QRCode(temp, {
    text: text,
    width: 300,
    height: 300,
    colorDark: color,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
    render: "canvas" // força canvas quando suportado
  });

  // função que desenha o logo sobre o canvas e substitui o conteúdo visível
  function drawLogoAndReplace(canvas) {
    const ctx = canvas.getContext("2d");

    if (!logoFile) {
      // Sem logo: apenas mova o canvas para o container final
      qrContainer.innerHTML = "";
      qrContainer.appendChild(canvas);
      document.getElementById("downloadBtn").style.display = "inline-block";
      // armazena dataURL para download
      document.getElementById("downloadBtn").dataset.img = canvas.toDataURL("image/png");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const logo = new Image();
      logo.onload = function() {
        // tamanho da área do logo: 25% do QR, ajuste se quiser menor/grande
        const maxLogoSize = Math.floor(canvas.width * 0.25);

        // calcula dimensão mantendo proporção
        let scale = Math.min(1, maxLogoSize / Math.max(logo.width, logo.height));
        const dw = Math.round(logo.width * scale);
        const dh = Math.round(logo.height * scale);
        const dx = Math.round((canvas.width - dw) / 2);
        const dy = Math.round((canvas.height - dh) / 2);

        // Reserva a área central com fundo branco (para não "quebrar" o QR)
        ctx.fillStyle = "#ffffff";
        // desenha um retângulo um pouco maior para garantir leitura (margin opcional)
        const padding = 2; // px extras caso precise
        ctx.fillRect(dx - padding, dy - padding, dw + padding * 2, dh + padding * 2);

        // desenha o logo centralizado (com proporção preservada)
        ctx.drawImage(logo, dx, dy, dw, dh);

        // clone final do canvas (evita problemas com elementos gerados pela lib)
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height;
        finalCanvas.getContext("2d").drawImage(canvas, 0, 0);

        // substitui o conteúdo do container pelo canvas final (o visível)
        qrContainer.innerHTML = "";
        qrContainer.appendChild(finalCanvas);

        // mostra botão de download e salva dataURL no botão
        document.getElementById("downloadBtn").style.display = "inline-block";
        document.getElementById("downloadBtn").dataset.img = finalCanvas.toDataURL("image/png");
      };
      logo.src = e.target.result;
    };
    reader.readAsDataURL(logoFile);
  }

  // aguarda o QR ser gerado — procura primeiro canvas; se houver img, converte para canvas
  (function waitForRender() {
    // se a lib já colocou um canvas
    const canvas = temp.querySelector("canvas");
    if (canvas) {
      drawLogoAndReplace(canvas);
      return;
    }

    // se a lib colocou um img (algumas implementações geram <img>), converte para canvas
    const img = temp.querySelector("img");
    if (img) {
      // garantir que a imagem esteja carregada para desenhar no canvas
      if (!img.complete) {
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth || 300;
          c.height = img.naturalHeight || 300;
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          drawLogoAndReplace(c);
        };
      } else {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth || 300;
        c.height = img.naturalHeight || 300;
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        drawLogoAndReplace(c);
      }
      return;
    }

    // ainda não gerou nada, tenta novamente em 80ms
    setTimeout(waitForRender, 80);
  })();
}

function downloadQRCode() {
  const btn = document.getElementById("downloadBtn");
  let dataUrl = btn.dataset.img;
  if (!dataUrl) {
    const canvas = document.querySelector("#qrcode canvas");
    if (!canvas) {
      alert("Gere um QR Code antes de baixar!");
      return;
    }
    dataUrl = canvas.toDataURL("image/png");
  }
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = dataUrl;
  link.click();
}



function previewLogo(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("logoPreview");
  preview.innerHTML = "";

  if (!file) return;

  if (file.type !== "image/png") {
    alert("Somente arquivos PNG são aceitos!");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.maxWidth = "80px";
    img.style.maxHeight = "80px";
    img.style.border = "1px solid #ccc";
    img.style.borderRadius = "8px";
    img.style.marginTop = "5px";
    preview.appendChild(img);
  }
  reader.readAsDataURL(file);
}
