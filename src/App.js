import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";
import { CommandHandlerProvider } from "./Contexts/CommandHandlerContext";

function App() {

  return (
    <div id="app">
      <CommandHandlerProvider>
        <ClassDiagramCanvas />
        <CommandPanel />
      </CommandHandlerProvider>
    </div>
  );
}

export default App;
