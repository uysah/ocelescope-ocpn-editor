import type { ObjectCentricPetriNet } from "@r4pm/components";

const nextId = (existingIds: string[], prefix: string) => {
  const used = existingIds
    .filter((id) => id.startsWith(prefix))
    .map((id) => parseInt(id.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = used.length ? Math.max(...used) + 1 : 0;
  return `${prefix}${next}`;
};

export const addPlace = (
  net: ObjectCentricPetriNet,
  objectType: string,
  tokens: number,
  finalTokens: number,
): ObjectCentricPetriNet => {
  const id = nextId(net.petri_net.places.map((p) => p.id), "p");
  const initial = { ...(net.petri_net.initial_marking ?? {}) };
  const final = { ...(net.petri_net.final_marking ?? {}) };
  if (tokens > 0) initial[id] = tokens;
  if (finalTokens > 0) final[id] = finalTokens;

  return {
    ...net,
    petri_net: {
      ...net.petri_net,
      places: [...net.petri_net.places, { id }],
      initial_marking: Object.keys(initial).length ? initial : null,
      final_marking: Object.keys(final).length ? final : null,
    },
    place_object_type: { ...net.place_object_type, [id]: objectType },
    place_in_out_mult: { ...net.place_in_out_mult, [id]: [{}, {}] },
  };
};