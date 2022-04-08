import React from 'react'
import { nanoid } from 'nanoid'
import Die from './components/Die.js'
import Stopwatch from './components/Stopwatch.js'
import Confetti from 'react-confetti'

const App = () => {
    //States
    const [dice , setDice] = React.useState(generateDieElement())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(0)
    
    //Stopwatch States
    const [start, setStart] = React.useState(false);
    const [time, setTime] = React.useState(0);
    const [best, setBest] = React.useState( //Get PrevTime (if available) from localStorage
        JSON.parse(localStorage.getItem("personalBest")) || {
        current: 0,
        previous: 0,
        }
    );
    
    //Check for game end
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstDiceValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstDiceValue)
        if (allHeld && allSameValue) {
            setTenzies(true) //Flag for game end
        }
    }, [dice])

    //Stopwatch helper - triggered on game end
    React.useEffect(() => {
        if (tenzies) {
        setStart(false) //Stop Stopwatch
            if (best.current === 0 || time < best.current) { //Save time if lower than previous best
                setBest((prev) => ({ previous: prev.current, current: time }))
                localStorage.setItem(
                "personalBest",
                JSON.stringify({ 
                    current: time, 
                    previous: 0 
                }))
                setTime(time) //Assign fixed value instead of continuing to increment on game end
            }
        }
    }, [tenzies, best, time])

    //Helper Fns
    function generateNewDie() {
        return { 
                value : Math.ceil(Math.random() * 6), 
                isHeld: false, 
                id: nanoid()
            }
    }

    function generateDieElement() {
        const diceArray = []
        for (let i = 0; i < 10; i++) {
            diceArray.push(generateNewDie())
        }
        return diceArray
    }

    function holdDie(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                {...die, isHeld : !die.isHeld} :
                die
        }))
    }

    //OnClick Handler
    function rollDice() {
        if(!tenzies) {
            setStart(true); //Start Stopwatch; remains true till game end
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
            setCount(count + 1)
        } else {
            setTenzies(false)
            setDice(generateDieElement())
            //Reset Stopwatch & Roll Count
            setCount(0);
            setTime(0);
        }
    }
    
    //Create dice elements
    const diceElements = dice.map(die => (
        <Die 
            value = {die.value}
            isHeld = {die.isHeld} 
            key = {die.id}
            holdDie = {() => holdDie(die.id)}       
        />
    ))

  return (
    <main>
        {tenzies && <Confetti />}
        <h2 className='title'>Tenzies Game</h2>
        <p className='title-desc'>Roll until all dice are the same.<br /> Click each die to freeze it at <br />its current value between rolls.</p>
        <div className='die-container'>
            {diceElements}
        </div>
        <button onClick={rollDice} className='roll-dice-button'>{tenzies ? "New Game" : "Roll"}</button>
        <p><b>Roll Count: </b>{count}</p>
        <p><b>Timer: </b><Stopwatch start={start} time={time} setTime={setTime} /></p>
        <p><b>Best Time: </b><Stopwatch time={best.current} /></p>
    </main>
  )
}

export default App