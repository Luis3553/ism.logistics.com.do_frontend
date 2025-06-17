import { ReportCategory } from "@utils/types";
import { DateField, DateRangeField, GroupByField, RulesList, SpeedingAllowedSpeedField, SpeedingMinimumDurationField, TitleField } from "./utils/fields";
import { format } from "date-fns";

const today = format(new Date(), "dd-MM-yyyy hh:mm");

export const reports: ReportCategory[] = [
    {
        category: "Movimiento",
        types: [
            {
                id: 1,
                name: "Odómetro",
                description: "Valor actual del odómetro",
                list: "trackers",
                disabled: false,
                fields: [
                    {
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte odómetro ${today}`,
                        component: TitleField,
                        props: {}, // you will inject `value` and `onChange` dynamically
                        onChangeType: "event",
                    },
                    {
                        key: "date",
                        type: "date",
                        defaultValue: new Date(),
                        component: DateField,
                        props: {
                            oldestAllowed: 120,
                        }, // you will inject `value` and `onChange` dynamically
                        onChangeType: "value",
                    },
                ],
            },
            {
                id: 2,
                name: "Exceso de velocidad",
                description: "Valor actual del odómetro",
                list: "trackers",
                disabled: false,
                fields: [
                    {
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de exceso de velocidad ${today}`,
                        component: TitleField,
                        props: {}, // you will inject `value` and `onChange` dynamically
                        onChangeType: "event",
                    },
                    {
                        key: "range",
                        type: "date[]",
                        defaultValue: [new Date(format(new Date(), "MM/dd/yyyy 00:00:00")), new Date(format(new Date(), "MM/dd/yyyy 23:59:59"))],
                        component: DateRangeField,
                        props: {
                            limit: 31,
                            oldestAllowed: 120,
                        },
                        onChangeType: "value",
                    },
                    {
                        key: "allowed_speed",
                        type: "number",
                        defaultValue: 80,
                        component: SpeedingAllowedSpeedField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        key: "min_duration",
                        type: "number",
                        defaultValue: 5,
                        component: SpeedingMinimumDurationField,
                        props: {},
                        onChangeType: "event",
                    },
                ],
            },
        ],
    },
    {
        category: "Eventos",
        types: [
            {
                id: 3,
                name: "Alertas",
                description: "Alertas generadas por reglas",
                disabled: true,
                list: "trackers",
                fields: [
                    {
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de eventos ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        key: "range",
                        type: "date[]",
                        defaultValue: [new Date(), new Date()],
                        component: DateRangeField,
                        props: {
                            limit: 31,
                            oldestAllowed: 120,
                        },
                        onChangeType: "value",
                    },
                    {
                        key: "groupBy",
                        type: "options[]",
                        defaultValue: {
                            value: "notifications",
                            label: "Eventos",
                        },
                        component: GroupByField,
                        props: {
                            options: [
                                { value: "notifications", label: "Eventos" },
                                { value: "trackers", label: "Objetos" },
                                { value: "groups", label: "Grupos" },
                            ],
                        },
                        onChangeType: "option",
                    },
                    {
                        key: "notifications",
                        type: "number[]",
                        defaultValue: [],
                        component: RulesList,
                        props: {},
                        onChangeType: "value",
                    },
                ],
            },
        ],
    },
    {
        category: "Gestión de flotas",
        types: [
            {
                id: 4,
                name: "Vencimiento de seguros",
                description: "Vencimiento de pólizas de seguro de vehículos",
                list: "vehicles",
                disabled: true,
                fields: [
                    {
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de vencimiento de seguros ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        key: "range",
                        type: "date[]",
                        defaultValue: [new Date(), new Date()],
                        component: DateRangeField,
                        props: {
                            limit: 31,
                            oldestAllowed: 120,
                        },
                        onChangeType: "value",
                    },
                ],
            },
            {
                id: 5,
                name: "Vencimiento de licencias",
                description: "Vencimiento de permiso de conducir de los conductores",
                list: "drivers",
                disabled: true,
                fields: [
                    {
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de vencimiento de licencias ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        key: "range",
                        type: "date[]",
                        defaultValue: [new Date(), new Date()],
                        component: DateRangeField,
                        props: {
                            limit: 31,
                            oldestAllowed: 120,
                        },
                        onChangeType: "value",
                    },
                ],
            },
            {
                id: 6,
                name: "Mantenimiento de vehículos",
                description: "Mantenimiento de vehículos programados",
                list: "vehicles",
                disabled: true,
                fields: [],
            },
        ],
    },
];