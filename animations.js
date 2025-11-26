/**
 * Animaciones y efectos visuales para la Máquina de Turing Avanzada
 */

class ScrollAnimations {
    constructor() {
        this.scrollElements = document.querySelectorAll('[data-scroll]');
        this.init();
    }

    init() {
        this.initParticles();
        this.initScrollAnimations();
        this.initButtonEffects();
        this.initTabSystem();
        this.initAsciiGrid();
    }

    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 100, 
                        density: { 
                            enable: true, 
                            value_area: 1000 
                        } 
                    },
                    color: { 
                        value: ["#00ff88", "#0080ff", "#ff0080"] 
                    },
                    shape: { 
                        type: "circle" 
                    },
                    opacity: { 
                        value: 0.5, 
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: { 
                        value: 3, 
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.5,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#00ff88",
                        opacity: 0.15,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: true,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { 
                            enable: true, 
                            mode: "grab" 
                        },
                        onclick: { 
                            enable: true, 
                            mode: "push" 
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 0.5
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        this.scrollElements.forEach(el => observer.observe(el));
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Efecto ripple al hacer clic
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Añadir estilos para la animación ripple
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initTabSystem() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Remover active de todos los botones y contenidos
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Añadir active al botón y contenido seleccionado
                button.classList.add('active');
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });
    }

    initAsciiGrid() {
        const asciiGrid = document.getElementById('asciiGrid');
        if (!asciiGrid) return;

        // Mostrar caracteres ASCII imprimibles (32-126)
        for (let i = 32; i <= 126; i++) {
            const char = document.createElement('div');
            char.className = 'ascii-char';
            char.textContent = String.fromCharCode(i);
            char.title = `ASCII ${i}: ${String.fromCharCode(i)}`;
            asciiGrid.appendChild(char);
        }
    }
}

/**
 * Clase para manejar efectos visuales adicionales
 */
class VisualEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initCharCounter();
        this.initCaesarShiftControls();
        this.initConsoleControls();
    }

    initCharCounter() {
        const input = document.getElementById('inputString');
        const counter = document.getElementById('charCount');

        if (input && counter) {
            input.addEventListener('input', () => {
                counter.textContent = input.value.length;
                
                // Cambiar color si está cerca del límite
                if (input.value.length >= 25) {
                    counter.style.color = '#ff4444';
                } else if (input.value.length >= 20) {
                    counter.style.color = '#ffaa00';
                } else {
                    counter.style.color = '';
                }
            });
        }
    }

    initCaesarShiftControls() {
        const shiftInput = document.getElementById('caesarShift');
        const shiftUp = document.getElementById('shiftUp');
        const shiftDown = document.getElementById('shiftDown');

        if (shiftInput && shiftUp && shiftDown) {
            shiftUp.addEventListener('click', () => {
                let value = parseInt(shiftInput.value) || 0;
                if (value < 25) {
                    shiftInput.value = value + 1;
                }
            });

            shiftDown.addEventListener('click', () => {
                let value = parseInt(shiftInput.value) || 0;
                if (value > 1) {
                    shiftInput.value = value - 1;
                }
            });
        }
    }

    initConsoleControls() {
        const clearBtn = document.getElementById('clearConsole');
        const exportBtn = document.getElementById('exportLog');
        const consoleEl = document.getElementById('console');

        if (clearBtn && consoleEl) {
            clearBtn.addEventListener('click', () => {
                consoleEl.innerHTML = '<div class="console-line info">> Consola limpiada</div>';
            });
        }

        if (exportBtn && consoleEl) {
            exportBtn.addEventListener('click', () => {
                const lines = consoleEl.querySelectorAll('.console-line');
                let text = 'Log de Ejecución - Máquina de Turing Avanzada\n';
                text += '='.repeat(50) + '\n\n';
                
                lines.forEach(line => {
                    text += line.textContent + '\n';
                });

                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'turing-log.txt';
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    }

    /**
     * Crear efecto de destello en una celda
     */
    static flashCell(cell, color = '#00ff88') {
        const originalBg = cell.style.backgroundColor;
        const originalBorder = cell.style.borderColor;
        const originalShadow = cell.style.boxShadow;

        cell.style.backgroundColor = color;
        cell.style.borderColor = color;
        cell.style.boxShadow = `0 0 30px ${color}`;

        setTimeout(() => {
            cell.style.backgroundColor = originalBg;
            cell.style.borderColor = originalBorder;
            cell.style.boxShadow = originalShadow;
        }, 300);
    }

    /**
     * Animar el resultado
     */
    static animateResult(accepted) {
        const resultPanel = document.getElementById('resultPanel');
        const resultIcon = document.getElementById('resultIcon');
        const resultValue = document.getElementById('result');

        if (!resultPanel) return;

        // Añadir clase de animación
        resultPanel.style.animation = 'none';
        resultPanel.offsetHeight; // Trigger reflow
        resultPanel.style.animation = 'resultPulse 0.5s ease';

        if (accepted) {
            resultPanel.style.borderColor = '#00ff88';
            resultPanel.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.3)';
            resultIcon.textContent = '✅';
            resultValue.className = 'result-value accepted';
        } else {
            resultPanel.style.borderColor = '#ff4444';
            resultPanel.style.boxShadow = '0 0 30px rgba(255, 68, 68, 0.3)';
            resultIcon.textContent = '❌';
            resultValue.className = 'result-value rejected';
        }

        // Añadir keyframes si no existen
        if (!document.getElementById('result-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'result-animation-styles';
            style.textContent = `
                @keyframes resultPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Mostrar notificación toast
     */
    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : '#0080ff'};
            color: ${type === 'success' ? '#000' : '#fff'};
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(toast);

        // Añadir animaciones si no existen
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => toast.remove(), 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new VisualEffects();
});

// Exportar para uso en otros módulos
window.VisualEffects = VisualEffects;