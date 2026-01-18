async function loadFooter() {
    try {
        const response = await fetch('/Component/footer.html');
        const html = await response.text();

        // Find a placeholder or append to body
        const footerContainer = document.querySelector('footer') || document.body;

        // If we found an existing footer tag, replace it. Otherwise append.
        if (document.querySelector('footer')) {
            document.querySelector('footer').innerHTML = html;
        } else {
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div);
        }

        // Update Year
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

    } catch (err) {
        console.error('Failed to load footer:', err);
    }
}

// Auto-load
document.addEventListener('DOMContentLoaded', loadFooter);
