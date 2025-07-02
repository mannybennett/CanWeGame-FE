import { useState, useEffect } from "react"
import { Search, Plus, Menu, X, ArrowRight } from "lucide-react"
import "../styles/HomePage.css"

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [gameTitle, setGameTitle] = useState("")
  const [startTime, setStartTime] = useState("12:00")
  const [startPeriod, setStartPeriod] = useState("PM")
  const [endTime, setEndTime] = useState("12:00")
  const [endPeriod, setEndPeriod] = useState("PM")
  const [selectedDays, setSelectedDays] = useState([])
  const [isWeekly, setIsWeekly] = useState(false)

  // Mock user data - replace with actual user data
  const currentUser = {
    username: "JohnDoe",
  }

  // Mock friends schedules data
  const friendsSchedules = [
    {
      id: 1,
      username: "AliceGamer",
      game: "Call of Duty",
      timeRange: "7pm - 11pm",
      dateRange: "Mon-Wed",
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // Implement search functionality here
  }

  const handleLogout = () => {
    console.log("Logging out...")
    // Implement logout functionality here
    setShowUserDropdown(false)
    setShowMobileMenu(false)
  }

  const handleAccountDetails = () => {
    console.log("Opening account details...")
    // Implement account details navigation here
    setShowUserDropdown(false)
    setShowMobileMenu(false)
  }

  const handleAddSchedule = () => {
    console.log("Adding new schedule...")
    setShowScheduleModal(true)
    setShowMobileMenu(false)
  }

  const handleCloseModal = () => {
    setShowScheduleModal(false)
    // Reset form
    setGameTitle("")
    setStartTime("12:00")
    setStartPeriod("PM")
    setEndTime("12:00")
    setEndPeriod("PM")
    setSelectedDays([])
    setIsWeekly(false)
  }

  const handleSubmitSchedule = (e) => {
    e.preventDefault()
    console.log("Schedule submitted:", {
      gameTitle,
      startTime: `${startTime} ${startPeriod}`,
      endTime: `${endTime} ${endPeriod}`,
      selectedDays,
      isWeekly,
    })
    handleCloseModal()
  }

  const toggleDay = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour}:${minute.toString().padStart(2, "0")}`
        times.push(timeString)
      }
    }
    return times
  }

  const getUserInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U"
  }

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-content">
          {/* Left Section - Logo and Schedule Button (Desktop) */}
          <div className="navbar-left">
            <div className="logo">
              <span className="logo-canwe">canwe</span>
              <span className="logo-game">game</span>
              <span className="logo-com">.com</span>
            </div>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          <div className="navbar-center desktop-only">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-container">
                <Search className="search-icon-left" size={20} />
                <input
                  type="text"
                  placeholder="Find friends"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-submit">
                  <ArrowRight size={25} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Section - User Icon (Desktop) */}
          <div className="navbar-right">
            <button className="schedule-button" onClick={handleAddSchedule}>
              <Plus size={20} />
              <p>Schedule</p>
            </button>
            <div className="user-dropdown-container desktop-only">
              <button className="user-icon" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                {getUserInitial(currentUser.username)}
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <button onClick={handleAccountDetails} className="dropdown-item">
                    Account Details
                  </button>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button className="mobile-menu-toggle mobile-only" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div className={`mobile-menu ${showMobileMenu ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="mobile-menu-close" onClick={() => setShowMobileMenu(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="mobile-menu-content">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <div className="search-container">
              <Search className="search-icon-left" size={20} />
              <input
                type="text"
                placeholder="Find friends"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-submit">
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Schedule Button */}
          <button className="mobile-schedule-button" onClick={handleAddSchedule}>
            <Plus size={16} />
            Schedule
          </button>

          {/* User Options */}
          <div className="mobile-user-section">
            <div className="mobile-user-info">
              <div className="user-icon mobile-user-icon">{getUserInitial(currentUser.username)}</div>
              <span className="username">{currentUser.username}</span>
            </div>
            <button onClick={handleAccountDetails} className="mobile-menu-item">
              Account Details
            </button>
            <button onClick={handleLogout} className="mobile-menu-item logout">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)} />}

      {/* Main Content */}
      <main className="main-content">
        {/* Your Schedules Section */}
        <section className="schedules-section">
          <h2 className="section-title">Your Schedules</h2>
          <div className="add-schedule-container">
            <div className="add-schedule-box" onClick={handleAddSchedule}>
              <Plus size={40} />
            </div>
            <h3 className="add-schedule-text">Add Schedule</h3>
          </div>
        </section>

        {/* Friends Schedules Section */}
        <section className="schedules-section">
          <h2 className="section-title">Friends Schedules</h2>
          <div className="friends-schedules-grid">
            {friendsSchedules.map((schedule) => (
              <div key={schedule.id} className="friend-schedule-card">
                <div className="friend-username">{schedule.username}</div>
                <div className="game-title">{schedule.game}</div>
                <div className="time-range">{schedule.timeRange}</div>
                <div className="date-range">{schedule.dateRange}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* Schedule Modal */}
      {showScheduleModal && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal} />
          <div className="schedule-modal">
            <div className="modal-content">
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>

              <h2 className="modal-title">Add Schedule</h2>

              <form onSubmit={handleSubmitSchedule} className="schedule-form">
                {/* Game Title Input */}
                <div className="form-group">
                  <label className="form-label">Game Title</label>
                  <input
                    type="text"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                {/* Time Inputs */}
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <div className="time-inputs">
                    <div className="time-input-group">
                      <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="time-select">
                        {generateTimeOptions().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <select
                        value={startPeriod}
                        onChange={(e) => setStartPeriod(e.target.value)}
                        className="period-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>

                    <span className="time-separator">to</span>

                    <div className="time-input-group">
                      <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="time-select">
                        {generateTimeOptions().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <select
                        value={endPeriod}
                        onChange={(e) => setEndPeriod(e.target.value)}
                        className="period-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Days Selection */}
                <div className="form-group">
                  <label className="form-label">Days</label>
                  <div className="days-buttons">
                    {["M", "T", "Wed", "Thu", "F", "Sat", "Sun"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`day-button ${selectedDays.includes(day) ? "selected" : ""}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekly Checkbox */}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isWeekly}
                      onChange={(e) => setIsWeekly(e.target.checked)}
                      className="weekly-checkbox"
                    />
                    <span className="checkbox-text">Weekly</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Add Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}