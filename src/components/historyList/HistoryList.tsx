import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import AppointmentItem from "../appointmentItem/AppointmentItem";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

function HistoryList() {
	const { allAppointments, getAppointments, appointmentLoadingStatus, calendarDate } =
		useContext(AppointmentContext);

	const [showEmptyState, setShowEmptyState] = useState(false);

	useEffect(() => {
		getAppointments();
	}, [calendarDate]);

	useEffect(() => {
		setShowEmptyState(
			appointmentLoadingStatus === "idle" &&
			allAppointments.length === 0
		);
	}, [allAppointments, appointmentLoadingStatus]);

	if (appointmentLoadingStatus === "loading") {
		return <Spinner />;
	} else if (appointmentLoadingStatus === "error") {
		return (
			<>
				<Error />
				<button className="schedule__reload" onClick={getAppointments}>
					Try to reload
				</button>
			</>
		);
	}

	if (showEmptyState) {
		return (
			<div className="empty-state">
				<h3>Entry history is empty</h3>
				<p>No records found for the selected period</p>
			</div>
		);
	}

	return (
		<>
			{allAppointments.map((item) => {
				return <AppointmentItem {...item} key={item.id} />;
			})}
		</>
	);
}

export default HistoryList;