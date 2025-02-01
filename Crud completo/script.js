let data = [
    { id: 1, nome: "João Silva", email: "joao@exemplo.com" },
    { id: 2, nome: "Maria Santos", email: "maria@exemplo.com" },
    { id: 3, nome: "Pedro Oliveira", email: "pedro@exemplo.com" },
  ];
  
  const dataTable = document.getElementById("dataTable");
  const addBtn = document.getElementById("addBtn");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementsByClassName("close")[0];
  const dataForm = document.getElementById("dataForm");
  const modalTitle = document.getElementById("modalTitle");
  const searchInput = document.getElementById("searchInput");
  const pagination = document.getElementById("pagination");
  const toast = document.getElementById("toast");
  
  let currentPage = 1;
  const itemsPerPage = 5;
  let sortColumn = "id";
  let sortDirection = "asc";
  
  function renderTable() {
    const tbody = dataTable.querySelector("tbody");
    tbody.innerHTML = "";
  
    const filteredData = data.filter(item =>
      item.nome.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      item.email.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  
    const sortedData = filteredData.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);
  
    paginatedData.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${item.email}</td>
        <td>
          <button class="btn view-btn" onclick="viewItem(${item.id})"><i class="fas fa-eye"></i></button>
          <button class="btn edit-btn" onclick="editItem(${item.id})"><i class="fas fa-edit"></i></button>
          <button class="btn delete-btn" onclick="deleteItem(${item.id})"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(row);
    });
  
    renderPagination(sortedData.length);
  }
  
  function renderPagination(totalItems) {
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";
  
    for (let i = 1; i <= pageCount; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.classList.add("page-btn");
      if (i === currentPage) pageBtn.classList.add("active");
      pageBtn.textContent = i;
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(pageBtn);
    }
  }
  
  function showModal(title) {
    modalTitle.textContent = title;
    modal.style.display = "block";
  }
  
  function hideModal() {
    modal.style.display = "none";
    dataForm.reset();
  }
  
  function addItem() {
    showModal("Adicionar Novo Item");
    dataForm.onsubmit = (e) => {
      e.preventDefault();
      const newItem = {
        id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
      };
      data.push(newItem);
      renderTable();
      hideModal();
      showToast("Item adicionado com sucesso");
    };
  }
  
  function viewItem(id) {
    const item = data.find((item) => item.id === id);
    showModal("Visualizar Item");
    document.getElementById("id").value = item.id;
    document.getElementById("nome").value = item.nome;
    document.getElementById("email").value = item.email;
    dataForm.style.pointerEvents = "none";
  }
  
  function editItem(id) {
    const item = data.find((item) => item.id === id);
    showModal("Editar Item");
    document.getElementById("id").value = item.id;
    document.getElementById("nome").value = item.nome;
    document.getElementById("email").value = item.email;
    dataForm.style.pointerEvents = "auto";
    dataForm.onsubmit = (e) => {
      e.preventDefault();
      item.nome = document.getElementById("nome").value;
      item.email = document.getElementById("email").value;
      renderTable();
      hideModal();
      showToast("Item atualizado com sucesso");
    };
  }
  
  function deleteItem(id) {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      data = data.filter((item) => item.id !== id);
      renderTable();
      showToast("Item excluído com sucesso");
    }
  }
  
  function showToast(message) {
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
  
  addBtn.onclick = addItem;
  closeBtn.onclick = hideModal;
  window.onclick = (event) => {
    if (event.target === modal) {
      hideModal();
    }
  };
  
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });
  
  document.querySelectorAll(".sort-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const column = icon.getAttribute("data-sort");
      if (sortColumn === column) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortColumn = column;
        sortDirection = "asc";
      }
      renderTable();
    });
  });
  
  renderTable();
  