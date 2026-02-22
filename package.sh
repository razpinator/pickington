#!/bin/bash

# Name of the output zip file
OUTPUT_FILE="pickington.zip"

# Remove existing zip file if it exists
if [ -f "$OUTPUT_FILE" ]; then
    rm "$OUTPUT_FILE"
    echo "Removed old $OUTPUT_FILE"
fi

# Create the zip file
# -r: recursive
# -x: exclude patterns
# We are excluding development files that are not needed in the production build
zip -r "$OUTPUT_FILE" . -x "*.git*" -x "*.DS_Store" -x "package.sh" -x "README.md" -x "LICENSE"

echo "Successfully created $OUTPUT_FILE"
