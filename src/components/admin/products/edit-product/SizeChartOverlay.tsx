"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import Spinner from "@/elements/Spinners/white";
import AlertMessage from "@/components/AlertMessage";
import clsx from "clsx";
import EditProductAction from "@/actions/edit-product";
import { useOverlayStore } from "@/zustand/admin/overlayStore";
import { MdOutlineEdit } from "react-icons/md";

export function EditSizesButton() {
  const { showOverlay } = useOverlayStore();

  const { pageName, overlayName } = useOverlayStore((state) => ({
    pageName: state.pages.editProduct.name,
    overlayName: state.pages.editProduct.overlays.sizes.name,
  }));

  return (
    <button
      onClick={() => showOverlay({ pageName, overlayName })}
      className="w-9 h-9 grid place-items-center rounded-full transition duration-300 ease-in-out hover:bg-gray2"
      type="button"
    >
      <MdOutlineEdit size={18} />
    </button>
  );
}

type MeasurementProps = {
  in: string;
  cm: string;
};

type Size = {
  measurements: {
    [key: string]: MeasurementProps;
  };
  size: string;
};

type ColumnProps = {
  index: number;
  name: string;
};

type EntryLabelProps = {
  index: number;
  name: string;
};

type SizeChartProps = {
  columns: ColumnProps[];
  entry_labels: EntryLabelProps[];
  sizes: Size[];
};

type ProductSizeProps = {
  size: string;
  measurements: Record<string, { in: string; cm: string }>;
};

export default function SizeChartOverlay({
  data,
}: {
  data: {
    productId: string;
    chart: SizeChartProps | null;
  };
}) {
  const chartExists =
    data.chart !== null && Object.keys(data.chart || {}).length > 0;

  const chartColumns = chartExists
    ? (data.chart?.columns || []).sort((a: any, b: any) => a.index - b.index)
    : [];
  const chartEntryLabels = chartExists
    ? (data.chart?.entry_labels || []).sort(
        (a: any, b: any) => a.index - b.index
      )
    : [];
  const chartEntries = chartExists ? data.chart?.sizes || [] : [];

  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(chartExists || false);
  const [columns, setColumns] = useState<ColumnProps[]>(chartColumns);
  const [entryLabels, setEntryLabels] =
    useState<EntryLabelProps[]>(chartEntryLabels);
  const [entries, setEntries] = useState<ProductSizeProps[]>(chartEntries);
  const [measurementInputs, setMeasurementInputs] = useState<
    Record<string, string>
  >({});

  const { hideOverlay } = useOverlayStore();

  const { pageName, isOverlayVisible, overlayName } = useOverlayStore(
    (state) => ({
      pageName: state.pages.editProduct.name,
      overlayName: state.pages.editProduct.overlays.sizes.name,
      isOverlayVisible: state.pages.editProduct.overlays.sizes.isVisible,
    })
  );

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOverlayVisible]);

  const hideAlertMessage = () => {
    setShowAlert(false);
    setAlertMessage("");
  };

  const saveChanges = async () => {
    if (!entries.length) {
      setAlertMessage("No sizes found");
      setShowAlert(true);
      return;
    }

    setLoading(true);

    const updatedChart = {
      columns,
      entry_labels: entryLabels,
      sizes: entries,
    };

    try {
      await EditProductAction({ id: data.productId, sizes: updatedChart });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      hideOverlay({ pageName, overlayName });
    }
  };

  const generateNewSizes = () => {
    const newSizes = entryLabels.map((entryLabel) => {
      const size = entryLabel.name;
      const measurements = Object.fromEntries(
        columns.slice(1).map((col) => [col.name, { in: "0", cm: "0" }])
      );

      return { size, measurements };
    });

    setEntries(newSizes);
    setMeasurementInputs({});
  };

  const handleColumnsInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const array = event.target.value.split(",");
    const values: string[] = array
      .map((inputValue: string) => inputValue.trim())
      .filter(Boolean);

    const newColumns = values.map((name, index) => ({
      index: index + 1,
      name: name.trim(),
    }));

    setShowChart(false);
    setColumns(newColumns);
    setMeasurementInputs({});
    generateNewSizes();
  };

  const handleEntryLabelsInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const array = event.target.value.split(",");
    const values: string[] = array
      .map((inputValue: string) => inputValue.trim())
      .filter(Boolean);

    const newEntryLabels = values.map((name, index) => ({
      index: index + 1,
      name: name.trim(),
    }));

    setShowChart(false);
    setEntryLabels(newEntryLabels);
    setMeasurementInputs({});
    generateNewSizes();
  };

  const createSizeChart = () => {
    generateNewSizes();
    setShowChart(true);
  };

  const InchesToCentimeters = (value: number, columnName: string) => {
    const excludedColumns = ["US", "EU", "UK", "NZ", "AU", "DE"];

    if (excludedColumns.includes(columnName.toUpperCase())) {
      return value;
    }

    const convertedValue = value * 2.54;
    return convertedValue;
  };

  const handleMeasurementInputChange =
    (rowIndex: number, columnName: string) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const inputValue = event.target.value;

      setEntries((prevEntries) => {
        const newSizes = prevEntries ? [...prevEntries] : [];
        const sizeObject = newSizes[rowIndex];

        if (sizeObject) {
          const excludedColumns = ["US", "EU", "UK", "NZ", "AU", "DE"];
          const updatedValue = inputValue === "" ? "0" : inputValue;

          let measurements;

          if (excludedColumns.includes(columnName.toUpperCase())) {
            measurements = {
              in: updatedValue,
              cm: updatedValue,
            };
          } else {
            const floatValue = parseFloat(updatedValue);
            const centimeters = InchesToCentimeters(
              floatValue,
              columnName
            ).toFixed(1);

            measurements = {
              in:
                floatValue % 1 === 0
                  ? String(parseInt(updatedValue))
                  : updatedValue,
              cm:
                parseFloat(centimeters) % 1 === 0
                  ? String(parseInt(centimeters))
                  : centimeters,
            };
          }

          sizeObject.measurements = {
            ...sizeObject.measurements,
            [columnName]: measurements,
          };
        }

        return newSizes;
      });

      setMeasurementInputs((prevInputs) => ({
        ...prevInputs,
        [`${rowIndex}-${columnName}`]: inputValue,
      }));
    };

  return (
    <>
      {isOverlayVisible && (
        <div className="custom-scrollbar flex justify-center py-20 w-screen h-screen overflow-x-hidden overflow-y-visible z-20 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-max h-max bg-white mx-auto mt-20 shadow rounded-14px overflow-hidden">
            <div className="w-full h-9 pt-[14px] px-4 flex items-center justify-between">
              <button
                onClick={() => hideOverlay({ pageName, overlayName })}
                className="flex items-center gap-1 cursor-pointer text-blue hover:underline"
              >
                <HiArrowLeft size={20} className="fill-blue" />
                <span className="heading-size-h3 text-blue">
                  Edit the size chart
                </span>
              </button>
              <button
                onClick={saveChanges}
                className={`min-w-[72px] h-9 px-3 rounded-full bg-blue transition duration-300 ease-in-out ${clsx(
                  {
                    "hover:bg-blue2": !loading,
                    "bg-opacity-40": loading,
                    "hover:bg-blue": loading,
                    "hover:bg-opacity-40": loading,
                  }
                )}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex gap-1 items-center justify-center w-full h-full">
                    <Spinner />
                    <p className="text-white">Saving</p>
                  </div>
                ) : (
                  <p className="text-white">Save</p>
                )}
              </button>
            </div>
            <div className="pt-12 pb-10 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="px-4">
                  <div>
                    <div className="flex flex-row gap-4 mb-4">
                      <div>
                        <label
                          className="flex gap-[2px] heading-size-h3"
                          htmlFor="columns"
                        >
                          Columns
                        </label>
                        <input
                          onChange={handleColumnsInputChange}
                          defaultValue={
                            columns.length
                              ? columns.map((column) => column.name).join(", ")
                              : ""
                          }
                          className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                          type="text"
                          name="name"
                          placeholder="Size, Length, etc."
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="flex gap-[2px] heading-size-h3"
                          htmlFor="entryLabels"
                        >
                          Entry labels
                        </label>
                        <input
                          onChange={handleEntryLabelsInputChange}
                          defaultValue={
                            entryLabels.length
                              ? entryLabels
                                  .map((label) => label.name)
                                  .join(", ")
                              : ""
                          }
                          className="w-full h-9 border rounded-md outline-none mt-4 px-3 focus:border-blue"
                          type="text"
                          name="entryLabels"
                          placeholder="S, M, L, etc."
                          required
                        />
                      </div>
                    </div>
                    <button
                      onClick={createSizeChart}
                      className="px-3 h-9 w-max bg-gray2 rounded-full transition duration-300 ease-in-out hover:bg-gray3"
                    >
                      Create Size Chart
                    </button>
                  </div>
                  {showChart && (
                    <div className="mt-8 flex flex-col gap-4">
                      <div>
                        <h3 className="heading-size-h3 mb-4">Inches</h3>
                        <div className="border border-neutral-200 w-max rounded overflow-hidden">
                          <table className="w-max">
                            <thead className="h-10 border-b border-neutral-200 bg-gray">
                              <tr>
                                {columns.map((column, index) => (
                                  <th
                                    key={index}
                                    className={`font-semibold leading-5 text-[15px] text-nowrap px-5 ${
                                      index === columns.length - 1
                                        ? ""
                                        : "border-r border-neutral-200"
                                    }`}
                                  >
                                    {column.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map((entry, entryIndex) => (
                                <tr
                                  key={entryIndex}
                                  className={`h-10 ${
                                    entryIndex === entries.length - 1
                                      ? ""
                                      : " border-b border-neutral-200"
                                  }`}
                                >
                                  <td className="font-semibold leading-5 text-[15px] text-center border-r border-neutral-200 w-[100px] bg-gray">
                                    {entry.size}
                                  </td>
                                  {columns
                                    .slice(1)
                                    .map((column, columnIndex) => (
                                      <td
                                        key={columnIndex}
                                        className={`text-center w-[100px] ${
                                          columnIndex === columns.length - 2
                                            ? ""
                                            : " border-r border-neutral-200"
                                        }`}
                                      >
                                        <input
                                          className="w-full h-[37px] px-3 outline-none text-center"
                                          type="text"
                                          placeholder="0"
                                          value={
                                            measurementInputs[
                                              `${entryIndex}-${column.name}`
                                            ] !== undefined
                                              ? measurementInputs[
                                                  `${entryIndex}-${column.name}`
                                                ]
                                              : entry.measurements[
                                                  column.name as keyof typeof entry.measurements
                                                ]?.in === "0"
                                              ? ""
                                              : entry.measurements[
                                                  column.name as keyof typeof entry.measurements
                                                ]?.in || ""
                                          }
                                          onChange={handleMeasurementInputChange(
                                            entryIndex,
                                            column.name
                                          )}
                                        />
                                      </td>
                                    ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <h3 className="heading-size-h3 mb-4">Centimeters</h3>
                        <div className="border border-neutral-200 w-max rounded overflow-hidden">
                          <table className="w-max bg-white">
                            <thead className="h-10 border-b border-neutral-200 bg-gray">
                              <tr>
                                {columns.map((column, index) => (
                                  <th
                                    key={index}
                                    className={`font-semibold leading-5 text-[15px] text-nowrap px-5 ${
                                      index === columns.length - 1
                                        ? ""
                                        : "border-r border-neutral-200"
                                    }`}
                                  >
                                    {column.name}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {entries.map((entry, entryIndex) => (
                                <tr
                                  key={entryIndex}
                                  className={`h-10 ${
                                    entryIndex === entries.length - 1
                                      ? ""
                                      : " border-b border-neutral-200"
                                  }`}
                                >
                                  <td className="font-semibold leading-5 text-[15px] text-center border-r border-neutral-200 w-[100px] bg-gray">
                                    {entry.size}
                                  </td>
                                  {columns
                                    .slice(1)
                                    .map((column, columnIndex) => (
                                      <td
                                        key={columnIndex}
                                        className={`text-center w-[100px] ${
                                          columnIndex === columns.length - 2
                                            ? ""
                                            : " border-r border-neutral-200"
                                        }`}
                                      >
                                        {
                                          entry.measurements[
                                            column.name as keyof typeof entry.measurements
                                          ]?.cm
                                        }
                                      </td>
                                    ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAlert && (
        <AlertMessage
          message={alertMessage}
          hideAlertMessage={hideAlertMessage}
        />
      )}
    </>
  );
}
