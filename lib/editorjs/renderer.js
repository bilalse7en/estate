/**
 * Converts Editor.js JSON output to HTML
 */
export function editorJsToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }

  return blocks.map(block => {
    switch (block.type) {
      case 'header':
        const level = block.data.level || 2;
        return `<h${level} class="text-${7-level}xl font-display font-bold text-[var(--text-main)] my-6">${block.data.text}</h${level}>`;

      case 'paragraph':
        return `<p class="text-[var(--text-main)] leading-relaxed my-4">${block.data.text}</p>`;

      case 'list':
        const listTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items
          .map(item => `<li class="text-[var(--text-main)] my-2">${item}</li>`)
          .join('');
        return `<${listTag} class="list-${block.data.style === 'ordered' ? 'decimal' : 'disc'} list-inside my-6 space-y-2">${items}</${listTag}>`;

      case 'quote':
        return `
          <blockquote class="border-l-4 border-primary-500 pl-6 py-4 my-8 italic bg-[var(--bg-secondary)] rounded-r-xl">
            <p class="text-lg text-[var(--text-main)] mb-2">${block.data.text}</p>
            ${block.data.caption ? `<cite class="text-sm text-[var(--text-muted)] not-italic">— ${block.data.caption}</cite>` : ''}
          </blockquote>
        `;

      case 'code':
        return `
          <pre class="bg-slate-900 text-gray-100 rounded-xl p-6 my-8 overflow-x-auto">
            <code class="text-sm font-mono">${escapeHtml(block.data.code)}</code>
          </pre>
        `;

      case 'image':
        return `
          <figure class="my-8">
            <img 
              src="${block.data.file.url}" 
              alt="${block.data.caption || ''}" 
              class="w-full rounded-2xl shadow-xl"
            />
            ${block.data.caption ? `<figcaption class="text-center text-sm text-[var(--text-muted)] mt-4 italic">${block.data.caption}</figcaption>` : ''}
          </figure>
        `;

      case 'embed':
        return `
          <div class="my-8 aspect-video">
            <iframe 
              src="${block.data.embed}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="w-full h-full rounded-2xl"
            ></iframe>
            ${block.data.caption ? `<p class="text-center text-sm text-[var(--text-muted)] mt-4 italic">${block.data.caption}</p>` : ''}
          </div>
        `;

      case 'table':
        const tableRows = block.data.content
          .map((row, index) => {
            const cells = row
              .map(cell => {
                const tag = index === 0 && block.data.withHeadings ? 'th' : 'td';
                const classes = tag === 'th' 
                  ? 'px-6 py-3 text-left font-bold text-[var(--text-main)] bg-primary-500/10'
                  : 'px-6 py-4 text-[var(--text-main)]';
                return `<${tag} class="${classes}">${cell}</${tag}>`;
              })
              .join('');
            return `<tr class="border-b border-[var(--glass-border)]">${cells}</tr>`;
          })
          .join('');
        
        return `
          <div class="my-8 overflow-x-auto">
            <table class="min-w-full glass rounded-2xl overflow-hidden">
              <tbody>${tableRows}</tbody>
            </table>
          </div>
        `;

      default:
        return '';
    }
  }).join('\n');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Extract plain text from Editor.js blocks for excerpts
 */
export function editorJsToPlainText(blocks, maxLength = 200) {
  if (!blocks || !Array.isArray(blocks)) {
    return '';
  }

  let text = '';
  
  for (const block of blocks) {
    if (block.type === 'paragraph' || block.type === 'header') {
      text += block.data.text + ' ';
    } else if (block.type === 'list') {
      text += block.data.items.join(' ') + ' ';
    }

    if (text.length > maxLength) {
      break;
    }
  }

  return text.substring(0, maxLength).trim() + (text.length > maxLength ? '...' : '');
}
