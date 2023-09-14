import "./weblayout.css";
import {Component} from "react";
import {Button} from "@blueprintjs/core";
import { Colors } from "@blueprintjs/core";

class WebLayout extends Component {
    render() {
        return (
            <div>
                <body>
                <header class="page-header" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY4 }}>
                    <h1>Header</h1>
                </header>

                <main class="page-content">
                    <nav class="content-navigation" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY5 }}>
                        <h1>Navigation</h1>
                    </nav>
                    <article class="content-article" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY2 }}>
                        <h1><Button intent="success" text="Clique em mim!" /></h1>
                    </article>
                    <aside class="content-sidebar" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY5 }}>
                        <h1>Sidebar</h1>
                    </aside>
                </main>

                <footer class="page-footer">
                    <h1>Footer</h1>
                </footer>
                </body>
            </div>
        );
    }
}

export default WebLayout;