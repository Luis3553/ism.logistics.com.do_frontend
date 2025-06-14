import { useEffect, useState } from "react";
import { CustomProvider, DatePicker, DateRangePicker } from "rsuite";
import { esES } from "rsuite/esm/locales";
import cn from "classnames";
import { useFetch } from "@hooks/useFetch";
import { LoadSpinner } from "@components/LoadSpinner";
import { CheckBox } from "./check-boxes";
import ListboxComponent from "@components/listbox";

export function GroupByField({ onChange, value, options }: { value: any; onChange: () => void; options: { value: any; label: string; }[] }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm font-medium">Agrupar por</span>
            <ListboxComponent onChange={onChange} selectedOption={value} options={options} />
        </div>
    );
}

export function TitleField({ onChange, value }: { value: any; onChange: () => void }) {
    const [isValid, setValid] = useState(true);
    const [hasInvalidCharacter, setCharacterValidity] = useState(true);

    useEffect(() => {
        if (String(value).length > 0) {
            setValid(true);
        } else setValid(false);

        if (
            String(value).includes("/") ||
            // String(value).includes(":") ||
            String(value).includes("\\") ||
            String(value).includes("*") ||
            String(value).includes('"') ||
            String(value).includes("<") ||
            String(value).includes(">") ||
            String(value).includes("|") ||
            String(value).includes("¿") ||
            String(value).includes("?")
        ) {
            setCharacterValidity(true);
        } else setCharacterValidity(false);
    }, [value]);

    return (
        <div className='flex flex-col w-full gap-2'>
            <label htmlFor='report_title' className='text-sm font-medium'>
                Título del reporte
            </label>
            <input
                type='text'
                name='report_title'
                id='report_title'
                value={value}
                onChange={onChange}
                className={cn("px-2 py-2 transition-all border rounded-md outline-none focus:border-brand-blue caret-brand-blue", !isValid && "border-red-500")}
                placeholder='Introduzca un título'
            />
            {!isValid && <small className='text-red-400'>Debe introducir un título para el reporte</small>}
            {hasInvalidCharacter && <small className='text-red-400'>El nombre del reporte no debe contener: / \ " * ? | &gt; &lt; :</small>}
        </div>
    );
}

export function DateRangeField({ onChange, value, limit, oldestAllowed }: { value: any; onChange: () => void; limit: number; oldestAllowed: number }) {
    const [tooOld, setOldness] = useState(false);
    const [tooWide, setWideness] = useState(false);

    useEffect(() => {
        const [from, to] = value || [];
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Calculate the earliest allowed date
        const minDate = new Date();
        minDate.setDate(today.getDate() - oldestAllowed);
        minDate.setHours(0, 0, 0, 0);

        let isOld = false;
        let isWide = false;

        if (from && (from < minDate || from > today)) {
            isOld = true;
        }
        if (to && (to < minDate || to > today)) {
            isOld = true;
        }

        if (from && to) {
            const diff = Math.abs((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > limit) {
                isWide = true;
            }
        }

        setOldness(isOld);
        setWideness(isWide);
    }, [value, limit, oldestAllowed]);

    // Disable dates outside the allowed range and those that exceed the limit
    const allowedRangeDates = (date: Date) => {
        const [from, to] = value || [];
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Calculate the earliest allowed date
        const minDate = new Date();
        minDate.setDate(today.getDate() - oldestAllowed);
        minDate.setHours(0, 0, 0, 0);

        // Only allow dates between minDate and today
        if (date < minDate || date > today) {
            return true;
        }

        // If selecting the end date, ensure the range does not exceed the limit
        if (from && !to) {
            const diff = Math.abs((date.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > limit) {
                return true;
            }
        }
        // If selecting the start date, ensure the range does not exceed the limit
        if (!from && to) {
            const diff = Math.abs((to.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > limit) {
                return true;
            }
        }
        // If both dates are selected, ensure the range does not exceed the limit
        if (from && to) {
            const diff = Math.abs((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
            if (diff > limit) {
                return true;
            }
        }

        return false;
    };

    return (
        <div className='flex flex-col w-full gap-2'>
            <label htmlFor='date_range' className='text-sm font-medium'>
                Rango de fecha
            </label>
            <CustomProvider locale={esES}>
                <DateRangePicker name='date_range' id='date_range' onChange={onChange} value={value} placement='bottomEnd' shouldDisableDate={allowedRangeDates} />
            </CustomProvider>
            {tooWide && <small className='text-red-400'>Rango permitido: {limit} días</small>}
            {tooOld && <small className='text-red-400'>Antigüedad máxima: {oldestAllowed} días</small>}
        </div>
    );
}

export function DateField({ onChange, value, oldestAllowed }: { value: any; onChange: () => void; oldestAllowed: number }) {
    const valueDate = new Date(value);

    const [tooOld, setOldness] = useState(false);

    useEffect(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Calculate the earliest allowed date
        const minDate = new Date();
        minDate.setDate(today.getDate() - oldestAllowed);
        minDate.setHours(0, 0, 0, 0);

        let isOld = false;

        if (valueDate && (valueDate < minDate || valueDate > today)) {
            isOld = true;
        }
        if (valueDate && (valueDate < minDate || valueDate > today)) {
            isOld = true;
        }

        setOldness(isOld);
    }, [value, oldestAllowed]);

    // Disable dates outside the allowed range
    const allowedRangeDates = (date: Date) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        // Calculate the earliest allowed date
        const minDate = new Date();
        minDate.setDate(today.getDate() - oldestAllowed);
        minDate.setHours(0, 0, 0, 0);

        // Only allow dates between minDate and today
        if (date < minDate || date > today) {
            return true;
        }

        return false;
    };

    return (
        <div className='flex flex-col w-full gap-2'>
            <label htmlFor='date' className='text-sm font-medium'>
                Hasta
            </label>
            <CustomProvider locale={esES}>
                <DatePicker name='date' id='date' onChange={onChange} value={valueDate} defaultValue={new Date()} cleanable={false} placement='bottomEnd' shouldDisableDate={allowedRangeDates} />
            </CustomProvider>
            {tooOld && <small className='text-red-400'>Antigüedad máxima: {oldestAllowed} días</small>}
        </div>
    );
}

export function SpeedingAllowedSpeedField({ onChange, value }: { value: number; onChange: () => void }) {
    const [isValid, setValid] = useState(true);

    useEffect(() => {
        if (value > 10 && value < 200) {
            setValid(true);
        } else setValid(false);
    }, [value]);

    return (
        <div className='flex flex-col w-full gap-2'>
            <label htmlFor='report_title' className='text-sm font-medium'>
                Velocidad permitida
            </label>
            <div className='relative'>
                <input
                    type='number'
                    name='allowed_speed'
                    id='allowed_speed'
                    value={Number(value)}
                    min={10}
                    max={200}
                    onChange={onChange}
                    className={cn("w-full px-2 py-1 transition-all border rounded-md outline-none pe-16 focus:border-brand-blue caret-brand-blue", !isValid && "border-red-500")}
                />
                <span className='absolute opacity-50 select-none end-4 top-1'>km/h</span>
            </div>
        </div>
    );
}

export function SpeedingMinimumDurationField({ onChange, value }: { value: number; onChange: () => void }) {
    const [isValid, setValid] = useState(true);

    useEffect(() => {
        if (value > 0 && value < 30) {
            setValid(true);
        } else setValid(false);
    }, [value]);

    return (
        <div className='flex flex-col w-full gap-2'>
            <label htmlFor='report_title' className='text-sm font-medium'>
                Duración de la violación
            </label>
            <div className='relative'>
                <input
                    type='number'
                    name='minimum_duration'
                    id='minimum_duration'
                    value={Number(value)}
                    onChange={onChange}
                    min={0}
                    max={30}
                    className={cn("w-full px-2 py-1 transition-all border rounded-md outline-none pe-16 focus:border-brand-blue caret-brand-blue", !isValid && "border-red-500")}
                />
                <span className='absolute opacity-50 select-none end-4 top-1'>min</span>
            </div>
        </div>
    );
}

export function RulesList({ onChange, value }: { value: number[]; onChange: (value: number[]) => void }) {
    const { data, isLoading } = useFetch<any[]>("/notifications/rules");
    const selected = new Set<number>(value || []);

    const handleToggle = (ruleValue: number) => {
        const newSelected = new Set(selected);
        if (newSelected.has(ruleValue)) {
            newSelected.delete(ruleValue);
        } else {
            newSelected.add(ruleValue);
        }
        onChange(Array.from(newSelected));
    };

    if (isLoading)
        return (
            <div className='relative p-8'>
                <LoadSpinner />
            </div>
        );

    if (data && data.length > 0)
        return (
            <div>
                <h2 className='text-sm font-medium'>Alertas</h2>
                <div className='overflow-y-scroll border rounded-lg max-h-52'>
                    {data.map((item: { label: string; value: number }) => (
                        <CheckBox key={item.value} label={item.label} checked={selected.has(item.value)} onChange={() => handleToggle(item.value)} />
                    ))}
                </div>
            </div>
        );
    return null;
}
