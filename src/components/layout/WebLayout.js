import "./weblayout.css";
import React, {Component} from 'react';
import axiosInstance from '../../api/axiosInstance';
import {Menu, MenuItem} from "@blueprintjs/core";
import { Colors } from "@blueprintjs/core";
import DiagramComponent from "../DiagramCanva"



class WebLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operations: [],
            loading: true,
            error: null
        };
    }
    async componentDidMount() {
        try {
            const response = await axiosInstance.get('/operations');  // TODO: substitua pelo endpoint correto
            this.setState({
                operations: response.data,
                loading: false
            });
        } catch (error) {
            this.setState({
                error: error.message,
                loading: false
            });
        }
    }

    //diagram

    render() {
        const { loading, error, operations } = this.state;
        return (
            <div>
                <body>
                <header className="page-header" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY4 }}>
                    <h1>Header</h1>
                </header>

                <main className="page-content">
                    <nav className="content-navigation" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY5 }}>
                        <Menu roleStructure="listoption" class="content-navigation" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY5, minWidth:0 }} small={true}>
                            {loading && <p>Carregando...</p>}
                            {error && <p>Erro: {error}</p>}
                            {operations.map(operations => (
                                <MenuItem icon={operations.icon} text={operations.name} />
                            ))}
                           {/* <MenuDivider />
                            <MenuItem text="Settings..." icon="cog" intent="primary">
                                <MenuItem icon="tick" text="Save on edit" />
                                <MenuItem icon="blank" text="Compile on edit" />
                            </MenuItem>*/}
                        </Menu>
                    </nav>
                    <article className="content-article" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY2 }}>
                        <DiagramComponent />
                    </article>
                    <aside className="content-sidebar" style={{ color: Colors.LIGHT_GRAY1, background: Colors.DARK_GRAY5 }}>
                        <h1>Sidebar</h1>
                    </aside>
                </main>

                <footer className="page-footer">
                    <h1>Footer</h1>
                </footer>
                </body>
            </div>
        );
    }
}

export default WebLayout;