NULL =

appdir = $(IPA_DATA_DIR)/freeipa-webui

EXTRA_DIST =		\
	$(NULL)

dist-hook:
	mkdir $(distdir)/random
	mkdir $(srcdir)/random
	mkdir $(top_distdir)/random
	mkdir $(top_srcdir)/random
	npm install
	npm run build
	cp -r dist/ $(distdir)/dist/
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

clean-local:
	rm -rf node_modules dist
