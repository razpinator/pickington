# Pickington

Pickington is a lightweight Chrome Extension designed for developers and designers. It allows you to swiftly inspect and extract detailed information about any HTML element on a webpage, including its HTML structure, computed CSS styles, and parent hierarchy.

## Features

- **Element Picker:** easy-to-use visual picker that highlights elements as you hover.
- **HTML Extraction:** Instantly copy the full `outerHTML` of the selected element.
- **Computed CSS:** (Optional) Retrieve the full set of computed CSS properties for the element.
- **Parent Structure:** (Optional) Get a hierarchical list of parent elements (Tag Name, ID, Class) to understand the DOM context.
- **Copy to Clipboard:** Automatically formats the extracted data as JSON and copies it to your clipboard.
- **Non-intrusive UI:** Uses a minimal overlay and notification system.

## Installation

### From Source (Developer Mode)

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/pickington.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the `pickington` directory from your cloned repository.
6. The extension should now appear in your browser toolbar.

## Usage

1. Click the **Pickington** icon in your Chrome toolbar.
2. Configure your extraction preferences:
   - **Include Parent Structure:** Check this to include the hierarchy of parent elements.
   - **Include Computed CSS:** Check this to include all computed styles for the element.
3. Click the **Start Picking** button.
4. Hover over any element on the webpage. You will see a highlight overlay.
5. Click on an element to capture its data.
6. A notification will confirm that the data has been copied to your clipboard in JSON format.
7. To stop picking, open the extension popup and click the button again, or simply reload the page.

## Data Format

The extracted data is copied as a JSON object:

```json
{
  "html": "<div id=\"example\" class=\"box\">Content</div>",
  "computedCSS": {
    "color": "rgb(0, 0, 0)",
    "font-size": "16px",
    "display": "block",
    ...
  },
  "parentStructure": [
    {
      "tagName": "body",
      "id": "",
      "className": ""
    },
    {
      "tagName": "html",
      "id": "",
      "className": ""
    }
  ]
}
```

## Permissions

- `activeTab`: To access the content of the current tab.
- `scripting`: To inject the content script for picking elements.
- `storage`: To save your preferences (Parent Structure & Computed CSS options).

## License

This project is free for personal, non-commercial use. Any commercial use, redistribution, or modification requires prior written permission from the author.
