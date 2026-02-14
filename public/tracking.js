const trackingForm = document.getElementById('trackingForm');
const trackInput = document.getElementById('trackInput');
const searchMessage = document.getElementById('searchMessage');
const trackingResult = document.getElementById('trackingResult');
const timelineSteps = document.getElementById('timelineSteps');

// Project Details Elements
const pTitle = document.getElementById('pTitle');
const pOrderId = document.getElementById('pOrderId');
const pMentor = document.getElementById('pMentor');
const pDelivery = document.getElementById('pDelivery');
const pSupport = document.getElementById('pSupport');
const pStatus = document.getElementById('pStatus');

const steps = [
    { id: 'confirmed', label: 'Order Confirmed', desc: 'Payment received.' },
    { id: 'analysis', label: 'Analysis', desc: 'Reviewing requirements.' },
    { id: 'design', label: 'Architecture', desc: 'Tech stack finalized.' },
    { id: 'development', label: 'Development', desc: 'Core modules in progress.' },
    { id: 'testing', label: 'Testing', desc: 'Optimization & fixes.' },
    { id: 'report', label: 'Documentation', desc: 'Report & PPT preparation.' },
    { id: 'delivery', label: 'Delivery', desc: 'Files ready.' },
    { id: 'completed', label: 'Completed', desc: 'Project delivered.' }
];

trackingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = trackInput.value.trim();

    if (!query) {
        showMessage('Please enter an Order ID or Email.', 'red');
        return;
    }

    showMessage('Searching...', 'var(--neon-cyan)');
    trackingResult.style.display = 'none';

    try {
        // Determine request param
        const param = query.includes('@') ? `email=${encodeURIComponent(query)}` : `orderId=${encodeURIComponent(query)}`;
        const res = await fetch(`/api/track-order?${param}`);
        const data = await res.json();

        if (data.success) {
            showMessage('', '');
            renderOrder(data.order, data.history);
        } else {
            showMessage(data.message, 'red');
        }

    } catch (err) {
        console.error(err);
        showMessage('Error connecting to server.', 'red');
    }
});

function showMessage(msg, color) {
    searchMessage.style.color = color;
    searchMessage.textContent = msg;
}

function renderOrder(order, history) {
    // Fill Details
    pTitle.textContent = order.project_title;
    pOrderId.textContent = order.order_code;
    pMentor.textContent = order.mentor_name;
    pDelivery.textContent = new Date(order.expected_delivery).toDateString();
    pSupport.textContent = order.support_until ? new Date(order.support_until).toDateString() : 'Active';
    pStatus.textContent = order.status;

    // Render Timeline
    timelineSteps.innerHTML = '';

    // Find index of current status
    let currentIndex = steps.findIndex(s => s.id === order.status);
    if (currentIndex === -1) currentIndex = 0; // Default if status mismatch

    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';

        // Determine state
        if (index < currentIndex) stepDiv.classList.add('completed');
        if (index === currentIndex) stepDiv.classList.add('active');

        stepDiv.innerHTML = `
            <div class="step-circle">
                ${index < currentIndex ? '<i class="fas fa-check"></i>' : (index + 1)}
            </div>
            <div class="step-label">${step.label}</div>
            <div class="step-desc">${step.desc}</div>
        `;

        timelineSteps.appendChild(stepDiv);
    });

    trackingResult.style.display = 'block';

    // Scroll to result
    trackingResult.scrollIntoView({ behavior: 'smooth' });
}
