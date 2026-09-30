import type { OcelescopeConfig } from "@ocelescope/core";
import management from "@ocelescope/management";
import ocpnEditorModule from "@instance/ocpn-editor";

// `pnpm run add:frontend` adds local frontend modules here.
export default {
	modules: [management, ocpnEditorModule],
} satisfies OcelescopeConfig;
