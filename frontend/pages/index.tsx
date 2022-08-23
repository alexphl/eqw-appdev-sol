import type { NextPage } from "next";
import dynamic from "next/dynamic";
import useLocalStorageState from "use-local-storage-state";
import Tabs from "./Tabs";

const Home: NextPage = () => {
  // Lazy load feature tab contents
  const components = ["Charts", "Tables", "Geo"];
  const [selectedTab, setSelectedTab] = useLocalStorageState("currentTab", {
    defaultValue: 0,
  });
  const Page = dynamic(() => import("./" + components[selectedTab]));

  return (
    <>
      <div className="px-12 py-6 transform-gpu" id="app">
        <nav className="mb-6 flex content-center justify-center space-x-6">
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
