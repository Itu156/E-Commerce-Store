 const menMenu = document.getElementById('menMenu');
  const womenMenu = document.getElementById('womenMenu');
  const kid = document.getElementById('kid');
  const sale = document.getElementById('sale');

  const menDropdown = menMenu.querySelector('.dropdown');
  const womenDropdown = document.querySelector('.dropdownw'); // Corrected
  const kidDropdown = kid.nextElementSibling; // Grabs the dropdown after #kid
  const saleDropdown = sale.nextElementSibling; // Grabs the dropdown after #sale

  // Hide all dropdowns helper
  function hideAllDropdowns() {
    menDropdown.style.display = 'none';
    womenDropdown.style.display = 'none';
    kidDropdown.style.display = 'none';
    saleDropdown.style.display = 'none';
  }

  menMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = menDropdown.style.display === 'flex';
    hideAllDropdowns();
    menDropdown.style.display = isVisible ? 'none' : 'flex';
  });

  womenMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = womenDropdown.style.display === 'flex';
    hideAllDropdowns();
    womenDropdown.style.display = isVisible ? 'none' : 'flex';
  });

  kid.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = kidDropdown.style.display === 'flex';
    hideAllDropdowns();
    kidDropdown.style.display = isVisible ? 'none' : 'flex';
  });

  sale.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = saleDropdown.style.display === 'flex';
    hideAllDropdowns();
    saleDropdown.style.display = isVisible ? 'none' : 'flex';
  });

  // Hide all dropdowns if you click outside
  document.addEventListener('click', hideAllDropdowns);