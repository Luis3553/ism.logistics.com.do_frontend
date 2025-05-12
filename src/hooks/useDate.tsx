import { useEffect, useState } from "react";

// Month labels
export const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Utility: Check for leap year
const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// Utility: Get number of days in a month
const getDaysInMonth = (month: number, year: number): number => {
    const daysPerMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysPerMonth[month - 1];
};

const todaysDate = new Date();

export const useDate = () => {
    const [day, setDay] = useState(`${todaysDate.getDate()}`.padStart(2, "0"));
    const [month, setMonth] = useState(`${todaysDate.getMonth() + 1}`.padStart(2, "0"));
    const [year, setYear] = useState(String(todaysDate.getFullYear()));

    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(+month, +year));

    useEffect(() => {
        const updatedDays = getDaysInMonth(+month, +year);
        setDaysInMonth(updatedDays);

        if (+day > updatedDays) {
            setDay(String(updatedDays).padStart(2, "0"));
        }
    }, [month, year]);

    return { daysInMonth, day, month, year, setDay, setMonth, setYear, months };
};
