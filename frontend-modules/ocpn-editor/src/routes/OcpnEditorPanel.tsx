import "@r4pm/components/styles.css";
import { ObjectCentricPetriNetWorkbench, type ObjectCentricPetriNet, ViewerConfigProvider  } from "@r4pm/components";
import { wasmLayout } from "@r4pm/components/rust-layout/wasm";

const OcpnEditorPanel = ({
  data,
  onNetChange,
}: {
  data: ObjectCentricPetriNet;
  onNetChange: (net: ObjectCentricPetriNet) => void;
}) => {
  return (
    <ViewerConfigProvider value={{ layout: wasmLayout }}>
      <ObjectCentricPetriNetWorkbench data={data} initialMode="edit" onNetChange={onNetChange} />
    </ViewerConfigProvider>
  );
};

export default OcpnEditorPanel;