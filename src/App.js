import { ParentSizeModern } from "@visx/responsive";
import { Canvas } from "./Canvas";

function App() {
  return (
    <div className="App">
      <ParentSizeModern>
        {({ width, height }) => <Canvas {...{ width, height }} />}
      </ParentSizeModern>
    </div>
  );
}

export default App;
