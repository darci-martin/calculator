import {Calculator} from "./components/Calculator";
import './App.css';

function App() {

  //Key press on the document is captured. 
  //App component, can capture the keydowns and then do something with them. Then update the State with whatever is in the keystroke.

  return (
        <Calculator />
  );
}

export default App;
