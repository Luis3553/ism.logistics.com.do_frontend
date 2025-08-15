import axios from "axios";
import { useState, useEffect, useMemo, useRef } from "react";
import { CustomProvider, DateRangePicker, toaster, Whisper } from "rsuite";
import { format } from "date-fns";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ColDef, RowSelectionOptions, themeBalham } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import classNames from "classnames";
import { LoadSpinner } from "@components/LoadSpinner";
import { esES } from "rsuite/esm/locales";
import { useEmployeesQuery } from "@framework/useGetEmployees";
import { tooltip } from "@utils/ui";
import ListOfTrackers from "@pages/Alert/components/select-trackers";
import { Option } from "@pages/Configuration/components/ListOfConfigurations";
import { Button } from "@components/Button";
import { useTrackersQuery } from "@framework/getTrackers";
import api from "@framework/index";
import messageToaster from "@utils/toaster";
import { Transition } from "@headlessui/react";
import { appearAnimationProps } from "@utils/animations";
import XLSX from "xlsx-js-style";
import { ImageModal } from "./components/ImageModal";
import { ByteToKB } from "@utils/bytesToKb";
import { compressImageFromUrl } from "./components/utils";
import { CheckinsList } from "@utils/types";

export default function Checkins() {
    const [response, setResponse] = useState<{ count: number; list: CheckinsList[] }>();
    // @ts-ignore
    const [isFetching, setIsFetching] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    const { data: employeesData } = useEmployeesQuery();
    const { data: trackersData, isLoading: isLoadingTrackers } = useTrackersQuery();
    const [trackersQuery, setTrackersQuery] = useState<number[]>([]);

    const [trackers, setTrackers] = useState<Option[]>([]);

    const agGridRef = useRef<AgGridReact>(null);

    const rowSelection: RowSelectionOptions = useMemo(() => {
        return {
            mode: "multiRow",
        };
    }, []);

    const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))]);

    const [checkins, setCheckins] = useState<CheckinsList[]>([]);

    useEffect(() => {
        if (trackersData) {
            const formattedTrackers = trackersData.list.map((tracker) => ({
                value: tracker.id,
                label: tracker.label,
            }));
            setTrackers(formattedTrackers);
            setTrackersQuery(trackersData.list.map((i) => Number(i.id)));
        }
    }, [trackersData]);

    const [loadingImage, setLoadingImage] = useState(false);

    const columnDefs: ColDef[] = [
        { field: "marker_time", headerName: "Fecha", flex: 1 },
        {
            headerName: "Dirección",
            cellRenderer: (params: any) => {
                return (
                    <a
                        className='underline transition-all text-brand-blue hover:text-brand-dark-blue decoration-transparent hover:decoration-brand-blue'
                        target='_blank'
                        href={`https://app.progps.com.do/pro/applications/map/?lat=${params.data.location.lat}&lng=${params.data.location.lng}`}>
                        {params.data.location.address}
                    </a>
                );
            },
            flex: 1,
        },
        {
            field: "employee_id",
            headerName: "Empleado",
            cellRenderer: (params: any) => {
                const employee = employeesData?.find((e) => e.id == params.data.employee_id);
                return employee ? `${employee.first_name} ${employee.last_name}` : "-";
            },
            flex: 1,
        },
        {
            field: "comment",
            headerName: "Comentario",
            editable: true,
            cellRenderer: (params: any) => {
                return params.data.comment ?? "-";
            },
            flex: 1,
        },
        {
            headerName: "Foto",
            cellRenderer: (params: any) => {
                return params.data.files?.[0]?.size ? (
                    <button
                        onClick={() => {
                            if (params.data.files?.[0]?.view_url) {
                                setIsOpen(true);
                                if (params.data.files[0].size > 900 * 1024) {
                                    setLoadingImage(true);
                                    compressImageFromUrl(params.data.files[0].view_url, 900).then((blob) => {
                                        const url = URL.createObjectURL(blob);
                                        setImageUrl(url);
                                        setLoadingImage(false);
                                    });
                                } else {
                                    setImageUrl(params.data.files[0].view_url);
                                }
                            } else {
                                alert("No hay foto disponible");
                            }
                        }}
                        className='underline transition-all text-brand-blue hover:text-brand-dark-blue decoration-transparent hover:decoration-brand-blue'>
                        {`Ver foto (${ByteToKB(params.data.files?.[0]?.size)})`}
                    </button>
                ) : (
                    "-"
                );
            },
            flex: 1,
        },
        {
            headerName: "Formulario",
            cellRenderer: (params: any) => {
                return params.data.form_label ? (
                    <Whisper speaker={tooltip(`Ver formulario: ${params.data.form_label}`)} placement='top'>
                        <a
                            target='_blank'
                            href={`https://app.progps.com.do/#/form/view/${params.data.form_id}`}
                            className='underline transition-all text-brand-blue hover:text-brand-dark-blue decoration-transparent hover:decoration-brand-blue'>
                            {params.data.form_label}
                        </a>
                    </Whisper>
                ) : (
                    "-"
                );
            },
            flex: 1,
        },
    ];

    function exportSelectedCheckinsToExcel() {
        if (checkins.length === 0) {
            toaster.push(messageToaster("No hay check-ins seleccionados", "warning"), {
                duration: 2000,
                placement: "topEnd",
            });
            return;
        }

        const linkStyle = {
            font: { color: { rgb: "0563C1" }, underline: true },
        };

        const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
        };

        const excelData = checkins.map((checkin) => {
            const employee = employeesData?.find((e) => e.id == checkin.employee_id);
            return {
                Fecha: checkin.marker_time,
                Dirección: {
                    v: checkin.location.address,
                    l: {
                        Target: `https://app.progps.com.do/pro/applications/map/?lat=${checkin.location.lat}&lng=${checkin.location.lng}`,
                        Tooltip: "Ver ubicación",
                    },
                    s: { ...linkStyle },
                },
                Latitud: checkin.location.lat,
                Longitud: checkin.location.lng,
                Empleado: employee ? `${employee.first_name} ${employee.last_name}` : "-",
                Comentario: checkin.comment ?? "-",
                Foto: checkin.files?.[0]?.view_url ? { v: "Ver foto", l: { Target: checkin.files[0].view_url, Tooltip: "Abrir foto" }, s: { ...linkStyle } } : "-",
                Formulario: checkin.form_label
                    ? {
                          v: checkin.form_label,
                          l: { Target: `https://app.progps.com.do/#/form/view/${checkin.form_id}`, Tooltip: "Ver formulario" },
                          s: { ...linkStyle },
                      }
                    : "-",
            };
        });

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Style headers
        const headerStyle = {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { fgColor: { rgb: "ebebeb" } },
            alignment: { horizontal: "center", vertical: "center" },
        };

        // @ts-ignore
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddress]) continue;
            ws[cellAddress].s = { ...headerStyle };
        }

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;
                ws[cellAddress].s = {
                    ...(ws[cellAddress].s || {}),
                    border: borderStyle,
                };
            }
        }

        // Optional: set column widths
        ws["!cols"] = [
            { wch: 20 }, // Fecha
            { wch: 40 }, // Dirección
            { wch: 12 }, // Latitud
            { wch: 12 }, // Longitud
            { wch: 25 }, // Empleado
            { wch: 30 }, // Comentario
            { wch: 20 }, // Foto
            { wch: 35 }, // Formulario
        ];

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Hoja 1");

        // Save file
        XLSX.writeFile(wb, `POI - ${format(dateRange[0], "dd/MM/yyyy")}-${format(dateRange[1], "dd/MM/yyyy")}.xlsx`);
    }

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsFetching(true);
        const [from, to] = dateRange;

        const payload = {
            from: format(from, "yyyy-MM-dd HH:mm:ss"),
            to: format(to, "yyyy-MM-dd HH:mm:ss"),
            trackers: trackersQuery,
            hash: "3d152bad53ff3e5ae928af1475fa2d4c",
        };

        axios
            .post("https://app.progps.com.do/api-v2/checkin/list", payload)
            .then((res) => {
                setResponse(res.data);
            })
            .finally(() => {
                setIsFetching(false);
            });
    }

    async function uploadImage(place_id: number, file: File) {
        const formData = new FormData();
        formData.append("place_id", place_id.toString());
        formData.append("file", file);

        if (file) {
            await api.post("/place/avatar/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        }
    }

    async function createPOI(checkin: CheckinsList): Promise<number> {
        const payload = {
            place: {
                description: "",
                fields: {},
                files: [],
                id: null,
                label: checkin.comment,
                location: {
                    address: checkin.location.address,
                    lat: checkin.location.lat,
                    lng: checkin.location.lng,
                    radius: 50,
                },
                tags: [],
            },
        };

        const res = await api.post("/place/create", payload);
        return res.data.id;
    }

    async function createPOIs() {
        checkins.forEach((checkin) => {
            createPOI(checkin)
                .then(async (poi) => {
                    if (checkin.files && checkin.files.length > 0) {
                        const file = checkin.files[0];
                        if (file.size > 900 * 1024) {
                            await compressImageFromUrl(file.view_url, 900).then((blob) => {
                                const compressedFile = new File([blob], file.name, { type: file.mime_type });
                                uploadImage(poi, compressedFile)
                                    .then(() => {
                                        toaster.push(messageToaster(`POI "${checkin.comment}" creado correctamente`, "success"), {
                                            duration: 2000,
                                            placement: "topEnd",
                                        });
                                    })
                                    .catch(() => {
                                        toaster.push(messageToaster(`Error subiendo la imagen del POI: "${checkin.comment}"`, "error"), {
                                            duration: 2000,
                                            placement: "topEnd",
                                        });
                                    });
                            });
                        } else {
                            // Fetch the file data and create a File instance
                            await fetch(file.download_url)
                                .then(async (response) => {
                                    const blob = await response.blob();
                                    const fileObj = new File([blob], file.name, { type: file.mime_type });
                                    await uploadImage(poi, fileObj)
                                        .then(() => {
                                            toaster.push(messageToaster(`POI "${checkin.comment}" creado correctamente`, "success"), {
                                                duration: 2000,
                                                placement: "topEnd",
                                            });
                                        })
                                        .catch(() => {
                                            toaster.push(messageToaster(`Error subiendo la imagen del POI: "${checkin.comment}"`, "error"), {
                                                duration: 2000,
                                                placement: "topEnd",
                                            });
                                        });
                                })
                                .catch(() => {
                                    toaster.push(messageToaster(`Error subiendo la imagen del POI: "${checkin.comment}"`, "error"), {
                                        duration: 2000,
                                        placement: "topEnd",
                                    });
                                });
                        }
                    } else {
                        toaster.push(messageToaster(`POI "${checkin.comment}" creado correctamente`, "success"), {
                            duration: 2000,
                            placement: "topEnd",
                        });
                    }
                })
                .catch(() => {
                    toaster.push(messageToaster(`Error creando el POI: "${checkin.comment}"`, "error"), {
                        duration: 2000,
                        placement: "topEnd",
                    });
                });
        });
    }

    return (
        <>
            <h1 className='mb-4 text-lg font-medium text-brand-dark-gray'>Check-ins a POI</h1>

            <form onSubmit={onSubmit} className='flex flex-row items-center gap-4 px-4 py-2 mb-4 bg-white rounded-lg shadow-lg'>
                <div className='flex flex-col'>
                    <label htmlFor='from' className='text-sm font-medium text-slate-600'>
                        Fecha
                    </label>
                    <CustomProvider locale={esES}>
                        <DateRangePicker
                            id='from'
                            placeholder='dd/mm/aaaa - dd/mm/aaaa'
                            format='dd/MM/yyyy'
                            value={dateRange}
                            cleanable={false}
                            onChange={(val) => setDateRange(val ?? [new Date(new Date().setHours(0, 0, 0, 0)), new Date(new Date().setHours(23, 59, 59, 999))])}
                        />
                    </CustomProvider>
                </div>
                <div className='w-80'>
                    <span className='text-sm font-medium text-slate-600'>Objetos</span>
                    <ListOfTrackers
                        data={trackers}
                        isLoading={isLoadingTrackers}
                        // @ts-ignore
                        setTrackersQuery={(e: (string | number)[]) => {
                            if (e[0] === "all") {
                                setTrackersQuery(trackers.map((i) => Number(i.value)));
                            } else {
                                setTrackersQuery((e as string[]).map((i) => parseInt(i)));
                            }
                        }}
                    />
                </div>
                <Button type='submit' variant='subtle' rounded='full' className='flex items-center mt-5 gap-x-4' disabled={isFetching}>
                    <FaMagnifyingGlass />
                    Buscar
                </Button>
            </form>
            {response ? (
                <Transition show={response != undefined} {...appearAnimationProps}>
                    <>
                        <div className={classNames("max-h-[calc(90vh-100px)] h-full min-h-[400px] transition-all")}>
                            <div className='flex flex-row items-center p-4 mb-4 bg-white rounded-lg shadow-lg'>
                                <Button
                                    onClick={() => {
                                        createPOIs().finally(() => {
                                            setCheckins([]); // Clear selection after creating POIs
                                            // Optionally clear selection in grid:
                                            agGridRef.current?.api.deselectAll();
                                        });
                                    }}>
                                    Crear puntos seleccionados{checkins.length > 0 ? ` (${checkins.length ?? 0})` : ""}
                                </Button>
                                <Button variant='subtle' className='ms-2' onClick={exportSelectedCheckinsToExcel}>
                                    Exportar a Excel{checkins.length > 0 ? ` (${checkins.length})` : ""}
                                </Button>
                                <div className='flex-grow text-right text-gray-500'>
                                    <strong>Total</strong>: {response.count}
                                </div>
                            </div>
                            <AgGridReact
                                noRowsOverlayComponentParams={{ noRowsMessageFunc: () => "No hay datos disponibles" }}
                                overlayNoRowsTemplate='No hay check-ins disponibles'
                                columnDefs={columnDefs}
                                loading={isFetching}
                                loadingOverlayComponent={() => <LoadSpinner />}
                                onRowSelected={(params) => {
                                    setCheckins(params.api.getSelectedRows());
                                }}
                                rowSelection={rowSelection}
                                rowData={response.list}
                                theme={themeBalham.withParams({ accentColor: "#3b82f6" })}
                                className='shadow-lg'
                                ref={agGridRef}
                            />
                        </div>
                        <ImageModal
                            isOpen={isOpen}
                            imageUrl={imageUrl}
                            onClose={() => {
                                setIsOpen(false);
                                setImageUrl("");
                            }}
                            loading={loadingImage}
                        />
                    </>
                </Transition>
            ) : (
                <div className='p-4 text-center h-[calc(90vh-100px)] min-h-[400px] bg-white rounded-lg shadow-lg flex items-center justify-center'>
                    No hay check-ins disponibles. Realice una búsqueda para ver los resultados.
                </div>
            )}
        </>
    );
}
