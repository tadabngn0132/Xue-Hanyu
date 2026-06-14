function StudyToolbar({
  lessons,
  selectedLesson,
  allLessonsValue,
  onLessonChange,
  onShuffle,
}) {
  return (
    <div className="toolbar">
      <label className="lesson-picker">
        <span>Chọn bài học</span>
        <select value={selectedLesson} onChange={onLessonChange}>
          <option value={allLessonsValue}>Tất cả {lessons.length} bài</option>
          {lessons.map((lesson) => (
            <option key={lesson} value={lesson}>
              Bài {lesson}
            </option>
          ))}
        </select>
      </label>

      <button className="secondary-button" type="button" onClick={onShuffle}>
        <span aria-hidden="true">↝</span>
        Trộn thẻ
      </button>
    </div>
  )
}

export default StudyToolbar
