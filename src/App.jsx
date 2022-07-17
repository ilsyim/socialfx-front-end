import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import * as authService from './services/authService'
import AddEvent from './pages/AddEvent/AddEvent'
import * as eventService from './services/eventService'
import AddDetails from './pages/AddDetails/AddDetails'
import EventList from './pages/EventList/EventList'

const App = () => {
  const [user, setUser] = useState(authService.getUser())
  const [events, setEvents] =  useState([])
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    const fetchAllEvents = async () => {
      const eventData = await eventService.getAll()
      setEvents(eventData)
    }
    fetchAllEvents()
  },[])

console.log(events)
  const handleSignupOrLogin = () => {
    setUser(authService.getUser())
  }

  const handleAddEvent = async (eventData, photo) => {
    const newEvent = await eventService.create(eventData)
    // if (photo) {
    //   eventPhotoHelper(photo.eventData)
    // }
    console.log(newEvent)
    setEvents([...events, newEvent])
    navigate(`/events/${newEvent._id}`) // check route later
  }

  // const handleUpdateEvent = await updatedEventData => {
  //   const updatedEvent = await eventService.updateEvent(updatedEventData)
  //   const newEventArray = events.map(event =>
  //     event._id === updatedEvent._id ? updatedEvent : event)
  //     setEvents(newEventArray)
  //     navigate("/")
  // }
  const handleUpdateEvent = async (updatedEventData) => {
    const updatedEvent = await eventService.updateEvent(updatedEventData)
    const newEventArray = events.map(event =>
      event._id === updatedEvent._id ? updatedEvent : event)
      setEvents(newEventArray)
      navigate("/")
  }


  return (
    <>
      <div className='App'>
        <NavBar user={user} handleLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Landing user={user}/>} />
            <Route path="/add" element={<AddEvent handleAddEvent={handleAddEvent} />} />
            <Route path="/all" element={<EventList events={events}/>} />
            <Route path="/events/:eventId" element={<AddDetails handleAddEvent={handleAddEvent} />} />
            <Route
              path="/signup"
              element={<Signup handleSignupOrLogin={handleSignupOrLogin} />}
            />
            <Route
              path="/login"
              element={<Login handleSignupOrLogin={handleSignupOrLogin} />}
            />
            <Route
              path="/profiles"
              element={user ? <Profiles /> : <Navigate to="/login" />}
            />
            <Route
              path="/changePassword"
              element={
                user ? (
                  <ChangePassword handleSignupOrLogin={handleSignupOrLogin} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App