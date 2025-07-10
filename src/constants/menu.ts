type MenuItem = {
    name: string;
    icon: string;
    to: string;
};

export const menuItems: MenuItem[] = [
    {
        name: "Inicio",
        icon: "mgc_home_4_fill",
        to: "/home",
    },
    {
        name: "Conductores",
        icon: "mgc_user_5_fill",
        to: "/drivers",
    },
    {
        name: "Detalles",
        icon: "mgc_file_info_fill",
        to: "/details",
    },
    {
        name: "Gráficos",
        icon: "mgc_chart_vertical_fill",
        to: "/charts",
    },
    {
        name: "Reportes",
        icon: "mgc_report_forms_fill",
        to: "/reports",
    },
    {
        name: "Alertas",
        icon: "mgc_notification_fill",
        to: "/notifications",
    },
    {
        name: "Tareas",
        icon: "mgc_route_fill",
        to: "/tasks",
    },
];
