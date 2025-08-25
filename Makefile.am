NULL =

appdir = $(IPA_DATA_DIR)/modern-ui

EXTRA_DIST =		\
	$(NULL)

install-exec-local:
	## We don't want to run this code in prci, prci runs those commands before make install
	test -d "dist" || npm install
	test -d "dist" || npm run build
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

dist-hook:
	npm install
	npm run build
	cp -r "dist/" "$(distdir)/dist/"

clean-local:
	rm -rf node_modules dist
