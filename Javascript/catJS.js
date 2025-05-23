const menMenu = document.getElementById('menMenu');
  const womenMenu = document.getElementById('womenMenu');
   const kid = document.getElementById('kid');
    const sale = document.getElementById('sale');
  const dropdown = menMenu.querySelector('.dropdown');

  menMenu.addEventListener('click', (e) => {
    
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });
  
  womenMenu.addEventListener('click', (e) => {
    
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });
  
   kid.addEventListener('click', (e) => {
    
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });
  
   sale.addEventListener('click', (e) => {
    
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  });

  
  document.addEventListener('click', () => {
    dropdown.style.display = 'none';
  });