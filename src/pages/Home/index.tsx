import { HomeCards } from "./HomeCards";
import { DateManager } from "./DateManager";
import { ChartComponent } from "./ChartComponent";
import { useDate } from "../../hooks/useDate";

export const Home = () => {
    const { daysInMonth, day, month, year, setDay, setMonth, setYear, months } = useDate();

    return (
        <>
            <DateManager daysInMonth={daysInMonth} day={day} month={month} year={year} setDay={setDay} setMonth={setMonth} setYear={setYear} months={months} />
            <HomeCards date={`${year}-${month}-${day}`} />
            <ChartComponent />
        </>
    );
};
