import { DatePicker } from "rsuite";
import "../../charts/plugins/scrollWheelZoom";
import GarageTable from "./components/GarageTable";
import { VehiclesPerType } from "./components/VehiclesPerType";
import { VehiclesPerTypeAndBrand } from "./components/VehiclesPerTypeAndBrand";
import { VehiclesPerTypeAndColor } from "./components/VehiclesPerTypeAndColor";
import { VehiclesPerTypeAndModel } from "./components/VehiclesPerTypeAndModel";
import { useState } from "react";

export const Driver = () => {
    const [dateValue, setDateValue] = useState<Date | null>(new Date());

    const onDateChange = (value: Date | null) => {
        setDateValue(value);
        console.log(value?.toLocaleTimeString("zh-Hans-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-"));
    };

    return (
        <>
            <div className="grid grid-cols-1 min-[920px]:grid-cols-[2fr_3fr_2fr] min-[920px]:grid-rows-[1fr_1fr] gap-4 grow min-[920px]:max-h-full min-h-[550px]">
                <div className="min-[920px]:row-start-1 min-[920px]:row-end-4 grid grid-cols-1 grid-rows-2 gap-4">
                    <VehiclesPerTypeAndColor />
                    <VehiclesPerType />
                </div>

                <div className="min-[920px]:row-start-1 min-[920px]:row-end-4 grid grid-cols-1 grid-rows-2 gap-4">
                    <GarageTable />
                    <VehiclesPerTypeAndBrand />
                </div>

                <div className="w-full min-[920px]:col-start-3 min-[920px]:col-end-4 row-start-1 row-end-4 text-center flex flex-col gap-4">
                    <div className="ms-auto text-md font-semibold text-gray-700 flex gap-2 items-center uppercase">
                        <span>Fecha</span>
                        <DatePicker value={dateValue} onChange={onDateChange} format="dd/MM/yyyy hh:mm aa" menuStyle={{ zIndex: 20 }} className="w-fit" showMeridiem />
                    </div>
                    <VehiclesPerTypeAndModel />
                </div>
            </div>
        </>
    );
};
