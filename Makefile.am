NULL =

appdir = $(IPA_DATA_DIR)/freeipa-webui

EXTRA_DIST =		\
	$(NULL)

install-exec-local:
	test -d "dist" || npm install
	test -d "dist" || npm run build
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

dist-hook:
	cp -r "dist/" "$(distdir)/dist/"

clean-local:
	rm -rf node_modules dist
