const output = document.querySelector('#output')

Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#interactive"),
      constraints: {
        facingMode: "environment",
      },
    },
    decoder: {
      readers: ["code_128_reader"],
    },
  }, function (err) {
    if (err) {
      console.error("Erro ao inicializar o leitor de código de barras:", err);
      return;
    }
    console.log("Leitor de código de barras inicializado com sucesso.");
    Quagga.start();
  });
  
  Quagga.onDetected(function (result) {
    console.log("Código de barras detectado:", result.codeResult.code);
    output.innerText = result.codeResult.code;
  });
  
  const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function() {
      const imageData = reader.result;
      decodeBarcodeFromImage(imageData);
    };
    reader.readAsDataURL(file);
  }
}

function decodeBarcodeFromImage(imageData) {
  Quagga.decodeSingle(
    {
      inputStream: {
        size: 800,
      },
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      decoder: {
        readers: ["code_128_reader"],
      },
      locate: true,
      src: imageData,
    },
    function(result) {
      if (result && result.codeResult) {
        console.log("Código de barras detectado:", result.codeResult.code);
        output.innerText = result.codeResult.code;
      } else {
        console.log("Não foi possível detectar o código de barras na imagem.");
        output.innerText = "Não foi possível detectar o código de barras na imagem."
      }
    }
  );
}

