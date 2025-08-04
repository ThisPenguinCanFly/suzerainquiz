document.addEventListener("DOMContentLoaded", () => {
  const questionDisplay = document.getElementById("question-display")
  const optionsContainer = document.getElementById("options-container")
  const resultsDisplay = document.getElementById("results-display")
  const restartBtn = document.getElementById("restart-btn")

  let questions = []
  let currentQuestionIndex = 0
  let score = 0

  // Fetch questions from JSON file
  async function fetchQuestions() {
    try {
      const response = await fetch("questions.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      questions = await response.json()
      startQuiz()
    } catch (error) {
      console.error("Error fetching questions:", error)
      questionDisplay.textContent = "Failed to load quiz questions. Please try again later."
    }
  }

  function startQuiz() {
    currentQuestionIndex = 0
    score = 0
    resultsDisplay.classList.add("hidden")
    restartBtn.classList.add("hidden")
    loadQuestion()
  }

  function loadQuestion() {
    optionsContainer.innerHTML = "" // Clear previous options

    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex]
      questionDisplay.textContent = currentQuestion.question

      currentQuestion.options.forEach((option) => {
        const button = document.createElement("button")
        button.classList.add("option-button")
        button.textContent = option
        button.dataset.option = option // Store option value
        button.addEventListener("click", () => handleAnswerSelection(button, currentQuestion.answer))
        optionsContainer.appendChild(button)
      })
    } else {
      showResults()
    }
  }

  function handleAnswerSelection(selectedButton, correctAnswer) {
    // Disable all option buttons to prevent multiple selections
    document.querySelectorAll(".option-button").forEach((btn) => {
      btn.disabled = true
    })

    const selectedAnswer = selectedButton.dataset.option
    selectedButton.classList.add("selected") // Mark the selected button

    if (selectedAnswer === correctAnswer) {
      score++
      selectedButton.classList.add("correct")
    } else {
      selectedButton.classList.add("incorrect")
      // Optionally, highlight the correct answer if the user was wrong
      document.querySelectorAll(".option-button").forEach((btn) => {
        if (btn.dataset.option === correctAnswer) {
          btn.classList.add("correct")
        }
      })
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      currentQuestionIndex++
      loadQuestion()
    }, 1500) // 1.5 second delay to show feedback
  }

  function showResults() {
    questionDisplay.textContent = ""
    optionsContainer.innerHTML = ""
    resultsDisplay.classList.remove("hidden")
    restartBtn.classList.remove("hidden")

    resultsDisplay.textContent = `You scored ${score} out of ${questions.length} questions!`
  }

  // Event Listener for restart button
  restartBtn.addEventListener("click", startQuiz)

  // Initial fetch and start
  fetchQuestions()
})
