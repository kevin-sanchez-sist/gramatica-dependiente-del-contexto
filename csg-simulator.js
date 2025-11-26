/**
 * Simulador de Gramáticas Dependientes del Contexto (CSG)
 * Versión Corregida - Con funcionalidad completa
 * 
 * @author Equipo GLF - UTP
 * @version 2.0
 */

class CSGSimulator {
    constructor() {
        // Símbolos especiales
        this.LEFT_BOUND = '⟨';
        this.RIGHT_BOUND = '⟩';
        this.BLANK = '□';
        
        // Estado del sistema
        this.currentGrammar = null;
        this.mode = 'generate'; // 'generate' o 'validate'
        this.sententialForm = ['S'];
        this.derivationHistory = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 600;
        this.position = 0;
        
        // Para validación
        this.targetString = '';
        this.maxSteps = 100;
        
        // Resultado
        this.result = null;
        this.isAccepted = false;
        
        // UI Elements
        this.elements = {};
        
        this.initialize();
    }

    initialize() {
        // Obtener elementos del DOM
        this.elements = {
            // Paneles
            grammarCards: document.querySelectorAll('.grammar-card'),
            modeButtons: document.querySelectorAll('.mode-btn'),
            
            // Inputs
            inputString: document.getElementById('inputString'),
            numDerivations: document.getElementById('numDerivations'),
            charCount: document.getElementById('charCount'),
            
            // Grupos de modo
            generateGroup: document.getElementById('generateGroup'),
            validateGroup: document.getElementById('validateGroup'),
            
            // Botones de control
            startBtn: document.getElementById('startBtn'),
            stepBtn: document.getElementById('stepBtn'),
            runBtn: document.getElementById('runBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            
            // Cinta (forma sentencial)
            tape: document.getElementById('tape'),
            tapeContainer: document.getElementById('tapeContainer'),
            tapeHead: document.getElementById('tapeHead'),
            headState: document.getElementById('headState'),
            
            // Estado
            currentPosition: document.getElementById('currentPosition'),
            stepCount: document.getElementById('stepCount'),
            currentLength: document.getElementById('currentLength'),
            appliedRule: document.getElementById('appliedRule'),
            
            // Reglas aplicables
            rulesContainer: document.getElementById('rulesContainer'),
            applicableRulesPanel: document.getElementById('applicableRulesPanel'),
            
            // Resultado
            result: document.getElementById('result'),
            resultIcon: document.getElementById('resultIcon'),
            resultOutput: document.getElementById('resultOutput'),
            outputValue: document.getElementById('outputValue'),
            resultValue: document.getElementById('resultValue'),
            resultPanel: document.getElementById('resultPanel'),
            
            // Árbol de derivación
            derivationTree: document.getElementById('derivationTree'),
            
            // Producciones
            productionsDisplay: document.getElementById('productionsDisplay'),
            
            // Editor personalizado
            customEditor: document.getElementById('customEditor'),
            
            // Velocidad
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue'),
            
            // Consola
            console: document.getElementById('console')
        };

        this.bindEvents();
        this.loadGrammar('anbncn'); // Cargar gramática por defecto
        this.addLog('Sistema inicializado correctamente', 'info');
        this.addLog('Selecciona una gramática y modo de operación', 'info');
    }

    bindEvents() {
        // Selección de gramática
        this.elements.grammarCards.forEach(card => {
            card.addEventListener('click', () => this.selectGrammar(card));
        });

        // Selección de modo
        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectMode(btn));
        });

        // Botones de control
        this.elements.startBtn.addEventListener('click', () => this.start());
        this.elements.stepBtn.addEventListener('click', () => this.step());
        this.elements.runBtn.addEventListener('click', () => this.run());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.resetBtn.addEventListener('click', () => this.reset());

        // Control de velocidad
        this.elements.speedSlider.addEventListener('input', (e) => {
            this.speed = 1050 - parseInt(e.target.value);
            this.elements.speedValue.textContent = `${this.speed}ms`;
        });

        // Navegación de cinta
        document.getElementById('scrollLeft').addEventListener('click', () => {
            this.elements.tapeContainer.scrollLeft -= 100;
        });
        document.getElementById('scrollRight').addEventListener('click', () => {
            this.elements.tapeContainer.scrollLeft += 100;
        });

        // Contador de caracteres
        if (this.elements.inputString) {
            this.elements.inputString.addEventListener('input', (e) => {
                this.elements.charCount.textContent = e.target.value.length;
            });
        }

        // Consola
        document.getElementById('clearConsole').addEventListener('click', () => {
            this.elements.console.innerHTML = '<div class="console-line info">> Consola limpiada</div>';
        });

        document.getElementById('exportLog').addEventListener('click', () => {
            this.exportLog();
        });
    }

    selectGrammar(card) {
        // Remover selección anterior
        this.elements.grammarCards.forEach(c => c.classList.remove('active'));
        
        // Seleccionar nueva gramática
        card.classList.add('active');
        const grammarId = card.dataset.grammar;
        
        // Mostrar/ocultar editor personalizado
        if (grammarId === 'custom') {
            this.elements.customEditor.style.display = 'block';
            this.loadCustomEditor();
        } else {
            this.elements.customEditor.style.display = 'none';
            this.loadGrammar(grammarId);
        }
        
        this.reset();
    }

    selectMode(btn) {
        // Remover selección anterior
        this.elements.modeButtons.forEach(b => b.classList.remove('active'));
        
        // Seleccionar nuevo modo
        btn.classList.add('active');
        this.mode = btn.dataset.mode;
        
        // Mostrar/ocultar controles según modo
        if (this.mode === 'generate') {
            this.elements.generateGroup.style.display = 'flex';
            this.elements.validateGroup.style.display = 'none';
        } else {
            this.elements.generateGroup.style.display = 'none';
            this.elements.validateGroup.style.display = 'flex';
        }
        
        this.addLog(`Modo seleccionado: ${this.mode === 'generate' ? 'Generar Cadenas' : 'Validar Cadenas'}`, 'info');
        this.reset();
    }

    loadGrammar(grammarId) {
        this.currentGrammar = GrammarDefinitions.getGrammar(grammarId);
        
        if (!this.currentGrammar) {
            this.addLog('Error: Gramática no encontrada', 'error');
            return;
        }

        this.addLog(`Gramática cargada: ${this.currentGrammar.name}`, 'success');
        this.addLog(`Descripción: ${this.currentGrammar.description}`, 'info');
        
        // Mostrar producciones
        this.displayProductions();
        
        // Reiniciar forma sentencial
        this.sententialForm = [this.currentGrammar.startSymbol];
        this.renderTape();
    }

    displayProductions() {
        if (!this.currentGrammar) return;
        
        this.elements.productionsDisplay.innerHTML = '';
        
        this.currentGrammar.productions.forEach((prod, index) => {
            const card = document.createElement('div');
            card.className = 'production-card';
            
            const rule = document.createElement('div');
            rule.className = 'production-rule';
            rule.innerHTML = `
                <span class="rule-number">${index + 1}.</span>
                <span class="rule-left">${prod.left.join(' ')}</span>
                <span class="rule-arrow">→</span>
                <span class="rule-right">${prod.right.join(' ')}</span>
            `;
            
            const desc = document.createElement('div');
            desc.className = 'production-desc';
            desc.textContent = prod.description || '';
            
            card.appendChild(rule);
            if (prod.description) {
                card.appendChild(desc);
            }
            
            this.elements.productionsDisplay.appendChild(card);
        });
    }

    start() {
        if (!this.currentGrammar) {
            this.addLog('Error: No hay gramática seleccionada', 'error');
            VisualEffects.showToast('Selecciona una gramática primero', 'error');
            return;
        }

        if (this.mode === 'generate') {
            const numDerivations = parseInt(this.elements.numDerivations.value) || 5;
            this.addLog(`Iniciando generación con ${numDerivations} derivaciones máximas`, 'info');
            this.maxSteps = numDerivations;
        } else {
            const input = this.elements.inputString.value.trim();
            if (!input) {
                this.addLog('Error: Ingresa una cadena para validar', 'error');
                VisualEffects.showToast('Ingresa una cadena', 'error');
                return;
            }
            this.targetString = input;
            this.addLog(`Iniciando validación de: "${input}"`, 'info');
            this.maxSteps = input.length * 10; // Límite proporcional
        }

        this.reset();
        this.currentStep = 0;
        this.derivationHistory = [this.sententialForm.join(' ')];
        this.updateDerivationTree();
    }

    /**
     * Encontrar todas las producciones aplicables en la forma sentencial actual
     */
    findApplicableProductions() {
        if (!this.currentGrammar) return [];

        const applicable = [];
        const formStr = this.sententialForm;

        for (let prodIndex = 0; prodIndex < this.currentGrammar.productions.length; prodIndex++) {
            const prod = this.currentGrammar.productions[prodIndex];
            
            // Buscar todas las posiciones donde se puede aplicar esta producción
            for (let pos = 0; pos <= formStr.length - prod.left.length; pos++) {
                let match = true;
                
                // Verificar si la producción coincide en esta posición
                for (let i = 0; i < prod.left.length; i++) {
                    if (formStr[pos + i] !== prod.left[i]) {
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    applicable.push({
                        production: prod,
                        productionIndex: prodIndex,
                        position: pos
                    });
                }
            }
        }

        return applicable;
    }

    /**
     * Aplicar una producción en una posición específica
     */
    applyProduction(applicable) {
        const { production, position } = applicable;
        
        // Crear nueva forma sentencial
        const newForm = [
            ...this.sententialForm.slice(0, position),
            ...production.right,
            ...this.sententialForm.slice(position + production.left.length)
        ];
        
        this.sententialForm = newForm;
        
        // Agregar a historial
        const ruleStr = `${production.left.join(' ')} → ${production.right.join(' ')}`;
        this.derivationHistory.push(this.sententialForm.join(' '));
        
        this.addLog(`Paso ${this.currentStep + 1}: Aplicada regla "${ruleStr}" en posición ${position}`, 'info');
        
        if (this.elements.appliedRule) {
            this.elements.appliedRule.textContent = ruleStr;
        }
        
        return true;
    }

    /**
     * Verificar si la forma sentencial actual es una cadena terminal
     */
    isTerminalString() {
        if (!this.currentGrammar) return false;
        
        return this.sententialForm.every(symbol => 
            this.currentGrammar.terminals.includes(symbol)
        );
    }

    /**
     * Ejecutar un paso de derivación
     */
    step() {
        if (this.currentStep >= this.maxSteps) {
            this.addLog('Límite de pasos alcanzado', 'warning');
            this.finishDerivation(false);
            return false;
        }

        // Buscar producciones aplicables
        const applicable = this.findApplicableProductions();
        
        if (applicable.length === 0) {
            // No hay más producciones aplicables
            if (this.mode === 'generate') {
                // En modo generar, verificar si llegamos a una cadena terminal
                if (this.isTerminalString()) {
                    this.finishDerivation(true);
                } else {
                    this.addLog('No hay más producciones aplicables', 'warning');
                    this.finishDerivation(false);
                }
            } else {
                // En modo validar, verificar si coincide con el objetivo
                const currentStr = this.sententialForm.join('');
                if (currentStr === this.targetString) {
                    this.finishDerivation(true);
                } else {
                    this.finishDerivation(false);
                }
            }
            return false;
        }

        // Seleccionar una producción aplicable
        let selectedApplicable;
        
        if (this.mode === 'generate') {
            // En modo generación, elegir aleatoriamente
            selectedApplicable = applicable[Math.floor(Math.random() * applicable.length)];
        } else {
            // En modo validación, usar heurística para acercarse al objetivo
            selectedApplicable = this.selectBestProduction(applicable);
        }

        // Aplicar la producción
        this.applyProduction(selectedApplicable);
        
        this.currentStep++;
        this.renderTape();
        this.updateDisplay();
        this.updateDerivationTree();

        // Verificar condiciones de término
        if (this.mode === 'generate') {
            if (this.isTerminalString()) {
                this.finishDerivation(true);
                return false;
            }
        } else {
            const currentStr = this.sententialForm.join('');
            if (currentStr === this.targetString) {
                this.finishDerivation(true);
                return false;
            }
            // Verificar si nos pasamos de longitud
            if (currentStr.length > this.targetString.length * 2) {
                this.finishDerivation(false);
                return false;
            }
        }

        return true;
    }

    /**
     * Seleccionar la mejor producción en modo validación
     */
    selectBestProduction(applicable) {
        // Heurística simple: preferir producciones que nos acerquen al objetivo
        let bestScore = -1;
        let bestApplicable = applicable[0];

        for (const app of applicable) {
            // Simular aplicación
            const newForm = [
                ...this.sententialForm.slice(0, app.position),
                ...app.production.right,
                ...this.sententialForm.slice(app.position + app.production.left.length)
            ];
            
            const newStr = newForm.join('');
            
            // Calcular score: preferir formas más cercanas al objetivo
            let score = 0;
            
            // Bonificación si es más similar al objetivo
            const minLen = Math.min(newStr.length, this.targetString.length);
            for (let i = 0; i < minLen; i++) {
                if (newStr[i] === this.targetString[i]) {
                    score += 10;
                }
            }
            
            // Penalización por diferencia de longitud
            score -= Math.abs(newStr.length - this.targetString.length) * 2;
            
            // Bonificación si reduce no-terminales
            const nonTerminals = newForm.filter(s => 
                this.currentGrammar.nonTerminals.includes(s)
            ).length;
            score -= nonTerminals * 5;
            
            if (score > bestScore) {
                bestScore = score;
                bestApplicable = app;
            }
        }

        return bestApplicable;
    }

    run() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.elements.runBtn.style.display = 'none';
        this.elements.pauseBtn.style.display = 'flex';
        
        this.addLog('Ejecución automática iniciada', 'info');

        const execute = () => {
            if (!this.isRunning || this.isPaused) return;
            
            const canContinue = this.step();
            
            if (canContinue && this.isRunning) {
                setTimeout(execute, this.speed);
            } else {
                this.isRunning = false;
                this.elements.runBtn.style.display = 'flex';
                this.elements.pauseBtn.style.display = 'none';
            }
        };
        
        execute();
    }

    pause() {
        this.isPaused = true;
        this.isRunning = false;
        
        this.elements.runBtn.style.display = 'flex';
        this.elements.pauseBtn.style.display = 'none';
        
        this.addLog('Ejecución pausada', 'warning');
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.result = null;
        this.position = 0;
        
        if (this.currentGrammar) {
            this.sententialForm = [this.currentGrammar.startSymbol];
            this.derivationHistory = [this.sententialForm.join(' ')];
        } else {
            this.sententialForm = ['S'];
            this.derivationHistory = ['S'];
        }
        
        this.renderTape();
        this.updateDisplay();
        this.updateDerivationTree();
        this.resetResultPanel();
        
        this.elements.runBtn.style.display = 'flex';
        this.elements.pauseBtn.style.display = 'none';
        
        this.addLog('Sistema reiniciado', 'info');
    }

    renderTape() {
        this.elements.tape.innerHTML = '';
        
        this.sententialForm.forEach((symbol, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // Clasificar símbolo
            if (this.currentGrammar) {
                if (this.currentGrammar.terminals.includes(symbol)) {
                    cell.classList.add('terminal');
                } else if (this.currentGrammar.nonTerminals.includes(symbol)) {
                    cell.classList.add('non-terminal');
                }
            }
            
            if (index === this.position) {
                cell.classList.add('active');
            }
            
            cell.textContent = symbol;
            
            const indexLabel = document.createElement('span');
            indexLabel.className = 'cell-index';
            indexLabel.textContent = index;
            cell.appendChild(indexLabel);
            
            this.elements.tape.appendChild(cell);
        });

        this.updateHeadPosition();
        this.scrollToHead();
    }

    updateHeadPosition() {
        const cells = this.elements.tape.querySelectorAll('.cell');
        
        if (cells[this.position]) {
            const cell = cells[this.position];
            const tapeRect = this.elements.tape.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();
            
            const left = cellRect.left - tapeRect.left + (cellRect.width / 2);
            this.elements.tapeHead.style.left = `${left}px`;
        }
        
        this.elements.headState.textContent = this.sententialForm[this.position] || 'S';
    }

    scrollToHead() {
        const cells = this.elements.tape.querySelectorAll('.cell');
        if (cells[this.position]) {
            const container = this.elements.tapeContainer;
            const cell = cells[this.position];
            const containerWidth = container.clientWidth;
            const cellLeft = cell.offsetLeft;
            const cellWidth = cell.offsetWidth;
            
            const scrollPosition = cellLeft - (containerWidth / 2) + (cellWidth / 2);
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    updateDisplay() {
        this.elements.currentPosition.textContent = this.position;
        this.elements.stepCount.textContent = this.currentStep;
        this.elements.currentLength.textContent = this.sententialForm.length;
    }

    updateDerivationTree() {
        this.elements.derivationTree.innerHTML = '';
        
        this.derivationHistory.forEach((form, index) => {
            const node = document.createElement('div');
            node.className = 'tree-node';
            
            if (index === this.derivationHistory.length - 1) {
                node.classList.add('current');
            }
            
            const stepLabel = document.createElement('span');
            stepLabel.className = 'step-label';
            stepLabel.textContent = index === 0 ? 'Inicio:' : `Paso ${index}:`;
            
            const formText = document.createElement('span');
            formText.className = 'form-text';
            formText.textContent = form;
            
            node.appendChild(stepLabel);
            node.appendChild(formText);
            
            this.elements.derivationTree.appendChild(node);
        });

        // Scroll al final
        this.elements.derivationTree.scrollTop = this.elements.derivationTree.scrollHeight;
    }

    finishDerivation(success) {
        this.result = success ? 'accepted' : 'rejected';
        this.isAccepted = success;
        
        const finalString = this.sententialForm.join('');
        
        if (success) {
            if (this.mode === 'generate') {
                this.addLog(`✓ Derivación exitosa: "${finalString}"`, 'success');
                this.elements.result.textContent = 'Cadena Generada';
                this.elements.resultIcon.textContent = '✅';
                if (this.elements.resultValue) {
                    this.elements.resultValue.textContent = finalString;
                }
                if (this.elements.outputValue) {
                    this.elements.outputValue.textContent = finalString;
                }
                if (this.elements.resultOutput) {
                    this.elements.resultOutput.style.display = 'block';
                }
            } else {
                this.addLog(`✓ Cadena aceptada: "${finalString}"`, 'success');
                this.elements.result.textContent = 'Cadena Aceptada';
                this.elements.resultIcon.textContent = '✅';
            }
            VisualEffects.showToast('Éxito', 'success');
        } else {
            if (this.mode === 'generate') {
                this.addLog(`✗ Derivación no completada`, 'error');
                this.elements.result.textContent = 'No Completada';
            } else {
                this.addLog(`✗ Cadena rechazada: "${finalString}" ≠ "${this.targetString}"`, 'error');
                this.elements.result.textContent = 'Cadena Rechazada';
            }
            this.elements.resultIcon.textContent = '❌';
            VisualEffects.showToast('Derivación fallida', 'error');
        }
        
        VisualEffects.animateResult(success);
        
        this.isRunning = false;
        this.elements.runBtn.style.display = 'flex';
        this.elements.pauseBtn.style.display = 'none';
    }

    resetResultPanel() {
        this.elements.result.textContent = 'En espera';
        this.elements.resultIcon.textContent = '⏳';
        if (this.elements.resultOutput) {
            this.elements.resultOutput.style.display = 'none';
        }
        if (this.elements.appliedRule) {
            this.elements.appliedRule.textContent = '-';
        }
    }

    loadCustomEditor() {
        this.addLog('Editor de gramáticas personalizadas (próximamente)', 'info');
    }

    addLog(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        line.textContent = `[${timestamp}] ${message}`;
        
        this.elements.console.appendChild(line);
        this.elements.console.scrollTop = this.elements.console.scrollHeight;
    }

    exportLog() {
        const lines = this.elements.console.querySelectorAll('.console-line');
        let text = 'Log de Ejecución - Simulador CSG\n';
        text += '='.repeat(50) + '\n\n';
        
        if (this.currentGrammar) {
            text += `Gramática: ${this.currentGrammar.name}\n`;
            text += `Modo: ${this.mode}\n`;
            text += `Resultado: ${this.result || 'En proceso'}\n`;
            text += '='.repeat(50) + '\n\n';
        }
        
        lines.forEach(line => {
            text += line.textContent + '\n';
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `csg-log-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.addLog('Log exportado exitosamente', 'success');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new CSGSimulator();
});