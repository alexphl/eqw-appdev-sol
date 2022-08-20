import type { NextPage } from "next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Tabs from "./Tabs";

const Home: NextPage = () => {
  // Lazy load feature tab contents
  const components = ["Charts", "Tables", "Geo"];
  const [selectedTab, setSelectedTab] = useState(0);
  const [pagePath, setPagePath] = useState(components[selectedTab]);
  
  var Page = dynamic(() => import("./" + pagePath)); // Component page

  useEffect(() => {
    setPagePath(components[selectedTab]);
  }, [selectedTab]);

  return (
    <>
      <div className="py-4 px-12 2xl:py-6" id="app">
        <nav className="mb-6 flex content-center justify-center space-x-6">
          <Tabs components={components} selector={[selectedTab, setSelectedTab]} />
        </nav>

        <main>
          <Page />
        </main>
      </div>
    </>
  );
};

export default Home;
