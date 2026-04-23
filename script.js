document.addEventListener("DOMContentLoaded", () => {
    // Only run if we are on the calculator page
    const binaryInput = document.getElementById("binaryInput");
    const decimalInput = document.getElementById("decimalInput");
    const btnToDecimal = document.getElementById("btnToDecimal");
    const btnToBinary = document.getElementById("btnToBinary");
    const errorMessage = document.getElementById("errorMessage");

    if (binaryInput && decimalInput) {
        function showError(msg) {
            errorMessage.textContent = msg;
            errorMessage.hidden = false;
            setTimeout(() => {
                errorMessage.hidden = true;
            }, 3000);
        }

        btnToDecimal.addEventListener("click", () => {
            const binValue = binaryInput.value.trim();
            if (binValue === "") {
                showError("Please enter a binary number.");
                return;
            }
            
            if (!/^[01]+$/.test(binValue)) {
                showError("Invalid binary format. Only 0s and 1s are allowed.");
                return;
            }

            const decValue = parseInt(binValue, 2);
            decimalInput.value = decValue;
        });

        btnToBinary.addEventListener("click", () => {
            const decValue = decimalInput.value.trim();
            if (decValue === "") {
                showError("Please enter a decimal number.");
                return;
            }

            const num = Number(decValue);
            if (!Number.isInteger(num) || num < 0) {
                showError("Please enter a valid non-negative integer.");
                return;
            }

            binaryInput.value = num.toString(2);
        });

        binaryInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                btnToDecimal.click();
            }
        });

        decimalInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                btnToBinary.click();
            }
        });
    }

    // Logic Simulator Logic
    const btnInputA = document.getElementById("btnInputA");
    const btnInputB = document.getElementById("btnInputB");
    const gateSelect = document.getElementById("gateSelect");
    const lightBulb = document.getElementById("lightBulb");

    if (btnInputA && btnInputB && gateSelect && lightBulb) {
        function updateLogic() {
            const a = parseInt(btnInputA.getAttribute("data-state"));
            const b = parseInt(btnInputB.getAttribute("data-state"));
            const gate = gateSelect.value;
            let result = 0;

            switch (gate) {
                case "AND": result = (a === 1 && b === 1) ? 1 : 0; break;
                case "OR": result = (a === 1 || b === 1) ? 1 : 0; break;
                case "XOR": result = (a !== b) ? 1 : 0; break;
                case "NAND": result = !(a === 1 && b === 1) ? 1 : 0; break;
            }

            if (result === 1) {
                lightBulb.classList.remove("off");
                lightBulb.classList.add("on");
            } else {
                lightBulb.classList.remove("on");
                lightBulb.classList.add("off");
            }
        }

        function toggleInput(btn) {
            const currentState = btn.getAttribute("data-state");
            const newState = currentState === "0" ? "1" : "0";
            btn.setAttribute("data-state", newState);
            btn.textContent = newState;
            updateLogic();
        }

        btnInputA.addEventListener("click", () => toggleInput(btnInputA));
        btnInputB.addEventListener("click", () => toggleInput(btnInputB));
        gateSelect.addEventListener("change", updateLogic);
        
        // Initial state update
        updateLogic();
    }
});
