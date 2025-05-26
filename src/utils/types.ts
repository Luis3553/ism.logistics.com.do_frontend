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
    value: string;
    component: (
        query: string,
        from: Date | null,
        to: Date,
        setGroupsQuery: Array<number | string>,
        setNotificationsQuery: Array<number | string>,
        setTrackersQuery: Array<number | string>,
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
