/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var container = document.getElementById('container');

function updateVars() {
    container = document.getElementById('container');
}

loadContentNetworkFirst()

function getServerData() {
  return fetch('api/get_drones').then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });
}


function updateUI(drones) {

  Array.prototype.forEach.call(drones.drones, drone => {
    if(!drone.lockedout && !drone.disabled) {
      const item = `<a class="card" value="${drone.did}" onclick="loadChecklist(${drone.did});">
         <div class="card_text">
		   <img src="/images/${drone.image}" class="card_image"></img>
           <h2 class="card_name">${drone.name}</h2>
           <h4 class="card_type">${drone.type}</h4>
         </div>
       </a>`;
      container.insertAdjacentHTML('beforeend', item);
    }
  });

}

function loadContentNetworkFirst() {
  getServerData().then(dataFromNetwork => {
	updateUI(dataFromNetwork);
  });
}
