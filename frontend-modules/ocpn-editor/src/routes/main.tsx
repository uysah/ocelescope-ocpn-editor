import { lazy, Suspense, useState } from "react";
import { Center, Loader } from "@mantine/core";

const PetriNetEditor = lazy(() => import("./PNEditor"));
const OcpnEditor = lazy(() => import("./OCPNEditor"));

export type EditorMode = "classic" | "ocpn";

const Editor = () => {
  const [mode, setMode] = useState<EditorMode>("ocpn");

  return (
    <Suspense
      fallback={
        <Center h="100%">
          <Loader />
        </Center>
      }
    >
      {mode === "classic" ? (
        <PetriNetEditor mode={mode} onModeChange={setMode} />
      ) : (
        <OcpnEditor mode={mode} onModeChange={setMode} />
      )}
    </Suspense>
  );
};

export default Editor