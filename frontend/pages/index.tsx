import type { NextPage } from "next";
import Tabs from "./Tabs";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const components = ['Charts', 'Tables', 'Geo'];
  const [selectedTab, setSelectedTab] = useState(0);
  const [pagePath, setPagePath] = useState(components[selectedTab]);

  var Page = dynamic(() => import("./" + pagePath));

  useEffect(() => {
    setPagePath(components[selectedTab]);
  }, [selectedTab]);

  return (
    <>
      <div className="py-4 px-12 2xl:py-6" id="app">
        <nav className="mb-6 flex content-center justify-center space-x-6">
          <Tabs selector={[selectedTab, setSelectedTab]} />
        </nav>

        <main className="grid grid-cols-2 bg-zinc-900">
          <Page />
        </main>
      </div>
    </>
  );
};

export default Home;
