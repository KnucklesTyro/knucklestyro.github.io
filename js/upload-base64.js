// js/upload-base64.js
(function () {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const base64Output = document.getElementById('base64Output');
  const previewArea = document.getElementById('previewArea');
  const fileInfo = document.getElementById('fileInfo');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const statusMsg = document.getElementById('statusMsg');
  const radios = document.querySelectorAll('input[name="mode"]');
  const MAX_SIZE = 8 * 1024 * 1024; // 8MB

  let selectedFile = null;

  function resetUI() {
    base64Output.textContent = '';
    previewArea.innerHTML = '';
    fileInfo.textContent = 'Nenhum arquivo selecionado.';
    statusMsg.textContent = '';
    selectedFile = null;
  }

  clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    resetUI();
  });

  function handleFile(file) {
   if (!file) return;

   if (file.size > MAX_SIZE) {
    fileInput.value = '';
    resetUI();
    statusMsg.style.color = 'crimson';
    statusMsg.textContent = `O arquivo "${file.name}" excede o limite de 8MB.`;
    return;
   }

  selectedFile = file;
  fileInfo.textContent = `Arquivo: ${file.name} — Tipo: ${file.type || 'n/a'} — Tamanho: ${formatBytes(file.size)}`;
  }

 

	const fileName = document.getElementById('fileName');

	fileInput.addEventListener('change', () => {
	  if (fileInput.files.length > 0) {
		fileName.textContent = fileInput.files[0].name;
	  } else {
		fileName.textContent = "Nenhum arquivo selecionado";
	  }
	});


  // Drag & drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.files = e.dataTransfer.files; // sincroniza
      handleFile(file);
    }
  });

  convertBtn.addEventListener('click', () => {
    statusMsg.textContent = '';
    if (!selectedFile) {
      statusMsg.style.color = 'crimson';
      statusMsg.textContent = 'Selecione ou arraste um arquivo antes de converter.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const commaIndex = dataUrl.indexOf(',');
      let header = '';
      let body = dataUrl;
      if (commaIndex >= 0) {
        header = dataUrl.substring(0, commaIndex + 1);
        body = dataUrl.substring(commaIndex + 1);
      }

      const mode = [...radios].find(r => r.checked).value;
      base64Output.textContent = mode === 'full' ? (header + body) : body;

      previewArea.innerHTML = '';
      if (selectedFile.type && selectedFile.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = selectedFile.name;
        previewArea.appendChild(img);
      } else {
        const box = document.createElement('div');
        box.textContent = 'Arquivo pronto (pré-visualização não suportada).';
        box.className = 'small-muted';
        previewArea.appendChild(box);
      }

      statusMsg.style.color = '#2a7a2a';
      statusMsg.textContent = 'Conversão completa.';
    };
    reader.onerror = () => {
      statusMsg.style.color = 'crimson';
      statusMsg.textContent = 'Erro ao ler o arquivo.';
    };
    reader.readAsDataURL(selectedFile);
  });

  copyBtn.addEventListener('click', () => {
    const text = base64Output.textContent;
    if (!text) {
      statusMsg.style.color = 'crimson';
      statusMsg.textContent = 'Nada para copiar.';
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      statusMsg.style.color = '#2a7a2a';
      statusMsg.textContent = 'Copiado para a área de transferência!';
      setTimeout(() => statusMsg.textContent = '', 2500);
    }).catch(() => {
      statusMsg.style.color = 'crimson';
      statusMsg.textContent = 'Falha ao copiar.';
    });
  });

  downloadBtn.addEventListener('click', () => {
    const text = base64Output.textContent;
    if (!text) {
      statusMsg.style.color = 'crimson';
      statusMsg.textContent = 'Nada para baixar.';
      return;
    }
    const filename = selectedFile ? selectedFile.name : 'base64.txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    statusMsg.style.color = '#2a7a2a';
    statusMsg.textContent = 'Arquivo .txt gerado.';
    setTimeout(() => statusMsg.textContent = '', 2500);
  });

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  resetUI();
})();



