// Node system renderer keeps everything static and accessible.
const list = document.getElementById('nodeList');
if (!list) {
  // If markup changes, quietly exit to avoid console noise in calm spaces.
  console.warn('Node list container is missing.');
}

const nodeDataPath = 'data/nodes.json';

async function loadNodes(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load nodes');
  }
  return await response.json();
}

function renderNodes(target, nodes) {
  target.innerHTML = '';
  nodes.forEach((node) => {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = node.title;
    item.appendChild(title);

    const desc = document.createElement('span');
    desc.textContent = node.summary;
    item.appendChild(desc);

    if (Array.isArray(node.links) && node.links.length > 0) {
      const linkWrap = document.createElement('div');
      linkWrap.className = 'node-links';
      node.links.forEach((href) => {
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.textContent = href.replace('#', '');
        anchor.rel = 'nofollow';
        linkWrap.appendChild(anchor);
      });
      item.appendChild(linkWrap);
    }
    target.appendChild(item);
  });
}

function renderFallback(target) {
  const notice = document.createElement('li');
  notice.textContent = 'Node data unavailable. Calm fallback active.';
  target.appendChild(notice);
}

(async () => {
  if (!list) {
    return;
  }
  try {
    const nodes = await loadNodes(nodeDataPath);
    if (Array.isArray(nodes) && nodes.length > 0) {
      renderNodes(list, nodes);
    } else {
      renderFallback(list);
    }
  } catch (error) {
    console.warn(error);
    renderFallback(list);
  }
})();
