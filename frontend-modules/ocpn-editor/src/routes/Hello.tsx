import "@r4pm/components/styles.css";
import type { ObjectCentricPetriNet } from "@r4pm/components";
import { Box, Button, Stack, Text, Splitter, ScrollArea, Group, Card, TextInput, NumberInput } from "@mantine/core";
import { DownloadIcon } from "lucide-react";
import { lazy, useEffect, useState } from "react";
import type { SplitterPaneSize } from "@mantine/hooks";
import { addPlace } from "../util/editor_functions";

const OcpnEditorPanel = lazy(() => import("./OcpnEditorPanel"));

const emptyNet: ObjectCentricPetriNet = {
  petri_net: { places: [], transitions: [], arcs: [], initial_marking: null, final_marking: null },
  place_object_type: {},
  place_in_out_mult: {},
};

const Editor = () => {
  const [mounted, setMounted] = useState(false);
  const COLLAPSED_SIZES: SplitterPaneSize[] = [75, 25];
  const [sizes, setSizes] = useState<SplitterPaneSize[]>(COLLAPSED_SIZES);
  const [net, setNet] = useState<ObjectCentricPetriNet>(emptyNet);
  const [seedNet, setSeedNet] = useState<ObjectCentricPetriNet>(emptyNet);
  const [newPlaceObjectType, setNewPlaceObjectType] = useState("");
  const [newPlaceTokens, setNewPlaceTokens] = useState(0);
  const [newPlaceFinalTokens, setNewPlaceFinalTokens] = useState(0);
  const [remountKey, setRemountKey] = useState(0);

  const handleAddPlace = () => {
    if (!newPlaceObjectType) return;
    const updated = addPlace(net, newPlaceObjectType, newPlaceTokens, newPlaceFinalTokens);
    setSeedNet(updated);
    setRemountKey((k) => k + 1);
    setNewPlaceTokens(0);
    setNewPlaceFinalTokens(0);
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;



  return (
    <Splitter
      sizes={sizes}
      onSizeChange={setSizes}
      lineSize={4}
      handleColor="var(--mantine-color-default-border)"
      h={"100%"}
    >
      <Splitter.Pane defaultSize={75} min={"10%"} collapsible>
        <Stack gap={"sm"} p="xs" h="100%">
          <Group
            px="sm"
            py="xs"
            wrap="nowrap"
            justify="space-between"
            style={{ borderBottom: "2px solid var(--mantine-color-default-border)" }}
          >
            <Text fw={600} size="lg">
              OCPN Editor
            </Text>
            <Button leftSection={<DownloadIcon size={16} />} variant="default">
              Download
            </Button>
          </Group>
          <Box pos="relative" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <OcpnEditorPanel key={remountKey} data={seedNet} onNetChange={setNet} />
          </Box>
        </Stack>
      </Splitter.Pane>

      <Splitter.Pane defaultSize={25} min={"10%"} collapsible>
        <ScrollArea h="100%" type="auto">
          <Stack gap="sm" p="md">
            <Group
                px="sm"
                py="xs"
                mb={"xs"}
                wrap="nowrap"
                justify="space-between"
                style={{ borderBottom: "2px solid var(--mantine-color-default-border)" }}
              >
              <Text fw={600} size="lg">
                Toolbox
              </Text>
            </Group>
            <Card withBorder radius="sm" padding="sm">
            <Text fw={600} size="sm">
              New Place
            </Text>
            <Text size="xs" c="dimmed" mb="xs">
              Set the object type, initial, and final marking.
            </Text>
            <TextInput label="Object Type" mb="xs" value={newPlaceObjectType} onChange={(e) => setNewPlaceObjectType(e.currentTarget.value)}/>
            <NumberInput label="Initial Tokens" mb="xs" value={newPlaceTokens} onChange={(v) => setNewPlaceTokens(Number(v)|| 0)}/>
            <NumberInput label="Final Tokens" mb="xs" value={newPlaceFinalTokens} onChange={(v) => setNewPlaceTokens(Number(v)|| 0)}/>
            <Button variant="default" disabled={!newPlaceObjectType} onClick={handleAddPlace}>
              Add Place
            </Button>
          </Card>

          </Stack>
        </ScrollArea>
      </Splitter.Pane>
    </Splitter>
  );
};

export default Editor;