NULL =

appdir = $(IPA_DATA_DIR)/freeipa-webui

EXTRA_DIST =		\
        dist		\
	$(NULL)

dist-hook:
	npm install
	npm run build
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

clean-local:
	rm -rf node_modules dist
