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

    const javaCodeInsertion = [
        "void insertionSort(int arr[]) {",
        "    int n = arr.length;",
        "    for (int i = 1; i < n; ++i) {",
        "        int key = arr[i];",
        "        int j = i - 1;",
        "        while (j >= 0 && arr[j] > key) {",
        "            arr[j + 1] = arr[j];",
        "            j = j - 1;",
        "        }",
        "        arr[j + 1] = key;",
        "    }",
        "}"
    ];

    const javaCodeHeap = [
        "void heapSort(int arr[]) {",
        "    int n = arr.length;",
        "    for (int i = n / 2 - 1; i >= 0; i--)",
        "        heapify(arr, n, i);",
        "    for (int i = n - 1; i > 0; i--) {",
        "        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;",
        "        heapify(arr, i, 0);",
        "    }",
        "}",
        "void heapify(int arr[], int n, int i) {",
        "    int largest = i, l = 2 * i + 1, r = 2 * i + 2;",
        "    if (l < n && arr[l] > arr[largest]) largest = l;",
        "    if (r < n && arr[r] > arr[largest]) largest = r;",
        "    if (largest != i) {",
        "        int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;",
        "        heapify(arr, n, largest);",
        "    }",
        "}"
    ];

    const javaCodeCounting = [
        "void countingSort(int arr[]) {",
        "    int n = arr.length;",
        "    int max = arr[0];",
        "    for (int i = 1; i < n; i++)",
        "        if (arr[i] > max) max = arr[i];",
        "    int[] count = new int[max + 1];",
        "    for (int i = 0; i < n; i++)",
        "        count[arr[i]]++;",
        "    for (int i = 1; i <= max; i++)",
        "        count[i] += count[i - 1];",
        "    int[] output = new int[n];",
        "    for (int i = n - 1; i >= 0; i--) {",
        "        output[count[arr[i]] - 1] = arr[i];",
        "        count[arr[i]]--;",
        "    }",
        "    for (int i = 0; i < n; i++)",
        "        arr[i] = output[i];",
        "}"
    ];

    const algorithmDetailsInfo = {
        merge: {
            title: "Merge Sort",
            description: "Merge Sort is a Divide-and-Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
            timeComplexity: "O(n log n) - It consistently divides the array in half and merges.",
            useCases: "Used in e-commerce applications for sorting products, or in Java's Collections.sort() for object arrays because it is a stable sort."
        },
        quick: {
            title: "Quick Sort",
            description: "Quick Sort is a Divide-and-Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.",
            timeComplexity: "O(n log n) average case, but O(n²) in the worst case. Best in practice for arrays.",
            useCases: "Widely used in language standard libraries (like C++ std::sort or Java Arrays.sort for primitives) because of its fast in-place memory performance."
        },
        insertion: {
            title: "Insertion Sort",
            description: "Insertion Sort builds the final sorted array one item at a time. It works the way you might sort playing cards in your hands.",
            timeComplexity: "O(n²) - It compares elements and shifts them to the right.",
            useCases: "Very fast for small datasets (often used as the base case for Quick Sort or Merge Sort algorithms) and for arrays that are already mostly sorted."
        },
        heap: {
            title: "Heap Sort",
            description: "Heap Sort is a comparison-based sorting technique based on a Binary Heap data structure. It is similar to selection sort where we first find the maximum element and place it at the end.",
            timeComplexity: "O(n log n) - It builds a max heap and extracts the max element n times.",
            useCases: "Useful in systems concerned with security or embedded systems where consistent O(n log n) memory-in-place performance is strictly required."
        },
        counting: {
            title: "Counting Sort",
            description: "Counting Sort is an integer sorting algorithm that operates by counting the number of objects that possess distinct key values, and calculating positions.",
            timeComplexity: "O(n + k) where n is the number of elements and k is the range of input.",
            useCases: "Extremely fast for sorting arrays where the range of integers is relatively small, such as sorting pixels by color values."
        }
    };

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

    function runInsertionSort() {
        let arr = [...array];
        steps = [];
        pushStep(arr, 0);
        let n = arr.length; pushStep(arr, 1);
        for (let i = 1; i < n; ++i) {
            pushStep(arr, 2, [i]);
            let key = arr[i]; pushStep(arr, 3, [i]);
            let j = i - 1; pushStep(arr, 4, [j]);
            while (j >= 0 && arr[j] > key) {
                pushStep(arr, 5, [j]);
                arr[j + 1] = arr[j]; pushStep(arr, 6, [j + 1, j]);
                j = j - 1; pushStep(arr, 7, [j]);
            }
            pushStep(arr, 5, [j]);
            arr[j + 1] = key; pushStep(arr, 9, [j + 1]);
        }
        pushStep(arr, 11);
        pushStep(arr, -1); // Done
    }

    function runHeapSort() {
        let arr = [...array];
        steps = [];

        function heapify(n, i) {
            pushStep(arr, 9, [i]);
            let largest = i, l = 2 * i + 1, r = 2 * i + 2; pushStep(arr, 10, [largest, l, r]);
            if (l < n && arr[l] > arr[largest]) largest = l; pushStep(arr, 11, [l, largest]);
            if (r < n && arr[r] > arr[largest]) largest = r; pushStep(arr, 12, [r, largest]);
            pushStep(arr, 13, [largest]);
            if (largest != i) {
                let swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap; pushStep(arr, 14, [i, largest]);
                heapify(n, largest); pushStep(arr, 15);
            }
            pushStep(arr, 16);
        }

        pushStep(arr, 0);
        let n = arr.length; pushStep(arr, 1);
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            pushStep(arr, 2, [i]);
            heapify(n, i); pushStep(arr, 3, [i]);
        }
        for (let i = n - 1; i > 0; i--) {
            pushStep(arr, 4, [i]);
            let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp; pushStep(arr, 5, [0, i]);
            heapify(i, 0); pushStep(arr, 6);
        }
        pushStep(arr, 8);
        pushStep(arr, -1); // Done
    }

    function runCountingSort() {
        let arr = [...array];
        steps = [];
        pushStep(arr, 0);
        let n = arr.length; pushStep(arr, 1);
        let max = arr[0]; pushStep(arr, 2);
        for (let i = 1; i < n; i++) {
            pushStep(arr, 3, [i]);
            if (arr[i] > max) max = arr[i]; pushStep(arr, 4, [i]);
        }
        let count = new Array(max + 1).fill(0); pushStep(arr, 5);
        for (let i = 0; i < n; i++) {
            pushStep(arr, 6, [i]);
            count[arr[i]]++; pushStep(arr, 7, [i]);
        }
        for (let i = 1; i <= max; i++) {
            pushStep(arr, 8);
            count[i] += count[i - 1]; pushStep(arr, 9);
        }
        let output = new Array(n); pushStep(arr, 10);
        for (let i = n - 1; i >= 0; i--) {
            pushStep(arr, 11, [i]);
            output[count[arr[i]] - 1] = arr[i]; pushStep(arr, 12, [i]);
            count[arr[i]]--; pushStep(arr, 13, [i]);
        }
        for (let i = 0; i < n; i++) {
            pushStep(arr, 15, [i]);
            arr[i] = output[i]; pushStep(arr, 16, [i]);
        }
        pushStep(arr, 18);
        pushStep(arr, -1); // Done
    }
    // --- END ALGORITHMS ---

    function renderCode() {
        const algo = algoSelect.value;
        let codeLines = [];
        if (algo === 'merge') codeLines = javaCodeMerge;
        else if (algo === 'quick') codeLines = javaCodeQuick;
        else if (algo === 'insertion') codeLines = javaCodeInsertion;
        else if (algo === 'heap') codeLines = javaCodeHeap;
        else if (algo === 'counting') codeLines = javaCodeCounting;
        
        codeContainer.innerHTML = '';
        codeLines.forEach((line, index) => {
            const div = document.createElement("div");
            div.className = "code-line";
            div.id = `code-line-${index}`;
            div.textContent = line;
            codeContainer.appendChild(div);
        });

        const details = algorithmDetailsInfo[algo];
        const detailsContainer = document.getElementById("algorithmDetails");
        if (details && detailsContainer) {
            detailsContainer.innerHTML = `
                <h2 style="margin-bottom: 1rem;">${details.title}</h2>
                <p style="margin-bottom: 0.5rem; line-height: 1.5;"><strong>What it is & How it works:</strong> ${details.description}</p>
                <p style="margin-bottom: 0.5rem; line-height: 1.5;"><strong>Time Complexity:</strong> ${details.timeComplexity}</p>
                <p style="line-height: 1.5;"><strong>Real World Use Cases:</strong> ${details.useCases}</p>
            `;
        }
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
        if (algoSelect.value === 'merge') runMergeSort();
        else if (algoSelect.value === 'quick') runQuickSort();
        else if (algoSelect.value === 'insertion') runInsertionSort();
        else if (algoSelect.value === 'heap') runHeapSort();
        else if (algoSelect.value === 'counting') runCountingSort();
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
