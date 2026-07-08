VENV_PATH := .venv

PYTHON := $(VENV_PATH)/bin/python
PIP := $(VENV_PATH)/bin/pip
REQUIREMENTS := requirements.txt

venv:
	@uv venv $(VENV_PATH)

install: venv
	@uv pip install -q -r $(REQUIREMENTS)

lab:
	@$(PYTHON) -m jupyter lab

clean:
	@rm -rf tests/images/esri/*
	@rm -rf tests/images/osm/*
	@rm -rf video/*.mp4
	@rm -rf \
	@rm -rf $(VENV_PATH)

cleanvenv:
	@rm -rf $(VENV_PATH)
