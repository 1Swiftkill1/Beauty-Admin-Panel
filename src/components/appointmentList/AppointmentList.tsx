import { useContext, useEffect, useState, useCallback } from "react";
import AppointmentItem from "../appointmentItem/AppointmentItem";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";
import CancelModal from "../modal/CancelModal";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";


function AppointmentList() {
	const {
		activeAppointments,
		getActiveAppointments,
		appointmentLoadingStatus,
		calendarDate
	} = useContext(AppointmentContext);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, selectId] = useState(0);
	const [showEmptyState, setShowEmptyState] = useState(false);

	useEffect(() => {
		getActiveAppointments();
	}, [calendarDate]);

	useEffect(() => {
        setShowEmptyState(
            appointmentLoadingStatus === "idle" && 
            activeAppointments.length === 0
        );
    }, [activeAppointments, appointmentLoadingStatus]);

	const handleOpenModal = useCallback((id: number) => {
		setIsOpen(true);
		selectId(id);
	}, [])

	if (appointmentLoadingStatus === 'loading') {
		return <Spinner />
	} else if (appointmentLoadingStatus === 'error') {
		return (
			<>
				<Error />
				<button className="schedule__reload" onClick={getActiveAppointments}>
					Try to reload
				</button>
			</>
		)
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
			{activeAppointments.map((item) => {
				return (
					<AppointmentItem
						{...item}
						key={item.id}
						getActiveAppointments={getActiveAppointments}
						openModal={handleOpenModal}
					/>
				);
			})}
			<CancelModal
				handleClose={setIsOpen}
				selectedId={selectedId}
				isOpen={isOpen}
			/>
		</>
	);
}

export default AppointmentList;