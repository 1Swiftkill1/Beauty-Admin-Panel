import { type AppointmentAction, ActionsTypes } from "./actions";
import type { IAppointment, ActiveAppointment } from "../../shared/interfaces/appointment.interface";
import type { LoadingStatusOptions } from "../../hooks/http.hook";

import type { LooseValue } from "react-calendar/dist/shared/types.js";

export interface IAppointmentState {
    allAppointments: IAppointment[] | [];
    activeAppointments: ActiveAppointment[] | [];
    appointmentLoadingStatus: LoadingStatusOptions;
    calendarDate: LooseValue;
}

export default function reducer(
    state: IAppointmentState,
    action: AppointmentAction
): IAppointmentState {
    switch (action.type) {
        case ActionsTypes.SET_ALL_APPOINTMENTS:
            return { ...state, allAppointments: action.payload, appointmentLoadingStatus: 'idle' };
        case ActionsTypes.SET_ACTIVE_APPOINTMENTS:
            return { ...state, activeAppointments: action.payload, appointmentLoadingStatus: 'idle' };
        case ActionsTypes.FETCHING_APPOINTMENTS:
            return { ...state, appointmentLoadingStatus: 'loading' };
        case ActionsTypes.ERROR_FETCHING_APPOINTMENTS:
            return { ...state, appointmentLoadingStatus: 'error' };
        case ActionsTypes.SET_CALENDAR_DATE:
            return {...state, calendarDate: action.payload}
        case ActionsTypes.RESET_CALENDAR_DATE:
            return {...state, calendarDate: [null, null]}
        default:
            return state;
    }
}