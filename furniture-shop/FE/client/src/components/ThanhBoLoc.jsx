import React from 'react'

const ThanhBoLoc = ({ activeFilter, setActiveFilter }) => {
  const filters = ['Tất Cả', 'Phòng Khách', 'Phòng Ngủ', 'Phòng Ăn', 'Văn Phòng']
  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f}
          className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
          onClick={() => setActiveFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

export default ThanhBoLoc
