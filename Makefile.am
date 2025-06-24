NULL =

appdir = $(IPA_DATA_DIR)/freeipa-webui

EXTRA_DIST =		\
	$(NULL)

install-exec-local:
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

dist-hook:
	npm install
	npm run build
	cp -r "dist/" "$(distdir)/dist/"

clean-local:
	rm -rf node_modules dist
