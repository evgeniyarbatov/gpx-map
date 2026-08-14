# Uses uv (https://docs.astral.sh/uv) for dependency management — uv sync creates/updates .venv; run commands via uv run, no manual activation.
DATA_ROOT ?= $(HOME)/Documents/data
REPO_NAME := $(notdir $(CURDIR))
DATA_DIR  ?= $(DATA_ROOT)/$(REPO_NAME)

PYTHON := uv run python

.PHONY: install lock lab run video clean

install:
	@uv sync --dev

lock:
	@uv lock

lab: install
	@$(PYTHON) -m jupyter lab

run:
	@npm install
	@npm run start

video:
	@test -n "$(GPX)" || (echo "usage: make video GPX=/path/to/track.gpx" >&2; exit 2)
	@$(MAKE) install
	@npm install
	@DATA_DIR="$(DATA_DIR)" ./scripts/make_video.sh "$(GPX)"

clean:
	@rm -rf tests/images/esri/*
	@rm -rf tests/images/osm/*
	@rm -rf $(DATA_DIR)/video/*.mp4
	@rm -rf .venv

