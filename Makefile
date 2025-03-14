# creates a package for the extension by copying the necessary files to a
# temporary directory and then creating a compressed archive of that directory.
# The archive is then moved to 'publish/' and the temporary directory is removed.
# The archive is named 'extension.zip'.
# The package is created in the root directory of the extension excluding the
# 'publish/' directory.

# The name of the extension.
EXTENSION_NAME = $(shell basename $(CURDIR))

# The name of the archive.
ARCHIVE_NAME = $(EXTENSION_NAME).zip

# The path to the archive.
ARCHIVE_PATH = publish/$(ARCHIVE_NAME)

# The path to the temporary directory.
TEMP_DIR = temp

# Default target
package: $(ARCHIVE_PATH)

# Create the archive
$(ARCHIVE_PATH): $(shell find . -type f -not -path "./publish/*" -not -path "./$(TEMP_DIR)/*")
	@echo "Creating package..."
	@mkdir -p publish
	@mkdir -p $(TEMP_DIR)
	$(eval FILE_LIST := $(shell find . -type f -not -path "./publish/*" -not -path "./$(TEMP_DIR)/*" -not -path "./.git/*" -not -path "./.gitignore" -not -path "./.DS_Store"))
	@echo $(FILE_LIST)
	@for file in $(FILE_LIST); do \
		dest_dir="$(TEMP_DIR)/$$(dirname $$file)"; \
		mkdir -p "$$dest_dir"; \
		cp -p "$$file" "$$dest_dir/"; \
	done
	@cd $(TEMP_DIR) && zip -r ../$(ARCHIVE_PATH) .
	@echo "Package created at $(ARCHIVE_PATH)"
	@rm -rf $(TEMP_DIR)

# Clean the package
clean:
	@echo "Cleaning package..."
	@rm -rf $(TEMP_DIR)
	@rm -f $(ARCHIVE_PATH)
	@echo "Package cleaned."

.PHONY: package clean
