from ocelescope.resource.default.petri_net import Arc, ArcType, PetriNet, Place, Transition
from ocelescope_module_ocpn_editor.model.input_ocpn import OcpnExportRequest


def convert_to_PN(ocpn: OcpnExportRequest) -> PetriNet:
    net = ocpn.petri_net
    object_types = ocpn.place_object_type
    in_out_mult = ocpn.place_in_out_mult if ocpn.place_in_out_mult is not None else {}

    ocpn = PetriNet()

    for place in net.places:
        ocpn.add_place(Place(name=place.id, object_type=object_types[place.id]))

    for transition in net.transitions:
        ocpn.add_transition(Transition(name=transition.id, label=transition.label))

    place_ids = {place.name for place in ocpn.places}

    def is_variable(source: str, target: str) -> bool:
        if source in place_ids:
            _, outgoing = in_out_mult.get(source, ({}, {}))
            return bool(outgoing.get(target))
        incoming, _ = in_out_mult.get(target, ({}, {}))
        return bool(incoming.get(source))

    for arc in net.arcs:
        source, target = arc.nodes
        ocpn.add_arc(
            Arc(
                source=source,
                target=target,
                type=ArcType.VARIABLE if is_variable(source, target) else ArcType.NORMAL,
                weight=arc.weight if arc.weight is not None else 1,
            )
        )

    ocpn.initial_marking = dict(net.initial_marking if net.initial_marking is not None else {})
    ocpn.final_marking = dict(net.final_marking if net.final_marking is not None else {})

    return ocpn