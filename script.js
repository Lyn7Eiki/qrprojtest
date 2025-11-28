// Mock Data
let categories = [
    { id: 'reaction', name: '反应罐', icon: 'fa-flask' },
    { id: 'buffer', name: '缓冲液', icon: 'fa-vial' },
    { id: 'centrifuge', name: '离心机', icon: 'fa-circle-notch' },
    { id: 'freezer', name: '冰柜', icon: 'fa-snowflake' },
    { id: 'incubator', name: '培养箱', icon: 'fa-temperature-high' }
];

let devices = [
    { id: '1', name: 'R204-1', category: 'reaction', qrContent: 'QR-R204-1-A', details: '容量: 500L, 材质: 316L不锈钢', tags: ['在用', 'A区'] },
    { id: '2', name: 'R204-2', category: 'reaction', qrContent: 'QR-R204-2-B', details: '容量: 500L, 材质: 316L不锈钢', tags: ['维护中'] },
    { id: '3', name: 'B-101', category: 'buffer', qrContent: 'QR-B-101', details: 'pH范围: 6.0-8.0', tags: ['无菌'] },
    { id: '4', name: 'C-300', category: 'centrifuge', qrContent: 'QR-C-300', details: '最大转速: 15000', tags: [] }
];

// State
let state = {
    currentCategory: 'reaction',
    selectedDeviceId: null,
    searchQuery: ''
};

// DOM Elements
const els = {
    categoryList: document.getElementById('categoryList'),
    deviceList: document.getElementById('deviceList'),
    searchInput: document.getElementById('searchInput'),

    // Details View
    emptyState: document.getElementById('emptyState'),
    deviceDetails: document.getElementById('deviceDetails'),
    detailName: document.getElementById('detailName'),
    detailCategory: document.getElementById('detailCategory'),
    detailQrContent: document.getElementById('detailQrContent'),
    detailTags: document.getElementById('detailTags'),
    detailDescription: document.getElementById('detailDescription'),
    qrCodeDisplay: document.getElementById('qrCodeDisplay'),

    // Buttons
    addBtn: document.getElementById('addBtn'),
    editBtn: document.getElementById('editBtn'),
    deleteBtn: document.getElementById('deleteBtn'),

    // Modals
    deviceModal: document.getElementById('deviceModal'),
    deleteModal: document.getElementById('deleteModal'),
    categoryModal: document.getElementById('categoryModal'),

    closeModal: document.getElementById('closeModal'),
    cancelModal: document.getElementById('cancelModal'),
    cancelDelete: document.getElementById('cancelDelete'),
    confirmDelete: document.getElementById('confirmDelete'),
    saveDevice: document.getElementById('saveDevice'),
    modalTitle: document.getElementById('modalTitle'),

    // Category Modal Controls
    closeCategoryModal: document.getElementById('closeCategoryModal'),
    cancelCategoryModal: document.getElementById('cancelCategoryModal'),
    saveCategory: document.getElementById('saveCategory'),
    newCategoryName: document.getElementById('newCategoryName'),

    // Form
    deviceForm: document.getElementById('deviceForm'),
    deviceId: document.getElementById('deviceId'),
    deviceName: document.getElementById('deviceName'),
    deviceCategory: document.getElementById('deviceCategory'),
    deviceQr: document.getElementById('deviceQr'),
    deviceTags: document.getElementById('deviceTags'),
    deviceDesc: document.getElementById('deviceDesc')
};

// Initialization
function init() {
    renderCategories();
    renderDeviceList();
    setupEventListeners();
}

// Rendering
function renderCategories() {
    const categoryHtml = categories.map(cat => `
        <div class="nav-item ${state.currentCategory === cat.id ? 'active' : ''}" 
             onclick="setCategory('${cat.id}')">
            <i class="fas ${cat.icon}"></i>
            <span>${cat.name}</span>
        </div>
    `).join('');

    // Add "Add Category" button
    const addBtnHtml = `
        <div class="nav-item" onclick="openCategoryModal()">
            <i class="fas fa-plus-circle"></i>
            <span>新增分类</span>
        </div>
    `;

    els.categoryList.innerHTML = categoryHtml + addBtnHtml;
}

function renderDeviceList() {
    const filteredDevices = devices.filter(d =>
        d.category === state.currentCategory &&
        (d.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            d.qrContent.toLowerCase().includes(state.searchQuery.toLowerCase()))
    );

    els.deviceList.innerHTML = filteredDevices.map(d => `
        <li class="device-item ${state.selectedDeviceId === d.id ? 'active' : ''}" 
            onclick="selectDevice('${d.id}')">
            <div class="device-item-name">${d.name}</div>
            <div class="device-item-sub">${d.qrContent}</div>
        </li>
    `).join('');
}

function renderDetails() {
    if (!state.selectedDeviceId) {
        els.emptyState.classList.remove('hidden');
        els.deviceDetails.classList.add('hidden');
        return;
    }

    const device = devices.find(d => d.id === state.selectedDeviceId);
    if (!device) return;

    els.emptyState.classList.add('hidden');
    els.deviceDetails.classList.remove('hidden');

    els.detailName.textContent = device.name;
    const cat = categories.find(c => c.id === device.category);
    els.detailCategory.textContent = cat ? cat.name : device.category;
    els.detailQrContent.textContent = device.qrContent;
    els.detailDescription.textContent = device.details || '无详细信息';

    // Mock QR Code generation
    els.qrCodeDisplay.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(device.qrContent)}" alt="QR Code">`;

    els.detailTags.innerHTML = device.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

// Actions
window.setCategory = (catId) => {
    state.currentCategory = catId;
    state.selectedDeviceId = null; // Reset selection on category change
    renderCategories();
    renderDeviceList();
    renderDetails();
};

window.selectDevice = (devId) => {
    state.selectedDeviceId = devId;
    renderDeviceList(); // Re-render to update active state
    renderDetails();
};

window.openCategoryModal = () => {
    els.newCategoryName.value = '';
    els.categoryModal.classList.remove('hidden');
};

// Event Listeners
function setupEventListeners() {
    // Search
    els.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderDeviceList();
    });

    // Modal Controls
    els.addBtn.addEventListener('click', () => openModal());
    els.editBtn.addEventListener('click', () => openModal(state.selectedDeviceId));
    els.deleteBtn.addEventListener('click', () => openDeleteModal());

    els.closeModal.addEventListener('click', closeModal);
    els.cancelModal.addEventListener('click', closeModal);
    els.cancelDelete.addEventListener('click', closeDeleteModal);

    // Category Modal Controls
    els.closeCategoryModal.addEventListener('click', closeCategoryModal);
    els.cancelCategoryModal.addEventListener('click', closeCategoryModal);
    els.saveCategory.addEventListener('click', handleSaveCategory);

    // Form Submission
    els.saveDevice.addEventListener('click', handleSave);
    els.confirmDelete.addEventListener('click', handleDelete);
}

// CRUD Logic
function openModal(id = null) {
    els.deviceForm.reset();

    // Populate Categories
    els.deviceCategory.innerHTML = categories.map(c =>
        `<option value="${c.id}">${c.name}</option>`
    ).join('');

    if (id) {
        const device = devices.find(d => d.id === id);
        els.modalTitle.textContent = '编辑设备';
        els.deviceId.value = device.id;
        els.deviceName.value = device.name;
        els.deviceCategory.value = device.category;
        els.deviceQr.value = device.qrContent;
        els.deviceTags.value = device.tags.join(', ');
        els.deviceDesc.value = device.details;
    } else {
        els.modalTitle.textContent = '新增设备';
        els.deviceId.value = '';
        els.deviceCategory.value = state.currentCategory; // Default to current
    }

    els.deviceModal.classList.remove('hidden');
}

function closeModal() {
    els.deviceModal.classList.add('hidden');
}

function closeCategoryModal() {
    els.categoryModal.classList.add('hidden');
}

function openDeleteModal() {
    els.deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    els.deleteModal.classList.add('hidden');
}

function handleSave(e) {
    e.preventDefault();

    // Validation
    if (!els.deviceName.value || !els.deviceQr.value || !els.deviceCategory.value) {
        alert('请填写所有必填项。');
        return;
    }

    const formData = {
        id: els.deviceId.value || Date.now().toString(),
        name: els.deviceName.value,
        category: els.deviceCategory.value,
        qrContent: els.deviceQr.value,
        details: els.deviceDesc.value,
        tags: els.deviceTags.value.split(',').map(t => t.trim()).filter(t => t)
    };

    if (els.deviceId.value) {
        // Edit
        const index = devices.findIndex(d => d.id === formData.id);
        if (index !== -1) devices[index] = formData;
    } else {
        // Add
        devices.push(formData);
    }

    closeModal();

    // If category changed, switch to it
    if (formData.category !== state.currentCategory) {
        state.currentCategory = formData.category;
        renderCategories();
    }

    state.selectedDeviceId = formData.id;
    renderDeviceList();
    renderDetails();
}

function handleDelete() {
    if (!state.selectedDeviceId) return;

    devices = devices.filter(d => d.id !== state.selectedDeviceId);
    state.selectedDeviceId = null;

    closeDeleteModal();
    renderDeviceList();
    renderDetails();
}

function handleSaveCategory(e) {
    e.preventDefault();
    const name = els.newCategoryName.value.trim();
    if (!name) {
        alert('请输入分类名称');
        return;
    }

    const id = 'cat_' + Date.now();
    categories.push({
        id: id,
        name: name,
        icon: 'fa-folder' // Default icon
    });

    closeCategoryModal();

    // Switch to new category
    state.currentCategory = id;
    renderCategories();
    renderDeviceList();

    // Scroll to end of nav
    els.categoryList.scrollLeft = els.categoryList.scrollWidth;
}

// Start
init();
