// Mobile Navigation Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const navRight = document.querySelector('.nav-right');

// Clone contact button to mobile menu if not exists
if (window.innerWidth <= 768 && !document.querySelector('.nav-links .mobile-contact-btn')) {
    const contactBtn = document.querySelector('.nav-right .btn');
    if (contactBtn) {
        const li = document.createElement('li');
        li.innerHTML = contactBtn.outerHTML;
        li.querySelector('a').classList.add('mobile-contact-btn');
        li.style.marginTop = '10px';
        navLinks.appendChild(li);
    }
}

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Modal Logic
const modal = document.getElementById("contactModal");
const closeModal = document.querySelector(".close-modal");

// Open Modal (Event Delegation)
document.addEventListener('click', (e) => {
    if (e.target.closest('.contact-trigger')) {
        e.preventDefault();
        if (modal) modal.style.display = "block";
    }
});

// Close Modal
if (closeModal) {
    closeModal.onclick = function () {
        modal.style.display = "none";
    }
}

// Close on outside click
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Visual feedback
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                formMessage.innerHTML = `<span style="color: var(--neon-green);"><i class="fas fa-check-circle"></i> ${result.message}</span>`;
                contactForm.reset();
                setTimeout(() => {
                    modal.style.display = "none";
                    formMessage.innerHTML = '';
                }, 3000);
            } else {
                formMessage.innerHTML = `<span style="color: #ff5f56;"><i class="fas fa-exclamation-circle"></i> ${result.message}</span>`;
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.innerHTML = `<span style="color: #ff5f56;">An error occurred. Please try again.</span>`;
        } finally {
            btn.disabled = false;
        }
    });
}

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        question.classList.toggle('active');

        if (question.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
            if (icon) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        } else {
            answer.style.maxHeight = 0;
            if (icon) {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        }
    });
});
