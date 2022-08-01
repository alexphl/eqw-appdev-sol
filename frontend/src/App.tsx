import { useState } from "react";
import Tabs from "./Tabs";

function App() {
  return (
    <>
      <div className="py-2 px-12 lg:px-10 lg:py-6" id="app">
        <nav className="mb-6 flex content-center justify-center space-x-6">
          <Tabs />
        </nav>

        <main className="grid grid-cols-2"></main>
      </div>
    </>
  );
}

export default App;
