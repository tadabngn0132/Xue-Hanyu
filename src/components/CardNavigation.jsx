function CardNavigation({ onPrevious, onNext }) {
  return (
    <div className="navigation">
      <button type="button" onClick={onPrevious}>
        <span aria-hidden="true">←</span>
        Thẻ trước
      </button>
      <button className="primary-button" type="button" onClick={onNext}>
        Thẻ tiếp
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}

export default CardNavigation
