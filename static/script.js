class ASCIIArtGenerator {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadArea = document.getElementById('uploadArea');
        this.selectFileBtn = document.getElementById('selectFileBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.widthInput = document.getElementById('widthInput');
        this.widthValue = document.getElementById('widthValue');
        this.resultSection = document.getElementById('resultSection');
        this.asciiOutput = document.getElementById('asciiOutput');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('errorMessage');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newImageBtn = document.getElementById('newImageBtn');
        
        this.selectedFile = null;
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.selectFileBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.widthInput.addEventListener('input', (e) => this.updateWidthValue(e));
        this.generateBtn.addEventListener('click', () => this.generateASCII());
        this.copyBtn.addEventListener('click', () => this.copyASCII());
        this.downloadBtn.addEventListener('click', () => this.downloadASCII());
        this.newImageBtn.addEventListener('click', () => this.resetForm());
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
        this.hideError();
        this.updateUploadArea(file.name);
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
            <button type="button" id="selectFileBtn" class="btn btn-primary">Выбрать другой файл</button>
        `;
        
        document.getElementById('selectFileBtn').addEventListener('click', () => this.fileInput.click());
    }
    
    updateWidthValue(event) {
        this.widthValue.textContent = event.target.value;
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
        
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayASCII(result.ascii_art);
            } else {
                this.showError(result.error || 'Произошла ошибка при обработке изображения');
            }
        } catch (error) {
            this.showError('Ошибка соединения с сервером');
        } finally {
            this.hideLoading();
        }
    }
    
    displayASCII(asciiArt) {
        this.asciiOutput.textContent = asciiArt;
        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    async copyASCII() {
        try {
            await navigator.clipboard.writeText(this.asciiOutput.textContent);
            this.showTemporaryMessage('ASCII арт скопирован в буфер обмена!', this.copyBtn);
        } catch (error) {
            this.showError('Не удалось скопировать текст');
        }
    }
    
    downloadASCII() {
        const asciiText = this.asciiOutput.textContent;
        const blob = new Blob([asciiText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii_art.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showTemporaryMessage('ASCII арт скачан!', this.downloadBtn);
    }
    
    resetForm() {
        this.selectedFile = null;
        this.fileInput.value = '';
        this.generateBtn.disabled = true;
        this.resultSection.style.display = 'none';
        this.hideError();
        
        const uploadContent = this.uploadArea.querySelector('.upload-content');
        uploadContent.innerHTML = `
            <div class="upload-icon">📁</div>
            <h3>Выберите изображение</h3>
            <p>Перетащите файл сюда или нажмите для выбора</p>
            <button type="button" id="selectFileBtn" class="btn btn-primary">Выбрать файл</button>
        `;
        
        document.getElementById('selectFileBtn').addEventListener('click', () => this.fileInput.click());
    }
    
    showLoading() {
        this.loading.style.display = 'block';
        this.generateBtn.disabled = true;
    }
    
    hideLoading() {
        this.loading.style.display = 'none';
        this.generateBtn.disabled = false;
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.error.style.display = 'block';
    }
    
    hideError() {
        this.error.style.display = 'none';
    }
    
    showTemporaryMessage(message, element) {
        const originalText = element.textContent;
        element.textContent = message;
        element.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.background = '';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ASCIIArtGenerator();
});
