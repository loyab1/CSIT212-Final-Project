document.addEventListener("DOMContentLoaded", () => {
    const arrayContainer = document.getElementById("arrayContainer");
    const codeContainer = document.getElementById("codeContainer");
    const algoSelect = document.getElementById("algoSelect");
    const btnReset = document.getElementById("btnReset");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const btnPlay = document.getElementById("btnPlay");

    let array = [];
    let steps = [];
    let currentStep = 0;
    let playInterval = null;

    const javaCodeMerge = [
        "void mergeSort(int[] arr, int l, int r) {",
        "    if (l < r) {",
        "        int m = l + (r - l) / 2;",
        "        mergeSort(arr, l, m);",
        "        mergeSort(arr, m + 1, r);",
        "        merge(arr, l, m, r);",
        "    }",
        "}",
        "",
        "void merge(int[] arr, int l, int m, int r) {",
        "    int n1 = m - l + 1;",
        "    int n2 = r - m;",
        "    int L[] = new int[n1];",
        "    int R[] = new int[n2];",
        "    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];",
        "    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];",
        "    int i = 0, j = 0, k = l;",
        "    while (i < n1 && j < n2) {",
        "        if (L[i] <= R[j]) {",
        "            arr[k] = L[i]; i++;",
        "        } else {",
        "            arr[k] = R[j]; j++;",
        "        }",
        "        k++;",
        "    }",
        "    while (i < n1) { arr[k] = L[i]; i++; k++; }",
        "    while (j < n2) { arr[k] = R[j]; j++; k++; }",
        "}"
    ];

    const javaCodeQuick = [
        "void quickSort(int[] arr, int low, int high) {",
        "    if (low < high) {",
        "        int pi = partition(arr, low, high);",
        "        quickSort(arr, low, pi - 1);",
        "        quickSort(arr, pi + 1, high);",
        "    }",
        "}",
        "",
        "int partition(int[] arr, int low, int high) {",
        "    int pivot = arr[high];",
        "    int i = (low - 1);",
        "    for (int j = low; j < high; j++) {",
        "        if (arr[j] <= pivot) {",
        "            i++;",
        "            int temp = arr[i];",
        "            arr[i] = arr[j];",
        "            arr[j] = temp;",
        "        }",
        "    }",
        "    int temp = arr[i + 1];",
        "    arr[i + 1] = arr[high];",
        "    arr[high] = temp;",
        "    return i + 1;",
        "}"
    ];

    function generateArray(size = 20) {
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 230) + 20); // values between 20 and 250
        }
        resetVisualizer();
    }

    function pushStep(arr, lineId, activeIndices = []) {
        steps.push({
            array: [...arr],
            lineId: lineId,
            activeIndices: activeIndices
        });
    }

    // --- ALGORITHMS ---
    function runMergeSort() {
        let arr = [...array];
        steps = [];
        
        function merge(l, m, r) {
            pushStep(arr, 9, [l, m, r]);
            let n1 = m - l + 1; pushStep(arr, 10);
            let n2 = r - m; pushStep(arr, 11);
            let L = new Array(n1); pushStep(arr, 12);
            let R = new Array(n2); pushStep(arr, 13);
            
            for (let i = 0; i < n1; ++i) L[i] = arr[l + i];
            pushStep(arr, 14);
            for (let j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
            pushStep(arr, 15);
            
            let i = 0, j = 0, k = l; pushStep(arr, 16);
            while (i < n1 && j < n2) {
                pushStep(arr, 17, [k]);
                pushStep(arr, 18, [k]);
                if (L[i] <= R[j]) {
                    arr[k] = L[i]; i++;
                    pushStep(arr, 19, [k]);
                } else {
                    arr[k] = R[j]; j++;
                    pushStep(arr, 21, [k]);
                }
                k++;
                pushStep(arr, 23, [k]);
            }
            while (i < n1) { arr[k] = L[i]; i++; k++; pushStep(arr, 25, [k-1]); }
            while (j < n2) { arr[k] = R[j]; j++; k++; pushStep(arr, 26, [k-1]); }
            pushStep(arr, 27);
        }

        function mergeSort(l, r) {
            pushStep(arr, 0, [l, r]);
            pushStep(arr, 1);
            if (l < r) {
                let m = Math.floor(l + (r - l) / 2); pushStep(arr, 2, [m]);
                pushStep(arr, 3);
                mergeSort(l, m);
                pushStep(arr, 4);
                mergeSort(m + 1, r);
                pushStep(arr, 5);
                merge(l, m, r);
            }
            pushStep(arr, 6);
        }

        mergeSort(0, arr.length - 1);
        pushStep(arr, -1); // Done
    }

    function runQuickSort() {
        let arr = [...array];
        steps = [];

        function partition(low, high) {
            pushStep(arr, 8, [low, high]);
            let pivot = arr[high]; pushStep(arr, 9, [high]);
            let i = (low - 1); pushStep(arr, 10);
            
            for (let j = low; j < high; j++) {
                pushStep(arr, 11, [j, high]);
                pushStep(arr, 12, [j, high]);
                if (arr[j] <= pivot) {
                    i++; pushStep(arr, 13, [i]);
                    let temp = arr[i]; pushStep(arr, 14, [i]);
                    arr[i] = arr[j]; pushStep(arr, 15, [i, j]);
                    arr[j] = temp; pushStep(arr, 16, [i, j]);
                }
            }
            let temp = arr[i + 1]; pushStep(arr, 19, [i + 1]);
            arr[i + 1] = arr[high]; pushStep(arr, 20, [i + 1, high]);
            arr[high] = temp; pushStep(arr, 21, [i + 1, high]);
            pushStep(arr, 22, [i + 1]);
            return i + 1;
        }

        function quickSort(low, high) {
            pushStep(arr, 0, [low, high]);
            pushStep(arr, 1);
            if (low < high) {
                pushStep(arr, 2);
                let pi = partition(low, high);
                pushStep(arr, 3);
                quickSort(low, pi - 1);
                pushStep(arr, 4);
                quickSort(pi + 1, high);
            }
            pushStep(arr, 5);
        }

        if(arr.length > 0) {
            quickSort(0, arr.length - 1);
        }
        pushStep(arr, -1); // Done
    }
    // --- END ALGORITHMS ---

    function renderCode() {
        const algo = algoSelect.value;
        const codeLines = algo === 'merge' ? javaCodeMerge : javaCodeQuick;
        codeContainer.innerHTML = '';
        codeLines.forEach((line, index) => {
            const div = document.createElement("div");
            div.className = "code-line";
            div.id = `code-line-${index}`;
            div.textContent = line;
            codeContainer.appendChild(div);
        });
    }

    function renderStep() {
        if (steps.length === 0) return;
        const step = steps[currentStep];
        
        // Render Array Bars
        arrayContainer.innerHTML = '';
        step.array.forEach((val, idx) => {
            const bar = document.createElement("div");
            bar.className = "array-bar";
            bar.style.height = `${val}px`;
            if (step.activeIndices.includes(idx)) {
                bar.style.backgroundColor = "#fbbf24"; // Highlight active bar (yellow)
            }
            arrayContainer.appendChild(bar);
        });

        // Highlight Code
        document.querySelectorAll(".code-line").forEach(el => el.classList.remove("active"));
        if (step.lineId >= 0) {
            const activeLine = document.getElementById(`code-line-${step.lineId}`);
            if (activeLine) {
                activeLine.classList.add("active");
                // Scroll into view safely
                activeLine.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }

        btnPrev.disabled = currentStep === 0;
        btnNext.disabled = currentStep === steps.length - 1;
        if (currentStep === steps.length - 1 && playInterval) {
            stopPlay();
        }
    }

    function resetVisualizer() {
        stopPlay();
        currentStep = 0;
        renderCode();
        if (algoSelect.value === 'merge') {
            runMergeSort();
        } else {
            runQuickSort();
        }
        renderStep();
    }

    function stopPlay() {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
            btnPlay.textContent = "Play";
        }
    }

    btnNext.addEventListener("click", () => {
        stopPlay();
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep();
        }
    });

    btnPrev.addEventListener("click", () => {
        stopPlay();
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    });

    btnPlay.addEventListener("click", () => {
        if (playInterval) {
            stopPlay();
        } else {
            if (currentStep === steps.length - 1) {
                currentStep = 0; // Restart
            }
            btnPlay.textContent = "Pause";
            playInterval = setInterval(() => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    renderStep();
                } else {
                    stopPlay();
                }
            }, 50); // 50ms per step for smooth animation
        }
    });

    btnReset.addEventListener("click", () => generateArray());
    algoSelect.addEventListener("change", resetVisualizer);

    // Initialize
    generateArray();
});
