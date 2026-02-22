# Justification for Chrome Web Store

## Single Purpose Description
Pickington is a developer tool designed to allow users to visually select any HTML element on a webpage and instantly extract its HTML structure, computed CSS styles, and parent hierarchy to the clipboard.

## Permission Justifications

### 1. activeTab
**Justification:**
This permission is required to grant the extension temporary access to the currently active tab when the user clicks the extension icon. This ensures that the extension only runs on pages the user explicitly interacts with, prioritizing user privacy. It allows the extension to inject the element picker script into the current page to perform its core function.

### 2. scripting
**Justification:**
The `scripting` permission is necessary to inject the JavaScript and CSS required for the visual element picker overlay into the current webpage. This allows the extension to highlight elements as the user hovers over them and capture click events to extract data without permanently modifying the page content.

### 3. storage
**Justification:**
The `storage` permission is used solely to save the user's localized preferences for the extension. Specifically, it stores boolean flags for "Include Parent Structure" and "Include Computed CSS" so that the user does not have to re-configure their extraction settings every time they use the tool. No personal data or browsing history is stored.

## Data Usage Compliance
I certify that the collection and usage of data by this extension complies with the Developer Program Policies. The extension only processes data (HTML/CSS of selected elements) locally on the user's machine and copies it to their clipboard. No data is transmitted to external servers.
