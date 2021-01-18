function getURL (start = 0 ) {
    return "https://api.coinlore.net/api/tickers/?start=" +start + '&limit=10';
}
function getData(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => loadDataIntoTable(data))
    .catch(err => console.log(err));

}

function loadDataIntoTable(data){
    let coinName = [];
    let coinSymbol = [];
    let coinRank = [];
    let coinPrice= [];
    let coin24Change = [];
    // console.log(data);
    data['data'].forEach((coin) => {
        coinName.push(coin.name);
        coinSymbol.push(coin.symbol);
        coinRank.push(coin.rank);
        coinPrice.push(coin.price_usd);
        coin24Change.push(coin.percent_change_24h);
    })

    let tableBody = document.getElementById("crypto-table-body");
    let html ="";

    for(let i = 0; i <coinName.length;i++) {
        // html += "<tr>"
        // html += "<td>" + coinName[i] "</td>"
        
        // html += "</tr>"

        html += `
        <tr> 
        <td> ${coinName[i]} (${coinSymbol[i]}) </td>        
        <td> ${coinRank[i]}  </td>
        <td>$${coinPrice[i]}  </td>`
        if (coin24Change[i] > 0 ) {
            html += `<td class='green-text text-darken 4'> ${coin24Change[i]} </td>`

        }else
        {
         html += `<td class="red-text text-darken 4"> ${coin24Change[i]} </td>`
        }

        html += `</tr>`;
        
    }
    tableBody.innerHTML = html;
}
function init() {
    const url = getURL();
    getData(url);

}

init();

function handleNumberClick(clickedLink, leftArrow, rightArrow){
    clickedLink.parentElement.classList = "active";  
    let clickedLinkPageNumber = parseInt(clickedLink.innerText);
    const url = getURL((clickedLinkPageNumber * 10)- 10);
    console.log(clickedLinkPageNumber);
    getData(url);
    

    switch(clickedLinkPageNumber) {
        case 1:
            disableLeftArrow(leftArrow);
            if(rightArrow.className.indexOf('disabled') !== -1)
            {
                enableRightArrow(rightArrow);
            }
                break;
        case 10:
            disableRightArrow(rightArrow);
            if(leftArrow.className.indexOf('disabled') !== -1 )
            {
                enableLeftArrow(leftArrow);
            }
                break;
        default:
            if (leftArrow.className.indexOf('disabled')!== -1 )
            {  
                enableLeftArrow(leftArrow);
            }
            if (rightArrow.className.indexOf('disabled') !==-1) 
            {
                enableRightArrow(rightArrow);
            }
            break;
    }
}

function handleLeftArrowClick(activePageNumber, leftArrow, rightArrow){
    //move to previous page
    let newPagenumber = activePageNumber - 1 
   
    let previousPage = document.querySelectorAll('li')[newPagenumber];  
    previousPage.classList ="active"
    url = getURL((newPagenumber * 10)- 10);
    getData(url);
    console.log(url);
    if (activePageNumber === 10) {
        enableRightArrow(rightArrow)
    }
    if (newPagenumber  === 1) {
        disableLeftArrow(leftArrow);
    }

  
    
}

function handleRightArrowClick(activePageNumber, leftArrow, rightArrow){
    //move to next page
    let newPagenumber = activePageNumber + 1   
    let previousPage = document.querySelectorAll('li')[newPagenumber];  
    previousPage.classList ="active"
    url = getURL((newPagenumber * 10)- 10);
    getData(url);
    console.log(url);
    if (newPagenumber === 10) {
        disableRightArrow(rightArrow)
    }
    if (activePageNumber === 1) {
        enableLeftArrow(leftArrow);
    }

  
    
}

function disableLeftArrow(leftArrow) {
    leftArrow.classList.remove('waves-effect');
    leftArrow.classList= "disabled left-arrow";
    // console.log(leftArrow.classList);
    
}

function enableLeftArrow(leftArrow){
    leftArrow.classList.remove('disabled');
    leftArrow.classList = "waves-effect left-arrow";
    // console.log(leftArrow.classList)

}

function disableRightArrow(rightArrow) {
    rightArrow.classList.remove('waves-effect');
    rightArrow.classList= "disabled right-arrow";
    // console.log(rightArrow.classList);
}

function enableRightArrow(rightArrow){
    rightArrow.classList.remove('disabled');
    rightArrow.classList = "waves-effect right-arrow";
    // console.log(rightArrow.classList);
}
 
//handle pagination
let pagelinks = document.querySelectorAll('a');
let activePageNumber
let clickedLink
let nextPage
let leftArrow
let rightArrow

pagelinks.forEach((element) => {    
    element.addEventListener("click", function()
    {
        leftArrow = document.querySelector('.left-arrow');
        rightArrow = document.querySelector('.right-arrow');
        activeLink = document.querySelector(".active");
        // console.log(leftArrow);
        // console.log(rightArrow);
        // console.log(activeLink);
        //get active page number
        activePageNumber = parseInt(activeLink.innerText);

        if((this.innerText ==='chevron_left' && activePageNumber === 1) || (this.innerText === 'chevron_right' && activePageNumber === 10)
        ) 
        {
            return;
        }

        //updates active class
        activeLink.classList = "waves-effect";
        activeLink.classList.remove('active');
            console.log(activePageNumber);
        if(this.innerText === 'chevron_left'){
            handleLeftArrowClick(activePageNumber, leftArrow, rightArrow);
        }else if (this.innerText === 'chevron_right') {
            handleRightArrowClick(activePageNumber, leftArrow, rightArrow);
        } else {
            handleNumberClick(this, leftArrow,rightArrow);
            
        }

    });
});