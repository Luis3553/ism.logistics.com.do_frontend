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
                        required: true,
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte odómetro ${today}`,
                        component: TitleField,
                        props: {}, // you will inject `value` and `onChange` dynamically
                        onChangeType: "event",
                    },
                    {
                        required: true,
                        key: "date",
                        type: "date",
                        defaultValue: new Date(),
                        component: DateField,
                        props: {
                            label: "Fecha",
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
                        required: true,
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de exceso de velocidad ${today}`,
                        component: TitleField,
                        props: {}, // you will inject `value` and `onChange` dynamically
                        onChangeType: "event",
                    },
                    {
                        required: true,
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
                        required: true,
                        key: "allowed_speed",
                        type: "number",
                        defaultValue: 80,
                        component: SpeedingAllowedSpeedField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        required: true,
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
                disabled: false,
                list: "trackers",
                fields: [
                    {
                        required: true,
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de eventos ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        required: true,
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
                        required: true,
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
                        required: true,
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
                list: "trackers",
                disabled: false,
                fields: [
                    {
                        required: false,
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de vencimiento de seguros ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        required: false,
                        key: "from",
                        type: "date",
                        defaultValue: new Date(format(new Date(), "MM/dd/yyyy 00:00:00")),
                        component: DateField,
                        props: {
                            label: "Desde",
                            nullable: true,
                        },
                        onChangeType: "value",
                    },
                    {
                        required: false,
                        key: "to",
                        type: "date",
                        defaultValue: new Date(format(new Date(), "MM/dd/yyyy 23:59:59")),
                        component: DateField,
                        props: {
                            label: "Hasta",
                            nullable: true,
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
                disabled: false,
                fields: [
                    {
                        required: false,
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de vencimiento de licencias ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                    {
                        required: false,
                        key: "from",
                        type: "date",
                        defaultValue: new Date(format(new Date(), "MM/dd/yyyy 00:00:00")),
                        component: DateField,
                        props: {
                            label: "Desde",
                            nullable: true,
                        },
                        onChangeType: "value",
                    },
                    {
                        required: false,
                        key: "to",
                        type: "date",
                        defaultValue: new Date(format(new Date(), "MM/dd/yyyy 23:59:59")),
                        component: DateField,
                        props: {
                            label: "Hasta",
                            nullable: true,
                        },
                        onChangeType: "value",
                    },
                ],
            },
            {
                id: 6,
                name: "Mantenimiento de vehículos",
                description: "Mantenimiento de vehículos programados",
                list: "trackers",
                disabled: false,
                fields: [
                    {
                        required: true,
                        key: "title",
                        type: "string",
                        defaultValue: `Reporte de mantenimiento ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                ],
            },
        ],
    },
    {
        category: "Dispositivos",
        types: [
            {
                id: 7,
                name: "Trackers fuera de línea",
                description: "Dispositiivos fuera de línea en un rango de tiempo",
                list: "trackers",
                disabled: false,
                fields: [
                    {
                        required: true,
                        key: "title",
                        type: "string",
                        defaultValue: `Dispositivos fuera de línea ${today}`,
                        component: TitleField,
                        props: {},
                        onChangeType: "event",
                    },
                ],
            },
        ],
    },
];
