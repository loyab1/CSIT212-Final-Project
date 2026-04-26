document.addEventListener("DOMContentLoaded", () => {
    const workspace = document.getElementById("workspace");
    const wireCanvas = document.getElementById("wireCanvas");

    let nodes = {};
    let wires = [];
    let nodeIdCounter = 0;

    // Dragging state
    let draggedNode = null;
    let offsetX = 0;
    let offsetY = 0;

    // Wiring state
    let isWiring = false;
    let wireStartPort = null; // { nodeId, type: 'out', portIndex }
    let tempWire = null;

    // Node Types Definition
    const GATE_TYPES = {
        INPUT: { inputs: 0, outputs: 1, label: 'Input' },
        OUTPUT: { inputs: 1, outputs: 0, label: 'Output' },
        AND: { inputs: 2, outputs: 1, label: 'AND' },
        OR: { inputs: 2, outputs: 1, label: 'OR' },
        XOR: { inputs: 2, outputs: 1, label: 'XOR' },
        NAND: { inputs: 2, outputs: 1, label: 'NAND' },
        NOT: { inputs: 1, outputs: 1, label: 'NOT' }
    };

    function generateId() {
        return 'node_' + (++nodeIdCounter);
    }

    function createNode(type, x, y) {
        const id = generateId();
        const def = GATE_TYPES[type];
        
        const node = {
            id,
            type,
            x,
            y,
            inputs: new Array(def.inputs).fill(null), // Holds values 0/1
            output: 0,
            element: null
        };
        nodes[id] = node;
        renderNode(node);
        evaluateCircuit();
        return node;
    }

    function renderNode(node) {
        const el = document.createElement("div");
        el.className = "circuit-node";
        el.id = node.id;
        el.style.left = node.x + "px";
        el.style.top = node.y + "px";

        // Delete button
        const trash = document.createElement("div");
        trash.className = "trash-btn";
        trash.innerHTML = "X";
        trash.onclick = (e) => {
            e.stopPropagation();
            deleteNode(node.id);
        };
        el.appendChild(trash);

        // Header
        const header = document.createElement("div");
        header.className = "node-header";
        header.innerText = GATE_TYPES[node.type].label;
        header.onmousedown = (e) => startDrag(e, node);
        header.addEventListener('touchstart', (e) => startDrag(e, node), {passive: false});
        el.appendChild(header);

        // Body
        const body = document.createElement("div");
        body.className = "node-body";

        // Input ports
        const inContainer = document.createElement("div");
        inContainer.className = "port-container";
        for(let i=0; i < GATE_TYPES[node.type].inputs; i++) {
            const port = document.createElement("div");
            port.className = "port in-port";
            port.dataset.nodeId = node.id;
            port.dataset.portIdx = i;
            port.dataset.type = 'in';
            
            port.onmousedown = (e) => handlePortClick(e, port);
            port.addEventListener('touchstart', (e) => { if(e.type==='touchstart') e.preventDefault(); handlePortClick(e, port); }, {passive: false});
            port.onmouseup = (e) => handlePortDrop(e, port);
            
            inContainer.appendChild(port);
        }
        body.appendChild(inContainer);

        // Content
        const content = document.createElement("div");
        content.className = "node-content";
        if (node.type === 'INPUT') {
            const toggle = document.createElement("div");
            toggle.className = "input-toggle";
            toggle.innerText = "0";
            toggle.onclick = () => {
                node.output = node.output === 1 ? 0 : 1;
                toggle.innerText = node.output;
                toggle.classList.toggle("active", node.output === 1);
                evaluateCircuit();
            };
            content.appendChild(toggle);
        } else if (node.type === 'OUTPUT') {
            const bulb = document.createElement("div");
            bulb.className = "output-bulb";
            bulb.id = `bulb_${node.id}`;
            content.appendChild(bulb);
        }
        body.appendChild(content);

        // Output ports
        const outContainer = document.createElement("div");
        outContainer.className = "port-container";
        for(let i=0; i < GATE_TYPES[node.type].outputs; i++) {
            const port = document.createElement("div");
            port.className = "port out-port";
            port.dataset.nodeId = node.id;
            port.dataset.portIdx = i;
            port.dataset.type = 'out';
            
            port.onmousedown = (e) => handlePortClick(e, port);
            port.addEventListener('touchstart', (e) => { if(e.type==='touchstart') e.preventDefault(); handlePortClick(e, port); }, {passive: false});
            port.onmouseup = (e) => handlePortDrop(e, port);
            
            outContainer.appendChild(port);
        }
        body.appendChild(outContainer);

        el.appendChild(body);
        workspace.appendChild(el);
        node.element = el;
    }

    function deleteNode(nodeId) {
        // Remove connected wires
        wires = wires.filter(w => w.from.nodeId !== nodeId && w.to.nodeId !== nodeId);
        // Remove element
        if (nodes[nodeId].element) {
            nodes[nodeId].element.remove();
        }
        delete nodes[nodeId];
        renderWires();
        evaluateCircuit();
    }

    function clearWorkspace() {
        Object.keys(nodes).forEach(id => deleteNode(id));
        wires = [];
        nodeIdCounter = 0;
        renderWires();
    }

    // --- Drag & Drop ---
    function startDrag(e, node) {
        if (e.type === 'mousedown' && e.button !== 0) return;
        draggedNode = node;
        const rect = node.element.getBoundingClientRect();
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;
        node.element.classList.add("dragging");
    }

    function handleMove(e) {
        const workspaceRect = workspace.getBoundingClientRect();
        const clientX = e.type === 'touchmove' || e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' || e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        if (draggedNode) {
            if (e.type === 'touchmove') e.preventDefault();
            let x = clientX - workspaceRect.left - offsetX;
            let y = clientY - workspaceRect.top - offsetY;
            
            x = Math.max(0, Math.min(x, workspaceRect.width - draggedNode.element.offsetWidth));
            y = Math.max(0, Math.min(y, workspaceRect.height - draggedNode.element.offsetHeight));
            
            draggedNode.x = x;
            draggedNode.y = y;
            draggedNode.element.style.left = x + "px";
            draggedNode.element.style.top = y + "px";
            renderWires();
        }

        if (isWiring && tempWire) {
            if (e.type === 'touchmove') e.preventDefault();
            const startPortEl = getPortElement(wireStartPort.nodeId, wireStartPort.type, wireStartPort.portIdx);
            if(startPortEl) {
                const startPos = getPortCenter(startPortEl);
                const endPos = { 
                    x: clientX - workspaceRect.left, 
                    y: clientY - workspaceRect.top 
                };
                drawBezier(tempWire, startPos, endPos, false);
            }
        }
    }

    function handleUp(e) {
        if (draggedNode) {
            draggedNode.element.classList.remove("dragging");
            draggedNode = null;
        }
        if (isWiring) {
            if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0) {
                const clientX = e.changedTouches[0].clientX;
                const clientY = e.changedTouches[0].clientY;
                const elUnder = document.elementFromPoint(clientX, clientY);
                if (elUnder && elUnder.classList.contains('port') && elUnder.dataset.type === 'in') {
                    handlePortDrop({stopPropagation: () => {}}, elUnder);
                }
            }

            isWiring = false;
            wireStartPort = null;
            if (tempWire) {
                tempWire.remove();
                tempWire = null;
            }
        }
    }

    workspace.addEventListener("mousemove", handleMove);
    workspace.addEventListener("touchmove", handleMove, {passive: false});
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);

    // --- Wiring logic ---
    function handlePortClick(e, portEl) {
        if(e.stopPropagation) e.stopPropagation();
        const type = portEl.dataset.type;
        if (type !== 'out') return;

        isWiring = true;
        wireStartPort = {
            nodeId: portEl.dataset.nodeId,
            type: type,
            portIdx: parseInt(portEl.dataset.portIdx)
        };

        tempWire = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempWire.setAttribute("class", "wire");
        wireCanvas.appendChild(tempWire);
    }

    function handlePortDrop(e, portEl) {
        if(e.stopPropagation) e.stopPropagation();
        if(!isWiring || !wireStartPort) return;
        
        const type = portEl.dataset.type;
        if (type !== 'in') return;
        
        const targetNodeId = portEl.dataset.nodeId;
        const targetPortIdx = parseInt(portEl.dataset.portIdx);

        if(wireStartPort.nodeId === targetNodeId) return;

        wires = wires.filter(w => !(w.to.nodeId === targetNodeId && w.to.portIdx === targetPortIdx));

        wires.push({
            from: { nodeId: wireStartPort.nodeId, portIdx: wireStartPort.portIdx },
            to: { nodeId: targetNodeId, portIdx: targetPortIdx }
        });

        renderWires();
        evaluateCircuit();
    }

// --- SVG rendering ---
    function getPortElement(nodeId, type, portIdx) {
        const nodeEl = document.getElementById(nodeId);
        if(!nodeEl) return null;
        return nodeEl.querySelector(`.port[data-type="${type}"][data-port-idx="${portIdx}"]`);
    }

    function getPortCenter(portEl) {
        const portRect = portEl.getBoundingClientRect();
        const workspaceRect = workspace.getBoundingClientRect();
        return {
            x: portRect.left - workspaceRect.left + portRect.width / 2,
            y: portRect.top - workspaceRect.top + portRect.height / 2
        };
    }

    function drawBezier(pathEl, p1, p2, isActive) {
        const dx = Math.abs(p2.x - p1.x) * 0.5;
        const d = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
        pathEl.setAttribute("d", d);
        if(isActive) pathEl.classList.add("active");
        else pathEl.classList.remove("active");
    }

    function renderWires() {
        // Keep existing path elements to avoid recreating, or just wipe and redraw
        wireCanvas.innerHTML = '';
        wires.forEach(w => {
            const startPort = getPortElement(w.from.nodeId, 'out', w.from.portIdx);
            const endPort = getPortElement(w.to.nodeId, 'in', w.to.portIdx);
            
            if(startPort && endPort) {
                const p1 = getPortCenter(startPort);
                const p2 = getPortCenter(endPort);
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", "wire");
                
                // Check if wire is active (carrying a 1)
                const sourceNode = nodes[w.from.nodeId];
                const isActive = sourceNode ? sourceNode.output === 1 : false;
                
                drawBezier(path, p1, p2, isActive);
                wireCanvas.appendChild(path);
            }
        });
    }

    // --- Logic Evaluation ---
    function evaluateLogic(type, inputs) {
        const a = inputs[0] || 0;
        const b = inputs[1] || 0;

        switch(type) {
            case 'AND': return (a === 1 && b === 1) ? 1 : 0;
            case 'OR': return (a === 1 || b === 1) ? 1 : 0;
            case 'XOR': return (a !== b) ? 1 : 0;
            case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
            case 'NOT': return a === 1 ? 0 : 1;
            case 'OUTPUT': return a;
            default: return 0;
        }
    }

    function evaluateCircuit() {
        // Reset all inputs first (except raw INPUT nodes)
        Object.values(nodes).forEach(n => {
            if(n.type !== 'INPUT') {
                n.inputs.fill(0);
            }
        });

        // Simple propagation: since it can have loops or order issues, 
        // we'll run a fixed number of iterations (e.g. 10) to let signals propagate.
        // A true topological sort is better, but this handles simple feedbacks.
        const iterations = Object.keys(nodes).length + 2;

        for(let iter=0; iter < iterations; iter++) {
            // Transfer signals along wires
            wires.forEach(w => {
                const sourceNode = nodes[w.from.nodeId];
                const targetNode = nodes[w.to.nodeId];
                if(sourceNode && targetNode) {
                    targetNode.inputs[w.to.portIdx] = sourceNode.output;
                }
            });

            // Evaluate all gates
            Object.values(nodes).forEach(n => {
                if(n.type !== 'INPUT') {
                    n.output = evaluateLogic(n.type, n.inputs);
                }
            });
        }

        // Update visuals
        Object.values(nodes).forEach(n => {
            if (n.type === 'OUTPUT') {
                const bulb = document.getElementById(`bulb_${n.id}`);
                if(bulb) {
                    bulb.classList.toggle("active", n.output === 1);
                }
            }
        });

        renderWires(); // update wire colors
    }

    // --- Toolbar bindings ---
    function spawnNode(type) {
        // Random slight offset so they don't stack perfectly
        const x = 50 + Math.random() * 50;
        const y = 50 + Math.random() * 50;
        createNode(type, x, y);
    }

    document.getElementById("addInput").onclick = () => spawnNode('INPUT');
    document.getElementById("addOutput").onclick = () => spawnNode('OUTPUT');
    document.getElementById("addAND").onclick = () => spawnNode('AND');
    document.getElementById("addOR").onclick = () => spawnNode('OR');
    document.getElementById("addXOR").onclick = () => spawnNode('XOR');
    document.getElementById("addNAND").onclick = () => spawnNode('NAND');
    document.getElementById("addNOT").onclick = () => spawnNode('NOT');
    document.getElementById("clearWorkspace").onclick = clearWorkspace;

    // Default setup
    const in1 = createNode('INPUT', 50, 100);
    const in2 = createNode('INPUT', 50, 200);
    const andGate = createNode('AND', 250, 150);
    const out1 = createNode('OUTPUT', 450, 150);

    wires.push({ from: { nodeId: in1.id, portIdx: 0 }, to: { nodeId: andGate.id, portIdx: 0 }});
    wires.push({ from: { nodeId: in2.id, portIdx: 0 }, to: { nodeId: andGate.id, portIdx: 1 }});
    wires.push({ from: { nodeId: andGate.id, portIdx: 0 }, to: { nodeId: out1.id, portIdx: 0 }});
    
    setTimeout(() => {
        renderWires();
        evaluateCircuit();
    }, 100); // Small delay to let DOM paint first
});
