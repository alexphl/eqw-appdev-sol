import type { NextPage } from "next";
import dynamic from "next/dynamic";
import useLocalStorageState from "use-local-storage-state";
import Tabs from "../components/Tabs";

const Home: NextPage = () => {
  // Lazy load feature tab contents
  const components = ["Charts", "Tables", "Maps"];
  const [selectedTab, setSelectedTab] = useLocalStorageState("currentTab", {
    defaultValue: 0,
  });
  const Page = dynamic(() => import("../components/" + components[selectedTab]));

  return (
    <>
      <div className="transform-gpu transition-all" id="app">
        <nav className="py-7 flex content-center justify-center space-x-6 top-0 w-screen absolute z-50">
          <Tabs
            components={components}
            selector={[selectedTab, setSelectedTab]}
          />
        </nav>

        <main className="transform-gpu transition-all">
          <Page />
        </main>
      </div>
    </>
  );
};

export default Home;
