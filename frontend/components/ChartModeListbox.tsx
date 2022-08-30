import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

/**
 * Chart mode selection listbox
 **/
const ChartModeListbox = (props: {
  selected: string;
  chartController: [any, any];
  id: number;
  cleanupFunc: Function;
}) => {
  const modes = ["Events", "Stats"];
  const [selected, setSelected] = useState(props.selected);

  // Checks if chart mode has to be updated
  useEffect(() => {
    const [charts, setCharts] = props.chartController;
    const setChartMode = (id: number, mode: string) => {
      const index = charts.findIndex(
        (chart: { id: number }) => chart.id === id
      );
      console.log("Setting Chart " + id + " mode to " + mode);

      if (index > -1) {
        let newArr = [...charts];
        newArr[index]["mode"] = mode;
        setCharts(newArr);
      }

      // Clear chart local storage
      props.cleanupFunc(id);

      return mode;
    };

    if (selected === props.selected) return;
    setChartMode(props.id, selected);
  }, [selected, props]);

  return (
    <div className="w-max font-bold text-zinc-300 self-center text-sm z-50 -ml-0.5">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg hover:bg-white/[0.06] py-1 pl-2 pr-6 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
            <span className="block truncate">{selected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
              <SelectorIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-max overflow-auto rounded-lg backdrop-blur-2xl bg-zinc-300/[0.05] py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {modes.map((mode: string) => (
                <Listbox.Option
                  key={mode}
                  className={({ active }) =>
                    `relative z-99 cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-100/[0.08] text-teal-200" : "text-white"
                    }`
                  }
                  value={mode}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {"Plot daily " + mode.toLowerCase()}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default ChartModeListbox;
