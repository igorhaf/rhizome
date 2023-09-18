import * as ReactDiagram from '@projectstorm/react-diagrams';
import {DefaultLinkModel} from "@projectstorm/react-diagrams";
import {TSCustomNodeFactory} from "./custom-node-ts/TSCustomNodeFactory"
import { TSCustomNodeModel } from './custom-node-ts/TSCustomNodeModel';

/**
 * @author Dylan Vorster
 */
export class Application {
    protected activeModel: ReactDiagram.DiagramModel;
    protected diagramEngine: ReactDiagram.DiagramEngine;

    constructor() {
        this.diagramEngine = ReactDiagram.default();
        this.newModel();
    }

    public newModel() {
        this.activeModel = new ReactDiagram.DiagramModel();

        this.diagramEngine.getNodeFactories().registerFactory(new TSCustomNodeFactory());
        //3-A) create a default node
        const node1 = new TSCustomNodeModel({ color: 'rgb(192,255,0)' });
        node1.setPosition(50, 50);

        const node2 = new TSCustomNodeModel({ color: 'rgb(0,192,255)' });
        node2.setPosition(200, 50);

        const link1 = new DefaultLinkModel();
        link1.setSourcePort(node1.getPort('out'));
        link1.setTargetPort(node2.getPort('in'));
        (link1 as DefaultLinkModel).addLabel('Custom label 1');
        this.activeModel.addAll(node1, node2, link1);
        this.diagramEngine.setModel(this.activeModel);
    }

    public getActiveDiagram(): ReactDiagram.DiagramModel {
        return this.activeModel;
    }

    public getDiagramEngine(): ReactDiagram.DiagramEngine {
        return this.diagramEngine;
    }
}