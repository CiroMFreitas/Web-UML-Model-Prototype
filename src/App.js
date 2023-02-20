import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";
import { CommandHandlerProvider } from "./Contexts/CommandHandlerContext";
import { Suspense } from "react";

function App() {

  return (
    <Suspense fallback="Loading... ">
      <div id="app">
        <CommandHandlerProvider>
          <ClassDiagramCanvas />
          <CommandPanel />
        </CommandHandlerProvider>
      </div>
    </Suspense>
  );
}

export default App;
