import "../styles/ScheduleCard.css";

export default function ScheduleCard({ schedule, onEdit, onDelete }) {
  // Ensure daysOfWeek is an array before joining
  const displayDays = schedule.daysOfWeek?.join(', ') || 'N/A';
  const displayDescription = schedule.description || 'No description provided.';

  return (
    <div className="schedule-card">
      {/* Display the username if it's a friend's schedule, or omit for personal schedules */}
      {/* You can add a condition here if you want to explicitly hide username for 'mySchedules'
          e.g., {schedule.isFriendSchedule && <div className="schedule-username">{schedule.username}</div>}
          For now, we'll always show it, as it's useful for friends' schedules. */}
      <div className="schedule-username">{schedule.username}</div>

      <h3 className="schedule-game-title">{schedule.gameTitle}</h3>
      <p className="schedule-time">
        Time: {schedule.startTime} - {schedule.endTime}
      </p>
      <p className="schedule-days">Days: {displayDays}</p>
      <p className="schedule-type">
        Type: {schedule.isWeekly ? 'Weekly' : 'One-time'}
      </p>
      {schedule.description && ( // Only show description if it exists
        <p className="schedule-description">{displayDescription}</p>
      )}

      {/* Action buttons (Edit/Delete) - only show if callbacks are provided */}
      {/* These would typically only be passed for the current user's schedules */}
      <div className="schedule-actions">
        {onEdit && (
          <button className="schedule-edit-button" onClick={() => onEdit(schedule)}>
            Edit
          </button>
        )}
        {onDelete && (
          <button className="schedule-delete-button" onClick={() => onDelete(schedule.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}