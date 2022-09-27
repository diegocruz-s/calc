const $buttons = document.querySelectorAll('.allBtns .btn');
const $currentOperation = document.querySelector('.currentOperation');
const $nextOperation = document.querySelector('.nextOperation');
let blockBtns = false;

$buttons.forEach((button)=>{
    button.addEventListener('click', (e)=>{

        if(!blockBtns){
            const valueLetter = e.target.innerText;
                
            if(+valueLetter >= 0 || valueLetter === '.' || valueLetter === '-'){

                calc.addValueCurrent(valueLetter);

            }else{

                calc.addValueNext(valueLetter);

            }
        }

    })
})

const calc = {

    addValueCurrent(value){
        const lastCharactereCurrent = $currentOperation.innerText.substr(-1);

        if(value === '.' && $currentOperation.innerText.includes('.')){
            return;
        }else if(value === '-' && $currentOperation.innerText.includes('-')){
            return;
        }else if(value === '.' && lastCharactereCurrent === '-'){
            return;
        }else if(value === '-' && lastCharactereCurrent === '.'){
            return;
        }else if($currentOperation.innerText !== '' && value === '-'){
            return;
        }else if($currentOperation.innerText === '' && value === '.'){
            return;
        }

        $currentOperation.innerText += value;
        
    },

    addValueNext(value){

        if(value === 'C'){
            this.restartAll();
            return;
        }
        if(value === 'DEL'){
            this.removeCaracter();
            return;
        }
        if(value === 'CE'){
            this.clearCurrentOperation();
            return;
        }
        
        this.changeValues(value);
        
    },

    changeValues(value){
        if($nextOperation.innerText !== ''){
            
            if($currentOperation.innerText === '-') return;
            
            const valuesOperations = $nextOperation.innerText += " " + $currentOperation.innerText;

            const lastCaracter = $nextOperation.innerText.substr(-1);

            if(lastCaracter === '+'||'*'||'/'){
                if(value !== '='){
                    $nextOperation.innerText = $nextOperation.innerText.replace(lastCaracter, value);
                }
            };
 
            const brokenValues = valuesOperations.split(' ');
            
            const firstValue = brokenValues[0];
            const operation = brokenValues[1];
            const secondValue = brokenValues[2];

            if(!secondValue) return;
            
            const resultOperation = this.performOperation(+firstValue, operation, +secondValue);
            
            if(resultOperation.error){
                $nextOperation.innerText = resultOperation.error;
                setTimeout(()=>{
                    this.restartAll();
                    blockBtns = false;
                }, 1000)
                return;
            }

            if(value === '='){
                $nextOperation.innerText = " " + resultOperation + " " + " + ";
                $currentOperation.innerText = '';

            }else{
                if(value === '=') return;

                $nextOperation.innerText = " " + resultOperation + " " + value;
                $currentOperation.innerText = '';
                
            }

            return;
        }else{
            if(value === '=') return;

            $nextOperation.innerText += " " + $currentOperation.innerText + " " + value;
            $currentOperation.innerText = '';

        }
    },

    performOperation(firstValue, operation, secondValue){

        if(!+firstValue && firstValue !== 0 || typeof operation !== 'string'){
            blockBtns = true;
            return { error: 'Valores inválidos!' };
        }

        switch(operation){
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                if(secondValue === 0){
                    blockBtns = true;
                    return { error: 'Impossível dividir por zero!' };
                };
                return firstValue / secondValue;
            default:
                blockBtns = true;
                return { error: 'Houve um erro!' }; 
        }
        
    },

    removeCaracter(){
        const valueText = $currentOperation.innerText;
        const newText = valueText.substring(0, valueText.length-1);
        $currentOperation.innerText = newText;
    },

    restartAll(){
        $currentOperation.innerText = '';
        $nextOperation.innerText = '';
    },

    clearCurrentOperation(){
        $currentOperation.innerText = '';
    },

}
