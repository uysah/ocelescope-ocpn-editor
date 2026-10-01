from fastapi import APIRouter
import tempfile
import os
from r4pm.petri_net import export_pnml  
from fastapi.responses import PlainTextResponse


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