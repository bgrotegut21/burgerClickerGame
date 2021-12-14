const main = () => {
  
    // the element names are the same as the class in the html document
    const getDomElements = () => {
        let dom = {};
        let sections = document.querySelector(".sections")


        const getDom = (element) => {
            let elementChildren = Array.from(element.children);
            elementChildren.forEach(child => {
                if(child.getAttribute("class")){
                    if (child.getAttribute("class").length != 0){
                        let className = child.getAttribute("class")
                        dom[className] = child;
                        let childChildren = Array.from(child.children);
                        if (childChildren.length != 0){
                            getDom(child);
                        }
                        console.log(dom, "the current dom")
                    }
    
                }
    
            })
        }
        getDom(sections);

        return dom;
    }



    const addBurger = () => {
        burgerCounter ++;
        renderBurgerItems();
    }



    //add bindings and remove bindings come from another project
    const addBindings = (elements,func,binding) => {
        if (!Array.isArray(elements)) elements.addEventListener(binding,func);
        else elements.forEach(element => element.addEventListener(binding,func));
    }
    
    const removeBindings = (elements,func,binding) => {
        if (!Array.isArray(elements)) elements.removeEventListener(binding,func);
        else elements.forEach(element => element.removeEventListener(binding,func));
    }


    let burgerCounter = 0;

    let burgersPerSecond = 0;

    let amountOfWorkers = 0;
    let amountOfStands = 0;
    let amountOfStores = 0;

    let costOfWorker = 100; //100
    let costOfStand = 5000; // 5000
    let costOfStore =  150000; // 150 000 

    let sellPriceOfWorkers = 50;
    let sellPriceOfStand = 2500;
    let sellPriceOfStore = 75000;

    let orginalSellPriceOfWorkers = 50;
    let originalSellPriceOfStand = 2500;
    let originalSellPriceOfStore = 75000;

    let originalCostOfWorker = 100; //100
    let originalCostOfStand = 5000; // 5000
    let originalCostOfStore =  150000; // 150 000 



    let workerPerSecond = 1;
    let standPerSecond = 10;
    let storePerSecond = 100;
    let isActive = false;
    let lastTime = Date.now();

    const dom = getDomElements();


    const purchaseItem = (item, amountOfItem,itemSell ,seconds) => {
        if (burgerCounter >= item){
            burgerCounter -= item;
            item = Math.round(1.2 * item);
            itemSell = Math.round (1.2 * itemSell);
            amountOfItem ++;
            burgersPerSecond += seconds;
            console.log(burgersPerSecond)
        }

        return {item, amountOfItem, itemSell};
    }

    const sellItem = (item, amountOfItem,itemSell,seconds, originalCost, originalSell) => {
        if (amountOfItem > 0){
            burgerCounter += itemSell;

  

            itemSell = itemSell - Math.round(0.2 * itemSell);
            item = item - Math.round(0.2 * item);
            if (item < originalCost ){
                item = originalCost;
                itemSell = originalSell;
            }
            

            console.log(itemSell, "the curren selling")
            amountOfItem --;
            burgersPerSecond -= seconds;
        }

        return {item, amountOfItem, itemSell}
    }


    const getItem = (event) => {

        let canSell = false;
        let className = event.target.getAttribute("class");
        if (className == "workerSell" || className == "standSell" ||
            className == "storeSell"
        ) canSell= true;

        console.log("getting the item")


        let item;

        if (className == "workerBuy" || className == "workerSell"){
            if (!canSell)  item = purchaseItem(costOfWorker, amountOfWorkers, sellPriceOfWorkers, workerPerSecond);
            else item = sellItem(costOfWorker, amountOfWorkers, sellPriceOfWorkers, workerPerSecond, originalCostOfWorker, orginalSellPriceOfWorkers);

            costOfWorker = item.item;
            amountOfWorkers = item.amountOfItem;
            sellPriceOfWorkers = item.itemSell;
            
        } else if (className == "standBuy" || className == "standSell"){
            if (!canSell) item = purchaseItem(costOfStand, amountOfStands,sellPriceOfStand, standPerSecond);
            else item = sellItem(costOfStand, amountOfStands,sellPriceOfStand, standPerSecond, originalCostOfStand, originalSellPriceOfStand);

            costOfStand = item.item;
            amountOfStands = item.amountOfItem;
            sellPriceOfStand = item.itemSell

        } else if (className == "storeBuy" || className == "storeSell"){
            if (!canSell) item = purchaseItem(costOfStore, amountOfStores,sellPriceOfStore,storePerSecond,);
            else item = sellItem(costOfStore, amountOfStores,sellPriceOfStore,storePerSecond, originalCostOfStore, originalSellPriceOfStore);

            costOfStore = item.item;
            amountOfStores = item.amountOfItem;
            sellPriceOfStore = item.itemSell
        }
        renderBurgerItems();

        console.log(amountOfWorkers, "the amount of workers")
    }

    
    const renderBurgerItems = () => {

        dom.burgerCounter.textContent = `Burgers - ${burgerCounter}`;
     //   console.log(dom.burgersPerSecond, "dom burgers per second")

        dom.burgersPerSecond.textContent = `Burgers per second - ${burgersPerSecond}`;

        dom.amountOfWorkers.textContent = `Worker - ${amountOfWorkers}`;
        dom.costOfWorker.textContent = `Cost - ${costOfWorker}`;
        dom.sellWorker.textContent = `Sell for - ${sellPriceOfWorkers}`

        dom.amountOfStands.textContent = `Stand - ${amountOfStands}`;
        dom.costOfStand.textContent = `Cost - ${costOfStand}`;
        dom.sellStand.textContent = `Sell for - ${sellPriceOfStand}`
        

        dom.amountOfStores.textContent = `Store - ${amountOfStores}`;
        dom.costOfStore.textContent = `Cost - ${costOfStore}`;
        dom.sellStore.textContent = `Sell for - ${sellPriceOfStore}`

    }


    const activateGame = () => {
        isActive = true;
        dom.overlay.style.display = 'none';
        dom.overlay.style.backgroundColor = "red";
        runCookiesPerSecond();
        removeBindings(dom.overlay,activateGame,"click");
    }

    const runCookiesPerSecond = () => {
        if (isActive){
            let timer = setInterval(() => {
                let currentTime= Date.now();


                if (currentTime - lastTime >= 1000){
                    lastTime = currentTime;
                    if (!isActive){
                        clearInterval(timer)
                    } else {
                        burgerCounter += burgersPerSecond;
                        renderBurgerItems();
                    }
                }
               // console.log("burgers")

            },1000)
        }
    }

    let buyButtons = [dom.workerBuy, dom.standBuy, dom.storeBuy];
    let sellButtons = [dom.workerSell, dom.standSell, dom.storeSell]



    addBindings(dom.burgerImage, addBurger,"click");
    addBindings(buyButtons,getItem,"click");
    addBindings(sellButtons,getItem,"click")
    addBindings(dom.overlay,activateGame, "click")

    renderBurgerItems();



}

main()