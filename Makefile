BUILD_DIR := ./build
INSTALL_DIR := /usr/share/ipa/modern-ui

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

build:
	npm install && npm run build

install:
	install -d $(INSTALL_DIR)
	cp -r $(BUILD_DIR)/* $(INSTALL_DIR)