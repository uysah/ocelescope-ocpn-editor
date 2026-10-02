from pydantic import BaseModel


class InputPlace(BaseModel):
    id: str


class InputTransition(BaseModel):
    id: str
    label: str | None = None


class InputArc(BaseModel):
    nodes: tuple[str, str]
    weight: int | None = None


class InputOCPN(BaseModel):
    places: list[InputPlace]
    transitions: list[InputTransition]
    arcs: list[InputArc]
    initial_marking: dict[str, int] | None = None
    final_marking: dict[str, int] | None = None


class OcpnExportRequest(BaseModel):
    petri_net: InputOCPN
    place_object_type: dict[str, str]
    place_in_out_mult: dict[str, tuple[dict[str, bool], dict[str, bool]]] | None = None