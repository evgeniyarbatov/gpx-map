# Uses uv (https://docs.astral.sh/uv) for dependency management — uv sync creates/updates .venv; run commands via uv run, no manual activation.
PYTHON := uv run python

.PHONY: install lock lab clean

install:
	@uv sync --dev

lock:
	@uv lock

lab: install
	@$(PYTHON) -m jupyter lab

clean:
	@rm -rf tests/images/esri/*
	@rm -rf tests/images/osm/*
	@rm -rf video/*.mp4
	@rm -rf .venv

