import "@r4pm/components/styles.css";
import { ObjectCentricPetriNetWorkbench, type ObjectCentricPetriNet, ViewerConfigProvider  } from "@r4pm/components";
import { wasmLayout } from "@r4pm/components/rust-layout/wasm";
import {HideToolbarButtons} from "../util/OCPN/hideToolbar";

const OcpnEditorPanel = ({
  data,
  onNetChange,

}: {
  data: ObjectCentricPetriNet;
  onNetChange: (net: ObjectCentricPetriNet) => void;
}) => {
  return (
    <ViewerConfigProvider value={{ layout: wasmLayout }}>
      <div style={{ position: "relative", height: "100%" }}>
        <ObjectCentricPetriNetWorkbench data={data} initialMode="edit" onNetChange={onNetChange} />
        <HideToolbarButtons labels={["Place", "Transition", "Layout"]} />
      </div>
    </ViewerConfigProvider>
  );
};

export default OcpnEditorPanel;