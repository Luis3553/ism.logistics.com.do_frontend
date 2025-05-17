import { DateRange } from "rsuite/esm/DateRangePicker";

export type Tracker = {
    notification_id: number;
    name: string;
    emergency: boolean;
    vehicle_id?: number;
    start_date: string;
    end_date: string;
    time: string;
    address: string;
};

export type Notification = {
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
export type AlertsByType = {
    notifications: NotificationGroup[];
};

export type Option = {
    id: number;
    value: string;
    component: (query: string, range: DateRange) => JSX.Element;
    icon: string;
};
