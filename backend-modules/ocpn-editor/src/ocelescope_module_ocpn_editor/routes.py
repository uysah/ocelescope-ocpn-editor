from fastapi import APIRouter, UploadFile
import tempfile
import os
from r4pm.petri_net import export_pnml  
from fastapi.responses import PlainTextResponse
from ocelescope_module_ocpn_editor.util.convert_format import convert_to_PN, convert_from_PN
from ocelescope_module_ocpn_editor.model.editor_ocpn import OcpnExportRequest, OcpnImportResponse
from ocelescope import PetriNet


router = APIRouter()


@router.post("/petri-net/export/pnml", operation_id="exportPetriNetPnml")
def export_petri_net_pnml(net: dict) -> PlainTextResponse:
    with tempfile.NamedTemporaryFile(suffix=".pnml", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        export_pnml(net, tmp_path)
        with open(tmp_path, "r", encoding="utf-8") as f:
            pnml_text = f.read()
    finally:
        os.unlink(tmp_path)

    return PlainTextResponse(content=pnml_text)


@router.post("/ocpn/export/ocelescope", operation_id="exportOCPN")
def export_ocpn(ocpn: OcpnExportRequest) -> PlainTextResponse:
    pnet = convert_to_PN(ocpn)

    with tempfile.NamedTemporaryFile(suffix=".ocelescope", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        written_path = pnet.write(tmp_path)
        with open(written_path, "r", encoding="utf-8") as f:
            content = f.read()
    finally:
        os.unlink(written_path)

    return PlainTextResponse(content=content)


@router.post("/ocpn/import/ocelescope", operation_id="importOCPN")
async def import_ocpn(file: UploadFile) -> OcpnImportResponse:
    input = await file.read()
    pnet = PetriNet.model_validate_json(input)
    return convert_from_PN(pnet)