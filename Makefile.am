NULL =

appdir = $(IPA_DATA_DIR)/modern-ui
licensedir = $(DESTDIR)$(datarootdir)/licenses/$(PACKAGE_NAME)-server-common/modern-ui

EXTRA_DIST =		\
	$(NULL)

install-exec-local:
	## We don't want to run this code in prci, prci runs those commands before make install
	test -d "dist" || npm clean-install
	test -d "dist" || ( npm run build && rm -rf node_modules && npm clean-install --omit=dev )
	mkdir -p "$(DESTDIR)$(appdir)"
	cp -p "dist/index.html" "$(DESTDIR)$(appdir)/index.html"
	cp -p "dist/favicon.ico" "$(DESTDIR)$(appdir)/favicon.ico"
	mkdir -p "$(licensedir)"
	cp -p "dist/COPYING" "$(licensedir)/COPYING"
	cp -rp "dist/assets" "$(DESTDIR)$(appdir)/assets"

dist-hook:
	npm clean-install
	## We need to build, but we only want the distributable dependencies in the .src.rpm
	npm run build && rm -rf node_modules && npm clean-install --omit=dev
	cp -r "." "$(distdir)/"

clean-local:
	rm -rf node_modules dist
