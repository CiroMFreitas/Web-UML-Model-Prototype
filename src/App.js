import { useEffect, useState } from "react";
import ClassDiagramCanvas from "./Components/ClassDiagramCanvas/ClassDiagramCanvas";
import CommandPanel from "./Components/CommandPanel/CommandPanel";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    setCommands(prevCommands => {
      return [prevCommands,
        { id: uuidv4(), line: "Command 1" },
        { id: uuidv4(), line: "Command 2" }]
    });
  }, [])

  return (
    <>
      <ClassDiagramCanvas />
      <CommandPanel commands={ commands } />
    </>
  );
}

export default App;
