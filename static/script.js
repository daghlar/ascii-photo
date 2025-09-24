class AdvancedASCIIArtGenerator {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadArea = document.getElementById('uploadArea');
        this.selectFileBtn = document.getElementById('selectFileBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.previewBtn = document.getElementById('previewBtn');
        this.widthInput = document.getElementById('widthInput');
        this.widthValue = document.getElementById('widthValue');
        this.styleSelect = document.getElementById('styleSelect');
        this.colorSelect = document.getElementById('colorSelect');
        this.resultSection = document.getElementById('resultSection');
        this.asciiOutput = document.getElementById('asciiOutput');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('errorMessage');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.newImageBtn = document.getElementById('newImageBtn');
        this.notification = document.getElementById('notification');
        
        this.selectedFile = null;
        this.asciiStyles = {
            standard: "@%#*+=-:. ",
            detailed: "@%#*+=-:. ",
            minimal: "@#*+-. ",
            artistic: "█▓▒░· "
        };
        
        this.colorSchemes = {
            'red-black': { primary: '#dc2626', secondary: '#000000' },
            'white-black': { primary: '#ffffff', secondary: '#000000' },
            'black-white': { primary: '#000000', secondary: '#ffffff' }
        };
        this.initEventListeners();
        this.initAnimations();
    }
    
    initEventListeners() {
        this.selectFileBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.widthInput.addEventListener('input', (e) => this.updateWidthValue(e));
        this.styleSelect.addEventListener('change', () => this.updateStylePreview());
        this.colorSelect.addEventListener('change', () => this.updateColorScheme());
        this.generateBtn.addEventListener('click', () => this.generateASCII());
        this.previewBtn.addEventListener('click', () => this.showPreview());
        this.copyBtn.addEventListener('click', () => this.copyASCII());
        this.downloadBtn.addEventListener('click', () => this.downloadASCII());
        this.shareBtn.addEventListener('click', () => this.shareASCII());
        this.newImageBtn.addEventListener('click', () => this.resetForm());
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    initAnimations() {
        // Animations disabled to prevent scroll bar issues
    }
    
    animateElements() {
        // Animation disabled
    }
    
    createFloatingParticles() {
        // Particles disabled to prevent scroll bar issues
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }
    
    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }
    
    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    processFile(file) {
        if (!this.isValidImageFile(file)) {
            this.showError('Пожалуйста, выберите файл изображения (PNG, JPG, JPEG, GIF, BMP, WEBP)');
            return;
        }
        
        this.selectedFile = file;
        this.generateBtn.disabled = false;
        this.previewBtn.disabled = false;
        this.hideError();
        this.updateUploadArea(file.name);
        this.showNotification('Файл успешно загружен!', 'success');
    }
    
    isValidImageFile(file) {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];
        return validTypes.includes(file.type);
    }
    
    updateUploadArea(fileName) {
        const uploadContent = this.uploadArea.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <div class="upload-icon">✅</div>
            <h3>Файл выбран</h3>
            <p>${fileName}</p>
            <button type="button" id="selectFileBtn" class="btn btn-primary">
                <span>🔄</span> Выбрать другой файл
            </button>
        `;
        
        document.getElementById('selectFileBtn').addEventListener('click', () => this.fileInput.click());
    }
    
    updateWidthValue(event) {
        this.widthValue.textContent = event.target.value;
        this.updateStylePreview();
    }
    
    updateStylePreview() {
        if (this.selectedFile) {
            this.previewBtn.disabled = false;
        }
    }
    
    updateColorScheme() {
        const colorScheme = this.colorSelect.value;
        const asciiOutput = document.getElementById('asciiOutput');
        
        switch(colorScheme) {
            case 'red-black':
                asciiOutput.style.color = '#dc2626';
                asciiOutput.style.textShadow = '0 0 10px rgba(220, 38, 38, 0.5)';
                break;
            case 'white-black':
                asciiOutput.style.color = '#ffffff';
                asciiOutput.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                break;
            case 'black-white':
                asciiOutput.style.color = '#000000';
                asciiOutput.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                break;
        }
        
        if (this.selectedFile) {
            this.previewBtn.disabled = false;
        }
    }
    
    async showPreview() {
        if (!this.selectedFile) {
            this.showError('Пожалуйста, выберите файл');
            return;
        }
        
        this.showLoading();
        this.hideError();
        
        try {
            const asciiArt = await this.generateASCIIClient(this.selectedFile);
            this.displayASCII(asciiArt);
            this.showNotification('Предпросмотр готов!', 'success');
        } catch (error) {
            this.showError('Ошибка создания предпросмотра');
        } finally {
            this.hideLoading();
        }
    }
    
    async generateASCII() {
        if (!this.selectedFile) {
            this.showError('Пожалуйста, выберите файл');
            return;
        }
        
        this.showLoading();
        this.hideError();
        
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('width', this.widthInput.value);
        formData.append('style', this.styleSelect.value);
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayASCII(result.ascii_art);
                this.showNotification('ASCII арт создан успешно!', 'success');
            } else {
                this.showError(result.error || 'Произошла ошибка при обработке изображения');
            }
        } catch (error) {
            this.showError('Ошибка соединения с сервером');
        } finally {
            this.hideLoading();
        }
    }
    
    async generateASCIIClient(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const width = parseInt(this.widthInput.value);
                const style = this.styleSelect.value;
                const asciiChars = this.asciiStyles[style] || this.asciiStyles.standard;
                
                canvas.width = width;
                canvas.height = Math.floor(width * img.height / img.width / 2);
                
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                
                let asciiStr = "";
                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];
                    
                    if (a < 128) {
                        asciiStr += " ";
                    } else {
                        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
                        const normalizedBrightness = brightness / 255;
                        const charIndex = Math.floor(normalizedBrightness * (asciiChars.length - 1));
                        asciiStr += asciiChars[charIndex];
                    }
                    
                    if ((i / 4 + 1) % canvas.width === 0) {
                        asciiStr += "\n";
                    }
                }
                
                resolve(asciiStr);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
    
    displayASCII(asciiArt) {
        this.asciiOutput.textContent = asciiArt;
        this.resultSection.style.display = 'block';
    }
    
    
    async copyASCII() {
        try {
            await navigator.clipboard.writeText(this.asciiOutput.textContent);
            this.showNotification('ASCII арт скопирован в буфер обмена!', 'success');
            this.animateButton(this.copyBtn);
        } catch (error) {
            this.showError('Не удалось скопировать текст');
        }
    }
    
    downloadASCII() {
        const asciiText = this.asciiOutput.textContent;
        const blob = new Blob([asciiText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii_art_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('ASCII арт скачан!', 'success');
        this.animateButton(this.downloadBtn);
    }
    
    async shareASCII() {
        const asciiText = this.asciiOutput.textContent;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Мой ASCII арт',
                    text: asciiText,
                });
                this.showNotification('ASCII арт поделен!', 'success');
            } catch (error) {
                this.fallbackShare(asciiText);
            }
        } else {
            this.fallbackShare(asciiText);
        }
    }
    
    fallbackShare(asciiText) {
        const shareText = `Посмотрите на мой ASCII арт:\n\n${asciiText}\n\nСоздано с помощью ASCII Art Generator`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Текст для поделиться скопирован!', 'success');
            });
        } else {
            this.showError('Функция поделиться недоступна в вашем браузере');
        }
    }
    
    resetForm() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.generateBtn.disabled = true;
        this.previewBtn.disabled = true;
        this.resultSection.style.display = 'none';
        this.hideError();
        
        const uploadContent = this.uploadArea.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <div class="upload-icon">📁</div>
            <h3>Выберите изображение</h3>
            <p>Перетащите файл сюда или нажмите для выбора</p>
            <button type="button" id="selectFileBtn" class="btn btn-primary">
                <span>📂</span> Выбрать файл
            </button>
        `;
        
        document.getElementById('selectFileBtn').addEventListener('click', () => this.fileInput.click());
        this.showNotification('Форма сброшена', 'info');
    }
    
    handleKeyboard(event) {
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'o':
                    event.preventDefault();
                    this.fileInput.click();
                    break;
                case 'g':
                    event.preventDefault();
                    if (!this.generateBtn.disabled) {
                        this.generateASCII();
                    }
                    break;
                case 'c':
                    if (this.resultSection.style.display !== 'none') {
                        event.preventDefault();
                        this.copyASCII();
                    }
                    break;
            }
        }
        
        if (event.key === 'Escape') {
            this.resetForm();
        }
    }
    
    showLoading() {
        this.loading.style.display = 'block';
        this.generateBtn.disabled = true;
        this.previewBtn.disabled = true;
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
        this.generateBtn.disabled = false;
        this.previewBtn.disabled = false;
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.error.style.display = 'block';
    }
    
    hideError() {
        this.error.style.display = 'none';
    }
    
    showNotification(message, type = 'success') {
        this.notification.textContent = message;
        this.notification.style.display = 'block';
        this.notification.className = `notification ${type}`;
        
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, 3000);
    }
    
    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedASCIIArtGenerator();
    
    const style = document.createElement('style');
    style.textContent = `
        .notification.success {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .notification.info {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        .notification.error {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        }
    `;
    document.head.appendChild(style);
});