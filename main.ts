const btnNewMember =document.querySelector<HTMLButtonElement>('#btnSubmit')!;
const frmMember= document.querySelector<HTMLFormElement>('#contactForm')!;
const txtName=document.querySelector<HTMLInputElement>('#cname')!;
const txtEmail=document.querySelector<HTMLInputElement>('#cemail')!;
const txtMsg=document.querySelector<HTMLInputElement>('#cmessage')!;


//check validation-------------------------------------------------
setEnableForm_mem(false);


frmMember.addEventListener('submit', (e)=> {
    e.preventDefault();

    const inputElms = [txtName, txtEmail, txtMsg];
    const invalidInputElms = inputElms.filter(elm => !elm.classList.contains('is-valid'));

    if (invalidInputElms.length > 0){
        invalidInputElms.forEach(elm => elm.classList.add('is-invalid'));
        invalidInputElms[0].focus();
        return;
    }

    /* Todo: Let's send the data to the backend for saving, right? */
});



function setEnableForm_mem(enable:boolean=true){
    for (const element of frmMember.elements){
        if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement){
            element.disabled=!enable;
        }
    }
}
btnNewMember.addEventListener('click', () => {
    setEnableForm_mem();
    frmMember.reset();
    txtName.focus();
});

function checkValidityOfNIC(){
    return /^\d{9}[Vv]$/.test(txtName.value);
}
function checkValidityOfMemberName(){
    return /^.+$/.test(txtEmail.value);
}
function checkValidityOfContact(){
    return /^\d{3}-\d{7}$/.test(txtMsg.value);
}

txtName.addEventListener('input',checkValidity_mem);
txtEmail.addEventListener('input',checkValidity_mem);
txtMsg.addEventListener('input',checkValidity_mem);

function checkValidity_mem(e: Event){
    (e.target as HTMLInputElement).classList.remove('is-valid', 'is-invalid');
    if(e.target === txtName){
        checkValidityOfNIC()? txtName.classList.add('is-valid'): txtName.classList.add('is-invalid');
    }else if (e.target === txtEmail){
        checkValidityOfMemberName()? txtEmail.classList.add('is-valid'): txtEmail.classList.add('is-invalid');
    }else{
        checkValidityOfContact()? txtMsg.classList.add('is-valid'): txtMsg.classList.add('is-invalid');
    }
}