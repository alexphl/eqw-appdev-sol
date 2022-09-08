import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Tab navigation panel
 **/
const Tabs = (props: { selector: [number, any]; components: string[] }) => {
  const categories = props.components;
  const [selectedIndex, setSelectedIndex] = props.selector;

  return (
    <div className="w-full max-w-xs px-2 sm:px-0">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 backdrop-blur-2xl backdrop-saturate-200 rounded-xl bg-black/[0.4] p-1 shadow-xl">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-1.5 text-sm font-bold leading-5 focus:outline-none",
                  selected
                    ? "bg-white/[0.1] shadow font-extrabold text-white/[0.95]"
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
