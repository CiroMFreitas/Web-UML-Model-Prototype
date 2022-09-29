import { useState } from "react";
import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";

function App() {
  const [commands, setCommands] = useState([]);

  //Onload actions
  /*useEffect(() => {
    return "nothing for now"
  }, []);*/

  return (
    <>
      <ClassDiagramCanvas />
      <CommandPanel commands={ commands } setCommands={ setCommands }/>
    </>
  );
}

export default App;
