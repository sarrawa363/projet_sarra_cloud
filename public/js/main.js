// Sélection des éléments du DOM
const itemForm = document.getElementById('item-form');
const itemId = document.getElementById('item-id');
const itemName = document.getElementById('item-name');
const itemDescription = document.getElementById('item-description');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const itemsList = document.getElementById('items-list');

// Variables globales
const API_URL = '/api/items';
let isEditing = false;

// Fonctions
// Charger tous les items
async function loadItems() {
  itemsList.innerHTML = '<div class="loading">Chargement des éléments...</div>';
  
  try {
    const response = await fetch(API_URL);
    const items = await response.json();
    
    if (items.length === 0) {
      itemsList.innerHTML = '<div class="no-items">Aucun élément trouvé. Ajoutez-en un!</div>';
      return;
    }
    
    itemsList.innerHTML = '';
    items.forEach(item => {
      const createdDate = new Date(item.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const itemCard = document.createElement('div');
      itemCard.classList.add('item-card');
      itemCard.innerHTML = `
        <div class="item-header">
          <div class="item-title">${item.name}</div>
          <div class="item-actions">
            <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="item-description">${item.description || 'Aucune description'}</div>
        <div class="item-date">Créé le ${createdDate}</div>
      `;
      
      itemsList.appendChild(itemCard);
    });
    
    // Ajouter les événements pour les boutons d'édition et de suppression
    addItemEvents();
  } catch (error) {
    console.error('Erreur lors du chargement des items:', error);
    itemsList.innerHTML = '<div class="no-items">Erreur lors du chargement des éléments. Veuillez réessayer.</div>';
  }
}

// Ajouter les événements aux boutons d'édition et de suppression
function addItemEvents() {
  // Événements pour les boutons d'édition
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      await editItem(id);
    });
  });
  
  // Événements pour les boutons de suppression
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        await deleteItem(id);
      }
    });
  });
}

// Créer un nouvel item
async function createItem(item) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création de l\'élément');
    }
    
    loadItems();
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la création de l\'item:', error);
    alert('Erreur lors de la création de l\'élément: ' + error.message);
  }
}

// Mettre à jour un item existant
async function updateItem(id, item) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour de l\'élément');
    }
    
    loadItems();
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'item:', error);
    alert('Erreur lors de la mise à jour de l\'élément: ' + error.message);
  }
}

// Supprimer un item
async function deleteItem(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la suppression de l\'élément');
    }
    
    loadItems();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'item:', error);
    alert('Erreur lors de la suppression de l\'élément: ' + error.message);
  }
}

// Préparer le formulaire pour éditer un item
async function editItem(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const item = await response.json();
    
    if (!response.ok) {
      throw new Error(item.message || 'Erreur lors de la récupération de l\'élément');
    }
    
    // Remplir le formulaire avec les données de l'item
    itemId.value = item.id;
    itemName.value = item.name;
    itemDescription.value = item.description || '';
    
    // Changer l'état du formulaire en mode édition
    submitBtn.textContent = 'Mettre à jour';
    cancelBtn.classList.remove('hidden');
    isEditing = true;
    
    // Scroller vers le formulaire
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'item pour édition:', error);
    alert('Erreur lors de la récupération de l\'élément: ' + error.message);
  }
}

// Réinitialiser le formulaire
function resetForm() {
  itemForm.reset();
  itemId.value = '';
  submitBtn.textContent = 'Ajouter';
  cancelBtn.classList.add('hidden');
  isEditing = false;
}

// Événements
// Charger les items au chargement de la page
document.addEventListener('DOMContentLoaded', loadItems);

// Événement de soumission du formulaire
itemForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const item = {
    name: itemName.value.trim(),
    description: itemDescription.value.trim()
  };
  
  if (!item.name) {
    alert('Le nom de l\'élément est requis !');
    return;
  }
  
  if (isEditing) {
    await updateItem(itemId.value, item);
  } else {
    await createItem(item);
  }
});

// Événement du bouton Annuler
cancelBtn.addEventListener('click', resetForm);