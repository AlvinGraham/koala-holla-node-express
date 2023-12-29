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
} // end getKoalas

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
  let newKoala = {
                  name: nameInEle.value,
                  gender: genderInEle.value,
                  age: ageInEle.value,
                  ready_to_transfer: readyForTransferInEle.value,
                  notes: notesInEle.value
                }

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
}

function renderDOM (koalas) {
  // targetable elements
  const viewKoalasEle = document.getElementById('viewKoalas');

  viewKoalasEle.innerHTML = null;
  let transferReadyBlock = null;
  for (let koala of koalas) {
    if (koala.ready_to_transfer.toUpperCase() === 'N') {
      transferReadyBlock = '<button onclick="transferReadyClk(event)">Ready for Transfer</button>';
    } else {
      transferReadyBlock = '';
    }
    viewKoalasEle.innerHTML += `
    <tr>
      <td>${koala.name}</td>
      <td>${koala.age}</td>
      <td>${koala.gender}</td>
      <td>${koala.ready_to_transfer}</td>
      <td>${koala.notes}</td>
      <td>${transferReadyBlock}</td>
      <td><button onclick="deleteKoalaClk(event)">Delete</button></td>
      <td class="hidden">${koala.id}</td>
    </tr>`;
  }
  return;
}

function transferReadyClk(event) {
  console.log('transder Koala button clicked');
  return;
}

function deleteKoalaClk(event) {
  console.log('delete Koala button clicked');

  return;
}

