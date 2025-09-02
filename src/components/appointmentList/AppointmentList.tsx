import { useContext, useEffect, useState } from "react";
import AppointmentItem from "../appointmentItem/AppointmentItem";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";
import CancelModal from "../modal/CancelModal";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";


function AppointmentList() {
	const {
		activeAppointments,
		getActiveAppointments,
		appointmentLoadingStatus
	} = useContext(AppointmentContext);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, selectId] = useState(0);


	useEffect(() => {
		getActiveAppointments();
	}, []);

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

	return (
		<>
			{activeAppointments.map((item) => {
				return (
					<AppointmentItem
						openModal={setIsOpen}
						selectId={() => selectId(item.id)}
						{...item}
						key={item.id}
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