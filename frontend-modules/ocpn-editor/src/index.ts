import { defineModule, defineModuleRoute } from "@ocelescope/core";
import { SparklesIcon } from "lucide-react";
import Editor from "./routes/Editor";

export const OCPNEditor = defineModuleRoute({
  component: Editor,
  label: "Event Log Editor",
  name: "Event Log Editor",
  requiresOcel: false,
});


export default defineModule({
  name: "ocpnEditor",
  label: "OCPN Editor",
  description: "An OCPN Editor",
  authors: [{ name: "Uy Sa Huynh" }],
  icon: SparklesIcon,
  routes: [OCPNEditor],
});
