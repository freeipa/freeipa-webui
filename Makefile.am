NULL =

appdir = $(IPA_DATA_DIR)/freeipa-webui

EXTRA_DIST =		\
        dist		\
	$(NULL)

# Move and unpack dist folder
install-exec-local: dist
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

dist:
	npm -v
	node -v
	npm i
	npm run build

clean-local:
	rm -rf node_modules dist
