import React, { useState, useEffect } from 'react';
import createEngine, {
    DiagramModel,
    DefaultNodeModel,
    DefaultPortModel,
    DefaultLinkModel,
    DefaultLinkWidget,
    DefaultDiagramState,
    DefaultLinkFactory
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { CustomCanvasWidget } from './helpers/CustomCanvasWidget';
import { LinkWidget, PointModel } from '@projectstorm/react-diagrams-core';

class AdvancedLinkModel extends DefaultLinkModel {
    constructor() {
        super({
            type: 'advanced',
            width: 4
        });
    }
}

class AdvancedPortModel extends DefaultPortModel {
    createLinkModel() {
        return new AdvancedLinkModel();
    }
}

const CustomLinkArrowWidget = (props) => {
    const { point, previousPoint } = props;

    const angle =
        90 +
        (Math.atan2(
                point.getPosition().y - previousPoint.getPosition().y,
                point.getPosition().x - previousPoint.getPosition().x
            ) *
            180) /
        Math.PI;

    return (
        <g className="arrow" transform={'translate(' + point.getPosition().x + ', ' + point.getPosition().y + ')'}>
            <g style={{ transform: 'rotate(' + angle + 'deg)' }}>
                <g transform={'translate(0, -3)'}>
                    <polygon
                        points="0,10 8,30 -8,30"
                        fill={props.color}
                        data-id={point.getID()}
                        data-linkid={point.getLink().getID()}
                    />
                </g>
            </g>
        </g>
    );
};

class AdvancedLinkWidget extends DefaultLinkWidget {
    generateArrow(point, previousPoint) {
        return (
            <CustomLinkArrowWidget
                key={point.getID()}
                point={point}
                previousPoint={previousPoint}
                colorSelected={this.props.link.getOptions().selectedColor}
                color={this.props.link.getOptions().color}
            />
        );
    }

    render() {
        const points = this.props.link.getPoints();
        const paths = [];

        for (let j = 0; j < points.length - 1; j++) {
            paths.push(
                this.generateLink(
                    LinkWidget.generateLinePath(points[j], points[j + 1]),
                    {
                        'data-linkid': this.props.link.getID(),
                        'data-point': j,
                        onMouseDown: (event) => {
                            this.addPointToLink(event, j + 1);
                        }
                    },
                    j
                )
            );
        }

        for (let i = 1; i < points.length - 1; i++) {
            paths.push(this.generatePoint(points[i]));
        }

        if (this.props.link.getTargetPort() !== null) {
            paths.push(this.generateArrow(points[points.length - 1], points[points.length - 2]));
        } else {
            paths.push(this.generatePoint(points[points.length - 1]));
        }

        return <g data-default-link-test={this.props.link.getOptions().testName}>{paths}</g>;
    }
}

class AdvancedLinkFactory extends DefaultLinkFactory {
    constructor() {
        super('advanced');
    }

    generateModel() {
        return new AdvancedLinkModel();
    }

    generateReactWidget(event) {
        return <AdvancedLinkWidget link={event.model} diagramEngine={this.engine} />;
    }
}

export default function DiagramComponent() {
    const [engine] = useState(() => {
        const eng = createEngine();
        eng.setModel(new DiagramModel());  // Set model here
        eng.getLinkFactories().registerFactory(new AdvancedLinkFactory());
        return eng;
    });

    useEffect(() => {
        const state = engine.getStateMachine().getCurrentState();
        if (state instanceof DefaultDiagramState) {
            state.dragNewLink.config.allowLooseLinks = false;
        }

        const model = engine.getModel();

        const node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
        const port1 = node1.addPort(new AdvancedPortModel(false, 'out'));
        node1.setPosition(100, 100);

        const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
        const port2 = node2.addPort(new AdvancedPortModel(true, 'in'));
        node2.setPosition(400, 100);

        const link1 = port1.link(port2);

        const node3 = new DefaultNodeModel('Node 3', 'rgb(0,192,255)');
        node3.addOutPort('Out');
        node3.setPosition(100, 200);

        model.addAll(node1, node2, node3, link1);
    }, [engine]);

    return (
        <CustomCanvasWidget>
            <CanvasWidget engine={engine} />
        </CustomCanvasWidget>
    );
}
