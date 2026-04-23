document.addEventListener("DOMContentLoaded", () => {
    // Only run if we are on the calculator page
    const binaryInput = document.getElementById("binaryInput");
    const decimalInput = document.getElementById("decimalInput");
    const btnToDecimal = document.getElementById("btnToDecimal");
    const btnToBinary = document.getElementById("btnToBinary");
    const errorMessage = document.getElementById("errorMessage");

    if (!binaryInput || !decimalInput) return;

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
        
        // Validate binary input using regex
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

        // Validate decimal input
        const num = Number(decValue);
        if (!Number.isInteger(num) || num < 0) {
            showError("Please enter a valid non-negative integer.");
            return;
        }

        binaryInput.value = num.toString(2);
    });

    // Optional: Allow pressing Enter in inputs
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
});
