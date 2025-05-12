import { useDate } from "../../hooks/useDate";
import AverageGeneralDataCards from "./components/AverageGeneralDataCards";
import BottomCards from "./components/BottomCards";
import Charts from "./components/Charts";
import { DateManager } from "./components/DateManager";
import { VehicleInfoCard } from "./components/VehicleInfoCard";

export const Details = () => {
    const { daysInMonth, day, month, year, setDay, setMonth, setYear, months } = useDate();

    return (
        <div className="h-full flex flex-col gap-4">
            <DateManager daysInMonth={daysInMonth} day={day} month={month} year={year} setDay={setDay} setMonth={setMonth} setYear={setYear} months={months} />
            <div className="grid w-full grow grid-cols-1 min-[1300px]:grid-cols-[3fr_2fr] gap-4">
                <div className="grid w-full grid-rows-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-2 gap-4 grid-rows-[auto_1fr_1fr]">
                            <span className="col-start-1 col-end-3 font-bold leading-none text-center uppercase">Datos generales del promedio</span>
                            <AverageGeneralDataCards />
                        </div>
                        <VehicleInfoCard />
                    </div>
                    <Charts />
                </div>
                <div className="grid w-full grid-rows-2 gap-4">
                    <div className="flex flex-col p-4 overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md">
                        <span className="text-center uppercase">Registro entre ubicaciones</span>
                        <div id="location_table" className="relative w-full overflow-auto grow"></div>
                    </div>
                    <BottomCards />
                </div>
            </div>
        </div>
    );
};
