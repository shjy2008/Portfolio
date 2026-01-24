import { useState } from 'react'
import './App.css'
import SearchEngine from "./SearchEngine/SearchEngine";

const ip: string = "127.0.0.1";
const port: string = "8080";
const url: string = "http://" + ip + ":" + port;


function App() {
  return (
    <>
      <p className="read-the-docs">
        SearchEngine:
      </p>
      {/* <SearchEngine */}
      <SearchEngine backendUrl = {url} />
    </>
  )
}

export default App
