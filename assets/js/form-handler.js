document.addEventListener("DOMContentLoaded", function () {
    // Your live Google Apps Script Web App URL
    const googleAppUrl = 'https://script.google.com/macros/s/AKfycbwyDh6HCpCWaY-S7it46Qcl1XaJfxhfE5qhYpY0DRuq0sCI-JGf-WLvvh9LkE93CsMY/exec';

    // Automatically inject the hidden honeypot trap into every form on the page
    document.querySelectorAll('form').forEach(form => {
        const honeyDiv = document.createElement('div');
        honeyDiv.style.display = 'none';
        honeyDiv.setAttribute('aria-hidden', 'true');
        honeyDiv.innerHTML = '<input type="text" name="bot_honey" tabindex="-1" autocomplete="off">';
        form.appendChild(honeyDiv);

        // Bind the unified AJAX submission handler
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (!submitBtn) return;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Processing...';
            submitBtn.disabled = true;

            fetch(googleAppUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'blocked') {
                    // Fail silently for bots
                    form.innerHTML = `<div class="text-steel-navy font-bold p-6 bg-green-50 border border-green-200 rounded-lg text-center shadow-sm w-full">Thank you. Your request has been securely added to our queue.</div>`;
                } else {
                    form.innerHTML = `<div class="text-steel-navy font-bold p-6 bg-green-50 border border-green-200 rounded-lg text-center shadow-sm w-full">Thank you. Your request has been securely added to our queue. We will review the details.</div>`;
                }
            })
            .catch(() => {
                alert('Submission failed. Please check your connection.');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    });
});
