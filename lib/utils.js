/**
 * Formats a date string into a localized readable format
 * @param {string | Date} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Calculates the estimated reading time for a block of text or Editor.js JSON
 * @param {string | object} content 
 * @returns {string}
 */
export function calculateReadTime(content) {
  if (!content) return '1 min read';
  
  let text = '';
  
  if (typeof content === 'string') {
    text = content;
  } else if (typeof content === 'object' && content !== null) {
    // Handle Editor.js format
    const blocks = content.blocks || [];
    text = blocks.map(block => {
      if (block.data && block.data.text) return block.data.text;
      if (block.data && block.data.items) return block.data.items.join(' ');
      if (block.data && block.data.content) return block.data.content;
      return '';
    }).join(' ');
  }

  // Strip HTML tags if any (from Editor.js or direct HTML)
  const plainText = text.replace(/<[^>]*>?/gm, ' ');
  
  const wordsPerMinute = 200;
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return `${minutes === 0 ? 1 : minutes} min read`;
}

/**
 * Generates a URL-friendly slug from a title string
 * @param {string} title 
 * @returns {string}
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
/**
 * Converts Editor.js JSON data to HTML string
 * @param {object} content 
 * @returns {string}
 */
export function editorJsToHtml(content) {
  if (!content || !content.blocks) return '';
  
  return content.blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      case 'paragraph':
        return `<p>${block.data.text}</p>`;
      case 'list': {
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items.map(item => `<li>${item}</li>`).join('');
        return `<${tag}>${items}</${tag}>`;
      }
      case 'quote':
        return `<blockquote>${block.data.text}${block.data.caption ? `<cite>${block.data.caption}</cite>` : ''}</blockquote>`;
      case 'image':
        return `
          <div style="margin: 20px 0; text-align: center;">
            <img src="${block.data.file.url}" alt="${block.data.caption || ''}" style="max-width: 100%; border-radius: 8px;" />
            ${block.data.caption ? `<p style="font-size: 12px; font-style: italic; color: #666;">${block.data.caption}</p>` : ''}
          </div>
        `;
      default:
        return '';
    }
  }).join('');
}
