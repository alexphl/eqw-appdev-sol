import type { NextPage } from "next";
import Tabs from "./Tabs";
import Charts from "./Charts";
import Tables from "./Tables";
import Geo from "./Geo";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const components = [Charts, Tables, Geo];
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(Charts);

  useEffect(() => {
    setPage (components[selectedTab]);
  }, [selectedTab]);

  return (
    <>
      <div className="py-4 px-12 2xl:py-6" id="app">
        <nav className="mb-6 flex content-center justify-center space-x-6">
          <Tabs selector={[selectedTab, setSelectedTab]} />
        </nav>

        <main className="grid grid-cols-2 bg-zinc-900">
          {page}
        </main>
      </div>
    </>
  );
};

export default Home;
