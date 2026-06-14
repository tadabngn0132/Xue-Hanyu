import { useMemo, useState } from 'react'
import AppHeader from './components/AppHeader'
import CardNavigation from './components/CardNavigation'
import FlashCard from './components/FlashCard'
import StudyProgress from './components/StudyProgress'
import StudyToolbar from './components/StudyToolbar'
import { NEW_WORDS } from './data/words'
import './App.css'

const ALL_LESSONS = 'all'

function shuffleWords(words) {
  const shuffled = [...words]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

function App() {
  const [selectedLesson, setSelectedLesson] = useState(ALL_LESSONS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [wordOrder, setWordOrder] = useState(() =>
    NEW_WORDS.map((word) => word.id),
  )

  const lessons = useMemo(
    () => [...new Set(NEW_WORDS.map((word) => word.lesson))],
    [],
  )

  const displayedWords = useMemo(() => {
    const words =
      selectedLesson === ALL_LESSONS
        ? NEW_WORDS
        : NEW_WORDS.filter((word) => word.lesson === Number(selectedLesson))
    const order = new Map(wordOrder.map((id, index) => [id, index]))

    return [...words].sort(
      (firstWord, secondWord) =>
        order.get(firstWord.id) - order.get(secondWord.id),
    )
  }, [selectedLesson, wordOrder])

  const currentWord = displayedWords[currentIndex]

  const goToCard = (index) => {
    setCurrentIndex(index)
    setIsFlipped(false)
  }

  const handlePrevious = () => {
    const previousIndex =
      (currentIndex - 1 + displayedWords.length) % displayedWords.length
    goToCard(previousIndex)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % displayedWords.length
    goToCard(nextIndex)
  }

  const handleLessonChange = (event) => {
    setSelectedLesson(event.target.value)
    goToCard(0)
  }

  const handleShuffle = () => {
    setWordOrder(shuffleWords(NEW_WORDS).map((word) => word.id))
    goToCard(0)
  }

  const handleSpeak = (event) => {
    event.stopPropagation()

    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentWord.word)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="app-shell">
      <AppHeader />

      <section className="study-panel" aria-label="Bộ thẻ học từ vựng">
        <StudyToolbar
          lessons={lessons}
          selectedLesson={selectedLesson}
          allLessonsValue={ALL_LESSONS}
          onLessonChange={handleLessonChange}
          onShuffle={handleShuffle}
        />

        <StudyProgress
          currentIndex={currentIndex}
          totalCards={displayedWords.length}
          lesson={currentWord.lesson}
        />

        <FlashCard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((flipped) => !flipped)}
          onSpeak={handleSpeak}
        />

        <CardNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </section>

      <p className="keyboard-note">
        Mỗi lần lật thẻ là một lần ghi nhớ tốt hơn.
      </p>
    </main>
  )
}

export default App
