document.addEventListener("DOMContentLoaded", () => {
    const arrayContainer = document.getElementById("arrayContainer");
    const codeContainer = document.getElementById("codeContainer");
    const algoSelect = document.getElementById("algoSelect");
    const btnReset = document.getElementById("btnReset");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const btnPlay = document.getElementById("btnPlay");
    const explanationText = document.getElementById("explanationText");
    const variableList = document.getElementById("variableList");

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

    const javaCodeDiddy = [
        "void diddySort(int[] arr) {",
        "    // Step 1: Remove all elements > 18",
        "    List<Integer> filtered = new ArrayList<>();",
        "    for (int x : arr) {",
        "        if (x <= 18) filtered.add(x);",
        "    }",
        "    int[] nArr = filtered.stream().mapToInt(i->i).toArray();",
        "    ",
        "    // Step 2: Selection Sort (Smallest first)",
        "    int n = nArr.length;",
        "    for (int i = 0; i < n - 1; i++) {",
        "        int min = i;",
        "        for (int j = i + 1; j < n; j++) {",
        "            if (nArr[j] < nArr[min]) min = j;",
        "        }",
        "        int temp = nArr[min];",
        "        nArr[min] = nArr[i];",
        "        nArr[i] = temp;",
        "    }",
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
        },
        diddy: {
            title: "Diddy Sort",
            description: "A unique filtering-based algorithm. It first purges any elements above the value of 18, then performs a Selection Sort on the survivors by repeatedly finding the minimum element.",
            timeComplexity: "O(n + m²) where n is original size and m is survivors (m <= n).",
            useCases: "Used in specialized scenarios where values above a certain threshold (18) are considered invalid or 'too big' for the system."
        }
    };

    function generateArray(size = 20) {
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 250) + 5); // values between 5 and 255
        }
        resetVisualizer();
    }

    function pushStep(arr, lineId, activeIndices = [], explanation = "", vars = {}) {
        steps.push({
            array: [...arr],
            lineId: lineId,
            activeIndices: activeIndices,
            explanation: explanation,
            vars: vars
        });
    }

    // --- ALGORITHMS ---
    function runMergeSort() {
        let arr = [...array];
        steps = [];
        
        function merge(l, m, r) {
            pushStep(arr, 9, [l, m, r], "Merging sub-arrays.", { l: l, m: m, r: r });
            let n1 = m - l + 1; pushStep(arr, 10, [], "Size of left sub-array.", { n1: n1 });
            let n2 = r - m; pushStep(arr, 11, [], "Size of right sub-array.", { n2: n2 });
            let L = new Array(n1); pushStep(arr, 12, [], "Initialize temporary left array.");
            let R = new Array(n2); pushStep(arr, 13, [], "Initialize temporary right array.");
            
            for (let i = 0; i < n1; ++i) L[i] = arr[l + i];
            pushStep(arr, 14, [l, m], "Copy data to temporary left array.");
            for (let j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
            pushStep(arr, 15, [m + 1, r], "Copy data to temporary right array.");
            
            let i = 0, j = 0, k = l; pushStep(arr, 16, [k], "Initialize indices for merging.", { i: 0, j: 0, k: l });
            while (i < n1 && j < n2) {
                pushStep(arr, 17, [k], "Comparing elements from L and R.", { i: i, j: j, k: k });
                pushStep(arr, 18, [k], "Checking: is L[i] <= R[j]?", { "L[i]": L[i], "R[j]": R[j] });
                if (L[i] <= R[j]) {
                    arr[k] = L[i]; i++;
                    pushStep(arr, 19, [k], "L[i] is smaller. Copying to main array.", { i: i, k: k });
                } else {
                    arr[k] = R[j]; j++;
                    pushStep(arr, 21, [k], "R[j] is smaller. Copying to main array.", { j: j, k: k });
                }
                k++;
                pushStep(arr, 23, [k], "Move to next position in main array.", { k: k });
            }
            while (i < n1) { arr[k] = L[i]; i++; k++; pushStep(arr, 25, [k-1], "Copying remaining elements from L.", { i: i, k: k }); }
            while (j < n2) { arr[k] = R[j]; j++; k++; pushStep(arr, 26, [k-1], "Copying remaining elements from R.", { j: j, k: k }); }
            pushStep(arr, 27, [], "Merge complete for this section.");
        }

        function mergeSort(l, r) {
            pushStep(arr, 0, [l, r], "Calling MergeSort on sub-array.", { l: l, r: r });
            pushStep(arr, 1, [], "Check: is l < r?");
            if (l < r) {
                let m = Math.floor(l + (r - l) / 2); pushStep(arr, 2, [m], "Calculating middle point.", { m: m });
                pushStep(arr, 3, [], "Sort first half.");
                mergeSort(l, m);
                pushStep(arr, 4, [], "Sort second half.");
                mergeSort(m + 1, r);
                pushStep(arr, 5, [], "Merge the sorted halves.");
                merge(l, m, r);
            }
            pushStep(arr, 6, [], "MergeSort call finished.");
        }

        mergeSort(0, arr.length - 1);
        pushStep(arr, -1, [], "Merge Sort completed!"); // Done
    }

    function runQuickSort() {
        let arr = [...array];
        steps = [];

        function partition(low, high) {
            pushStep(arr, 8, [low, high], "Partitioning the sub-array.", { low: low, high: high });
            let pivot = arr[high]; pushStep(arr, 9, [high], "Picking the last element as the pivot.", { low: low, high: high, pivot: pivot });
            let i = (low - 1); pushStep(arr, 10, [], "i is the index of the smaller element.", { low: low, high: high, pivot: pivot, i: i });
            
            for (let j = low; j < high; j++) {
                pushStep(arr, 11, [j, high], "Comparing current element arr[j] with pivot.", { j: j, pivot: pivot, i: i });
                pushStep(arr, 12, [j, high], "Checking: is arr[j] <= pivot?", { j: j, "arr[j]": arr[j], pivot: pivot });
                if (arr[j] <= pivot) {
                    i++; pushStep(arr, 13, [i], "Found an element <= pivot. Incrementing i.", { i: i, j: j });
                    let temp = arr[i]; pushStep(arr, 14, [i], "Swapping elements...", { i: i, j: j });
                    arr[i] = arr[j]; pushStep(arr, 15, [i, j], "Swapping elements: moving smaller element to the left.", { i: i, j: j });
                    arr[j] = temp; pushStep(arr, 16, [i, j], "Swap complete.", { i: i, j: j });
                }
            }
            let temp = arr[i + 1]; pushStep(arr, 19, [i + 1], "Finally, moving pivot to its correct sorted position.", { i: i, "i+1": i+1, pivot: pivot });
            arr[i + 1] = arr[high]; pushStep(arr, 20, [i + 1, high], "Moving pivot...", { i: i, "i+1": i+1 });
            arr[high] = temp; pushStep(arr, 21, [i + 1, high], "Pivot is now at its final sorted position.", { "sorted_at": i+1 });
            pushStep(arr, 22, [i + 1], "Returning the partition index.", { "pi": i+1 });
            return i + 1;
        }

        function quickSort(low, high) {
            pushStep(arr, 0, [low, high], "Calling QuickSort on sub-array.", { low: low, high: high });
            pushStep(arr, 1, [], "Check: is low < high?", { low: low, high: high });
            if (low < high) {
                pushStep(arr, 2, [], "Yes, low < high. Partitioning...");
                let pi = partition(low, high);
                pushStep(arr, 3, [], "Partitioning complete. Sorting left half.", { low: low, "pi-1": pi-1 });
                quickSort(low, pi - 1);
                pushStep(arr, 4, [], "Left half sorted. Sorting right half.", { "pi+1": pi+1, high: high });
                quickSort(pi + 1, high);
            }
            pushStep(arr, 5, [], "QuickSort call finished.");
        }

        if(arr.length > 0) {
            quickSort(0, arr.length - 1);
        }
        pushStep(arr, -1, [], "Quick Sort completed!"); // Done
    }

    function runInsertionSort() {
        let arr = [...array];
        steps = [];
        pushStep(arr, 0, [], "Starting Insertion Sort.");
        let n = arr.length; pushStep(arr, 1, [], "Initialize n as the array length.", { n: n });
        for (let i = 1; i < n; ++i) {
            pushStep(arr, 2, [i], "Main loop: picking element at index i.", { i: i, n: n });
            let key = arr[i]; pushStep(arr, 3, [i], "Set key = arr[i]. We will find the correct spot for this key.", { i: i, key: key });
            let j = i - 1; pushStep(arr, 4, [j], "Initialize j to the index before i.", { i: i, key: key, j: j });
            while (j >= 0 && arr[j] > key) {
                pushStep(arr, 5, [j, j + 1], "Compare arr[j] with key. Since arr[j] > key, we shift arr[j] to the right.", { i: i, key: key, j: j, "arr[j]": arr[j] });
                arr[j + 1] = arr[j]; pushStep(arr, 6, [j + 1, j], "Shifted arr[j] to arr[j+1].", { i: i, key: key, j: j });
                j = j - 1; pushStep(arr, 7, [j], "Decrement j to check the next element to the left.", { i: i, key: key, j: j });
            }
            pushStep(arr, 5, [j], "Condition j >= 0 && arr[j] > key is now false. Found the insertion spot.", { i: i, key: key, j: j });
            arr[j + 1] = key; pushStep(arr, 9, [j + 1], "Insert key at its correct position arr[j+1].", { i: i, key: key, j: j, "j+1": j+1 });
        }
        pushStep(arr, 11, [], "Array is now sorted using Insertion Sort!");
        pushStep(arr, -1); // Done
    }

    function runHeapSort() {
        let arr = [...array];
        steps = [];

        function heapify(n, i) {
            pushStep(arr, 9, [i], "Heapifying sub-tree.", { n: n, i: i });
            let largest = i, l = 2 * i + 1, r = 2 * i + 2; pushStep(arr, 10, [largest, l, r], "Initialize largest as root and calculate children.", { largest: largest, l: l, r: r });
            if (l < n && arr[l] > arr[largest]) {
                largest = l; pushStep(arr, 11, [l, largest], "Left child is larger than current largest.", { largest: largest });
            } else {
                pushStep(arr, 11, [l, largest], "Left child is not larger.");
            }
            if (r < n && arr[r] > arr[largest]) {
                largest = r; pushStep(arr, 12, [r, largest], "Right child is larger than current largest.", { largest: largest });
            } else {
                pushStep(arr, 12, [r, largest], "Right child is not larger.");
            }
            pushStep(arr, 13, [largest, i], "Checking: is largest still root?", { largest: largest, i: i });
            if (largest != i) {
                let swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap; pushStep(arr, 14, [i, largest], "Root is not largest. Swapping with largest child.", { i: i, largest: largest });
                heapify(n, largest); pushStep(arr, 15, [], "Recursively heapifying the affected sub-tree.");
            }
            pushStep(arr, 16, [], "Heapify complete.");
        }

        pushStep(arr, 0, [], "Starting Heap Sort.");
        let n = arr.length; pushStep(arr, 1, [], "Initialize n.", { n: n });
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            pushStep(arr, 2, [i], "Phase 1: Building max heap.", { i: i });
            heapify(n, i); pushStep(arr, 3, [i], "Root built.");
        }
        for (let i = n - 1; i > 0; i--) {
            pushStep(arr, 4, [i], "Phase 2: Extracting elements from heap.", { i: i });
            let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp; pushStep(arr, 5, [0, i], "Move current root to end.", { i: i });
            heapify(i, 0); pushStep(arr, 6, [], "Heapifying the reduced heap.");
        }
        pushStep(arr, 8, [], "Array is now sorted using Heap Sort!");
        pushStep(arr, -1, [], "Heap Sort completed!"); // Done
    }

    function runCountingSort() {
        let arr = [...array];
        steps = [];
        pushStep(arr, 0, [], "Starting Counting Sort.");
        let n = arr.length; pushStep(arr, 1, [], "Initialize n.", { n: n });
        let max = arr[0]; pushStep(arr, 2, [0], "Initialize max with the first element.", { max: max });
        for (let i = 1; i < n; i++) {
            pushStep(arr, 3, [i], "Scan for the maximum value in the array.", { i: i, max: max });
            if (arr[i] > max) {
                max = arr[i]; pushStep(arr, 4, [i], "New max found!", { max: max });
            }
        }
        let count = new Array(max + 1).fill(0); pushStep(arr, 5, [], "Create count array of size max + 1.", { size: max + 1 });
        for (let i = 0; i < n; i++) {
            pushStep(arr, 6, [i], "Count frequencies of each element.", { i: i, "arr[i]": arr[i] });
            count[arr[i]]++; pushStep(arr, 7, [i], "Increment count for this value.", { "value": arr[i], "count": count[arr[i]] });
        }
        for (let i = 1; i <= max; i++) {
            pushStep(arr, 8, [], "Update count array to store cumulative sums.", { i: i });
            count[i] += count[i - 1]; pushStep(arr, 9, [], "Accumulate: count[i] = count[i] + count[i-1]", { i: i, "count[i]": count[i] });
        }
        let output = new Array(n); pushStep(arr, 10, [], "Initialize output array.", { n: n });
        for (let i = n - 1; i >= 0; i--) {
            pushStep(arr, 11, [i], "Build output array using cumulative counts.", { i: i, "arr[i]": arr[i] });
            output[count[arr[i]] - 1] = arr[i]; pushStep(arr, 12, [i], "Place element in its correct output position.", { "arr[i]": arr[i], "index": count[arr[i]] - 1 });
            count[arr[i]]--; pushStep(arr, 13, [i], "Decrement count for this value.", { "value": arr[i], "remaining_count": count[arr[i]] });
        }
        for (let i = 0; i < n; i++) {
            pushStep(arr, 15, [i], "Copy sorted elements back to original array.", { i: i });
            arr[i] = output[i]; pushStep(arr, 16, [i], "Copied element from output array.", { "arr[i]": arr[i] });
        }
        pushStep(arr, 18, [], "Counting Sort complete!");
        pushStep(arr, -1, [], "Done."); // Done
    }

    function runDiddySort() {
        let arr = [...array];
        steps = [];
        pushStep(arr, 0, [], "Starting Diddy Sort.");
        pushStep(arr, 2, [], "Filtering phase: Checking for elements > 18.");
        
        let survivors = [];
        for (let i = 0; i < arr.length; i++) {
            pushStep(arr, 4, [i], "Checking element at index " + i, { i: i, value: arr[i] });
            if (arr[i] <= 18) {
                survivors.push(arr[i]);
                pushStep(arr, 5, [i], "Element is <= 18. Keep it!", { value: arr[i] });
            } else {
                pushStep(arr, 5, [i], "Element > 18. Removing from system...", { value: arr[i] });
            }
        }
        
        arr = [...survivors];
        pushStep(arr, 7, [], "Filtering complete. Survivors: " + arr.length, { count: arr.length });
        
        let n = arr.length;
        pushStep(arr, 10, [], "Starting Selection Sort on remaining elements.", { n: n });
        for (let i = 0; i < n - 1; i++) {
            let min_idx = i;
            pushStep(arr, 12, [i], "Assuming index " + i + " is the minimum.", { i: i, min_idx: min_idx });
            for (let j = i + 1; j < n; j++) {
                pushStep(arr, 13, [j, min_idx], "Comparing index " + j + " with current minimum.", { j: j, min_idx: min_idx });
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                    pushStep(arr, 14, [j, min_idx], "Found a new minimum!", { min_idx: min_idx });
                }
            }
            pushStep(arr, 16, [i, min_idx], "Swapping minimum into position " + i);
            let temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
            pushStep(arr, 19, [i, min_idx], "Swap complete.");
        }
        
        pushStep(arr, 20, [], "Diddy Sort complete!");
        pushStep(arr, -1, [], "Done.");
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
        else if (algo === 'diddy') codeLines = javaCodeDiddy;
        
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

        // Update Explanation
        if (step.explanation) {
            explanationText.textContent = step.explanation;
        } else {
            explanationText.textContent = "Processing algorithm steps...";
        }

        // Update Variable Watch
        variableList.innerHTML = '';
        if (step.vars) {
            Object.entries(step.vars).forEach(([key, val]) => {
                const varDiv = document.createElement("div");
                varDiv.style.padding = "4px 8px";
                varDiv.style.backgroundColor = "#374151";
                varDiv.style.borderRadius = "4px";
                varDiv.style.color = "#fff";
                varDiv.innerHTML = `<span style="color: #93c5fd;">${key}:</span> ${val}`;
                variableList.appendChild(varDiv);
            });
        }
        if (variableList.innerHTML === '') {
            variableList.innerHTML = '<span style="color: #6b7280; font-style: italic;">No active local variables</span>';
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
        else if (algoSelect.value === 'diddy') runDiddySort();
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
