import { Calendar as LibCalendar } from "react-calendar";
import { useContext } from "react";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import 'react-calendar/dist/Calendar.css';
import "./calendar.scss";

function Calendar() {

	const { calendarDate, setDateAndFilter, resetCalendar } = useContext(AppointmentContext);

	return <div className="calendar">
		<LibCalendar
			value={calendarDate}
			onChange={(value) => {
				setDateAndFilter(value);
			}}
			selectRange
		/>
		 <button 
                className="calendar__reset-btn"
                onClick={resetCalendar}
                disabled={!calendarDate || (Array.isArray(calendarDate) && !calendarDate[0])}
            >
                Reset selected period
            </button>
	</div>
}

export default Calendar;
