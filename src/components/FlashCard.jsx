function FlashCard({ word, isFlipped, onFlip, onSpeak }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onFlip()
    }
  }

  return (
    <div
      className={`flash-card ${isFlipped ? 'is-flipped' : ''}`}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
      aria-label={isFlipped ? 'Xem mặt chữ Hán' : 'Xem nghĩa của từ'}
    >
      <span className="card-inner">
        <span className="card-face card-front">
          <span className="card-label">Chữ Hán</span>
          <span className="hanzi">{word.word}</span>
          <span className="pinyin">{word.pinyin}</span>
          <button className="speak-button" type="button" onClick={onSpeak}>
            <span aria-hidden="true">◖</span>
            Nghe phát âm
          </button>
          <span className="flip-hint">Nhấn vào thẻ để xem nghĩa</span>
        </span>

        <span className="card-face card-back">
          <span className="card-label">Nghĩa của từ</span>
          <span className="meaning">{word.vietnamese}</span>
          <span className="english">{word.english}</span>
          <span className="example">
            <span>Ví dụ</span>
            {word.example}
          </span>
          <span className="flip-hint">Nhấn vào thẻ để quay lại</span>
        </span>
      </span>
    </div>
  )
}

export default FlashCard
