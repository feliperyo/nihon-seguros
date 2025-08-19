const menuToggle = document.querySelector('.menu-toggle');
const menuList = document.querySelector('.menu ul');

menuToggle.addEventListener('click', () => {
    menuList.classList.toggle('active');
});
