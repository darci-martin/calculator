import {Display} from "./Display"
import {PastCalculations} from "./PastCalculations";
import {useState, useEffect, useCallback} from "react"
import {Buttons} from "./Buttons"
import previous from "../previous-calcs.json"

let operatorInput = ''; 
let result = 0;
let secondOperand = false; //tracking if we are on first or second operand
let operatorLast = false; //tracking if an operator was last input
let calcHist = []; //use for previous calculations section

export const Calculator = () => {

    const [operandOne, setOperandOne] = useState('');
    const [operandTwo, setOperandTwo] = useState('');
    const [prevCalcs, setPrevCalcs] = useState([]);

    const buttonList = ["AC","DEL","÷","7","8","9","*","4","5","6","-","1","2","3","+","0",".","="];

    // Process each of the passed previous calculations
    useEffect(() => {
        previous.forEach((previous) => {
            let var1 = parseFloat(previous.operand1);
            let var2 = parseFloat(previous.operand2);
            let res = 0;
            switch (previous.operator) {
            case '+':
                res = var1 + var2;
                break;
            case '-':
                res = var1 - var2;
                break;
            case '÷':
                res = var1 / var2;
                break;
            case '/':
                res = var1 / var2;
                break;
            case '*':
                res = var1 * var2;
                break;
            default:
                res = 0;
            }
            let prevCalc = var1 + ' ' + previous.operator + ' ' + var2 + ' = ' + res.toFixed(7) * 1;
            calcHist.unshift(prevCalc);
            setPrevCalcs(calcHist);    
        })
    }, [])

    //Update the Previous Calculations section
    const calcHistory = () => {
        let firstOperand = operandOne.slice(0, -1);
        firstOperand = firstOperand === '' ? 0 : firstOperand;
        let secondOperand = operandTwo;
        secondOperand = secondOperand === '' ? 0: secondOperand;
        let prevCalc = firstOperand + ' ' + operatorInput + ' ' + secondOperand + ' = ' + result.toFixed(7) * 1;
        calcHist.unshift(prevCalc);
        setPrevCalcs(calcHist);
    }

    // Function to handle AC button selection and Clear from keyboard
    const clearHandler = () => {
        setOperandOne('');
        setOperandTwo('');
        operatorInput = '';
        result = 0;
        secondOperand = false;
        operatorLast = false;
    }

    //Function to add to first operand
    const addFirstOperand = (operand) => {
        let firstOperand = operandOne + operand;
        setOperandOne(firstOperand);
        operatorLast = false;
    }

    //Function to add to second operand
    const addSecondOperand = (operand) => {
        let secOperand = operandTwo + operand;
        setOperandTwo(secOperand);
        operatorLast= false;
        secondOperand = true;
    }

    //Function to take care of numbers and decimals
    const numberHandler = (number) => {
        if (number === '.') {
            if (!operandOne.includes(".") && !secondOperand) { //Add to first Operand
                addFirstOperand(number);
            }
            else if (!operandTwo.includes(".") && secondOperand) { //Add to second Operand
                addSecondOperand(number);
            }
            else {
                alert("You already have a decimal point in this number");
            }
        }
        else if (operatorLast) { //Input the number to the second Operand
            addSecondOperand(number);
        }
        else if (secondOperand) { //Input to second Operand directly
            addSecondOperand(number);
        }
        else {
            addFirstOperand(number);
        }
    }

    //Function to handle operator
    const operatorHandler = (operation) => {
        if (operatorInput === '') { //no operator has been input yet
            operatorInput = operation;
            addFirstOperand(operatorInput);
            operatorLast = true;
        }
        else if (operatorLast) { //if the last thing we did was add an operator, update it
            operatorInput = operation;
            addFirstOperand(operatorInput);
            operatorLast = true; //we did not add number, set this to true
        }
        else {
            //When attempting to add a decimal to the second operand, I ended up with this alert
            alert("You have already provided an operator for this calculation");
        }
    }

    //Function to handle delete operations
    const deleteHandler = () => {
        if (operandTwo.length === 0) { //Delete from first operator
            let firstOperand = operandOne.slice(0, -1);
            setOperandOne(firstOperand);
            secondOperand = false; //we are no longer using the second operand if it was fully deleted
            operatorLast = false; //if we have deleted from first operand the operator is gone
            operatorInput = ''; //reset input to accept a new input
        } else { //Delete from second operator
            let secOperand = operandTwo.slice(0, -1);
            setOperandTwo(secOperand);
            operatorLast = operandTwo === ''; //if no longer a second operand update operator last to true
        }
    }

    // Function to calculate the result for the user
    const calcResult = () => {
        let firstOperand = operandOne.slice(0, -1);
        firstOperand = firstOperand === '' ? 0 : firstOperand;
        let secondOperand = operandTwo;
        secondOperand = secondOperand === '' ? 0: secondOperand;
        let var1 = parseFloat(firstOperand);
        let var2 = parseFloat(secondOperand);
        switch (operatorInput) {
            case '+':
                result = var1 + var2;
                break;
            case '-':
                result = var1 - var2;
                break;
            case '÷':
                result = var1 / var2;
                break;
            case '/':
                result = var1 / var2;
                break;
            case '*':
                result = var1 * var2;
                break;
            default:
                result = 0;
        }
    }

    // Function to process Equal operation
    const equalHandler = () => {
        if (secondOperand) { //We already have a second operand, return result
            calcResult();
        }
        else if (operatorLast) { //we can assume second operand is zero and output result 
            calcResult();
        }
        else {
            result = parseFloat(operandOne);
        }
        calcHistory(); //Update history text before we clear
        //reset operand two
        setOperandTwo('');
        setOperandOne(result.toString()); //update Operand One with new value
        //reset all other variables
        result = 0;
        secondOperand = false;
        operatorLast = false;
        operatorInput = '';
    }

    const btnSelected = (btn) => {
        const operators = /[+-/*÷]/g;
        const numbers = /[.0-9]/g;
        btn === "AC" ? clearHandler()
        :btn === "DEL" ? deleteHandler()
        :numbers.test(btn) ? numberHandler(btn)
        :operators.test(btn) ? operatorHandler(btn)
        :btn === "=" ? equalHandler()
        :numberHandler(btn);
    }

    const classBtn = (btn) => {
        return btn === "DEL" ? "button del-clear del-button"
               :btn === "AC" ? "button del-clear"
               :btn ==="÷" ? "button op"
               :btn ==="*" ? "button op"
               :btn ==="-" ? "button op"
               :btn ==="+" ? "button op"
               :btn ==="=" ? "button op"
               :btn ==="0" ? "button num zero"
               :"button num";
    }

    // Take actions based on user input from Keyboard
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleKeyDown = useCallback((event) => {
        console.log("Key Handler")
        const key = event.key;
        const numbers = /[.0-9]/g;
        const operators = /[+-/*]/g;
        if (numbers.test(key)) {
            numberHandler(key);
        }
        else if (operators.test(key)) {
            operatorHandler(key);
        }
        else if (key === "Enter") {
            equalHandler();
        }
        else if (key === "Clear") {
            clearHandler();
        }
        else if (key === "Backspace") {
            deleteHandler();
        }
    })

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [handleKeyDown]);

    const buttonOutput = buttonList.map((btn, key) => {
        return (
        <Buttons key={key} className={classBtn(btn)} value={btn} onClick={() => btnSelected(btn)}/>
        )}
    )

    return <section className="section">
    <div className="calculator-div" tabIndex={0} onKeyDown={handleKeyDown}>
        <Display 
            operandOne={operandOne}
            operandTwo={operandTwo} />
        {buttonOutput}
    </div>
        <PastCalculations 
            prevCalcs = {prevCalcs} />
    </section>
}