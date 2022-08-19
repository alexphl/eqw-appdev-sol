import type { NextPage } from 'next'
import Head from 'next/head'
import Tabs from "./Tabs";

const Home: NextPage = () => {
  return (
    <>
      <div className="py-4 px-12 2xl:py-6" id="app">
        <nav className="mb-6 flex content-center justify-center space-x-6">
          <Tabs />
        </nav>

        <main className="grid grid-cols-2 bg-zinc-900">CONTENT</main>
      </div>
    </>
  )
}

export default Home
