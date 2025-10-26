import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrowserWindow from "@/components/BrowserWindow";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BrowserWindow />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;