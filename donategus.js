let currentAmount = 60; 
const promptpayID = "0801138627";

function selectAmount(amount, btnElement) {
    document.getElementById('customInputWrapper').classList.remove('show');
    document.getElementById('customAmount').value = '';
    document.querySelectorAll('.amount-card').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    currentAmount = amount;
    updateMainButton();
}

function toggleCustomInput(btnElement) {
    document.querySelectorAll('.amount-card').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    const inputWrapper = document.getElementById('customInputWrapper');
    inputWrapper.classList.add('show');
    const inputField = document.getElementById('customAmount');
    inputField.focus();
    currentAmount = inputField.value ? parseInt(inputField.value) : 0;
    updateMainButton();
}

function updateCustomAmount(val) {
    currentAmount = val ? parseInt(val) : 0;
    updateMainButton();
}

function updateMainButton() {
    const btn = document.getElementById('supportBtn');
    if (currentAmount > 0) {
        btn.textContent = `สนับสนุน ฿${currentAmount.toLocaleString('th-TH')}`;
        btn.disabled = false;
        btn.style.opacity = '1';
    } else {
        btn.textContent = `ระบุจำนวนเงิน`;
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }
}

function openPaymentModal() {
    if (currentAmount <= 0) return;
    document.getElementById('modalTotalAmount').textContent = `฿${currentAmount.toLocaleString('th-TH')}`;
    const qrImg = document.getElementById('promptpayQR');
    qrImg.src = `https://promptpay.io/${promptpayID}/${currentAmount}.png`;
    document.getElementById('paymentModal').classList.add('open');
    document.body.style.overflow = 'hidden'; 
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('open');
    document.body.style.overflow = ''; 
}

document.getElementById('paymentModal').addEventListener('click', function(e) {
    if (e.target === this) closePaymentModal();
});

function switchPaymentTab(tabId, btnElement) {
    document.querySelectorAll('.m-tab').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    document.querySelectorAll('.payment-view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${tabId}`).classList.add('active');
}

let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function copyData(val, msg) {
    if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = val;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast(msg);
        } catch (err) {
            showToast('คัดลอกไม่สำเร็จ');
        }
        document.body.removeChild(textArea);
        return;
    }

    navigator.clipboard.writeText(val).then(() => {
        showToast(msg);
        if (navigator.vibrate) navigator.vibrate(40);
    }).catch(() => {
        showToast('คัดลอกไม่สำเร็จ ลองอีกครั้ง');
    });
}

async function downloadQR(imgElementId, fileNamePrefix) {
    const imgElement = document.getElementById(imgElementId);
    const imgSrc = imgElement.src;

    if (!imgSrc) {
        showToast("ไม่พบรูป QR Code");
        return;
    }

    try {
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const timeStamp = new Date().getTime();
        link.download = `Donate_${fileNamePrefix}_${currentAmount}THB_${timeStamp}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
        URL.revokeObjectURL(blobUrl);
        showToast(`บันทึก QR Code ลงเครื่องแล้ว!`);
        
    } catch (error) {
        const fallbackLink = document.createElement('a');
        fallbackLink.href = imgSrc;
        fallbackLink.target = '_blank';
        fallbackLink.download = `Donate_${fileNamePrefix}.png`;
        
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        
        showToast("เปิดรูปแล้ว กดค้าง/คลิกขวาเพื่อบันทึก");
    }
}
