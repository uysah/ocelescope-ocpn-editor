import "@r4pm/components/styles.css";
import { ObjectCentricPetriNetWorkbench, type ObjectCentricPetriNet, ViewerConfigProvider  } from "@r4pm/components";
import { wasmLayout } from "@r4pm/components/rust-layout/wasm";

const emptyNet: ObjectCentricPetriNet = {
  petri_net: { places: [], transitions: [], arcs: [], initial_marking: null, final_marking: null },
  place_object_type: {},
  place_in_out_mult: {},
};

const OcpnEditorPanel = () => {
  return (
    <ViewerConfigProvider value={{ layout: wasmLayout }}>
    <ObjectCentricPetriNetWorkbench data={emptyNet} initialMode="edit"/>
    </ViewerConfigProvider>
  );
};

export default OcpnEditorPanel;