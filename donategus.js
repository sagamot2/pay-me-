const tabButtons = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.panel');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

const purposeData = {
    'boba': { amount: 60, msg: 'สดชื่นเลย! ขอบคุณสำหรับชานมไข่มุกนะครับ 🥰' },
    'mookata': { amount: 300, msg: 'อิ่มไปอีกหลายวัน! ขอบคุณสำหรับหมูกระทะเยียวยาจิตใจครับ 🥓' },
    'book': { amount: 500, msg: 'ความรู้แน่นๆ! ขอบคุณที่ช่วยสมทบทุนค่าหนังสือเรียนครับ 📖' },
    'custom': { amount: 0, msg: 'ขอบคุณสำหรับทุกการสนับสนุนที่ให้ผมเดินหน้าต่อนะครับ 🚀' }
};

function selectPurpose(type, cardElement) {
    document.querySelectorAll('.purpose-card').forEach(card => card.classList.remove('active'));
    cardElement.classList.add('active');

    const data = purposeData[type];
    document.getElementById('purposeMessage').innerHTML = data.msg;

    const qrImg = document.getElementById('dynamicQR');
    const amountText = document.getElementById('qrAmountText');
    
    if (data.amount > 0) {
        qrImg.src = `https://promptpay.io/0801138627/${data.amount}.png`;
        amountText.textContent = `ยอดโอน: ฿${data.amount}`;
    } else {
        qrImg.src = `https://promptpay.io/0801138627.png`;
        amountText.textContent = `ระบุยอดเงินในแอป`;
    }

    document.getElementById('bankAppLinks').classList.remove('show');

    const resultBox = document.getElementById('purposeResult');
    resultBox.classList.remove('show');
    
    setTimeout(() => {
        resultBox.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

function copyAndShowApps() {
    copyData('0801138627', 'คัดลอกเลขแล้ว! เปิดแอปด้านล่างได้เลย 👇');
    const appLinks = document.getElementById('bankAppLinks');
    appLinks.classList.add('show');
}

const cryptoData = {
    'USDT': {
        img: 'usdt.jpg',
        address: '0xd843581d4f8202764a9c0c60f0271eb8e2c25bd8',
        warning: '⚠️ โอนเฉพาะเหรียญ USDT ผ่านเครือข่าย TRC20 เท่านั้น'
    },
    'BTC': {
        img: 'btc.jpg',
        address: 'bc1peg3j4dvwq2sq3u2upak0vsspc0mnxc8cmhcjy0v2at8g8k34ps7qeyw863',
        warning: '⚠️ โอนเฉพาะเหรียญ BTC ผ่านเครือข่าย Bitcoin เท่านั้น'
    },
    'ETH': {
        img: 'eth.jpg',
        address: '0xd843581d4f8202764a9c0c60f0271eb8e2c25bd8',
        warning: '⚠️ โอนเฉพาะเหรียญ ETH ผ่านเครือข่าย ERC20 เท่านั้น'
    },
    'SOL': {
        img: 'sol.jpg',
        address: 'cbkPKZ4QN6P5kHk8766yrUUusHcMZcesqHivZWmFK68',
        warning: '⚠️ โอนเฉพาะเหรียญ SOL ผ่านเครือข่าย Solana เท่านั้น'
    }
};

let currentCrypto = 'USDT';

function switchCrypto(coin, btnElement) {
    currentCrypto = coin;
    const data = cryptoData[coin];

    document.getElementById('cryptoImg').src = data.img;
    document.getElementById('cryptoWarning').innerHTML = `<strong>${data.warning}</strong>`;
    document.getElementById('cryptoAddress').textContent = data.address;

    document.querySelectorAll('.crypto-tab').forEach(tab => tab.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
}

function copyCrypto() {
    const address = cryptoData[currentCrypto].address;
    copyData(address, `คัดลอก Address ${currentCrypto} แล้ว`);
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
        link.download = `Donate_${fileNamePrefix}_${timeStamp}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
        showToast(`บันทึก QR ${fileNamePrefix} ลงเครื่องแล้ว!`);
        
    } catch (error) {
        console.error(error);
        const fallbackLink = document.createElement('a');
        fallbackLink.href = imgSrc;
        fallbackLink.target = '_blank';
        fallbackLink.download = `Donate_${fileNamePrefix}.png`;
        
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        
        showToast("เปิดรูปแล้ว กดค้างหรือคลิกขวาเพื่อบันทึก");
    }
}
