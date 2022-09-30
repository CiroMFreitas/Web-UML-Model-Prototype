import { useState } from "react";
import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";

function App() {
  const [handledCommands, setHandledCommands] = useState([]);

  //Onload actions
  /*useEffect(() => {
    return "nothing for now"
  }, []);*/

  return (
    <>
      <ClassDiagramCanvas handledCommands={ handledCommands } setHandledCommands={ setHandledCommands } />
      <CommandPanel handledCommands={ handledCommands } setHandledCommands={ setHandledCommands } />
    </>
  );
}

export default App;
