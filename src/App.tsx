
import './App.css';
import {
  DiagramComponent,
  DataBinding,
  MindMap,
  Inject,
  LayoutModel, NodeModel, ConnectorModel
} from '@syncfusion/ej2-react-diagrams';
import {DataManager} from '@syncfusion/ej2-data';
import { useRef } from 'react';
import {mindMapData} from './data';

function App() {
  const dataManager = new DataManager(mindMapData);
  const layout : LayoutModel = {
    type : 'MindMap',
    orientation : 'Horizontal',//'Vertical'
    verticalSpacing : 50, horizontalSpacing : 50 //40 (_For_Vertical_)
  }

  /**
   * 
   * @param node - NodeModel
   * @returns 
   */
  const getNodeDefaults = (node : NodeModel) =>{
    node.height = 40;
    node.width = 110;
    const branch = (node.data as any).branch;
    node.annotations = [{ content : (node.data as any).Label, style:{color:"white"} }]
    if( branch == "Root" || branch =="Left" || branch=="Right"){
      node.shape = branch != "Root" ? { type : "Basic", shape : "Ellipse"} : 
      { type : "Path", data : `M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z`}
      node.style = { fill: branch !="Root" ?"#F39C12" : "#E74C3C", strokeWidth:0}
    }
    else{
      node.style = { fill : branch=="subRight" ? "#8E44AD" : "#3498DB", strokeWidth:0}
    }
    node.ports = [
      {id:'port1', offset:{x:0, y:0.5}},
      {id:'port2', offset:{x:1, y:0.5}},
      //{id:'port1', offset:{y:0, y:0.5}},
      //{id:'port2', offset:{y:1, y:0.5}}
    ]
    node.expandIcon = { shape : "Minus"}
    node.collapseIcon = { shape : "Plus"}
    return node;
  }
  /**
   * 
   * @param connector - ConnectorModel
   * @param diagram - DiagramComponent (Ej2 Diagram Instance)
   * @returns 
   */
  const getConnectorDefaults = (connector: ConnectorModel, diagram: DiagramComponent) => {
    connector.type = "Bezier";
    connector.targetDecorator = { shape: "None" };
    connector.style = { strokeWidth: 3 };

    if (connector.sourceID && connector.targetID) {
      const sourceNode = diagram.getObject(connector.sourceID) as NodeModel | null;
      const targetNode = diagram.getObject(connector.targetID) as NodeModel | null;
  
      // Ensure sourceNode and targetNode are not null
      if (sourceNode && targetNode) {
        const branch = (targetNode as any).data.branch;
  
        // Ensure nodes have the required ports
        if (sourceNode.ports && sourceNode.ports.length > 1 && targetNode.ports && targetNode.ports.length > 1) {
          if (branch === "Left" || branch === "subLeft") {
            connector.style.strokeColor = "#3498DB";
            connector.sourcePortID = sourceNode.ports[0].id;
            connector.targetPortID = targetNode.ports[1].id;
          } else if (branch === "Right" || branch === "subRight") {
            connector.style.strokeColor = "#8E44AD";
            connector.sourcePortID = sourceNode.ports[1].id;
            connector.targetPortID = targetNode.ports[0].id;
          }
        }
      }
    }
    return connector;
  }
  return (
    <div>
      <DiagramComponent
        height={"720px"}
        width={"100%"}
        dataSourceSettings={{
          id : 'id',
          parentId : 'parentId',
          dataManager : dataManager
        }}
        layout = {layout}
        getNodeDefaults={getNodeDefaults}
        getConnectorDefaults={getConnectorDefaults}
      >
        <Inject services={[MindMap, DataBinding]}></Inject>
      </DiagramComponent>
      
    </div>
  );
}

export default App;
