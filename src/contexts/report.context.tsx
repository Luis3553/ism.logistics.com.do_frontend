import { Report, ReportValues } from "@utils/types";
import { create } from "zustand";

type ReportStore = {
    storeInLocalStorage: boolean;
    setStoreInLocalStorage: (store: boolean) => void;
    showDescriptions: boolean;
    setShowDescriptions: (show: boolean) => void;
    expandFilesAutomatically: boolean;
    setExpandFilesAutomatically: (show: boolean) => void;
    activeReport: Report | null;
    setActiveReport: (report: Report) => void;
    reportValues: ReportValues;
    setReportValues: (values: ReportValues) => void;
};

const showDescriptions = localStorage.getItem("showDescriptions") === "false" ? false : true;
const expandFilesAutomatically = localStorage.getItem("expandFilesAutomatically") === "false" ? false : true;
const storeInLocalStorage = localStorage.getItem("storeInLocalStorage") === "false" ? false : true;

export const useReportStore = create<ReportStore>((set) => ({
    showDescriptions: showDescriptions,
    setShowDescriptions: (show) => set({ showDescriptions: show }), 
    storeInLocalStorage: storeInLocalStorage,
    setStoreInLocalStorage: (store) => set({ storeInLocalStorage: store }),
    expandFilesAutomatically: expandFilesAutomatically,
    setExpandFilesAutomatically: (show) => set({ expandFilesAutomatically: show }),
    activeReport: null,
    setActiveReport: (report: Report) => set({ activeReport: report }),
    reportValues: {},
    setReportValues: (values: ReportValues) => set({ reportValues: values }),
}));
