PROJECT_NAME := $(shell basename $(PWD))
VENV_PATH = ~/.venv/$(PROJECT_NAME)

venv:
	@python3 -m venv $(VENV_PATH)

install: venv
	@source $(VENV_PATH)/bin/activate && \
	pip install --disable-pip-version-check -q -r requirements.txt

jupyter:
	@python -m ipykernel install \
	--user --name=$(PROJECT_NAME) \
	--display-name "gpx-map"
