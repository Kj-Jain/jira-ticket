let add = document.querySelector('.add');
let remove = document.querySelector('.remove')
let modalcon = document.querySelector('.modal-container');
let ticketmaincont = document.querySelector('.ticketmain-cont');
let textcontainer= document.querySelector('.textcontainer');
let modalcolor=  document.querySelectorAll('.modalcolor');
let toolbarcolor=  document.querySelectorAll('.color');
let ticketArr =[]


let colorcode ="black";
modalcon.style.display='none'

// get data from local storage and show on page

if(localStorage.getItem("jira_ticket")){
    ticketArr = JSON.parse(localStorage.getItem('jira_ticket'));
    ticketArr.forEach((ticketobj) =>{
        addCreateticket(ticketobj.colorcod, ticketobj.taskValue,ticketobj.ticketid)
    })
}


add.addEventListener('click' ,(e)=>{
   
    modalcon.style.display='flex' 

    

   
})

remove.addEventListener('click', (e) =>{
 
    modalcon.style.display='none'
    textcontainer.value=""
})





modalcolor.forEach((color) =>{
    color.addEventListener("click",(e) =>{
        
         modalcolor.forEach((bordercolor) =>{
            bordercolor.classList.remove("border");
         })

         color.classList.add('border')
         colorcode= color.classList[0];
    })
})

modalcon.addEventListener("keydown" ,(e) =>{
    if(e.ctrlKey && e.key === 'z'){
        addCreateticket(colorcode,textcontainer.value)
        modalcon.style.display="none"
        textcontainer.value="";

        modalcolor.forEach((color) =>{
            if(color.classList[0] == "black"){
                color.classList.add('border')
            }
            else{
                color.classList.remove('border')

            }
        })
        colorcode="black"
    

    }
})

// implement this code at the end of the project 
toolbarcolor.forEach((col) =>{
    col.addEventListener('click' ,(e)=>{
        let toolcolorclass = col.classList[0];
        
        //give the array of filtered ticket
        let filterticket = ticketArr.filter((ticketobj,idx) =>{
            return toolcolorclass == ticketobj.colorcod
        })
        // remove previos ticket
        let allticket = document.querySelectorAll(".ticket-container")
        allticket.forEach((ticketobj) =>{
            ticketobj.remove()
        })

        // display filtered ticket
        filterticket.forEach((ticketobj) =>{
            addCreateticket(ticketobj.colorcod,ticketobj.taskValue,ticketobj.ticketid)
        })

    })
})

toolbarcolor.forEach((col) =>{
    col.addEventListener('dblclick' ,(e)=>{
        let allticket = document.querySelectorAll(".ticket-container")
         // remove previos ticket
        allticket.forEach((ticketobj) =>{
            ticketobj.remove()
        })
        ticketArr.forEach((ticketobj)=>{
            addCreateticket(ticketobj.colorcod,ticketobj.taskValue,ticketobj.ticketid)

        })
    })
})

function addCreateticket(colorcod,taskValue,taskid){
 
    let id= taskid || shortid();
    let tickcont = document.createElement('div');
    tickcont.setAttribute("class","ticket-container");
   
    // let taskValue = textcontainer.value;

    tickcont.innerHTML=`
            <div class="ticketcolor-container ${colorcod}" > 
            <div class="ticketcolor"></div>
            <div class="deleteicon">
                <i class="fa-sharp fa-solid fa-xmark"></i>
            </div>
            </div>
            <div class="ticketheading">${id}</div>
            <div class="textValue">${taskValue}</div>
            <div class="lockdiv">
            <i class="fa-solid fa-lock"></i>
            </div>            
            
    `
    
    
    
   
    ticketmaincont.append(tickcont)
    
    if(!taskid){
        
    ticketArr.push({colorcod,taskValue,ticketid:id})
    console.log(ticketArr)

    localStorage.setItem("jira_ticket" ,JSON.stringify(ticketArr))
    }


    handelremove(tickcont,id)
    handellock(tickcont,id)
    handelcolor(tickcont,id)
    
}

function handelremove(ticket ,id){
    let tickcolorcont = ticket.querySelector('.deleteicon');
    let delteicon = tickcolorcont.children[0];
    delteicon.addEventListener('click', (e)=>{
        let ticketid = getIdxInArr(id)
        // here we delete ticket in array 
        ticketArr.splice(ticketid,1)

        localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))



        ticket.remove();

    })
}

function handellock(ticket,id){
    let lockdiv = ticket.querySelector('.lockdiv');
    let lockincon = lockdiv.children[0];
    let editTextArea = ticket.querySelector('.textValue')
    lockincon.addEventListener('click', (e)=>{
        let ticketIdx = getIdxInArr(id)
        if(lockincon.classList.contains('fa-lock')){
            lockincon.classList.remove('fa-lock');
       
            lockincon.classList.add('fa-lock-open');
            editTextArea.setAttribute("contenteditable","true")
            
            
        }
        else{
            lockincon.classList.remove('fa-lock-open');
            lockincon.classList.add('fa-lock');
            editTextArea.setAttribute("contenteditable","false")

        }
       // modify data in array as override
       ticketArr[ticketIdx].taskValue= editTextArea.innerText;
       //update edit text  data in local storage
       localStorage.setItem("jira_ticket" ,JSON.stringify(ticketArr))
       
    })
    
    
}

//to change to ticket color 
let colorArr = ["pink",'blue','green','black']
function handelcolor(ticket,id){
    let colorcont = ticket.querySelector('.ticketcolor-container');
    
    
    // alert(currCol)
    colorcont.addEventListener("click",(e)=>{
        let tickedIdIdxInArr = getIdxInArr(id)
        let currCol= colorcont.classList[1];
        let currColIdxArr = colorArr.findIndex((coloridx)=>{
            // if(coloridx==currCol){
            //     //return the idx
            //     return coloridx;
                
            // }
            return currCol==coloridx
        })
        currColIdxArr++;
        // use modulo to 4/4=0
        let adjustColorIdx = currColIdxArr%colorArr.length;
        // get the color using idx in array
        let newcolor = colorArr[adjustColorIdx];
        // remove current color in ticket

        colorcont.classList.remove(currCol);
        colorcont.classList.add(newcolor)
        
        ticketArr[tickedIdIdxInArr].colorcod = newcolor;
        localStorage.setItem("jira_ticket" , JSON.stringify(ticketArr))

        


    })

}
// this is find the id  in the array in which we change the color
function getIdxInArr(id){
    let ticketIdx = ticketArr.findIndex((tickobj)=>{
        return tickobj.ticketid == id;
    })
    return ticketIdx

}
