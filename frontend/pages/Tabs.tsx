import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = (props: { selector: any; components: string[] }) => {
  const categories = props.components;
  const [selectedIndex, setSelectedIndex] = props.selector;

  return (
    <div className="w-full max-w-xs px-2 sm:px-0">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-zinc-900 p-1">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-1.5 text-sm font-bold leading-5 focus:outline-none",
                  selected
                    ? "bg-zinc-800 shadow font-extrabold text-white/[0.95]"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-white/[0.90]"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
