import React from 'react'
import { nanoid } from 'nanoid'
import Die from './components/Die.js'
import Confetti from 'react-confetti'

const App = () => {
    
    const [dice , setDice] = React.useState(generateDieElement())
    const [tenzies, setTenzies] = React.useState(false)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstDiceValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstDiceValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

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

    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(generateDieElement())
        }
    }

    function holdDie(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                {...die, isHeld : !die.isHeld} :
                die
        }))
    }

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
    </main>
  )
}

export default App