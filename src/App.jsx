import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState({message: null, type: null})

  useEffect(() => {
    personService.getAll().then(intialPersons => setPersons(intialPersons))
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const names = persons.map(person => person.name)
    
    if (names.includes(newName)) {
      
      if (!window.confirm(`Confirm ${newName} number being updated to ${newNumber}`)) {return}
      
      const idUpdate = persons.filter(person => person.name === newName)[0]
      
      personService
      .update(idUpdate.id, {...idUpdate, number: newNumber})
      .then(updatedPerson => setPersons(persons.map(person => person.id === idUpdate.id ? updatedPerson : person)))
      .then(setErrorMessage({message: `${newName} number has been updated to ${newNumber}`, type: 'success'}))
      .then(setTimeout(() => {setErrorMessage({message: null, type: null})}, 5000))
      .catch(error => {
        setErrorMessage({message: error.response.data.error, type: 'error'})
        setTimeout(() => {setErrorMessage({message: null, type: null})}, 5000)
      })
      
      setNewNumber('')
      setNewName('')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService.create(personObject).then(response => setPersons([...persons, response])).catch(error => {
      setErrorMessage({message: error.response.data.error, type: 'error'})
      setTimeout(() => {setErrorMessage({message: null, type: null})}, 5000)
      return
    })

    setErrorMessage({message: `${newName} has been added`, type: 'success'})
    setTimeout(() => {setErrorMessage({message: null, type: null})}, 5000)
    setNewNumber('')
    setNewName('')
  }

  const removePerson = (id) => {
    const updatedPersons = persons.filter(person => person.id !== id)
    personService.remove(id).then(setPersons(updatedPersons))
    .then(setErrorMessage({message: `Person has successfully be removed with id ${id}`, type: 'success'}))
    .then(setTimeout(() => {setErrorMessage({message: null, type: null})}, 5000))
    .catch(error => {
      setErrorMessage({message: `${id} id has already been removed`, type: 'error'})
      setTimeout(() => {setErrorMessage({message: null, type: null})}, 5000)
    })
    
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification rmessage={errorMessage} />
      <Filter filter={filter} setFilter={setFilter} />
      <PersonForm setNewName={setNewName} newName={newName} newNumber={newNumber} setNewNumber={setNewNumber} addName={addName}/>
      <Persons filter={filter} persons={persons} removeHandler={removePerson} />
    </div>
  )
}

export default App