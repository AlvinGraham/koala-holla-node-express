console.log( 'js' );

getKoalas();

function getKoalas(){
  console.log( 'in getKoalas' );
  // axios call to server to get koalas
  axios({
    method: 'GET',
    url: '/koalas'
  })
  .then((response) => {
    console.log('/koalas GET:');
    console.table(response.data);
    renderDOM(response.data);
  })
  .catch((error) =>{
    console.log('Error in /koalas GET:', error);
  });
} // end getKoalas()

function saveKoala(){
  console.log( 'in saveKoala' );
  // set targetable DOM input elements
  const nameInEle = document.getElementById('nameIn');
  const genderInEle = document.getElementById('genderIn');
  const ageInEle = document.getElementById('ageIn');
  const readyForTransferInEle = document.getElementById('readyForTransferIn');
  const notesInEle = document.getElementById('notesIn');
  
  // data validation
  if (!nameInEle.value || !genderInEle.value || !ageInEle.value 
      || !readyForTransferInEle.value) {
    console.error('Error: Invalid Koala Input');
    alert('Invalid Input: Missing Name, Age, Gender, or Transfer Status');
    return;
  }  
  if ((readyForTransferInEle.value).toUpperCase() !== 'Y' && 
      (readyForTransferInEle.value).toUpperCase() !== 'N') {
        console.error('Error: Invalid Transfer Status', 
          readyForTransferInEle.value);
        alert('Invalid Transfer Status: Use Y or N.');
        return;
      }
  // assemble data payload
  let newKoala = {name: nameInEle.value,
                  gender: genderInEle.value,
                  age: ageInEle.value,
                  ready_to_transfer: readyForTransferInEle.value,
                  notes: notesInEle.value};

  // axios call to server to POST koalas
  axios({
    method: 'POST',
    url: '/koalas',
    data: newKoala
  })
  .then((response) => {
    console.log('POST data:');
    console.table(newKoala);
    //clear input fields
    nameInEle.value = null;
    genderInEle.value = null;
    ageInEle.value = null;
    readyForTransferInEle.value = null;
    notesInEle.value = null;

    // render Koala List on DOM
    getKoalas();
    return;
  })
  .catch((error) => {
    console.error('Error in /koalas POST route:', error);
  });
} // end saveKoala()

function renderDOM (koalas) {
  // targetable elements
  const viewKoalasEle = document.getElementById('viewKoalas');

  viewKoalasEle.innerHTML = null;
  let transferReadyBlock = null;
  for (let koala of koalas) {
    if (koala.ready_to_transfer.toUpperCase() === 'N') {
      transferReadyBlock = '<button onclick="transferReadyClk(event)">Toggle to READY</button>';
    } else {
      transferReadyBlock = '<button onclick="transferReadyClk(event)">Toggle to NOT READY</button>';
    }
    viewKoalasEle.innerHTML += `
    <tr>
      <td>${koala.name}</td>
      <td>${koala.age}</td>
      <td>${koala.gender}</td>
      <td>${koala.ready_to_transfer}</td>
      <td>${koala.notes}</td>
      <td>${transferReadyBlock}</td>
      <td><button onclick="editKoalaBtnClk(event)">Edit</button></td>
      <td><button onclick="deleteKoalaClk(event)">Delete</button></td>
      <td class="hidden">${koala.id}</td>
    </tr>`;
  }
  return;
} // renderDOM (koalas)

function transferReadyClk(event) {
  event.preventDefault();
  console.log('transder Koala button clicked');

// get ID
  let targetId = event.target.parentElement.parentElement.lastElementChild.innerHTML;
  console.log("Targeted Element:", targetId);
 

  axios({
    method: 'PUT',
    url: `/koalas/ready/${targetId}`
  })
  .then((response) => {
    console.log('Modified ready status of koala ID:', targetId);
    removeFilterBtnClk(event);
    getKoalas();
  })
  .catch((error) => {
    console.error('Error in /koalas/ready/: PUT route:', error);
  });
  return;
} // end transferReadyClk(event)

function deleteKoalaClk(event) {
  event.preventDefault();
  console.log('delete Koala button clicked');

  let targetId = event.target.parentElement.parentElement.lastElementChild.innerHTML;
  let targetName = event.target.parentElement.parentElement.firstElementChild.innerHTML;
  // console.log("Targeted Element:", targetId);
  
  
  swal({
    title: `Deleting Koala ${targetName}`,
    text: `Are you sure you want to delete Koala ${targetName}? They will be gone forever!`,
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  .then((confirmDelete) => {
    if (confirmDelete) {
      swal({text: `Deleting Koala ${targetName}!`, icon: 'success'});  
      axios({
        method: 'DELETE',
        url: `/koalas/${targetId}`
      })
      .then((response) => {
        console.log('Deleted row of koala ID:', targetId);
        getKoalas();
      })
      .catch((error) => {
        console.error('Error in /koalas/ready/: PUT route:', error);
      });
    } else {
      swal(`Koala ${targetName} is saved from deletion`);
    }
  });

  return;
} // end deleteKoalaClk(event)

function editKoalaBtnClk(event) {
  event.preventDefault();
  console.log('In editKoalaBtnClk(event)');
  // targetable DOM elements
  const addKoalaFrmEle = document.getElementById('addKoala');
  const editKoalaFrmEle = document.getElementById('editKoala');
  const nameEditInEle = document.getElementById('nameEditIn');
  const ageEditInEle = document.getElementById('ageEditIn');
  const genderEditInEle = document.getElementById('genderEditIn');
  const notesEditInEle = document.getElementById('notesEditIn');
  const targetId = event.target.parentElement.parentElement.lastElementChild.innerHTML;
  
  addKoalaFrmEle.classList.add('hidden');
  editKoalaFrmEle.classList.remove('hidden');
  
  // pregenerate form
  nameEditInEle.value = event.target.parentElement.parentElement.children.item(0).innerHTML;
  document.getElementById('editKoalaBanner').innerHTML = `Edit Koala 
   "${event.target.parentElement.parentElement.firstElementChild.innerHTML}" (ID: ${targetId})`;
  ageEditInEle.value = event.target.parentElement.parentElement.children.item(1).innerHTML;
  genderEditInEle.value = event.target.parentElement.parentElement.children.item(2).innerHTML;
  notesEditInEle.value = event.target.parentElement.parentElement.children.item(4).innerHTML;
  document.getElementById('editId').innerHTML = `${targetId}`;
} //end editKoalaBtnClk(event)

function editKoala(event) {
  event.preventDefault();
  console.log('editKoala(event)');
  // targetable DOM elements
  const nameEditInEle = document.getElementById('nameEditIn');
  const ageEditInEle = document.getElementById('ageEditIn');
  const genderEditInEle = document.getElementById('genderEditIn');
  const notesEditInEle = document.getElementById('notesEditIn');
  const targetIdEle = document.getElementById('editId');

  // assemble data payload
  let koalaEdits = {
                    name: nameEditInEle.value,
                    age: ageEditInEle.value,
                    gender: genderEditInEle.value,
                    notes: notesEditInEle.value
  };
  console.log('Data payload:', koalaEdits);

  axios({
    method: 'PUT',
    url: `/koalas/edit/${targetIdEle.innerHTML}`,
    data: koalaEdits
  })
  .then((response) => {
    // clean up
    cancelEditKoala(event);
    getKoalas();
    return;
  })
  .catch((error) => {
    console.error('Error in ../edits/: PUT:', error);
  })

return;
} //end editKoala(event)

function cancelEditKoala(event) {
event.preventDefault();
console.log('In cancelEditKoalas(event)');
const addKoalaFrmEle = document.getElementById('addKoala');
const editKoalaFrmEle = document.getElementById('editKoala');

addKoalaFrmEle.classList.remove('hidden');
editKoalaFrmEle.classList.add('hidden');
} // end cancelEditKoala(event)

function filterBtnClk(event) {
  event.preventDefault();
  console.log('In filterBtnClk:');

  //assemble data payload
  let koalaFilters = {
                      name: document.getElementById('nameFilterIn').value,
                      age: document.getElementById('ageFilterIn').value,
                      gender: document.getElementById('genderFilterIn').value,
                      ready_to_transfer: document.getElementById('transferFilterIn').value,
                      notes: document.getElementById('notesFilterIn').value};

    axios({
      method: 'GET',
      url: `/koalas/filter?name=${koalaFilters.name}&age=${koalaFilters.age}&gender=${koalaFilters.gender}&ready_to_transfer=${koalaFilters.ready_to_transfer}&notes=${koalaFilters.notes}`
    })
    .then ((response) => {
      console.log('Filtered Koalas:');
      console.table(response.data);
      renderDOM(response.data);

    })
    .catch((error) => {
      console.error('Error in /koalas/filter GET route:', error);
    });
  return;
} // end filterBtnClk(event)

function removeFilterBtnClk(event) {
  event.preventDefault();
  console.log('In removeFilterBtnClk:');

  document.getElementById('nameFilterIn').value = null;
  document.getElementById('ageFilterIn').value = null;
  document.getElementById('genderFilterIn').value = null;
  document.getElementById('transferFilterIn').value = null;
  document.getElementById('notesFilterIn').value = null;

  getKoalas();

  return;
} // end removeFilterBtnClk(event)