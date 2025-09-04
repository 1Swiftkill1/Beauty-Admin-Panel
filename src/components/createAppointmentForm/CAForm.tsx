import { useContext } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import useAppointmentService from "../../services/AppointmentService";
import type { IAppointment } from "../../shared/interfaces/appointment.interface";
import "./caform.scss";

function CAForm() {
	const { createNewAppointment } = useAppointmentService();
	const { getActiveAppointments } = useContext(AppointmentContext);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setError,
	} = useForm<IAppointment>({
		defaultValues: {
			id: 1,
			name: '',
			service: '',
			phone: '',
			date: '',
			canceled: false,
		},
	});

	const onSubmit: SubmitHandler<IAppointment> = async (data) => {
		try {
			await createNewAppointment(data);
			reset();
			getActiveAppointments();
		} catch (error) {
			if (error instanceof Error) {
				setError("root", {
					type: "manual",
					message: error.message,
				});
			} else {
				setError("root", {
					type: "manual",
					message: "Error while creating new appointment",
				});
			}
		}
	};
	return (
		<form className="caform" onSubmit={handleSubmit(onSubmit)}>
			<div className="caform__title">Create new appointment</div>

			<label htmlFor="name">
				Name<span>*</span>
			</label>
			<input
				type="text"
				id="name"
				placeholder="User name"
				{...register("name", {
					required: "Name is required",
				})}
			/>
			{errors.name && <span className="error">{errors.name.message}</span>}

			<label htmlFor="service">
				Service<span>*</span>
			</label>
			<input
				type="text"
				id="service"
				placeholder="Service name"
				{...register("service", {
					required: "Service is required",
				})}
			/>
			{errors.service && <span className="error">{errors.service.message}</span>}

			<label htmlFor="phone">
				Phone number<span>*</span>
			</label>
			<input
				type="tel"
				id="phone"
				placeholder="+1 890 335 372"
				{...register("phone", {
					required: "Phone number is required",
					pattern: {
						value: /^\++[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{3}/,
						message: "Format should be +1 804 944 567",
					},
				})}
			/>
			{errors.phone && <span className="error">{errors.phone.message}</span>}

			<label htmlFor="date">
				Date<span>*</span>
			</label>
			<input
				type="text"
				id="date"
				placeholder="DD/MM/YYYY HH:mm"
				{...register("date", {
					required: "Date is required",
					pattern: {
						value: /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/,
						message: "Format should be DD/MM/YYYY HH:mm",
					},
				})}
			/>
			{errors.date && <span className="error">{errors.date.message}</span>}

			{errors.root && <span className="error">{errors.root.message}</span>}

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Creating..." : "Create"}
			</button>
		</form>
	);
}

export default CAForm;