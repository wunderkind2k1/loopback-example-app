BASE_DIR := $(shell pwd)
APP_NAME := $(notdir $(BASE_DIR))
TEMP_DIR := $(shell mktemp -d /tmp/deploy.XXXX)

$(APP_NAME).tgz: $(shell git ls-files)
	@echo "Building app and dependencies..."
	@(cd $(TEMP_DIR) && npm install --quiet $(BASE_DIR)) > build.log 2>&1 \
		|| echo "Failed build in $(TEMP_DIR), see build.log for details"
	@echo "Packaging app and dependencies..."
	@tar -C $(TEMP_DIR)/node_modules -czf $@ $(APP_NAME)
	@echo "Bundled npm package ready: $@"
