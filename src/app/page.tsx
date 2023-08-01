"use client"

import ClassDiagramCanvas from "../../Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "../../Components/CommandPanel/CommandPanel";
import { CommandHandlerProvider } from "../../Contexts/CommandHandlerContext";

export default function Home() {
  return (
    <div>
      <CommandHandlerProvider>
        <ClassDiagramCanvas />
        <CommandPanel />
      </CommandHandlerProvider>
    </div>
  )
}