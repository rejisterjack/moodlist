document.addEventListener("DOMContentLoaded", function () {
  // Get the calendar element and initialize mood logs from localStorage
  const calendarEl = document.getElementById("calendar")
  let moodLogs = JSON.parse(localStorage.getItem("moodLogs")) || {}

  // Define mood labels for emoji representation
  const moodLabels = {
    "😊": "Happy",
    "😢": "Sad",
    "😐": "Neutral",
    "🎉": "Excited",
  }

  // Initialize FullCalendar with configuration
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth", // Default view
    headerToolbar: {
      left: "prev,next,today", // Navigation buttons
      center: "title", // Calendar title
      right: "dayGridMonth,timeGridWeek,timeGridDay", // View options
    },
    prevText: "<", // Custom text for previous button
    nextText: ">", // Custom text for next button
    events: Object.keys(moodLogs).map((date) => ({
      id: date, // Event ID is the date
      title: `${moodLogs[date]} ${moodLabels[moodLogs[date]]}`, // Event title with emoji and label
      start: date, // Event start date
      allDay: true, // Event spans the entire day
    })),
    eventContent: function (arg) {
      // Custom rendering for event content
      return { html: `<div class="text-center">${arg.event.title}</div>` }
    },
    themeSystem: "bootstrap5", // Use Bootstrap 5 for styling
  })
  calendar.render() // Render the calendar

  // Update navigation button text
  const prevButton = document.querySelector(".fc-prev-button")
  const nextButton = document.querySelector(".fc-next-button")
  if (prevButton) prevButton.innerHTML = "<"
  if (nextButton) nextButton.innerHTML = ">"

  // Add event listeners to mood buttons
  document.querySelectorAll(".btn-emoji").forEach((button) => {
    button.addEventListener("click", function () {
      const today = new Date().toISOString().split("T")[0] // Get today's date
      const mood = this.getAttribute("data-mood") // Get mood from button attribute
      moodLogs[today] = mood // Update mood logs
      localStorage.setItem("moodLogs", JSON.stringify(moodLogs)) // Save to localStorage

      // Remove existing event for today if it exists
      const existingEvent = calendar.getEventById(today)
      if (existingEvent) {
        existingEvent.remove()
      }

      // Add new event for today's mood
      calendar.addEvent({
        id: today,
        title: `${mood} ${moodLabels[mood]}`,
        start: today,
        allDay: true,
      })
    })
  })
})
