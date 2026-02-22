let isPicking = false;
let overlay;
let notification;
let currentOptions = {};

// Initialize UI elements
function createOverlay() {
  if (!document.getElementById('pickington-overlay')) {
    overlay = document.createElement('div');
    overlay.id = 'pickington-overlay';
    document.body.appendChild(overlay);
  } else {
    overlay = document.getElementById('pickington-overlay');
  }

  if (!document.getElementById('pickington-notification')) {
      notification = document.createElement('div');
      notification.id = 'pickington-notification';
      document.body.appendChild(notification);
  } else {
      notification = document.getElementById('pickington-notification');
  }
}

function showNotification(message) {
    if (!notification) createOverlay();
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function handleMouseOver(e) {
  if (!isPicking) return;
  
  e.stopPropagation();
  const target = e.target;
  
  if (target === overlay || target === notification) return;

  // Update overlay position/size
  const rect = target.getBoundingClientRect();
  
  // Use absolute positioning with scroll offsets to ensure it moves with the page
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  overlay.style.display = 'block';
  overlay.style.position = 'absolute';
  overlay.style.top = (rect.top + scrollTop) + 'px';
  overlay.style.left = (rect.left + scrollLeft) + 'px';
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';
}

function handleClick(e) {
  if (!isPicking) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const target = e.target;
  extractAndCopy(target);
  
  // Turn off picker after selection? Or keep it on?
  // Let's keep it on for multiple selections, but user can turn it off in popup.
  // showNotification("Copied to clipboard!");
}

function getComputedCSS(element) {
  const styles = window.getComputedStyle(element);
  let cssText = '';
  
  // It's often too much to get ALL computed styles. 
  // Let's get the most relevant ones or all if requested.
  // A huge list of computed properties is often not useful for copy-pasting.
  // However, the prompt says "The computed CSS".
  // We'll try to get explicitly set styles and some defaults, or just iterate common ones.
  // Iterating all is safer for "The computed CSS" requirement.
  
  const relevantProps = [];
  // For standard "computed style", we usually just dump everything or try to be smart.
  // Let's try to capture a comprehensive list but maybe format it nicely.
  
  // Actually, `cssText` on getComputedStyle is often empty in some browsers for computed styles.
  // We might need to iterate.
  
  let styleObj = {};
  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i];
    const val = styles.getPropertyValue(prop);
    if (val) {
        styleObj[prop] = val;
    }
  }
  return JSON.stringify(styleObj, null, 2);
}

function getElementStructure(element, depth = 0) {
    // Simple structure representation
    let structure = {
        tagName: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        // attributes: ...
    };
    return structure;
}

function getParentStructure(element) {
    const parents = [];
    let current = element.parentElement;
    while (current) {
        parents.push({
            tagName: current.tagName.toLowerCase(),
            id: current.id,
            className: current.className
        });
        current = current.parentElement;
    }
    return parents;
}

async function extractAndCopy(element) {
  const data = {};
  
  // 1. HTML
  data.html = element.outerHTML;
  
  // 2. Computed CSS
  if (currentOptions.includeComputed) {
    data.computedCSS = JSON.parse(getComputedCSS(element));
  }
  
  // 3. Parent Structure
  if (currentOptions.includeParent) {
    data.parentStructure = getParentStructure(element);
  }

  const textToCopy = JSON.stringify(data, null, 2);
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    showNotification("Copied element data to clipboard!");
  } catch (err) {
    console.error('Failed to copy: ', err);
    showNotification("Failed to copy to clipboard.");
  }
}

// Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStatus") {
    sendResponse({isPicking: isPicking});
  } 
  else if (request.action === "togglePicker") {
    isPicking = request.state;
    currentOptions = request.options || {};
    
    if (isPicking) {
      createOverlay();
      document.addEventListener('mouseover', handleMouseOver, true);
      document.addEventListener('click', handleClick, true);
      document.body.style.cursor = 'crosshair';
    } else {
      if (overlay) overlay.style.display = 'none';
      document.removeEventListener('mouseover', handleMouseOver, true);
      document.removeEventListener('click', handleClick, true);
      document.body.style.cursor = 'default';
    }
    sendResponse({success: true});
  }
});
