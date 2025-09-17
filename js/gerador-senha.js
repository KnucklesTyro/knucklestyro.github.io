	function updateLengthLabel() {
	  const lengthRange = document.getElementById("lengthRange");
	  const lengthLabel = document.getElementById("lengthLabel");
	  lengthLabel.textContent = lengthRange.value;
	}


    function generatePassword() {
      const length = parseInt(document.getElementById("lengthRange").value);
      const useSpecials = document.getElementById("useSpecials").checked;
      const useUpperLower = document.getElementById("useUpperLower").checked;
      const noSeqRepeat = document.getElementById("noSeqRepeat").checked;

      let chars = "abcdefghijklmnopqrstuvwxyz";
      if (useUpperLower) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      chars += "0123456789";
      if (useSpecials) chars += "!*@";

      let password = "";
      while (password.length < length) {
        let char = chars.charAt(Math.floor(Math.random() * chars.length));

        // Regras de números
        if (noSeqRepeat && password.length > 0) {
          const lastChar = password[password.length - 1];
          if (!isNaN(lastChar) && !isNaN(char)) {
            const lastNum = parseInt(lastChar);
            const currNum = parseInt(char);
            if (lastNum === currNum || currNum === lastNum + 1) {
              continue; // pula se for repetido ou sequência
            }
          }
        }

        password += char;
      }

      // Garante que pelo menos 1 especial seja usado
	  const specials = "!*@";
	  if (useSpecials && !/[!@*]/.test(password)) {
	    const pos = Math.floor(Math.random() * password.length);
	    const specialChar = specials.charAt(Math.floor(Math.random() * specials.length));
	    password = password.substring(0, pos) + specialChar + password.substring(pos + 1);
	   }

      document.getElementById("passwordOutput").value = password;
    }

    function copyPassword() {
      const output = document.getElementById("passwordOutput");
      output.select();
      output.setSelectionRange(0, 99999);
      document.execCommand("copy");
      alert("Senha copiada!");
    }

