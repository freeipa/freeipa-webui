# SPDX-FileCopyrightText: 2022 Red Hat, Inc.
# SPDX-License-Identifier: GPL-3.0-or-later

BUILD_DIR := ./dist
INSTALL_DIR := /usr/share/ipa/modern-ui

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

build:
	npm install && npm run build

install:
	install -d $(INSTALL_DIR)
	cp -r $(BUILD_DIR)/* $(INSTALL_DIR)
