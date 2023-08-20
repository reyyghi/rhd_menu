let buttonParams = [];
let Button = [];

const openMenu = (data = null) => {
    let html = ``;

    html += "<div id='buttons'>";
    data.forEach((item, index) => {
        if(!item.hidden) {
            let header = item.header;
            let message = item.txt || item.text;
            let isMenuHeader = item.isMenuHeader;
            let search = item.search;
            let isDisabled = item.disabled;
            let icon = item.icon;
            let image = item.image;
            html += getButtonRender(header, message, index, isMenuHeader, search, isDisabled, icon, image);
            if (item.params) buttonParams[index] = item.params;
            
            // Button[index] = item;
        }
    });

    $("#buttons").html(html);
    $("#container").html(html);
    $('.button').click(function() {
        const target = $(this)
        if (!target.hasClass('title') && !target.hasClass('disabled')) {
            postData(target.attr('id'));
        }
    });

    $("#search-input").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $("#buttons .button").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
};  

const getButtonRender = (header, message = null, id, isMenuHeader, search, isDisabled, icon) => {
    return `
        <div class="${isMenuHeader ? "title" : "button"} ${isDisabled ? "disabled" : ""}" id="${id}">
            <div class="icon"> <img src=${icon} width=30px onerror="this.onerror=null; this.remove();"> <i class="${icon}" onerror="this.onerror=null; this.remove();"></i> </div>
            <div class="column">
            <div class="header"> ${header}</div>
            ${message ? `<div class="text">${message}</div>` : ""} 
            </div>
        </div>
        
        ${search ? `<div class="search-container" > <i class="fa-solid fa-magnifying-glass"></i> <input  type="text" id="search-input" placeholder= "Search..." > </div>` : ""}
    `;
};

const closeMenu = () => {
    $("#buttons").html(" ");
    buttonParams = [];
    $("#search-input").hide(); // hide search bar
};

const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return closeMenu();
};

const filterButtons = (query) => {
    const filteredItems = menuItems.filter(item => item.header.toLowerCase().includes(query.toLowerCase()));
    openMenu(filteredItems);
};

$("#search-input").on('input', function() {
    filterButtons($(this).val());
});



window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "contex_open":
        case "context_header_open":
            return openMenu(buttons);
        case "context_close":
            return closeMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        cancelMenu();
    }
};
