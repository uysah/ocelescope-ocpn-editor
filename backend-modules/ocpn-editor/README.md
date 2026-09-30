# OCPN Editor

An OCPN Editor

An [Ocelescope](https://www.ocelescope.org) backend module. It is a FastAPI app
that `ocelescope-backend` discovers through the `ocelescope_backend.modules`
entry point in `pyproject.toml` and serves under `/modules/ocpnEditor/v1`.

- `src/ocelescope_module_ocpn_editor/module.py` — module class `OCPNEditor` (key `ocpnEditor`)
- `src/ocelescope_module_ocpn_editor/routes.py` — API routes

Install it next to `ocelescope-backend` (e.g. as a uv workspace member of an
Ocelescope module project) and run `ocelescope-backend serve`.

## Updating from the template

This module was generated with [Copier](https://copier.readthedocs.io). To pull
in later changes from the template, commit your work and run in this folder:

```sh
uvx copier update
```
