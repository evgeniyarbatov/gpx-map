# Uses uv (https://docs.astral.sh/uv) for dependency management — uv sync creates/updates .venv; run commands via uv run, no manual activation.
DATA_ROOT ?= $(HOME)/data
REPO_NAME := $(notdir $(CURDIR))
DATA_DIR  ?= $(DATA_ROOT)/$(REPO_NAME)

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
	@rm -rf $(DATA_DIR)/video/*.mp4
	@rm -rf .venv

