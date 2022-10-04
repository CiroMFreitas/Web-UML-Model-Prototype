import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";
import { HandledCommandsProvider } from "./Contexts/HandledCommandContext";

function App() {

  //Onload actions
  /*useEffect(() => {
    return "nothing for now"
  }, []);*/

  return (
    <div>
      <HandledCommandsProvider>
        <ClassDiagramCanvas />
        <CommandPanel />
      </HandledCommandsProvider>
    </div>
  );
}

export default App;
