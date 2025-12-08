VENV_PATH := .venv

PYTHON := $(VENV_PATH)/bin/python
PIP := $(VENV_PATH)/bin/pip
REQUIREMENTS := requirements.txt

venv:
	@python3 -m venv $(VENV_PATH)

install: venv
	@$(PIP) install --disable-pip-version-check -q --upgrade pip
	@$(PIP) install --disable-pip-version-check -q -r $(REQUIREMENTS)

lab:
	@$(PYTHON) -m jupyter lab

clean:
	@rm -rf tests/images/esri/*
	@rm -rf tests/images/osm/*
	@rm -rf video/*.mp4
	@rm -rf \
	@rm -rf $(VENV_PATH)
