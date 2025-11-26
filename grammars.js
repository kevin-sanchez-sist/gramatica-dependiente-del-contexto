/**
 * Gramáticas Dependientes del Contexto - Definiciones
 * Colección de gramáticas predefinidas (clásicas y prácticas)
 * 
 * @author Equipo GLF - UTP
 * @version 1.0
 */

class GrammarDefinitions {
    /**
     * Obtener todas las gramáticas predefinidas
     */
    static getAllGrammars() {
        return {
            // ========== GRAMÁTICAS CLÁSICAS ==========
            'anbncn': {
                name: 'a^n b^n c^n',
                description: 'Lengua clásica CSG - Longitud múltiple',
                startSymbol: 'S',
                terminals: ['a', 'b', 'c'],
                nonTerminals: ['S', 'B', 'C'],
                productions: [
                    { left: ['S'], right: ['a', 'S', 'B', 'C'], description: 'Generar nueva capa' },
                    { left: ['S'], right: ['a', 'B', 'C'], description: 'Caso base' },
                    { left: ['C', 'B'], right: ['B', 'C'], description: 'Intercambiar B y C' },
                    { left: ['a', 'B'], right: ['a', 'b'], description: 'Convertir B en b' },
                    { left: ['b', 'B'], right: ['b', 'b'], description: 'Propagar b' },
                    { left: ['b', 'C'], right: ['b', 'c'], description: 'Convertir C en c' },
                    { left: ['c', 'C'], right: ['c', 'c'], description: 'Propagar c' }
                ],
                examples: ['abc', 'aabbcc', 'aaabbbccc'],
                type: 'classic'
            },

            'ww': {
                name: 'ww',
                description: 'Duplicación exacta de cadenas',
                startSymbol: 'S',
                terminals: ['a', 'b'],
                nonTerminals: ['S', 'A', 'B', 'C'],
                productions: [
                    { left: ['S'], right: ['a', 'S', 'A'], description: 'Agregar a' },
                    { left: ['S'], right: ['b', 'S', 'B'], description: 'Agregar b' },
                    { left: ['S'], right: ['C'], description: 'Iniciar copia' },
                    { left: ['C', 'a'], right: ['a', 'a', 'C'], description: 'Copiar a' },
                    { left: ['C', 'b'], right: ['b', 'b', 'C'], description: 'Copiar b' },
                    { left: ['C', 'A'], right: ['a'], description: 'Terminar con a' },
                    { left: ['C', 'B'], right: ['b'], description: 'Terminar con b' }
                ],
                examples: ['aa', 'bb', 'abab', 'baba', 'aabbaa'],
                type: 'classic'
            },

            'anbnan': {
                name: 'a^n b^n a^n',
                description: 'Centro marcado con b\'s',
                startSymbol: 'S',
                terminals: ['a', 'b'],
                nonTerminals: ['S', 'A', 'B'],
                productions: [
                    { left: ['S'], right: ['a', 'S', 'a'], description: 'Agregar a\'s simétricos' },
                    { left: ['S'], right: ['B'], description: 'Iniciar centro' },
                    { left: ['B'], right: ['b', 'B'], description: 'Agregar b' },
                    { left: ['B'], right: ['b'], description: 'Caso base b' },
                    { left: ['a', 'B'], right: ['B', 'a'], description: 'Intercambiar para simetría' }
                ],
                examples: ['aba', 'aabbaa', 'aaabbbaa', 'aaaabbbbaaaa'],
                type: 'classic'
            },

            'anb2n': {
                name: 'a^n b^2n',
                description: 'Relación 1:2 entre símbolos',
                startSymbol: 'S',
                terminals: ['a', 'b'],
                nonTerminals: ['S', 'A', 'B'],
                productions: [
                    { left: ['S'], right: ['a', 'S', 'B', 'B'], description: 'Agregar a y dos B' },
                    { left: ['S'], right: ['a', 'B', 'B'], description: 'Caso base' },
                    { left: ['a', 'B'], right: ['a', 'b'], description: 'Primera b' },
                    { left: ['b', 'B'], right: ['b', 'b'], description: 'Segunda b' }
                ],
                examples: ['abb', 'aabbbb', 'aaabbbbbb'],
                type: 'classic'
            },

            // ========== GRAMÁTICAS PRÁCTICAS ==========
            'balanced': {
                name: 'Balanceo Complejo',
                description: 'Paréntesis correctamente anidados',
                startSymbol: 'S',
                terminals: ['(', ')'],
                nonTerminals: ['S'],
                productions: [
                    { left: ['S'], right: ['(', 'S', ')'], description: 'Anidar paréntesis' },
                    { left: ['S'], right: ['S', 'S'], description: 'Concatenar expresiones' },
                    { left: ['S'], right: ['(', ')'], description: 'Par simple' }
                ],
                examples: ['()', '(())', '()()', '((()))', '(()())'],
                type: 'practical'
            },

            'declaration': {
                name: 'Declaraciones de Variables',
                description: 'Declaraciones tipo var:tipo',
                startSymbol: 'S',
                terminals: ['int', 'float', 'x', 'y', ':', ','],
                nonTerminals: ['S', 'D', 'T', 'V'],
                productions: [
                    { left: ['S'], right: ['D'], description: 'Declaración' },
                    { left: ['D'], right: ['T', 'V', ':', 'T'], description: 'Tipo var:tipo' },
                    { left: ['D'], right: ['D', ',', 'D'], description: 'Múltiples declaraciones' },
                    { left: ['T'], right: ['int'], description: 'Tipo int' },
                    { left: ['T'], right: ['float'], description: 'Tipo float' },
                    { left: ['V'], right: ['x'], description: 'Variable x' },
                    { left: ['V'], right: ['y'], description: 'Variable y' }
                ],
                examples: ['int x:int', 'float y:float', 'int x:int,float y:float'],
                type: 'practical'
            },

            'palindrome-ctx': {
                name: 'Palíndromo Contextual',
                description: 'Palíndromos con marcadores contextuales',
                startSymbol: 'S',
                terminals: ['a', 'b', 'c'],
                nonTerminals: ['S'],
                productions: [
                    { left: ['S'], right: ['a', 'S', 'a'], description: 'Palíndromo con a' },
                    { left: ['S'], right: ['b', 'S', 'b'], description: 'Palíndromo con b' },
                    { left: ['S'], right: ['c', 'S', 'c'], description: 'Palíndromo con c' },
                    { left: ['S'], right: ['a'], description: 'Centro a' },
                    { left: ['S'], right: ['b'], description: 'Centro b' },
                    { left: ['S'], right: ['c'], description: 'Centro c' }
                ],
                examples: ['a', 'aba', 'bab', 'abcba', 'aabaa', 'abba'],
                type: 'practical'
            }
        };
    }

    /**
     * Obtener una gramática específica
     */
    static getGrammar(grammarId) {
        const grammars = this.getAllGrammars();
        return grammars[grammarId] || null;
    }

    /**
     * Validar que una gramática sea CSG válida
     */
    static validateCSG(grammar) {
        const errors = [];

        // Verificar que exista símbolo inicial
        if (!grammar.startSymbol) {
            errors.push('Debe definir un símbolo inicial');
        }

        // Verificar que haya al menos una producción
        if (!grammar.productions || grammar.productions.length === 0) {
            errors.push('Debe haber al menos una producción');
        }

        // Verificar cada producción
        grammar.productions.forEach((prod, index) => {
            // Verificar que |left| <= |right| (propiedad CSG)
            if (prod.left.length > prod.right.length) {
                errors.push(`Producción ${index + 1}: |α| > |β| (no es CSG)`);
            }

            // Verificar que no haya epsilon-producciones (excepto S -> ε)
            if (prod.right.length === 0) {
                if (prod.left.length !== 1 || prod.left[0] !== grammar.startSymbol) {
                    errors.push(`Producción ${index + 1}: ε-producción no permitida`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Crear gramática personalizada vacía
     */
    static createEmptyGrammar() {
        return {
            name: 'Gramática Personalizada',
            description: 'Define tu propia gramática CSG',
            startSymbol: 'S',
            terminals: [],
            nonTerminals: ['S'],
            productions: [
                { left: ['S'], right: ['a'], description: 'Producción de ejemplo' }
            ],
            examples: [],
            type: 'custom'
        };
    }

    /**
     * Exportar gramática a JSON
     */
    static exportGrammar(grammar) {
        return JSON.stringify(grammar, null, 2);
    }

    /**
     * Importar gramática desde JSON
     */
    static importGrammar(jsonString) {
        try {
            const grammar = JSON.parse(jsonString);
            const validation = this.validateCSG(grammar);
            
            if (!validation.valid) {
                return {
                    success: false,
                    errors: validation.errors
                };
            }

            return {
                success: true,
                grammar: grammar
            };
        } catch (e) {
            return {
                success: false,
                errors: ['JSON inválido: ' + e.message]
            };
        }
    }

    /**
     * Obtener ejemplos de cadenas para una gramática
     */
    static getExamples(grammarId) {
        const grammar = this.getGrammar(grammarId);
        return grammar ? grammar.examples : [];
    }

    /**
     * Generar descripción legible de una producción
     */
    static formatProduction(production) {
        const left = production.left.join(' ');
        const right = production.right.join(' ');
        return `${left} → ${right}`;
    }

    /**
     * Detectar contexto en una producción
     */
    static detectContext(production) {
        // Buscar el núcleo (no terminal) en el lado izquierdo
        const nonTerminalIndex = production.left.findIndex(
            symbol => /^[A-Z]$/.test(symbol)
        );

        if (nonTerminalIndex === -1) {
            return {
                leftContext: [],
                core: production.left,
                rightContext: []
            };
        }

        return {
            leftContext: production.left.slice(0, nonTerminalIndex),
            core: [production.left[nonTerminalIndex]],
            rightContext: production.left.slice(nonTerminalIndex + 1)
        };
    }

    /**
     * Verificar si una cadena contiene solo terminales
     */
    static isTerminalString(string, terminals) {
        return string.every(symbol => terminals.includes(symbol));
    }

    /**
     * Encontrar todas las posiciones donde se puede aplicar una producción
     */
    static findApplicablePositions(sententialForm, production) {
        const positions = [];
        const leftPattern = production.left;

        for (let i = 0; i <= sententialForm.length - leftPattern.length; i++) {
            let match = true;
            for (let j = 0; j < leftPattern.length; j++) {
                if (sententialForm[i + j] !== leftPattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                positions.push(i);
            }
        }

        return positions;
    }
}

// Exportar para uso en otros módulos
window.GrammarDefinitions = GrammarDefinitions;