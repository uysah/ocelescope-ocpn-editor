import "@r4pm/components/styles.css";
import { ReactFlowProvider } from "@xyflow/react";
import { Editor, type PetriNetNode } from "@r4pm/components/petri";
import { Box, Button, Stack, Text, Divider, NumberInput, TextInput, Splitter, ScrollArea, Group, Select, Card, MultiSelect, SegmentedControl} from "@mantine/core";
import { DownloadIcon, PlayIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { SplitterPaneSize } from "@mantine/hooks";
import { wasmLayout } from "@r4pm/components/rust-layout/wasm";
import { useExportPetriNetPnml } from "../../api/ocpnEditor";
import {buildPetriNet, downloadFile} from "../../util/Petri Net/export_pnml";
import { buildArcSourceOptions, buildArcTargetOptions } from "../../util/Petri Net/add_arcs";
import { EditorFunction, type SelectedNode, type EditorActions } from "../../util/Petri Net/PnEditor_function";
import { EditorMode } from "../main";
import {ViewerExportFrame} from "@r4pm/components"

const PetriNetEditor = (
  {
    mode,onModeChange
  }:{
    mode:EditorMode;
    onModeChange: (mode:EditorMode) => void;
  }
) => {
  const COLLAPSED_SIZES: SplitterPaneSize[] = [75, 25];

  const [selected, setSelected] = useState<SelectedNode>(null);
  const [sizes, setSizes] = useState<SplitterPaneSize[]>(COLLAPSED_SIZES);
  const [arcSource, setArcSource] = useState<string | null>(null);
  const [arcTarget, setArcTarget] = useState<string[]>([]);
  const [arcWeight, setArcWeight] = useState(1);
  const [nodes, setNodesForToolbox] = useState<PetriNetNode[]>([]);
  const [newPlaceTokens, setNewPlaceTokens] = useState(0);
  const [newPlaceFinalTokens, setNewPlaceFinalTokens] = useState(0);
  const [newTransitionLabel, setNewTransitionLabel] = useState("Transition");

  const actionsRef = useRef<EditorActions | null>(null);



  const { mutateAsync: exportPnml} = useExportPetriNetPnml();

  const handleDownload = async () => {
    const graph = actionsRef.current?.getGraph();
    if (!graph) return;
    const net = buildPetriNet(graph.nodes, graph.edges);
    const pnml = await exportPnml({ data: net });
    downloadFile("petri-net.pnml", pnml as string, "application/xml");
  };

  const sourceOptions = buildArcSourceOptions(nodes);
  const targetOptions = buildArcTargetOptions(nodes, arcSource);
  const canAddArc = !!arcSource && arcTarget.length > 0;

  const handleAddArc = () => {
    if (!arcSource || arcTarget.length === 0) return;
    arcTarget.forEach((target) => {
      actionsRef.current?.addArc(arcSource, target, arcWeight);
    });
    setArcSource(null);
    setArcTarget([]);
    setArcWeight(1);
  };

return (
  <Splitter
    sizes={sizes}
    onSizeChange={setSizes}
    lineSize={4}
    handleColor="var(--mantine-color-default-border)"
    h={"100%"}
  >
  <Splitter.Pane defaultSize={75} min={"10%"} collapsible>
    <Stack p="xs" h="100%">
      <Group
        px="sm"
        py="xs"
        wrap="nowrap"
        justify="space-between"
        style={{ borderBottom: "2px solid var(--mantine-color-default-border)" }}
      >
        <Text fw={600} size="lg">Petri-Net Editor</Text>
        <Group>
          <Button leftSection={<DownloadIcon size={16} />} variant="default" onClick={handleDownload}>
            Export PNML
          </Button>
          <Button variant="filled" leftSection={<PlayIcon size={16}/>} onClick={()=> actionsRef.current?.runLayout()}>
            Run Layout
          </Button>
        </Group>
      </Group>

      <Box pos="relative" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <ReactFlowProvider>
          <ViewerExportFrame filename="petri-net" style={{ height: "100%" }}>
              <Editor editable showExportControls={false} relayoutOnDrag={false} initialNodes={[]} initialEdges={[]} layoutOverride={wasmLayout.petri}>
                <EditorFunction
                  onReady={(actions) => (actionsRef.current = actions)}
                  onSelectionChange={setSelected}
                  onNodesChange={setNodesForToolbox}
                />
              </Editor>
          </ViewerExportFrame>
        </ReactFlowProvider>
      </Box>
    </Stack>
  </Splitter.Pane>

    <Splitter.Pane defaultSize={25} min={"10%"} collapsible>
      <ScrollArea h="100%" type="auto">
        <Stack gap="sm" p="md">
            <Group
              px="sm"
              py="xs"
              wrap="nowrap"
              justify="space-between"
              style={{ borderBottom: "2px solid var(--mantine-color-default-border)" }}
            >
              <Text fw={600} size="lg">
                  Toolbox
              </Text>
            </Group>
            <Text fw={600} size="md">
                Editor Type
            </Text>
            <SegmentedControl
            value={mode}
            onChange={(v) => onModeChange(v as EditorMode)}
            data={[
              { label: "Object-Centric", value: "ocpn" },
              { label: "Case-Centric", value: "classic" }
            ]}
            />
            <Text fw={600} size="md">
              Add Elements
            </Text>

            <Card withBorder radius="sm" padding="sm">
              <Text fw={600} size="sm">
                New Place
              </Text>
              <Text size="xs" c="dimmed" mb="xs">
                Select the number of initial and final tokens.
              </Text>

              <NumberInput label="Initial Tokens" min={0}mb="xs" value={newPlaceTokens} onChange={(v) => setNewPlaceTokens(Number(v) || 0)} />
              <NumberInput label="Final Tokens" min={0} mb="xs" value={newPlaceFinalTokens} onChange={(v) => setNewPlaceFinalTokens(Number(v) || 0)}/>

              <Button variant="default" onClick={() => {actionsRef.current?.addPlace(newPlaceTokens,newPlaceFinalTokens)}}>
                Add place
              </Button>
            </Card>

            <Card withBorder radius="sm" padding="sm">
              <Text fw={600} size="sm">
                New Transition
              </Text>
              <Text size="xs" c="dimmed" mb="xs">
                Set the transition label.
              </Text>
              <TextInput 
                label="Label" 
                mb="xs" 
                value={newTransitionLabel}    
                onChange={(e) => setNewTransitionLabel(e.currentTarget.value)} 
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      actionsRef.current?.addTransition(newTransitionLabel)
                    }
                  }}
                />
              <Button variant="default" onClick={() => {actionsRef.current?.addTransition(newTransitionLabel)}}>
                Add transition
              </Button>
            </Card>

          <Card withBorder radius="sm" padding="sm">
            <Text fw={600} size="sm">
              New Arc
            </Text>
            <Text size="xs" c="dimmed" mb="xs">
              Set the source and target nodes.
              </Text>
            <Select
              label="From"
              placeholder="Select source"
              data={sourceOptions}
              value={arcSource}
              onChange={(value) => {
                setArcSource(value);
                setArcTarget([]);
              }}
              clearable
              searchable
            />
            <MultiSelect
              label="To"
              placeholder="Select target"
              data={targetOptions}
              value={arcTarget}
              onChange={setArcTarget}
              disabled={!arcSource}
              clearable
              searchable
            />
            <NumberInput label="Weight" min={1} mb="xs" value={arcWeight} onChange={(v) => setArcWeight(Number(v) || 1)} />
            <Button variant="default" disabled={!canAddArc} onClick={handleAddArc}>
              Add arc
            </Button>
          </Card>      

          <Divider />



          <Text fw={500} size="md">
            Selected Element
          </Text>
          {selected === null && (
            <Text size="sm" c="dimmed">
              Click a place, transition, or arc to edit it here.
            </Text>
          )}

          {selected?.type === "place" && (
            <>
              <NumberInput
                label="Tokens"
                min={0}
                value={selected.tokens}
                onChange={(newTokens) => {
                  const tokens = Number(newTokens);
                  setSelected({ ...selected, tokens });
                  actionsRef.current?.updatePlaceTokens(tokens);
                }}
              />
              <NumberInput
                label="Final Tokens"
                min={0}
                value={selected.finalTokens}
                onChange={(newFinalTokens) => {
                  const finalTokens = Number(newFinalTokens);
                  setSelected({ ...selected, finalTokens });
                  actionsRef.current?.updatePlaceFinalTokens(finalTokens);
                }}
              />
            </>
          )}
          {selected?.type === "transition" && (
            <TextInput
              label="Label"
              value={selected.label}
              onChange={(newLabel) => {
                const label = newLabel.currentTarget.value;
                setSelected({ ...selected, label });
                actionsRef.current?.updateTransitionLabel(label);
              }}
            />
          )}
          {selected !== null && (
            <>
            <Divider/>
            <Button color="red" variant="light" onClick={() => {actionsRef.current?.deleteSelected(); setSelected(null)}}>
              Delete Element
            </Button>
            </>
          )}
        </Stack>
      </ScrollArea>
    </Splitter.Pane>
  </Splitter>
);
}


export default PetriNetEditor