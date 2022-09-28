import { useState } from "react";
import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";

function App() {
  const [commands, setCommands] = useState([]);

  return (
    <>
      <ClassDiagramCanvas />
      <CommandPanel commands={ commands } />
    </>
  );
}

export default App;
