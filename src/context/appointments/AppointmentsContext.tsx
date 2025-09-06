import React, { createContext, useReducer, useCallback, useEffect } from "react";
import type { Value } from "react-calendar/dist/shared/types.js";
import reducer, { type IAppointmentState } from "./reducer";
import useAppointmentService from "../../services/AppointmentService";
import { ActionsTypes } from "./actions";
import { useLocation } from "react-router-dom";

const initialState: IAppointmentState = {
    allAppointments: [],
    activeAppointments: [],
    appointmentLoadingStatus: "idle",
    calendarDate: [null, null]
};

interface ProviderProps {
    children: React.ReactNode;
}

interface AppointmentContextValue extends IAppointmentState {
    getAppointments: () => void;
    getActiveAppointments: () => void;
    setDateAndFilter: (newDate: Value) => void;
    resetCalendar: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppointmentContext = createContext<AppointmentContextValue>({
    allAppointments: initialState.allAppointments,
    activeAppointments: initialState.activeAppointments,
    appointmentLoadingStatus: initialState.appointmentLoadingStatus,
    calendarDate: initialState.calendarDate,
    getAppointments: () => { },
    getActiveAppointments: () => { },
    setDateAndFilter: () => { },
    resetCalendar: () => { }
});

const AppointmentContextProvider = ({ children }: ProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { loadingStatus, getAllAppointments, getAllActiveAppointments } =
        useAppointmentService();
    
    const location = useLocation();

    const resetCalendar = useCallback(() => {
        dispatch({ type: ActionsTypes.RESET_CALENDAR_DATE });
    }, []);

    useEffect(() => {
        resetCalendar();
    }, [location.pathname, resetCalendar]);

    const value: AppointmentContextValue = {
        allAppointments: state.allAppointments,
        activeAppointments: state.activeAppointments,
        appointmentLoadingStatus: loadingStatus,
        calendarDate: state.calendarDate,
        getAppointments: () => {
            getAllAppointments().then((data) => {
                const filteredData = data.filter((item) => {
                    if (Array.isArray(state.calendarDate) && state.calendarDate[0] && state.calendarDate[1]) {
                        if (new Date(item.date).getTime() >= new Date(state.calendarDate[0]).getTime() && new Date
                            (item.date).getTime() <= new Date(state.calendarDate[1]).getTime()) {
                            return item;
                        }
                    } else {
                        return item;
                    }
                });
                dispatch({ type: ActionsTypes.SET_ALL_APPOINTMENTS, payload: filteredData });
            }).catch(() => {
                dispatch({ type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS })
            })
        },
        getActiveAppointments: () => {
            getAllActiveAppointments().then((data) => {
                const filteredData = data.filter((item) => {
                    if (Array.isArray(state.calendarDate) && state.calendarDate[0] && state.calendarDate[1]) {
                        if (new Date(item.date).getTime() >= new Date(state.calendarDate[0]).getTime() && new Date
                            (item.date).getTime() <= new Date(state.calendarDate[1]).getTime()) {
                            return item;
                        }
                    } else {
                        return item;
                    }
                })
                dispatch({ type: ActionsTypes.SET_ACTIVE_APPOINTMENTS, payload: filteredData })
            }).catch(() => {
                dispatch({ type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS })
            })
        },
        setDateAndFilter: (newDate: Value) => {
            dispatch({ type: ActionsTypes.SET_CALENDAR_DATE, payload: newDate })
        },
        resetCalendar
    };

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
};

export default AppointmentContextProvider;