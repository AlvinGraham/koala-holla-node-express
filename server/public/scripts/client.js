console.log( 'js' );

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
  // axios call to server to get koalas
 
}

function renderDOM (koalas) {
  // targetable elements
  const viewKoalasEle = document.getElementById('viewKoalas');

  viewKoalasEle.innerHTML = null;
  for (let koala of koalas) {
    viewKoalasEle.innerHTML += `
    <tr>
      <td>${koala.name}</td>
      <td>${koala.age}</td>
      <td>${koala.gender}</td>
      <td>${koala.ready_to_transfer}</td>
      <td>${koala.notes}</td>
    </tr>`;
  }
}
getKoalas();
