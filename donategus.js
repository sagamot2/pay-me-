const promptpayID = "0801138627"; 
const amountInput = document.getElementById('amount');
const qrImage = document.getElementById('qrImage');
const qrStatus = document.getElementById('qrStatus');
let typingTimer;

amountInput.addEventListener('input', function() {
    clearTimeout(typingTimer);
    const val = this.value;

    if (!val || val <= 0) {
        qrImage.src = `https://promptpay.io/${promptpayID}.png`;
        qrStatus.textContent = "สแกนเพื่อโอนเงินแบบไม่ระบุยอด";
        qrStatus.style.color = "var(--text-muted)";
        return;
    }

    typingTimer = setTimeout(() => {
        qrImage.src = `https://promptpay.io/${promptpayID}/${val}.png`;
        qrStatus.textContent = `ยอดชำระ: ฿${Number(val).toLocaleString('th-TH')}`;
        qrStatus.style.color = "#10b981";
    }, 500);
});

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
        address: ' 0xd843581d4f8202764a9c0c60f0271eb8e2c25bd8',
        warning: '⚠️ โอนเฉพาะเหรียญ ETH ผ่านเครือข่าย ERC20 เท่านั้น'
    },
    'SOL': {
        img: 'sol.jpg',
        address: ' cbkPKZ4QN6P5kHk8766yrUUusHcMZcesqHivZWmFK68', 
        warning: '⚠️ โอนเฉพาะเหรียญ SOL ผ่านเครือข่าย Solana เท่านั้น'
    }
};

let currentCrypto = 'USDT'; 

function switchCrypto(coin) {
    currentCrypto = coin;
    const data = cryptoData[coin];

    document.getElementById('cryptoImg').src = data.img;
    
    document.getElementById('cryptoWarning').innerHTML = `<strong>${data.warning}</strong>`;
    
    document.getElementById('cryptoAddress').textContent = data.address;

    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if (tab.textContent === coin) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

function copyData(val, msg) {
    navigator.clipboard.writeText(val).then(() => {
        showToast(msg);
        if (navigator.vibrate) navigator.vibrate(40);
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
        console.error('Download error:', error);
        const fallbackLink = document.createElement('a');
        fallbackLink.href = imgSrc;
        fallbackLink.target = '_blank';
        fallbackLink.download = `Donate_${fileNamePrefix}.png`;
        
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        
        showToast("ระบบเปิดรูปให้แล้ว กดค้าง/คลิกขวา เพื่อบันทึกได้เลย");
    }
}