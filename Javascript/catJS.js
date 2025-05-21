const menMenu = document.getElementById('menMenu');
  const womenMenu = document.getElementById('womenMenu');
   const kid = document.getElementById('kid');
    const sale = document.getElementById('sale');
  const dropdown = menMenu.querySelector('.dropdown');

  menMenu.addEventListener('click', (e) => {
    // Stop bubbling so clicking inside dropdown doesn't re-trigger
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  // Hide dropdown if you click anywhere else
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });
  
  womenMenu.addEventListener('click', (e) => {
    // Stop bubbling so clicking inside dropdown doesn't re-trigger
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  // Hide dropdown if you click anywhere else
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });
  
   kid.addEventListener('click', (e) => {
    // Stop bubbling so clicking inside dropdown doesn't re-trigger
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  // Hide dropdown if you click anywhere else
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });
  
   sale.addEventListener('click', (e) => {
    // Stop bubbling so clicking inside dropdown doesn't re-trigger
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  // Hide dropdown if you click anywhere else
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });