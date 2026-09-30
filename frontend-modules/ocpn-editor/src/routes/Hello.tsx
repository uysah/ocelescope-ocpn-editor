import "@r4pm/components/styles.css";

import { Box, Button, Stack, Text, Splitter, ScrollArea, Group } from "@mantine/core";
import { DownloadIcon } from "lucide-react";
import { lazy, useEffect, useState } from "react";
import type { SplitterPaneSize } from "@mantine/hooks";
const OcpnEditorPanel = lazy(() => import("./OcpnEditorPanel"));


const Editor = () => {
  const [mounted, setMounted] = useState(false);
  const COLLAPSED_SIZES: SplitterPaneSize[] = [75, 25];
  const [sizes, setSizes] = useState<SplitterPaneSize[]>(COLLAPSED_SIZES);

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
            <OcpnEditorPanel/>
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
          </Stack>
        </ScrollArea>
      </Splitter.Pane>
    </Splitter>
  );
};

export default Editor;