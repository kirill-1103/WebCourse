const menuArea = document.querySelectorAll('.right-click-area');
for(let menuAr of menuArea) {
    menuAr.addEventListener('contextmenu', event => {
        //убираем все контекстные меню
        let menus = document.querySelectorAll('.right-click-menu');
        for (let m of menus) {
            m.classList.remove('active');
        }

        //открываем нужное
        event.preventDefault();
        //console.log(menuAr.id);
        const menu = document.getElementById('context_menu_'+menuAr.id);
        menu.classList.add("active");
        menu.style.top = `${event.clientY}px`;
        menu.style.left = `${event.clientX}px`;
    })
}
document.addEventListener('click',event=>{
    let menus = document.querySelectorAll('.right-click-menu');
    for(let m of menus){
        m.classList.remove('active');
    }
},false)

