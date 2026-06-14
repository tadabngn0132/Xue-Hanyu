function StudyProgress({ currentIndex, totalCards, lesson }) {
  const currentCard = currentIndex + 1
  const progress = (currentCard / totalCards) * 100

  return (
    <>
      <div className="progress-row">
        <span>
          Thẻ {currentCard} / {totalCards}
        </span>
        <span>Bài {lesson}</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin="1"
        aria-valuemax={totalCards}
        aria-valuenow={currentCard}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </>
  )
}

export default StudyProgress
