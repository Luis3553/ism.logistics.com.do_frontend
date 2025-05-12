export interface VehicleLabelGroup {
    department: string;
    garages: GarageGroup[];
}

export interface GarageGroup {
    garage: string;
    drivers: DriverGroup[];
}

export interface DriverGroup {
    driver: string;
    vehicles: BrandGroup[];
}

export interface BrandGroup {
    brand: string;
    models: ModelGroup[];
}

export interface ModelGroup {
    model: string;
    labels: string[]; // e.g., "HYUNDAI - L484862"
}
