import './App.css';
import { BodyWidget } from './components/helpers/BodyWidget';
import WebLayout from "./components/layout/WebLayout";
import {Application} from "./components/Application";

function App() {
    return (
        <div>
            <WebLayout />
           {/* var app = new Application();
            return <BodyWidget app={app} />;*/}
        </div>
    );
}

export default App;
