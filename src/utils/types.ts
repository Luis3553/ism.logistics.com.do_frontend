export type Tracker = {
    notification_id: number;
    name: string;
    emergency: boolean;
    vehicle_id?: number;
    start_date: string;
    latitude?: number;
    longitude?: number;
    end_date: string;
    time: string;
    address: string;
};

export type Notification = {
    id: number;
    name: string;
    trackers: Tracker[];
};

export type Group = {
    id: number;
    name: string;
    notifications: Notification[];
};

export type AlertsByGroup = {
    groups: Group[];
};

export type AlertsGroup = {
    name: string;
    trackers: Tracker[];
};

export type NotificationGroup = {
    name: string;
    groups: AlertsGroup[];
};

export type Alert = {
    name: string;
    events: Tracker[];
};

export type TrackerGroup = {
    id: number;
    name: string;
    alerts: Alert[];
};

export type AlertsByType = {
    notifications: NotificationGroup[];
};

export type AlertsByTracker = {
    trackers: TrackerGroup[];
};

export type Option = {
    id: number;
    label: string;
    value: any;
    component: (
        query: string,
        from: Date | null,
        to: Date,
        setGroupsQuery: Array<number | string>,
        setNotificationsQuery: Array<number | string>,
        setTrackersQuery: Array<number | string>,
        allAlerts: Array<number | string>,
        allGroups: Array<number>,
        allTrackers: Array<number>,
    ) => JSX.Element;
    icon: string;
};

export type Tag = {
    id: number;
    name: string;
    color: string;
};

export type Driver = {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
};

export type Vehicle = {
    color: string;
    additional_info: string;
    driver: Driver;
    frame_number: string;
    garage_id?: number;
    garage_organization_name: string;
    label: string;
    id: number;
    manufacture_year: number;
    model: string;
    reg_number: string;
    subtype: string;
    tags: Array<Tag>;
    tracker_id: number;
    tracker_label: string;
    trailer_reg_number: string;
    type: "truck" | "trailer" | "vehicle";
    vin: string;
    fuel_type: string;
    chassis_number: string;
};

export type FieldConfig = {
    key: string;
    type: "string" | "number" | "date" | "date[]" | "number[]" | "string[]" | "options[]";
    defaultValue?: any;
    component: React.FC<any>;
    props: Record<string, any>;
    onChangeType: "event" | "value" | "array" | "option";
    required: boolean;
};

export type ReportType = {
    id: number;
    name: string;
    description: string;
    fields: FieldConfig[];
    list: "trackers" | "vehicles" | "drivers";
    disabled: boolean;
};

export type ReportCategory = {
    category: string;
    types: ReportType[];
};

export type RetrievedReportSummaryRows = {
    title: string;
    value: string;
};

export type RetrievedReportContentCols = {
    name: string;
    key: string;
};

export type RetrievedReportContentRows = {
    [key: string]: any;
};

export type RetrievedReportData = {
    groupLabel: string;
    bgColor: string;
    content: {
        columns: RetrievedReportContentCols[];
        rows: RetrievedReportContentRows[];
    } | RetrievedReportData[];
};
export type RetrievedReport = {
    title: string;
    date: string;
    summary: {
        title: string;
        color: string;
        rows: RetrievedReportSummaryRows[];
    };
    data: RetrievedReportData[];
    columns_dimensions_for_excel_file: {};
};

export type GeneratedReportRow = {
    id: number;
    title: string;
    created_at: string;
    report_payload: any;
    updated_at: string;
    percent: number;
};

export type GeneratedReport = {
    category: string;
    reports: GeneratedReportRow[];
};

export type TrackerObject = {
    clone: boolean;
    group_id: number;
    id: number;
    label: string;
    source: {
        blocked: boolean;
        creation_date: string;
        device_id: string;
        id: number;
        model: string;
        phone: string;
        status_listening_id?: number;
        tariff_end_date: string;
        tariff_id: number;
    };
    tag_bindings: number[];
};

export type TrackersGroup = {
    id: number;
    name: string;
    color: string;
    trackers: TrackerObject[];
};
export type DriversGroup = {
    name: string;
    trackers: TrackerObject[];
};
export type VehiclesGroup = {
    name: string;
    trackers: TrackerObject[];
};
